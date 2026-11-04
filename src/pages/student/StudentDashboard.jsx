import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, CalendarX, CheckCircle, TrendingUp, 
  Clock, AlertCircle, ArrowRight, PlayCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { getStudentMissed, getStudentAssignments, db } = useData();

  const missedClasses = getStudentMissed(user.uid);
  const assignments = getStudentAssignments(user.uid);

  // Calculate Stats
  const totalMissed = missedClasses.length;
  const pendingAssignments = assignments.filter(a => a.status !== 'Completed').length;
  const completedAssignments = assignments.filter(a => a.status === 'Completed').length;
  
  const totalTasks = assignments.reduce((acc, a) => acc + a.tasks.length, 0);
  const completedTasks = assignments.reduce((acc, a) => acc + a.tasks.filter(t => t.completed).length, 0);
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Chart Data
  const pieData = [
    { name: 'Completed', value: completedTasks, color: '#10b981' },
    { name: 'Pending', value: totalTasks - completedTasks, color: '#e2e8f0' },
  ];

  // Get recent items
  const recentAssignments = assignments.slice(0, 3);
  const recentMissed = missedClasses.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-brand-800 to-brand-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
          <p className="text-brand-100 mt-2 max-w-lg">
            You have {pendingAssignments} pending recovery assignment{pendingAssignments !== 1 && 's'}. 
            Keep up the great work and stay on top of your learning.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/student/assignments" className="px-5 py-2.5 bg-white text-brand-700 rounded-lg font-medium text-sm hover:bg-brand-50 transition shadow-sm">
              View Assignments
            </Link>
            <Link to="/student/missed-classes" className="px-5 py-2.5 bg-brand-700/50 backdrop-blur text-white border border-brand-400/30 rounded-lg font-medium text-sm hover:bg-brand-700 transition">
              Report Missed Class
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarX} label="Missed Classes" value={totalMissed} color="rose" subtitle="Reported this semester" />
        <StatCard icon={BookOpen} label="Pending Recovery" value={pendingAssignments} color="amber" subtitle="Assignments to complete" />
        <StatCard icon={CheckCircle} label="Completed" value={completedAssignments} color="emerald" subtitle="Recovery tasks finished" />
        <StatCard icon={TrendingUp} label="Overall Progress" value={`${progressPercent}%`} color="brand" subtitle="Across all assignments" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Chart */}
        <div className="card flex flex-col items-center justify-center py-8">
          <h3 className="text-lg font-semibold text-navy-900 w-full mb-4">Learning Recovery</h3>
          <div className="h-48 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold text-navy-900">{progressPercent}%</span>
              <span className="text-xs text-slate-500 font-medium">Tasks Done</span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Completed</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>Pending</div>
          </div>
        </div>

        {/* Recent Assignments */}
        <div className="card lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Active Recovery Assignments</h3>
            <Link to="/student/assignments" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentAssignments.length > 0 ? recentAssignments.map(a => (
              <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-brand-100 text-brand-600 rounded-lg shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-navy-900 text-sm">{a.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{a.subjectName} • Due {formatDate(a.deadline)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <Badge status={a.status} />
                  <Link to="/student/assignments" className="p-2 bg-white border border-slate-200 rounded-lg hover:text-brand-600 shadow-sm transition">
                    <PlayCircle size={18} />
                  </Link>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-slate-500 text-sm">No active assignments. You're all caught up!</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Missed Classes */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-navy-900">Recent Absence Reports</h3>
          <Link to="/student/missed-classes" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 rounded-lg">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Subject</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Topics</th>
                <th className="px-4 py-3 rounded-tr-lg">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentMissed.length > 0 ? recentMissed.map(m => (
                <tr key={m.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-navy-900">{m.subjectName}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(m.date)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 truncate block max-w-[200px]">{m.topics.join(', ')}</span>
                  </td>
                  <td className="px-4 py-3"><Badge status={m.status} /></td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="text-center py-6 text-slate-500">No missed classes reported.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}