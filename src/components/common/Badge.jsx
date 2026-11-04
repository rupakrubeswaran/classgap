import { STATUS_COLORS } from '../../utils/constants';

export default function Badge({ children, status, color }) {
  const cls = color || STATUS_COLORS[status] || 'bg-slate-100 text-slate-700';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${cls}`}>
      {children || status}
    </span>
  );
}