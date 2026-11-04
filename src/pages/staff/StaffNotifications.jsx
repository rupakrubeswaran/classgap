import { Bell, CheckCircle2, ClipboardList, AlertCircle, Megaphone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import EmptyState from '../../components/common/EmptyState';
import { formatDateTime } from '../../utils/helpers';

const ICON_MAP = {
  submission: { icon: ClipboardList, color: 'bg-purple-100 text-purple-600' },
  info: { icon: Bell, color: 'bg-slate-100 text-slate-600' },
  announcement: { icon: Megaphone, color: 'bg-sky-100 text-sky-600' },
  completion: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600' },
};

export default function StaffNotifications() {
  const { user } = useAuth();
  const { getStudentNotifications, markNotificationRead, markAllNotificationsRead } = useData();
  
  const notifications = getStudentNotifications(user.uid);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">You have {unreadCount} unread messages</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={() => markAllNotificationsRead(user.uid)} className="text-sm text-brand-600 hover:underline font-medium">
            Mark all as read
          </button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications.map(notif => {
              const config = ICON_MAP[notif.type] || ICON_MAP.info;
              const Icon = config.icon;
              return (
                <div 
                  key={notif.id} 
                  onClick={() => !notif.read && markNotificationRead(notif.id)}
                  className={`p-4 sm:p-5 flex gap-4 transition-colors cursor-pointer ${notif.read ? 'bg-white opacity-70' : 'bg-brand-50/30 hover:bg-brand-50/60'}`}
                >
                  <div className={`p-2.5 rounded-full shrink-0 h-fit ${config.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm ${notif.read ? 'font-medium text-slate-700' : 'font-bold text-navy-900'}`}>
                        {notif.title}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{formatDateTime(notif.createdAt)}</span>
                    </div>
                    <p className={`text-sm ${notif.read ? 'text-slate-500' : 'text-slate-700'}`}>{notif.message}</p>
                  </div>
                  {!notif.read && <div className="w-2.5 h-2.5 bg-brand-500 rounded-full mt-1.5 shrink-0"></div>}
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState icon={Bell} title="All caught up!" description="You have no staff notifications right now." />
        )}
      </div>
    </div>
  );
}