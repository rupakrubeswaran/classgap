import { useState } from 'react';
import { BookOpen, FileText, ClipboardList, ChevronRight, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

export default function MySubjects() {
  const { user } = useAuth();
  const { db, getStudentAssignments } = useData();
  const [selectedSubject, setSelectedSubject] = useState(null);

  const mySubjects = db.subjects.filter(s => s.department === user.department);
  const myAssignments = getStudentAssignments(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Subjects</h1>
        <p className="page-subtitle">Overview of your enrolled courses and materials</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mySubjects.map(subject => {
          const resources = db.resources.filter(r => r.subjectId === subject.id);
          const assignments = myAssignments.filter(a => a.subjectId === subject.id);
          const completedAsgs = assignments.filter(a => a.status === 'Completed').length;
          
          // Determine if staff has created it
          const staff = db.users.find(u => u.uid === subject.staffId);

          return (
            <div key={subject.id} className="card hover:shadow-card-hover transition-all flex flex-col group cursor-pointer" onClick={() => setSelectedSubject(subject)}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm" style={{ backgroundColor: subject.color }}>
                  <BookOpen size={24} />
                </div>
                <div className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                  {subject.code}
                </div>
              </div>

              <h3 className="text-lg font-bold text-navy-900 group-hover:text-brand-600 transition-colors mb-1">{subject.name}</h3>
              <p className="text-sm text-slate-500 mb-6">Instructor: {staff?.name || 'TBA'}</p>

              <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-100">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Resources</span>
                  <span className="text-base font-bold text-navy-900 flex items-center gap-1.5">
                    <FileText size={14} className="text-brand-500" /> {resources.length}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Assignments</span>
                  <span className="text-base font-bold text-navy-900 flex items-center gap-1.5">
                    <ClipboardList size={14} className="text-emerald-500" /> {completedAsgs}/{assignments.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subject Detail Modal */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedSubject(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="h-24 flex items-center px-6" style={{ backgroundColor: selectedSubject.color }}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white shadow-lg -mb-8 mt-8 border-4 border-white">
                <BookOpen size={28} />
              </div>
            </div>
            <div className="p-6 pt-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-navy-900">{selectedSubject.name}</h2>
                  <p className="text-sm text-slate-500">{selectedSubject.code} • {selectedSubject.credits} Credits</p>
                </div>
                <button onClick={() => setSelectedSubject(null)} className="text-slate-400 hover:text-slate-700">✕</button>
              </div>
              
              <div className="space-y-3 mt-6">
                <Link to="/student/resources" onClick={() => setSelectedSubject(null)} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <FileText className="text-brand-500" size={20} />
                    <span className="font-medium text-navy-900">View Learning Resources</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-brand-500 transition" />
                </Link>
                <Link to="/student/assignments" onClick={() => setSelectedSubject(null)} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="text-emerald-500" size={20} />
                    <span className="font-medium text-navy-900">Recovery Assignments</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-emerald-500 transition" />
                </Link>
                <Link to="/student/assessment" onClick={() => setSelectedSubject(null)} className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <Video className="text-amber-500" size={20} />
                    <span className="font-medium text-navy-900">Assessments & Quizzes</span>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-amber-500 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}