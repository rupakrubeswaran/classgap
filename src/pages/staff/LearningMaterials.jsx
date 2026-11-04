import { useState } from 'react';
import { Plus, FileText, Video, Link as LinkIcon, Presentation, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function LearningMaterials() {
  const { user } = useAuth();
  const { db, addToCollection, removeFromCollection } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const myResources = db.resources.filter(r => {
    const sub = db.subjects.find(s => s.id === r.subjectId);
    return sub && sub.department === user.department;
  });

  const [form, setForm] = useState({
    title: '',
    subjectId: '',
    type: 'pdf',
    url: '',
    size: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.subjectId || !form.url) {
      toast.error('Title, Subject, and URL are required');
      return;
    }
    setLoading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      addToCollection('resources', {
        ...form,
        staffId: user.uid
      });
      toast.success('Material uploaded successfully');
      setIsModalOpen(false);
      setForm({ title: '', subjectId: '', type: 'pdf', url: '', size: '' });
      setLoading(false);
    }, 600);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      removeFromCollection('resources', id);
      toast.success('Resource deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Learning Materials</h1>
          <p className="page-subtitle">Upload and manage study resources for your students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Upload Material
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Resource Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myResources.length > 0 ? myResources.map(res => {
                const subject = db.subjects.find(s => s.id === res.subjectId);
                return (
                  <tr key={res.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-navy-900">{res.title}</td>
                    <td className="px-6 py-4 text-slate-600">{subject?.name}</td>
                    <td className="px-6 py-4 uppercase text-xs font-bold text-slate-500">{res.type}</td>
                    <td className="px-6 py-4 text-slate-500">{formatDate(res.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(res.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState 
                      icon={FileText} 
                      title="No materials uploaded" 
                      description="Upload your first PDF, PPT, or video link to get started."
                      action={<button onClick={() => setIsModalOpen(true)} className="btn-secondary">Upload Now</button>}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Learning Material">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Resource Title *</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. Chapter 4 - Trees and Graphs"
              value={form.title}
              onChange={(e) => setForm({...form, title: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Subject *</label>
              <select 
                className="input-field"
                value={form.subjectId}
                onChange={(e) => setForm({...form, subjectId: e.target.value})}
              >
                <option value="">Select subject</option>
                {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Type</label>
              <select 
                className="input-field"
                value={form.type}
                onChange={(e) => setForm({...form, type: e.target.value})}
              >
                <option value="pdf">PDF Document</option>
                <option value="ppt">PPT Presentation</option>
                <option value="video">Video Lecture</option>
                <option value="link">External Link</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">File URL / Video Link *</label>
            <input 
              type="url" 
              className="input-field" 
              placeholder="https://..."
              value={form.url}
              onChange={(e) => setForm({...form, url: e.target.value})}
            />
            <p className="text-xs text-slate-500 mt-1">In a production app, this would be a Firebase Storage upload.</p>
          </div>

          <div>
            <label className="label">File Size (Optional)</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="e.g. 2.4 MB"
              value={form.size}
              onChange={(e) => setForm({...form, size: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Uploading...' : 'Upload Material'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}