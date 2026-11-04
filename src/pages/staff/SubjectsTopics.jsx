import { useState } from 'react';
import { Plus, BookOpen, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { DEPARTMENTS, YEARS } from '../../utils/constants';

export default function SubjectsTopics() {
  const { user } = useAuth();
  const { db, addToCollection, removeFromCollection } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mySubjects = db.subjects.filter(s => s.department === user.department);

  const [form, setForm] = useState({
    name: '',
    code: '',
    department: user.department,
    year: '3rd Year',
    credits: 3,
    color: '#6366f1'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.code) {
      toast.error('Subject name and code are required');
      return;
    }
    
    addToCollection('subjects', {
      ...form,
      staffId: user.uid,
      credits: Number(form.credits)
    });
    toast.success('Subject added successfully');
    setIsModalOpen(false);
    setForm({ name: '', code: '', department: user.department, year: '3rd Year', credits: 3, color: '#6366f1' });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this subject? All related data may be affected.')) {
      removeFromCollection('subjects', id);
      toast.success('Subject deleted');
    }
  };

  const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Subjects & Topics</h1>
          <p className="page-subtitle">Manage the academic syllabus for your department</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Subject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mySubjects.map(subject => (
          <div key={subject.id} className="card relative group">
            <button 
              onClick={() => handleDelete(subject.id)}
              className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
            <div className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white" style={{ backgroundColor: subject.color }}>
              <BookOpen size={20} />
            </div>
            <h3 className="font-bold text-navy-900">{subject.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{subject.code} • {subject.year}</p>
            <div className="flex gap-2">
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{subject.credits} Credits</span>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{subject.department}</span>
            </div>
          </div>
        ))}
        {mySubjects.length === 0 && (
          <div className="col-span-full card">
            <EmptyState icon={BookOpen} title="No subjects added" description="Add subjects to start organizing your syllabus." />
          </div>
        )}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Subject">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Subject Name *</label>
              <input type="text" className="input-field" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Data Structures" />
            </div>
            <div>
              <label className="label">Subject Code *</label>
              <input type="text" className="input-field" value={form.code} onChange={(e) => setForm({...form, code: e.target.value})} placeholder="CS301" />
            </div>
            <div>
              <label className="label">Credits</label>
              <input type="number" className="input-field" value={form.credits} onChange={(e) => setForm({...form, credits: e.target.value})} />
            </div>
            <div>
              <label className="label">Department</label>
              <select className="input-field" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})}>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Year</label>
              <select className="input-field" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          
          <div>
            <label className="label">Subject Color Tag</label>
            <div className="flex gap-2">
              {colors.map(c => (
                <button key={c} type="button" onClick={() => setForm({...form, color: c})} className={`w-8 h-8 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-navy-900' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Subject</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}