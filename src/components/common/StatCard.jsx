import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({ icon: Icon, label, value, color = 'brand', trend, trendLabel, subtitle }) {
  const colorMap = {
    brand: 'bg-brand-50 text-brand-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    amber: 'bg-amber-50 text-amber-600',
    sky: 'bg-sky-50 text-sky-600',
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
  };

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-5 hover:shadow-card-hover transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="text-3xl font-bold text-navy-900 mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl ${colorMap[color]}`}>
            <Icon size={22} strokeWidth={2} />
          </div>
        )}
      </div>
      {trend !== undefined && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {trend >= 0 ? (
            <TrendingUp size={14} className="text-emerald-600" />
          ) : (
            <TrendingDown size={14} className="text-rose-600" />
          )}
          <span className={trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
            {Math.abs(trend)}%
          </span>
          <span className="text-slate-400">{trendLabel || 'vs last week'}</span>
        </div>
      )}
    </div>
  );
}