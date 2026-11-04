import { Construction } from 'lucide-react';

export default function PlaceholderPage({ title, subtitle, part }) {
  return (
    <div className="p-6 md:p-8">
      <div className="max-w-2xl mx-auto card mt-8 text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 text-brand-600 rounded-full mb-4">
          <Construction size={28} />
        </div>
        <h1 className="text-2xl font-bold text-navy-900">{title}</h1>
        <p className="text-slate-500 mt-2">{subtitle}</p>
        <p className="mt-4 inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
          Coming in {part}
        </p>
      </div>
    </div>
  );
}