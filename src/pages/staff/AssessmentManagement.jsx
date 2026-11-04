import { useState } from 'react';
import { Plus, Trash2, FileQuestion, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

export default function AssessmentManagement() {
  const { user } = useAuth();
  const { db, addToCollection, removeFromCollection } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const myAssessments = db.assessments.filter(a => a.staffId === user.uid);

  const [form, setForm] = useState({
    title: '',
    subjectId: '',
    duration: 15,
    deadline: '',
    questions: [
      { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }
    ]
  });

  const handleAddQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }]
    });
  };

  const handleRemoveQuestion = (index) => {
    const newQs = form.questions.filter((_, i) => i !== index);
    setForm({ ...form, questions: newQs });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQs = [...form.questions];
    newQs[index][field] = value;
    setForm({ ...form, questions: newQs });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQs = [...form.questions];
    newQs[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: newQs });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.subjectId || !form.deadline) {
      toast.error('Please fill all required fields');
      return;
    }
    // Validate questions
    const invalidQ = form.questions.find(q => !q.question || q.options.some(o => !o));
    if (invalidQ) {
      toast.error('Please fill in all questions and options');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      addToCollection('assessments', {
        ...form,
        staffId: user.uid
      });
      toast.success('Quiz created successfully!');
      setIsModalOpen(false);
      setForm({ title: '', subjectId: '', duration: 15, deadline: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' }] });
      setLoading(false);
    }, 600);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this quiz?')) {
      removeFromCollection('assessments', id);
      toast.success('Quiz deleted');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">Assessment Management</h1>
          <p className="page-subtitle">Create topic-wise MCQ tests for your students</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Create Quiz
        </button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Quiz Title</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Questions</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myAssessments.length > 0 ? myAssessments.map(quiz => {
                const subject = db.subjects.find(s => s.id === quiz.subjectId);
                return (
                  <tr key={quiz.id} className="hover:bg-slate-50/50 transition">
                    <td className="px-6 py-4 font-medium text-navy-900">{quiz.title}</td>
                    <td className="px-6 py-4 text-slate-600">{subject?.name}</td>
                    <td className="px-6 py-4"><Badge color="bg-brand-50 text-brand-700">{quiz.questions.length} Qs</Badge></td>
                    <td className="px-6 py-4 text-slate-500">{new Date(quiz.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDelete(quiz.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5">
                    <EmptyState 
                      icon={FileQuestion} 
                      title="No quizzes yet" 
                      description="Create your first MCQ quiz to test your students."
                      action={<button onClick={() => setIsModalOpen(true)} className="btn-secondary">Create Quiz</button>}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Quiz Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Quiz" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Quiz Title *</label>
              <input type="text" className="input-field" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Data Structures Mid-Term" />
            </div>
            <div>
              <label className="label">Subject *</label>
              <select className="input-field" value={form.subjectId} onChange={(e) => setForm({...form, subjectId: e.target.value})}>
                <option value="">Select subject</option>
                {mySubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Duration (minutes)</label>
              <input type="number" className="input-field" value={form.duration} onChange={(e) => setForm({...form, duration: e.target.value})} />
            </div>
            <div>
              <label className="label">Deadline *</label>
              <input type="date" className="input-field" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="font-semibold text-navy-900 mb-3">Questions</h3>
            {form.questions.map((q, qIndex) => (
              <div key={qIndex} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4 relative">
                <button type="button" onClick={() => handleRemoveQuestion(qIndex)} className="absolute top-3 right-3 text-slate-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
                <div className="mb-3">
                  <label className="label text-xs">Question {qIndex + 1}</label>
                  <input type="text" className="input-field bg-white" value={q.question} onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} placeholder="Type the question here..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input type="radio" name={`correct_${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)} className="w-4 h-4 text-brand-600 focus:ring-brand-500" />
                      <input type="text" className="input-field bg-white py-1.5 text-sm" value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + oIndex)}`} />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mb-2">Select the radio button next to the correct answer.</p>
                <div>
                  <label className="label text-xs">Explanation (Optional)</label>
                  <input type="text" className="input-field bg-white py-1.5 text-sm" value={q.explanation} onChange={(e) => handleQuestionChange(qIndex, 'explanation', e.target.value)} placeholder="Why is this the correct answer?" />
                </div>
              </div>
            ))}
            <button type="button" onClick={handleAddQuestion} className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:underline">
              <Plus size={16} /> Add Another Question
            </button>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : 'Publish Quiz'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}