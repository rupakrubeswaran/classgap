import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Mail, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Enter a valid email');
      return;
    }
    setLoading(true);
    // Demo: simulate send
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
    toast.success('Reset link sent to your email (demo)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md">
        <Link to="/login" className="flex items-center gap-2 mb-6 text-navy-900">
          <div className="p-2 bg-brand-600 rounded-lg text-white">
            <GraduationCap size={22} />
          </div>
          <span className="text-xl font-bold">ClassGap</span>
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-navy-900">Forgot password?</h1>
          <p className="text-slate-500 text-sm mt-1">
            Enter your email and we'll send a reset link (demo simulation).
          </p>

          {sent ? (
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm">
              If an account exists for <b>{email}</b>, you'll receive a reset link shortly.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@college.edu"
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <Link to="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-slate-600 hover:text-navy-900">
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}