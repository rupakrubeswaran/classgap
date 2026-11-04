import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Award, ArrowRight, PlayCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';

export default function SelfAssessment() {
  const { user } = useAuth();
  const { db, submitAssessment } = useData();
  
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const mySubjectIds = mySubjects.map(s => s.id);
  
  // Get quizzes for student's department
  const availableQuizzes = db.assessments.filter(q => mySubjectIds.includes(q.subjectId));
  // Get student's past results
  const pastResults = db.assessmentResults.filter(r => r.studentId === user.uid);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  const handleSelectOption = (qId, optIndex) => {
    setAnswers({ ...answers, [qId]: optIndex });
  };

  const handleNext = () => {
    if (currentQIndex < activeQuiz.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handleSubmit = () => {
    const res = submitAssessment(user, activeQuiz, answers);
    setResult(res);
    setIsSubmitted(true);
    toast.success('Assessment submitted!');
  };

  if (isSubmitted && result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card text-center py-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-50 text-brand-600 rounded-full mb-4">
            <Award size={40} />
          </div>
          <h2 className="text-2xl font-bold text-navy-900">Quiz Completed!</h2>
          <p className="text-slate-500 mt-1">{activeQuiz.title}</p>
          
          <div className="mt-6 flex justify-center gap-8">
            <div>
              <p className="text-sm text-slate-500">Your Score</p>
              <p className="text-4xl font-bold text-navy-900">{result.score}<span className="text-xl text-slate-400">/{result.total}</span></p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Percentage</p>
              <p className={`text-4xl font-bold ${result.percentage >= 50 ? 'text-emerald-500' : 'text-red-500'}`}>{result.percentage}%</p>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-3">
            <button onClick={() => setActiveQuiz(null)} className="btn-secondary">Back to Quizzes</button>
          </div>
        </div>

        {/* Review Answers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-navy-900">Review Answers</h3>
          {activeQuiz.questions.map((q, i) => {
            const detail = result.detail[i];
            return (
              <div key={q.id} className={`card border-l-4 ${detail.correct ? 'border-l-emerald-500' : 'border-l-red-500'}`}>
                <div className="flex gap-3">
                  {detail.correct ? <CheckCircle className="text-emerald-500 shrink-0" size={20} /> : <XCircle className="text-red-500 shrink-0" size={20} />}
                  <div>
                    <p className="font-medium text-navy-900">{i + 1}. {q.question}</p>
                    <div className="mt-3 space-y-1.5 text-sm">
                      {q.options.map((opt, optIdx) => (
                        <div key={optIdx} className={`px-3 py-2 rounded-lg ${
                          optIdx === q.correctAnswer ? 'bg-emerald-50 text-emerald-700 font-medium' : 
                          (optIdx === detail.chosen && !detail.correct) ? 'bg-red-50 text-red-700' : 'text-slate-600'
                        }`}>
                          {opt}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-3 bg-slate-50 p-2 rounded"><b>Explanation:</b> {q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const q = activeQuiz.questions[currentQIndex];
    const isLast = currentQIndex === activeQuiz.questions.length - 1;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
            <div>
              <h2 className="font-semibold text-navy-900">{activeQuiz.title}</h2>
              <p className="text-xs text-slate-500">Question {currentQIndex + 1} of {activeQuiz.questions.length}</p>
            </div>
            <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-medium flex items-center gap-1">
              <Clock size={14} /> {activeQuiz.duration} mins
            </div>
          </div>

          <h3 className="text-lg font-medium text-navy-900 mb-4">{q.question}</h3>
          
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(q.id, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${
                  answers[q.id] === idx 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium shadow-sm' 
                    : 'border-slate-200 hover:border-brand-300 hover:bg-slate-50'
                }`}
              >
                <span className="inline-block w-6 h-6 rounded-full bg-white border border-slate-200 text-center leading-5 text-xs mr-2 font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-between mt-8 pt-4 border-t border-slate-100">
            <button onClick={() => setActiveQuiz(null)} className="text-sm text-slate-500 hover:text-navy-900">Cancel</button>
            {isLast ? (
              <button 
                onClick={handleSubmit} 
                disabled={Object.keys(answers).length !== activeQuiz.questions.length}
                className="btn-primary"
              >
                Submit Quiz
              </button>
            ) : (
              <button 
                onClick={handleNext} 
                disabled={answers[q.id] === undefined}
                className="btn-primary flex items-center gap-2"
              >
                Next <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Self-Assessment</h1>
        <p className="page-subtitle">Test your knowledge with topic-wise quizzes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Quizzes */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold text-navy-900">Available Quizzes</h3>
          {availableQuizzes.length > 0 ? availableQuizzes.map(quiz => {
            const subject = db.subjects.find(s => s.id === quiz.subjectId);
            const hasTaken = pastResults.some(r => r.assessmentId === quiz.id);
            
            return (
              <div key={quiz.id} className="card flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900">{quiz.title}</h4>
                    <p className="text-sm text-slate-500 mt-0.5">{subject?.name} • {quiz.questions.length} questions</p>
                    {hasTaken && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><CheckCircle size={12}/> Completed</p>}
                  </div>
                </div>
                <button onClick={() => startQuiz(quiz)} className="btn-secondary shrink-0 flex items-center justify-center gap-2">
                  <PlayCircle size={18} /> {hasTaken ? 'Retake' : 'Start Quiz'}
                </button>
              </div>
            );
          }) : (
            <div className="card">
              <EmptyState icon={BookOpen} title="No quizzes available" description="Your instructors haven't published any assessments yet." />
            </div>
          )}
        </div>

        {/* Past Results */}
        <div>
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Past Results</h3>
          <div className="card p-0 overflow-hidden">
            {pastResults.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {pastResults.map(res => (
                  <div key={res.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-navy-900 text-sm">{res.assessmentTitle}</p>
                      <p className="text-xs text-slate-500">{res.score}/{res.total} correct</p>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${res.percentage >= 50 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {res.percentage}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 p-6 text-center">No quizzes taken yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}