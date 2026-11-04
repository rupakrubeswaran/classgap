import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, User, Mail, Lock, Hash, Building2, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { DEPARTMENTS, YEARS, SECTIONS } from '../../utils/constants';

const initialForm = {
  name: '',
  registerNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  department: '',
  year: '',
  section: '',
  college: '',
};

export default function StudentRegister() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Full name is required';
    if (!form.registerNumber.trim()) errs.registerNumber = 'Register number is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!form.department) errs.department = 'Select a department';
    if (!form.year) errs.year = 'Select year of study';
    if (!form.section) errs.section = 'Select section';
    if (!form.college.trim()) errs.college = 'College name is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { confirmPassword: _c, ...payload } = form;
      await registerStudent(payload);
      toast.success('Account created! Welcome to ClassGap.');
      navigate('/student/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <Link to="/login" className="flex items-center gap-2 mb-6 text-navy-900">
          <div className="p-2 bg-brand-600 rounded-lg text-white">
            <GraduationCap size={22} />
          </div>
          <span className="text-xl font-bold">ClassGap</span>
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-navy-900">Create Student Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join ClassGap and never miss a learning opportunity</p>

          <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="label">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.name} onChange={set('name')} placeholder="Arjun Mehta" className="input-field pl-10" />
              </div>
              {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label">Register Number</label>
              <div className="relative">
                <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={form.registerNumber} onChange={set('registerNumber')} placeholder="CS21B001" className="input-field pl-10" />
              </div>
              {errors.registerNumber && <p className="text-xs text-red-600 mt-1">{errors.registerNumber}</p>}
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={set('email')} placeholder="you@college.edu" className="input-field pl-10" />
              </div>
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.password} onChange={set('password')} placeholder="Min. 6 characters" className="input-field pl-10" />
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.confirmPassword} onChange={set('confirmPassword')} placeholder="Re-enter password" className="input-field pl-10" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="label">Department</label>
              <div className="relative">
                <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={form.department} onChange={set('department')} className="input-field pl-10">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              {errors.department && <p className="text-xs text-red-600 mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="label">Year of Study</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={form.year} onChange={set('year')} className="input-field pl-10">
                  <option value="">Select year</option>
                  {YEARS.map((y) => <option key={y}>{y}</option>)}
                </select>
              </div>
              {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year}</p>}
            </div>

            <div>
              <label className="label">Section</label>
              <div className="relative">
                <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <select value={form.section} onChange={set('section')} className="input-field pl-10">
                  <option value="">Select section</option>
                  {SECTIONS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {errors.section && <p className="text-xs text-red-600 mt-1">{errors.section}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="label">College Name</label>
              <input value={form.college} onChange={set('college')} placeholder="National Institute of Technology" className="input-field" />
              {errors.college && <p className="text-xs text-red-600 mt-1">{errors.college}</p>}
            </div>

            <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 mt-2">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
              <Link to="/login" className="btn-secondary flex-1 text-center">Back to Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}