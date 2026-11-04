import { createContext, useContext, useEffect, useState } from 'react';
import {
  demoUsers, demoSubjects, demoChapters, demoTopics,
  demoResources, demoMissedClasses, demoAssignments,
  demoAssessments, demoAssessmentResults, demoNotifications,
  demoAnnouncements, demoStudyTasks,
} from '../data/demoData';
import { generateId } from '../utils/helpers';

const DataContext = createContext(null);

const KEY = 'classgap_db_v1';

function loadInitial() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('DB load error', e);
  }
  return {
    users: demoUsers,
    subjects: demoSubjects,
    chapters: demoChapters,
    topics: demoTopics,
    resources: demoResources,
    missedClasses: demoMissedClasses,
    assignments: demoAssignments,
    assessments: demoAssessments,
    assessmentResults: demoAssessmentResults,
    notifications: demoNotifications,
    announcements: demoAnnouncements,
    studyTasks: demoStudyTasks,
  };
}

export function DataProvider({ children }) {
  const [db, setDb] = useState(loadInitial);
  const [loading, setLoading] = useState(false);

  // Persist on every change
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {
      console.warn('DB save error', e);
    }
  }, [db]);

  // ---------- Generic helpers ----------
  const addToCollection = (collection, item) => {
    const newItem = {
      id: generateId(collection.slice(0, 3)),
      createdAt: new Date().toISOString(),
      ...item,
    };
    setDb((prev) => ({
      ...prev,
      [collection]: [newItem, ...prev[collection]],
    }));
    return newItem;
  };

  const updateInCollection = (collection, id, patch) => {
    setDb((prev) => ({
      ...prev,
      [collection]: prev[collection].map((it) =>
        it.id === id ? { ...it, ...patch, updatedAt: new Date().toISOString() } : it
      ),
    }));
  };

  const removeFromCollection = (collection, id) => {
    setDb((prev) => ({
      ...prev,
      [collection]: prev[collection].filter((it) => it.id !== id),
    }));
  };

  // ---------- User Profile ----------
  const updateUserProfile = (uid, updatedData) => {
    setDb((prev) => ({
      ...prev,
      users: prev.users.map((u) =>
        u.uid === uid ? { ...u, ...updatedData, updatedAt: new Date().toISOString() } : u
      ),
    }));
  };
  
  // ---------- Notifications ----------
  const addNotification = (userId, title, message, type = 'info') => {
    addToCollection('notifications', {
      userId, title, message, type, read: false,
    });
  };

  const markNotificationRead = (id) => {
    updateInCollection('notifications', id, { read: true });
  };

  const markAllNotificationsRead = (userId) => {
    setDb((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
    }));
  };

  // ---------- Missed Class Workflow ----------
  const submitMissedClass = (student, subject, form) => {
    const missed = addToCollection('missedClasses', {
      studentId: student.uid,
      studentName: student.name,
      subjectId: subject.id,
      subjectName: subject.name,
      date: form.date,
      topics: form.topics,
      reason: form.reason || '',
      status: 'Pending',
    });
    return missed;
  };

  const approveMissedClass = (missedClassId, staff) => {
    const mc = db.missedClasses.find((m) => m.id === missedClassId);
    if (!mc) return;
    updateInCollection('missedClasses', missedClassId, {
      status: 'Approved',
      reviewedBy: staff.uid,
      reviewedAt: new Date().toISOString(),
    });
    addNotification(
      mc.studentId,
      'Missed Class Approved',
      `Your missed class for ${mc.subjectName} on ${mc.date} has been approved.`,
      'approval'
    );
  };

  const rejectMissedClass = (missedClassId, staff, reason) => {
    const mc = db.missedClasses.find((m) => m.id === missedClassId);
    if (!mc) return;
    updateInCollection('missedClasses', missedClassId, {
      status: 'Rejected',
      reviewedBy: staff.uid,
      reviewedAt: new Date().toISOString(),
      rejectionReason: reason,
    });
    addNotification(
      mc.studentId,
      'Missed Class Rejected',
      `Your report for ${mc.subjectName} on ${mc.date} was rejected: ${reason}`,
      'rejection'
    );
  };

  // ---------- Recovery Assignments ----------
  const createAssignment = (staff, payload) => {
    const assignment = addToCollection('assignments', {
      ...payload,
      staffId: staff.uid,
      status: 'Assigned',
      feedback: '',
      tasks: (payload.tasks || []).map((t) => ({
        id: generateId('task'),
        completed: false,
        ...t,
      })),
    });
    // notify student
    addNotification(
      payload.studentId,
      'New Recovery Assignment',
      `You've been assigned: ${payload.title}`,
      'assignment'
    );
    // link to missed class
    if (payload.missedClassId) {
      updateInCollection('missedClasses', payload.missedClassId, {
        status: 'Approved',
        assignmentId: assignment.id,
      });
    }
    return assignment;
  };

  const toggleAssignmentTask = (assignmentId, taskId) => {
    setDb((prev) => ({
      ...prev,
      assignments: prev.assignments.map((a) => {
        if (a.id !== assignmentId) return a;
        const tasks = a.tasks.map((t) =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        const allDone = tasks.every((t) => t.completed);
        return {
          ...a,
          tasks,
          status:
            a.status === 'Assigned' && tasks.some((t) => t.completed)
              ? 'In Progress'
              : a.status,
          _allDone: allDone,
        };
      }),
    }));
  };

  const submitAssignment = (assignmentId) => {
    const a = db.assignments.find((x) => x.id === assignmentId);
    if (!a) return;
    updateInCollection('assignments', assignmentId, {
      status: 'Under Review',
      submittedAt: new Date().toISOString(),
    });
    addNotification(
      a.staffId,
      'Student Submission',
      `${a.studentName} submitted "${a.title}" for review.`,
      'submission'
    );
  };

  const reviewAssignment = (assignmentId, staff, { status, feedback }) => {
    const a = db.assignments.find((x) => x.id === assignmentId);
    if (!a) return;
    updateInCollection('assignments', assignmentId, {
      status,
      feedback: feedback || a.feedback,
      reviewedBy: staff.uid,
      reviewedAt: new Date().toISOString(),
    });
    addNotification(
      a.studentId,
      status === 'Completed' ? 'Recovery Completed!' : 'Feedback Received',
      status === 'Completed'
        ? `Your recovery assignment "${a.title}" has been approved. Great work!`
        : `Your assignment "${a.title}" requires revision. Check feedback.`,
      status === 'Completed' ? 'completion' : 'revision'
    );
  };

  // ---------- Assessment Results ----------
  const submitAssessment = (student, assessment, answers) => {
    let score = 0;
    const detail = assessment.questions.map((q, i) => {
      const chosen = answers[q.id];
      const correct = chosen === q.correctAnswer;
      if (correct) score += 1;
      return { questionId: q.id, chosen, correct, correctAnswer: q.correctAnswer, explanation: q.explanation };
    });
    const result = addToCollection('assessmentResults', {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      studentId: student.uid,
      studentName: student.name,
      score,
      total: assessment.questions.length,
      percentage: Math.round((score / assessment.questions.length) * 100),
      answers,
      detail,
      submittedAt: new Date().toISOString(),
    });
    addNotification(
      student.uid,
      'Assessment Completed',
      `You scored ${score}/${assessment.questions.length} on "${assessment.title}".`,
      'assessment'
    );
    return result;
  };

  // ---------- Study Tasks ----------
  const addStudyTask = (studentId, task) => {
    addToCollection('studyTasks', { studentId, completed: false, ...task });
  };
  const toggleStudyTask = (taskId) => {
    setDb((prev) => ({
      ...prev,
      studyTasks: prev.studyTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  // ---------- Announcements ----------
  const createAnnouncement = (staff, payload) => {
    const ann = addToCollection('announcements', {
      staffId: staff.uid,
      staffName: staff.name,
      ...payload,
    });
    // Notify all students matching target
    db.users
      .filter(
        (u) =>
          u.role === 'student' &&
          (!payload.targetDept || u.department === payload.targetDept) &&
          (!payload.targetYear || u.year === payload.targetYear)
      )
      .forEach((u) => {
        addNotification(u.uid, 'New Announcement', payload.title, 'announcement');
      });
    return ann;
  };

  // ---------- Selectors ----------
  const getStudentAssignments = (studentId) =>
    db.assignments.filter((a) => a.studentId === studentId);
  const getStaffAssignments = (staffId) =>
    db.assignments.filter((a) => a.staffId === staffId);
  const getStudentMissed = (studentId) =>
    db.missedClasses.filter((m) => m.studentId === studentId);
  const getStaffPendingMissed = () =>
    db.missedClasses.filter((m) => m.status === 'Pending');
  const getStudentNotifications = (userId) =>
    db.notifications
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const getStudentResults = (studentId) =>
    db.assessmentResults.filter((r) => r.studentId === studentId);
  const getStudentResources = (department) =>
    db.resources.filter((r) => {
      const subject = db.subjects.find((s) => s.id === r.subjectId);
      return subject && subject.department === department;
    });

  const value = {
    db, loading,
    // CRUD
    addToCollection, updateInCollection, removeFromCollection,
    // User
    updateUserProfile,
    // Workflows
    submitMissedClass, approveMissedClass, rejectMissedClass,
    createAssignment, toggleAssignmentTask, submitAssignment, reviewAssignment,
    submitAssessment,
    addStudyTask, toggleStudyTask,
    createAnnouncement,
    // Notifications
    addNotification, markNotificationRead, markAllNotificationsRead,
    // Selectors
    getStudentAssignments, getStaffAssignments, getStudentMissed,
    getStaffPendingMissed, getStudentNotifications, getStudentResults,
    getStudentResources,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}