import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, Eye, EyeOff, Mail, Lock, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password, role);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(role === 'student' ? '/student/dashboard' : '/staff/dashboard');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (type) => {
    if (type === 'student') {
      setEmail('student@classgap.demo');
      setPassword('student123');
      setRole('student');
    } else {
      setEmail('staff@classgap.demo');
      setPassword('staff123');
      setRole('staff');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-12 flex-col justify-between text-white relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur rounded-xl">
              <GraduationCap size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">ClassGap</h1>
              <p className="text-xs text-white/70">Learning Recovery Platform</p>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <h2 className="text-4xl font-bold leading-tight">
            Missed a Class?
            <br />
            <span className="text-brand-200">Never Miss Learning.</span>
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            A smart learning recovery platform connecting students and staff through structured catch-up plans, resources, and assessments.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
            {[
              { n: '500+', l: 'Students' },
              { n: '50+', l: 'Faculty' },
              { n: '10K+', l: 'Resources' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-3 text-center">
                <div className="text-2xl font-bold">{s.n}</div>
                <div className="text-xs text-white/70">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/50">© 2025 ClassGap · SEVA Innovation Challenge 2026</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="p-2 bg-brand-600 rounded-lg text-white">
              <GraduationCap size={22} />
            </div>
            <span className="text-xl font-bold text-navy-900">ClassGap</span>
          </div>

          <h1 className="text-3xl font-bold text-navy-900">Welcome back</h1>
          <p className="text-slate-500 mt-1">Sign in to continue to your dashboard</p>

          {/* Role toggle */}
          <div className="mt-6 p-1 bg-slate-100 rounded-xl flex">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'student'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <BookOpen size={16} /> Student
            </button>
            <button
              type="button"
              onClick={() => setRole('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                role === 'staff'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              <GraduationCap size={16} /> Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="label">
                {role === 'student' ? 'Email or Register Number' : 'Staff Email'}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'student' ? 'student@classgap.demo' : 'staff@classgap.demo'}
                  className="input-field pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="label mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {role === 'student' && (
            <p className="mt-5 text-center text-sm text-slate-600">
              New here?{' '}
              <Link to="/register/student" className="text-brand-600 hover:text-brand-700 font-medium">
                Create student account
              </Link>
            </p>
          )}

          {role === 'staff' && (
            <p className="mt-5 text-center text-xs text-slate-500">
              Staff accounts are created by the administrator.
            </p>
          )}

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-brand-50 border border-brand-100 rounded-xl">
            <div className="flex items-center gap-2 text-brand-800 text-sm font-semibold mb-2">
              <Sparkles size={16} /> Demo Credentials
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span><b>Student:</b> student@classgap.demo / student123</span>
                <button onClick={() => fillDemo('student')} className="text-brand-600 hover:underline font-medium">Use</button>
              </div>
              <div className="flex justify-between items-center">
                <span><b>Staff:</b> staff@classgap.demo / staff123</span>
                <button onClick={() => fillDemo('staff')} className="text-brand-600 hover:underline font-medium">Use</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}