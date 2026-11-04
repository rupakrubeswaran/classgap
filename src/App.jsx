import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import StudentRegister from './pages/auth/StudentRegister';
import ForgotPassword from './pages/auth/ForgotPassword';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import MySubjects from './pages/student/MySubjects';
import MissedClasses from './pages/student/MissedClasses';
import LearningResources from './pages/student/LearningResources';
import RecoveryAssignments from './pages/student/RecoveryAssignments';
import StudyPlanner from './pages/student/StudyPlanner';
import AIAssistant from './pages/student/AIAssistant';
import SelfAssessment from './pages/student/SelfAssessment';
import MyProgress from './pages/student/MyProgress';
import Notifications from './pages/student/Notifications';
import Profile from './pages/student/Profile';

// Staff Imports
import StaffDashboard from './pages/staff/StaffDashboard';
import StudentManagement from './pages/staff/StudentManagement';
import SubjectsTopics from './pages/staff/SubjectsTopics';
import LearningMaterials from './pages/staff/LearningMaterials';
import MissedClassRequests from './pages/staff/MissedClassRequests';
import StaffRecoveryAssignments from './pages/staff/StaffRecoveryAssignments';
import CatchupPlans from './pages/staff/CatchupPlans';
import AssessmentManagement from './pages/staff/AssessmentManagement';
import PerformanceAnalytics from './pages/staff/PerformanceAnalytics';
import Announcements from './pages/staff/Announcements';
import StaffNotifications from './pages/staff/StaffNotifications'; // Matches the file we kept
import StaffProfile from './pages/staff/StaffProfile';

import StudentLayout from './components/layout/StudentLayout';
import StaffLayout from './components/layout/StaffLayout';

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register/student" element={<StudentRegister />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Root redirect */}
      <Route
        path="/"
        element={
          <Navigate
            to={!user ? '/login' : user.role === 'staff' ? '/staff/dashboard' : '/student/dashboard'}
            replace
          />
        }
      />

      {/* Student Portal */}
      <Route
        path="/student"
        element={
          <ProtectedRoute role="student">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="subjects" element={<MySubjects />} />
        <Route path="missed-classes" element={<MissedClasses />} />
        <Route path="resources" element={<LearningResources />} />
        <Route path="assignments" element={<RecoveryAssignments />} />
        <Route path="planner" element={<StudyPlanner />} />
        <Route path="ai-assistant" element={<AIAssistant />} />
        <Route path="assessment" element={<SelfAssessment />} />
        <Route path="progress" element={<MyProgress />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Staff Portal */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute role="staff">
            <StaffLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/staff/dashboard" replace />} />
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="subjects" element={<SubjectsTopics />} />
        <Route path="materials" element={<LearningMaterials />} />
        <Route path="missed-requests" element={<MissedClassRequests />} />
        <Route path="assignments" element={<StaffRecoveryAssignments />} />
        <Route path="catchup-plans" element={<CatchupPlans />} />
        <Route path="assessments" element={<AssessmentManagement />} />
        <Route path="analytics" element={<PerformanceAnalytics />} />
        <Route path="announcements" element={<Announcements />} />
        <Route path="notifications" element={<StaffNotifications />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}