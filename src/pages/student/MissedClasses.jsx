import { useState } from 'react';
import { Plus, CalendarX, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function MissedClasses() {
  const { user } = useAuth();
  const { db, getStudentMissed, submitMissedClass } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter subjects for this student's department
  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const missedClasses = getStudentMissed(user.uid);

  const [form, setForm] = useState({
    subjectId: '',
    date: '',
    topics: '',
    reason: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.subjectId || !form.date || !form.topics) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    const subject = mySubjects.find(s => s.id === form.subjectId);
    
    // Simulate network delay
    setTimeout(() => {
      submitMissedClass(user, subject, {
        date: form.date,
        topics: form.topics.split(',').map(t => t.trim()).filter(Boolean),
        reason: form.reason
      });
      toast.success('Missed class reported successfully');
      setIsModalOpen(false);
      setForm({ subjectId: '', date: '', topics: '', reason: '' });
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Missed Classes</h1>
          <p className="page-subtitle">Report absences and track verification status</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Report Missed Class
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Topics Missed</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {missedClasses.length > 0 ? missedClasses.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-medium text-navy-900">{m.subjectName}</td>
                  <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{formatDate(m.date)}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {m.topics.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs max-w-[200px] truncate">{m.reason || '—'}</td>
                  <td className="px-6 py-4">
                    <Badge status={m.status} />
                    {m.status === 'Rejected' && m.rejectionReason && (
                      <p className="text-[10px] text-red-500 mt-1 max-w-[150px]">{m.rejectionReason}</p>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState 
                      icon={CalendarX} 
                      title="No missed classes reported" 
                      description="When you miss a class, report it here so your instructor can create a recovery plan."
                      action={<button onClick={() => setIsModalOpen(true)} className="btn-secondary">Report Now</button>}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Report Missed Class">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Subject *</label>
            <select 
              className="input-field"
              value={form.subjectId}
              onChange={(e) => setForm({...form, subjectId: e.target.value})}
            >
              <option value="">Select a subject</option>
              {mySubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="label">Date of Absence *</label>
            <input 
              type="date" 
              className="input-field"
              max={new Date().toISOString().split('T')[0]}
              value={form.date}
              onChange={(e) => setForm({...form, date: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Topics Missed *</label>
            <input 
              type="text" 
              className="input-field"
              placeholder="e.g. Binary Trees, BFS, DFS (comma separated)"
              value={form.topics}
              onChange={(e) => setForm({...form, topics: e.target.value})}
            />
            <p className="text-xs text-slate-500 mt-1">Separate multiple topics with commas</p>
          </div>
          
          <div>
            <label className="label">Reason for Absence (Optional)</label>
            <textarea 
              className="input-field min-h-[80px]"
              placeholder="e.g. Medical appointment, family emergency..."
              value={form.reason}
              onChange={(e) => setForm({...form, reason: e.target.value})}
            />
          </div>

          <div className="p-3 bg-amber-50 rounded-lg flex gap-2 text-amber-700 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>Your instructor will review this report. Once approved, a recovery assignment will be generated for you.</p>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}