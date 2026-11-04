import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar as CalendarIcon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function StudyPlanner() {
  const { user } = useAuth();
  const { db, addStudyTask, toggleStudyTask } = useData();
  const [newTask, setNewTask] = useState({ title: '', subjectId: '', date: new Date().toISOString().split('T')[0], priority: 'Medium' });

  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const myTasks = db.studyTasks.filter(t => t.studentId === user.uid).sort((a,b) => new Date(a.date) - new Date(b.date));

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.subjectId) {
      toast.error('Please enter a task title and select a subject');
      return;
    }
    addStudyTask(user.uid, newTask);
    toast.success('Task added to planner');
    setNewTask({ title: '', subjectId: '', date: new Date().toISOString().split('T')[0], priority: 'Medium' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Study Planner</h1>
        <p className="page-subtitle">Organize your daily learning tasks and targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Task Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-24">
            <h3 className="font-semibold text-navy-900 mb-4 flex items-center gap-2">
              <Plus size={18} className="text-brand-600" /> Add New Task
            </h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="label">Task Description</label>
                <input type="text" className="input-field" placeholder="e.g. Revise Binary Trees" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="input-field" value={newTask.subjectId} onChange={(e) => setNewTask({...newTask, subjectId: e.target.value})}>
                  <option value="">Select subject</option>
                  {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date</label>
                  <input type="date" className="input-field" value={newTask.date} onChange={(e) => setNewTask({...newTask, date: e.target.value})} />
                </div>
                <div>
                  <label className="label">Priority</label>
                  <select className="input-field" value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">Add to Planner</button>
            </form>
          </div>
        </div>

        {/* Task List */}
        <div className="lg:col-span-2 space-y-4">
          {myTasks.length > 0 ? myTasks.map(task => {
            const subject = db.subjects.find(s => s.id === task.subjectId);
            return (
              <div key={task.id} className={`card p-4 flex items-center gap-4 transition-all ${task.completed ? 'opacity-60 bg-slate-50' : ''}`}>
                <button onClick={() => toggleStudyTask(task.id)} className="shrink-0">
                  {task.completed ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Circle size={24} className="text-slate-300 hover:text-brand-500" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-navy-900 ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><CalendarIcon size={12} /> {formatDate(task.date)}</span>
                    <span className="font-medium text-brand-600">{subject?.name}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  task.priority === 'High' ? 'bg-red-50 text-red-600' : 
                  task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-600'
                }`}>
                  {task.priority}
                </div>
              </div>
            );
          }) : (
            <div className="card">
              <EmptyState 
                icon={Clock} 
                title="Your planner is empty" 
                description="Add your first study task to start organizing your learning."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}