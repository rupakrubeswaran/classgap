import { useState } from 'react';
import { Plus, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/helpers';
import { DEPARTMENTS, YEARS } from '../../utils/constants';

export default function Announcements() {
  const { user } = useAuth();
  const { db, createAnnouncement } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const myAnnouncements = db.announcements.filter(a => a.staffId === user.uid);

  const [form, setForm] = useState({
    title: '',
    message: '',
    targetDept: user.department,
    targetYear: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.message) {
      toast.error('Title and message are required');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      createAnnouncement(user, form);
      toast.success('Announcement broadcasted to students!');
      setIsModalOpen(false);
      setForm({ title: '', message: '', targetDept: user.department, targetYear: '' });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Announcements</h1>
          <p className="page-subtitle">Broadcast important updates to your students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Announcement
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myAnnouncements.length > 0 ? myAnnouncements.map(ann => (
          <div key={ann.id} className="card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
            <div className="flex items-center gap-2 mb-2">
              <Megaphone size={16} className="text-brand-500" />
              <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Announcement</span>
            </div>
            <h3 className="font-semibold text-navy-900 text-lg mb-2">{ann.title}</h3>
            <p className="text-sm text-slate-600 mb-4 whitespace-pre-wrap">{ann.message}</p>
            <div className="flex justify-between items-center text-xs text-slate-400 pt-3 border-t border-slate-100">
              <span>{formatDateTime(ann.createdAt)}</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {ann.targetYear || 'All Years'} • {ann.targetDept}
              </span>
            </div>
          </div>
        )) : (
          <div className="col-span-full card">
            <EmptyState 
              icon={Megaphone} 
              title="No announcements yet" 
              description="Create your first announcement to notify students about exams, deadlines, or events."
              action={<button onClick={() => setIsModalOpen(true)} className="btn-secondary">Create Now</button>}
            />
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Mid-Semester Exam Schedule"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="label">Message *</label>
            <textarea 
              className="input-field min-h-[120px]"
              placeholder="Type your announcement details here..."
              value={form.message}
              onChange={(e) => setForm({...form, message: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Target Department</label>
              <select 
                className="input-field"
                value={form.targetDept}
                onChange={(e) => setForm({...form, targetDept: e.target.value})}
              >
                <option value="">All Departments</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Target Year</label>
              <select 
                className="input-field"
                value={form.targetYear}
                onChange={(e) => setForm({...form, targetYear: e.target.value})}
              >
                <option value="">All Years</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Broadcasting...' : 'Broadcast Announcement'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}