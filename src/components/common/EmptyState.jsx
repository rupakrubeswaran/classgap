import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
      <div className="p-4 rounded-full bg-slate-50 text-slate-400 mb-4">
        <Icon size={32} />
      </div>
      <h3 className="text-base font-semibold text-navy-900">{title}</h3>
      {description && <p className="text-sm text-slate-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}