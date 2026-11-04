import { Download, TrendingUp, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';

export default function MyProgress() {
  const { user } = useAuth();
  const { db, getStudentAssignments, getStudentMissed, getStudentResults } = useData();

  const assignments = getStudentAssignments(user.uid);
  const missedClasses = getStudentMissed(user.uid);
  const results = getStudentResults(user.uid);

  // Stats
  const completedAsgs = assignments.filter(a => a.status === 'Completed');
  const pendingAsgs = assignments.filter(a => a.status !== 'Completed');
  
  // Chart Data: Performance by Subject
  const subjectPerformance = db.subjects.filter(s => s.department === user.department).map(sub => {
    const subjectResults = results.filter(r => {
      const asg = db.assessments.find(a => a.id === r.assessmentId);
      return asg?.subjectId === sub.id;
    });
    const avgScore = subjectResults.length > 0 
      ? subjectResults.reduce((acc, r) => acc + r.percentage, 0) / subjectResults.length 
      : 0;
      
    return {
      name: sub.code,
      score: Math.round(avgScore)
    };
  }).filter(d => d.score > 0);

  const handleDownloadReport = () => {
    // Triggers the browser's print-to-PDF dialog
    window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="page-title">My Progress</h1>
          <p className="page-subtitle">Track your learning recovery journey</p>
        </div>
        <button onClick={handleDownloadReport} className="btn-primary flex items-center gap-2 print:hidden">
          <Download size={18} /> Download Report
        </button>
      </div>

      {/* Printable Report Area */}
      <div className="space-y-6" id="printable-report">
        {/* Hidden header for PDF only */}
        <div className="hidden print:block mb-8 border-b-2 border-slate-900 pb-4">
          <h1 className="text-3xl font-bold text-black">ClassGap Progress Report</h1>
          <p className="text-slate-600 mt-1">Student: {user.name} ({user.registerNumber}) | Date: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BookOpen} label="Missed Classes" value={missedClasses.length} color="rose" />
          <StatCard icon={CheckCircle} label="Recoveries Completed" value={completedAsgs.length} color="emerald" />
          <StatCard icon={Clock} label="Active Recoveries" value={pendingAsgs.length} color="amber" />
          <StatCard icon={TrendingUp} label="Quizzes Taken" value={results.length} color="brand" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Chart */}
          <div className="card">
            <h3 className="text-lg font-semibold text-navy-900 mb-6">Average Quiz Score by Subject</h3>
            {subjectPerformance.length > 0 ? (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectPerformance} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px' }} />
                    <Bar dataKey="score" name="Avg Score (%)" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-10">Take some quizzes to see your progress!</p>
            )}
          </div>

          {/* Assignment History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-navy-900 mb-4">Recovery History</h3>
            <div className="space-y-3">
              {assignments.length > 0 ? assignments.map(asg => (
                <div key={asg.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-medium text-navy-900 text-sm">{asg.title}</p>
                    <p className="text-xs text-slate-500">{asg.subjectName} • Due {formatDate(asg.deadline)}</p>
                  </div>
                  <Badge status={asg.status} />
                </div>
              )) : (
                <p className="text-sm text-slate-500 text-center py-10">No assignments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}