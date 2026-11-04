import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import StatCard from '../../components/common/StatCard';

export default function PerformanceAnalytics() {
  const { user } = useAuth();
  const { db } = useData();

  // Filter data for staff's department
  const myStudents = db.users.filter(u => u.role === 'student' && u.department === user.department);
  const myAssignments = db.assignments.filter(a => a.staffId === user.uid);
  
  // Stats
  const totalStudents = myStudents.length;
  const completedAssignments = myAssignments.filter(a => a.status === 'Completed').length;
  const pendingAssignments = myAssignments.length - completedAssignments;
  
  // Identify students with gaps (assignments not completed and deadline passed, or high pending count)
  const studentsWithGaps = new Set(
    myAssignments.filter(a => a.status !== 'Completed').map(a => a.studentId)
  ).size;

  // Chart Data: Recovery Completion Rate (Pie)
  const pieData = [
    { name: 'Completed', value: completedAssignments, color: '#10b981' },
    { name: 'Pending', value: pendingAssignments, color: '#e2e8f0' },
  ];

  // Chart Data: Student-wise Assignment Count (Bar)
  const studentChartData = myStudents.map(student => {
    const studentAsgs = myAssignments.filter(a => a.studentId === student.uid);
    return {
      name: student.name.split(' ')[0], // First name for chart
      assigned: studentAsgs.length,
      completed: studentAsgs.filter(a => a.status === 'Completed').length
    };
  }).filter(d => d.assigned > 0); // Only show students who have assignments

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Performance Analytics</h1>
        <p className="page-subtitle">Monitor student recovery progress and identify learning gaps</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={totalStudents} color="brand" subtitle="In your department" />
        <StatCard icon={CheckCircle} label="Recoveries Completed" value={completedAssignments} color="emerald" subtitle="All time" />
        <StatCard icon={TrendingUp} label="Active Recoveries" value={pendingAssignments} color="amber" subtitle="Currently in progress" />
        <StatCard icon={AlertTriangle} label="Students with Gaps" value={studentsWithGaps} color="rose" subtitle="Need attention" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Rate */}
        <div className="card flex flex-col items-center py-8">
          <h3 className="text-lg font-semibold text-navy-900 w-full mb-2">Overall Recovery Rate</h3>
          <p className="text-xs text-slate-500 w-full mb-6">Completion status of all assignments</p>
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
              <span className="text-3xl font-bold text-navy-900">
                {myAssignments.length === 0 ? 0 : Math.round((completedAssignments / myAssignments.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Completed</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>Pending</div>
          </div>
        </div>

        {/* Student-wise Bar Chart */}
        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold text-navy-900 mb-1">Student Recovery Breakdown</h3>
          <p className="text-xs text-slate-500 mb-6">Assigned vs Completed assignments per student</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentChartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="assigned" name="Assigned" fill="#a5b4fc" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="completed" name="Completed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}