import { useState } from 'react';
import { Plus, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';

export default function CatchupPlans() {
  const { db, addToCollection, removeFromCollection } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For demo purposes, we save these templates to a special collection or just use local state
  const [templates, setTemplates] = useState([
    {
      id: 'temp_1',
      title: 'Standard 3-Day Recovery Plan',
      description: 'Use this template for typical single-topic absences. Includes reading, practice, and quiz.',
      tasks: ['Read provided notes/materials', 'Complete 3 practice problems', 'Attempt the topic quiz'],
      priority: 'Medium'
    },
    {
      id: 'temp_2',
      title: 'Intensive Exam Prep Recovery',
      description: 'For students who missed critical pre-exam revision classes.',
      tasks: ['Review entire chapter summary', 'Solve previous year questions', 'Schedule 1-on-1 with instructor'],
      priority: 'High'
    }
  ]);

  const [form, setForm] = useState({ title: '', description: '', tasks: '', priority: 'Medium' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.tasks) {
      toast.error('Title and tasks are required');
      return;
    }
    const newTemplate = {
      id: `temp_${Date.now()}`,
      title: form.title,
      description: form.description,
      tasks: form.tasks.split('\n').filter(t => t.trim() !== ''),
      priority: form.priority
    };
    setTemplates([newTemplate, ...templates]);
    toast.success('Template created');
    setIsModalOpen(false);
    setForm({ title: '', description: '', tasks: '', priority: 'Medium' });
  };

  const handleDelete = (id) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success('Template deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Catch-up Plan Templates</h1>
          <p className="page-subtitle">Create reusable task lists to speed up assignment creation</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map(temp => (
          <div key={temp.id} className="card relative group flex flex-col">
            <button 
              onClick={() => handleDelete(temp.id)}
              className="absolute top-4 right-4 p-1.5 bg-red-50 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
            >
              <Trash2 size={16} />
            </button>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-brand-50 text-brand-600 rounded-lg">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-navy-900 text-lg">{temp.title}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">{temp.description}</p>
            
            <div className="bg-slate-50 rounded-lg p-4 flex-1">
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Included Tasks:</p>
              <ul className="space-y-2">
                {temp.tasks.map((task, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className={`text-xs font-bold px-2 py-1 rounded ${
                temp.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {temp.priority} Priority
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Plan Template">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Template Title *</label>
            <input type="text" className="input-field" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Standard 3-Day Recovery" />
          </div>
          <div>
            <label className="label">Description</label>
            <input type="text" className="input-field" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="When should this be used?" />
          </div>
          <div>
            <label className="label">Tasks (One per line) *</label>
            <textarea className="input-field min-h-[120px]" value={form.tasks} onChange={(e) => setForm({...form, tasks: e.target.value})} placeholder="Read chapter 4&#10;Solve practice problems&#10;Take the quiz" />
          </div>
          <div>
            <label className="label">Default Priority</label>
            <select className="input-field" value={form.priority} onChange={(e) => setForm({...form, priority: e.target.value})}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Save Template</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}