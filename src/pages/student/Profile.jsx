import { useState, useRef } from 'react';
import { User, Mail, Hash, Building2, Camera, Save, Calendar, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { DEPARTMENTS, YEARS, SECTIONS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

export default function Profile() {
  const { user, updateSessionUser } = useAuth();
  const { updateUserProfile, getStudentMissed, getStudentAssignments } = useData();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    registerNumber: user.registerNumber || '',
    department: user.department || '',
    year: user.year || '',
    section: user.section || '',
    college: user.college || '',
    avatar: user.avatar || '', // Base64 image string
  });

  const missedCount = getStudentMissed(user.uid).length;
  const assignmentCount = getStudentAssignments(user.uid).length;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateUserProfile(user.uid, form);
      updateSessionUser(form); // Update topbar/sidebar instantly
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 600);
  };

  // Helper to render avatar (image or initials)
  const renderAvatar = (sizeClass) => {
    if (form.avatar && form.avatar.startsWith('data:image')) {
      return <img src={form.avatar} alt="Profile" className={`${sizeClass} rounded-full object-cover shadow-inner`} />;
    }
    return (
      <div className={`${sizeClass} rounded-full bg-brand-600 text-white flex items-center justify-center font-bold shadow-inner`}>
        {form.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal and academic information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Stats */}
        <div className="space-y-6">
          <div className="card flex flex-col items-center py-8 text-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
              {renderAvatar('w-32 h-32 text-4xl')}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
            </div>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
            
            <h2 className="text-xl font-bold text-navy-900 mt-4">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.registerNumber}</p>
            <div className="mt-4 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-semibold">
              {user.department}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-navy-900 mb-4">Activity Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg"><Calendar size={18} /></div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{missedCount} Missed Classes</p>
                  <p className="text-xs text-slate-500">Reported this semester</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-brand-50 text-brand-600 rounded-lg"><BookOpen size={18} /></div>
                <div>
                  <p className="text-sm font-medium text-navy-900">{assignmentCount} Assignments</p>
                  <p className="text-xs text-slate-500">Recovery plans received</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-2 card">
          <h3 className="font-semibold text-navy-900 mb-6 pb-4 border-b border-slate-100">Personal Details</h3>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="label">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="input-field pl-10" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required />
                </div>
              </div>
              
              <div>
                <label className="label">Register Number</label>
                <div className="relative">
                  <Hash size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="input-field pl-10 bg-slate-50 text-slate-500 cursor-not-allowed" value={form.registerNumber} disabled />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Register number cannot be changed.</p>
              </div>

              <div className="md:col-span-2">
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" className="input-field pl-10" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              <div>
                <label className="label">Department</label>
                <select className="input-field" value={form.department} onChange={(e) => setForm({...form, department: e.target.value})}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="label">College Name</label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" className="input-field pl-10" value={form.college} onChange={(e) => setForm({...form, college: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label">Year of Study</label>
                <select className="input-field" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})}>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>

              <div>
                <label className="label">Section</label>
                <select className="input-field" value={form.section} onChange={(e) => setForm({...form, section: e.target.value})}>
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="pt-6 mt-6 border-t border-slate-100 flex justify-end">
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-8">
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}