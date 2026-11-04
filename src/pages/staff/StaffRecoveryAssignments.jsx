import { useState } from 'react';
import { Plus, ClipboardList, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function StaffRecoveryAssignments() {
  const { user } = useAuth();
  const { db, createAssignment, reviewAssignment } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Data
  const myAssignments = db.assignments.filter(a => a.staffId === user.uid);
  const approvedMissedClasses = db.missedClasses.filter(m => m.status === 'Approved' && !m.assignmentId);
  
  const [form, setForm] = useState({
    missedClassId: '',
    title: '',
    priority: 'High',
    startDate: new Date().toISOString().split('T')[0],
    deadline: '',
    tasks: [{ title: 'Read notes and materials' }, { title: 'Complete practice problems' }]
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.missedClassId || !form.title || !form.deadline) {
      toast.error('Please fill required fields');
      return;
    }

    const missedClass = db.missedClasses.find(m => m.id === form.missedClassId);
    if (!missedClass) return;

    setLoading(true);
    setTimeout(() => {
      createAssignment(user, {
        missedClassId: missedClass.id,
        studentId: missedClass.studentId,
        studentName: missedClass.studentName,
        subjectId: missedClass.subjectId,
        subjectName: missedClass.subjectName,
        title: form.title,
        topics: missedClass.topics,
        priority: form.priority,
        startDate: form.startDate,
        deadline: form.deadline,
        tasks: form.tasks.filter(t => t.title.trim() !== '')
      });
      toast.success('Recovery assignment created and assigned to student!');
      setIsModalOpen(false);
      setForm({ missedClassId: '', title: '', priority: 'High', startDate: new Date().toISOString().split('T')[0], deadline: '', tasks: [{ title: '' }] });
      setLoading(false);
    }, 600);
  };

  const handleReview = (assignmentId, status) => {
    const feedback = window.prompt(`Enter feedback for the student (optional):`);
    reviewAssignment(assignmentId, user, { status, feedback });
    toast.success(`Assignment marked as ${status}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Recovery Assignments</h1>
          <p className="page-subtitle">Create and manage catch-up plans for students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Assignment
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myAssignments.length > 0 ? myAssignments.map(assignment => (
          <div key={assignment.id} className="card flex flex-col">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                <ClipboardList size={20} />
              </div>
              <Badge status={assignment.status} />
            </div>
            
            <h3 className="font-semibold text-navy-900 line-clamp-1">{assignment.title}</h3>
            <p className="text-xs text-slate-500 mt-1 mb-3">{assignment.studentName} • {assignment.subjectName}</p>
            
            <div className="space-y-2 mb-4 flex-1">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock size={14} className="text-amber-500" /> Due {formatDate(assignment.deadline)}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <AlertCircle size={14} className="text-brand-500" /> Priority: {assignment.priority}
              </div>
              <div className="mt-2 text-xs font-medium text-navy-800">
                Tasks: {assignment.tasks.filter(t => t.completed).length}/{assignment.tasks.length} completed
              </div>
            </div>

            {/* Actions based on status */}
            <div className="pt-3 border-t border-slate-100 mt-auto">
              {assignment.status === 'Under Review' ? (
                <div className="flex gap-2">
                  <button onClick={() => handleReview(assignment.id, 'Completed')} className="flex-1 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded text-xs font-medium transition">Approve</button>
                  <button onClick={() => handleReview(assignment.id, 'Revision Required')} className="flex-1 py-1.5 bg-orange-50 text-orange-600 hover:bg-orange-100 rounded text-xs font-medium transition">Request Revision</button>
                </div>
              ) : assignment.status === 'Completed' ? (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1"><CheckCircle size={14} /> Completed successfully</p>
              ) : (
                <p className="text-xs text-slate-400 italic">Waiting for student to submit...</p>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full card">
            <EmptyState icon={ClipboardList} title="No assignments created" description="Create a recovery plan from an approved missed class." />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Recovery Assignment">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="label">Select Approved Missed Class *</label>
            <select 
              className="input-field"
              value={form.missedClassId}
              onChange={(e) => {
                const mc = db.missedClasses.find(m => m.id === e.target.value);
                setForm({...form, missedClassId: e.target.value, title: mc ? `${mc.subjectName} Recovery - ${mc.topics[0]}` : ''});
              }}
            >
              <option value="">Select a request</option>
              {approvedMissedClasses.map(m => (
                <option key={m.id} value={m.id}>{m.studentName} - {m.subjectName} ({formatDate(m.date)})</option>
              ))}
            </select>
            {approvedMissedClasses.length === 0 && <p className="text-xs text-red-500 mt-1">No approved missed classes available. Approve one first!</p>}
          </div>

          <div>
            <label className="label">Assignment Title *</label>
            <input 
              type="text" 
              className="input-field" 
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select className="input-field" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
                <option>High</option><option>Medium</option><option>Low</option>
              </select>
            </div>
            <div>
              <label className="label">Deadline *</label>
              <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label">Study Tasks</label>
            {form.tasks.map((task, idx) => (
              <input 
                key={idx}
                type="text" 
                className="input-field mb-2 text-sm" 
                placeholder={`Task ${idx + 1}`}
                value={task.title}
                onChange={(e) => {
                  const newTasks = [...form.tasks];
                  newTasks[idx].title = e.target.value;
                  setForm({...form, tasks: newTasks});
                }}
              />
            ))}
            <button type="button" onClick={() => setForm({...form, tasks: [...form.tasks, { title: '' }]})} className="text-xs text-brand-600 font-medium hover:underline">
              + Add another task
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading || approvedMissedClasses.length === 0} className="btn-primary">
              {loading ? 'Creating...' : 'Assign to Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}