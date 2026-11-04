import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, CalendarX, ClipboardList, CheckCircle, 
  ArrowRight, AlertCircle, FileText 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import { formatDate } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function StaffDashboard() {
  const { user } = useAuth();
  const { db, getStaffAssignments, getStaffPendingMissed } = useData();

  // Staff Stats
  const myStudents = db.users.filter(u => u.role === 'student' && u.department === user.department);
  const pendingMissed = getStaffPendingMissed();
  const myAssignments = getStaffAssignments(user.uid);
  const completedAssignments = myAssignments.filter(a => a.status === 'Completed');

  // Chart Data (Mocked subject-wise recovery for now)
  const chartData = db.subjects
    .filter(s => s.department === user.department)
    .map(sub => {
      const missed = db.missedClasses.filter(m => m.subjectId === sub.id).length;
      return { name: sub.code, missed };
    }).slice(0, 5);

  const recentRequests = pendingMissed.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold">Staff Overview</h1>
          <p className="text-slate-300 mt-2 max-w-lg">
            Welcome back, {user.name.split(' ')[0]}. You have <span className="font-bold text-white">{pendingMissed.length} pending missed-class requests</span> to review.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/staff/missed-requests" className="px-5 py-2.5 bg-brand-600 text-white rounded-lg font-medium text-sm hover:bg-brand-500 transition shadow-sm">
              Review Requests
            </Link>
            <Link to="/staff/assignments" className="px-5 py-2.5 bg-white/10 backdrop-blur text-white rounded-lg font-medium text-sm hover:bg-white/20 transition">
              Manage Assignments
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="My Students" value={myStudents.length} color="brand" subtitle="In your department" />
        <StatCard icon={CalendarX} label="Pending Requests" value={pendingMissed.length} color="rose" subtitle="Awaiting verification" />
        <StatCard icon={ClipboardList} label="Active Assignments" value={myAssignments.length - completedAssignments.length} color="amber" subtitle="In progress" />
        <StatCard icon={CheckCircle} label="Completed" value={completedAssignments.length} color="emerald" subtitle="Recoveries finished" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy-900 mb-6">Missed Classes by Subject</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="missed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pending Requests list */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Needs Review</h3>
            <Link to="/staff/missed-requests" className="text-sm text-brand-600 hover:underline flex items-center gap-1">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentRequests.length > 0 ? recentRequests.map(req => (
              <div key={req.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-navy-900 text-sm">{req.studentName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{req.subjectName} • {formatDate(req.date)}</p>
                  </div>
                  <Badge status={req.status} />
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
                <p className="text-sm text-slate-500">All caught up! No pending requests.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}