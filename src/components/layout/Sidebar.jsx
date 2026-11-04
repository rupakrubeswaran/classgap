import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, CalendarX, Library, 
  ClipboardList, CalendarDays, Bot, FileQuestion, 
  TrendingUp, Bell, User, LogOut, GraduationCap, X,
  Users, FolderTree, UploadCloud, CheckSquare, 
  Megaphone, BarChart3, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isOpen, onClose, type }) {
  const { user, logout } = useAuth();

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/subjects', icon: BookOpen, label: 'My Subjects' },
    { to: '/student/missed-classes', icon: CalendarX, label: 'Missed Classes' },
    { to: '/student/resources', icon: Library, label: 'Resources' },
    { to: '/student/assignments', icon: ClipboardList, label: 'Assignments' },
    { to: '/student/planner', icon: CalendarDays, label: 'Study Planner' },
    { to: '/student/ai-assistant', icon: Bot, label: 'AI Assistant' },
    { to: '/student/assessment', icon: FileQuestion, label: 'Self-Assessment' },
    { to: '/student/progress', icon: TrendingUp, label: 'My Progress' },
    { to: '/student/notifications', icon: Bell, label: 'Notifications' },
    { to: '/student/profile', icon: User, label: 'My Profile' },
  ];

  const staffLinks = [
    { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/staff/students', icon: Users, label: 'Student Management' },
    { to: '/staff/subjects', icon: FolderTree, label: 'Subjects & Topics' },
    { to: '/staff/materials', icon: UploadCloud, label: 'Learning Materials' },
    { to: '/staff/missed-requests', icon: CheckSquare, label: 'Missed Requests' },
    { to: '/staff/assignments', icon: ClipboardList, label: 'Recovery Assignments' },
    { to: '/staff/assessments', icon: FileQuestion, label: 'Assessments' },
    { to: '/staff/analytics', icon: BarChart3, label: 'Performance Analytics' },
    { to: '/staff/announcements', icon: Megaphone, label: 'Announcements' },
    { to: '/staff/notifications', icon: Bell, label: 'Notifications' },
    { to: '/staff/profile', icon: User, label: 'Staff Profile' },
  ];

  const links = type === 'student' ? studentLinks : staffLinks;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-navy-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-navy-900 text-white z-50 flex flex-col
        transition-transform duration-300 ease-in-out border-r border-navy-800 shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-navy-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-xl shadow-lg shadow-brand-500/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">ClassGap</h1>
              <p className="text-[10px] text-brand-300 font-medium tracking-widest uppercase mt-1">Learning Recovery</p>
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
          <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {type === 'student' ? 'Student Portal' : 'Staff Portal'}
          </p>
          
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => { if(window.innerWidth < 1024) onClose(); }}
                className={({ isActive }) => `
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                  ${isActive 
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-900/50' 
                    : 'text-slate-400 hover:text-white hover:bg-navy-800/80'}
                `}
              >
                <Icon size={18} className="shrink-0" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-navy-800 bg-navy-950/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white font-bold text-sm shadow-inner">
              {user?.avatar || user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-navy-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}