import { useState } from 'react';
import { Search, Filter, User, Mail, Hash, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { YEARS, SECTIONS } from '../../utils/constants';
import { formatDate } from '../../utils/helpers';

export default function StudentManagement() {
  const { user } = useAuth();
  const { db, getStudentAssignments, getStudentMissed } = useData();
  
  const [search, setSearch] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [filterSection, setFilterSection] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Filter students for staff's department
  const myStudents = db.users.filter(u => u.role === 'student' && u.department === user.department);

  const filteredStudents = myStudents.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.registerNumber.toLowerCase().includes(search.toLowerCase());
    const matchesYear = !filterYear || s.year === filterYear;
    const matchesSection = !filterSection || s.section === filterSection;
    return matchesSearch && matchesYear && matchesSection;
  });

  // Get selected student details
  const studentAssignments = selectedStudent ? getStudentAssignments(selectedStudent.uid) : [];
  const studentMissed = selectedStudent ? getStudentMissed(selectedStudent.uid) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Student Management</h1>
        <p className="page-subtitle">View and monitor students in your department</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or register number..." 
            className="input-field pl-9 bg-slate-50 border-transparent focus:bg-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <select className="input-field bg-slate-50 border-transparent focus:bg-white sm:w-36" value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <select className="input-field bg-slate-50 border-transparent focus:bg-white sm:w-32" value={filterSection} onChange={(e) => setFilterSection(e.target.value)}>
            <option value="">All Sections</option>
            {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Reg No.</th>
                <th className="px-6 py-4">Year / Sec</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4 text-right">Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length > 0 ? filteredStudents.map(student => (
                <tr key={student.uid} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-xs">
                        {student.avatar}
                      </div>
                      <span className="font-medium text-navy-900">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{student.registerNumber}</td>
                  <td className="px-6 py-4 text-slate-600">{student.year} - {student.section}</td>
                  <td className="px-6 py-4 text-slate-500 text-xs">{student.email}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedStudent(student)} className="p-2 bg-white border border-slate-200 rounded-lg hover:text-brand-600 shadow-sm transition">
                      <ChevronRight size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">No students found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      <Modal open={!!selectedStudent} onClose={() => setSelectedStudent(null)} title="Student Profile" size="lg">
        {selectedStudent && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
                {selectedStudent.avatar}
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900">{selectedStudent.name}</h2>
                <p className="text-sm text-slate-500">{selectedStudent.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{selectedStudent.department}</span>
                  <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">{selectedStudent.year} - Sec {selectedStudent.section}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Missed Classes</p>
                <p className="text-2xl font-bold text-navy-900">{studentMissed.length}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs text-slate-500 font-medium mb-1">Recovery Assignments</p>
                <p className="text-2xl font-bold text-navy-900">{studentAssignments.length}</p>
              </div>
            </div>

            {/* Recent Assignments */}
            <div>
              <h3 className="font-semibold text-navy-900 mb-3 text-sm">Recent Assignments</h3>
              <div className="space-y-2">
                {studentAssignments.length > 0 ? studentAssignments.slice(0, 3).map(asg => (
                  <div key={asg.id} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-lg text-sm">
                    <div>
                      <p className="font-medium text-navy-900">{asg.title}</p>
                      <p className="text-xs text-slate-500">{asg.subjectName}</p>
                    </div>
                    <Badge status={asg.status} />
                  </div>
                )) : <p className="text-sm text-slate-500">No assignments yet.</p>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}