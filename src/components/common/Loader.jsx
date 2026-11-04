export default function Loader({ fullPage = false, text = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-brand-100 border-t-brand-600 rounded-full animate-spin" style={{ borderWidth: 3 }} />
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
  if (fullPage) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">{content}</div>;
  }
  return <div className="flex justify-center py-16">{content}</div>;
}