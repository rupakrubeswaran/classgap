import { useState } from 'react';
import { Check, X, FileText, CalendarX } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/helpers';

export default function MissedClassRequests() {
  const { user } = useAuth();
  const { db, approveMissedClass, rejectMissedClass } = useData();
  
  const [filter, setFilter] = useState('Pending');
  const [selectedReq, setSelectedReq] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Filter requests based on department (staff only sees their dept)
  const allRequests = db.missedClasses.filter(req => {
    const subject = db.subjects.find(s => s.id === req.subjectId);
    return subject && subject.department === user.department;
  });

  const filteredRequests = filter === 'All' 
    ? allRequests 
    : allRequests.filter(r => r.status === filter);

  const handleApprove = (req) => {
    approveMissedClass(req.id, user);
    toast.success(`Approved request for ${req.studentName}`);
  };

  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMissedClass(selectedReq.id, user, rejectReason);
    toast.success('Request rejected');
    setIsRejectModalOpen(false);
    setRejectReason('');
    setSelectedReq(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Missed Class Requests</h1>
        <p className="page-subtitle">Review and verify student absence reports</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {['Pending', 'Approved', 'Rejected', 'All'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              filter === tab 
                ? 'border-brand-600 text-brand-600' 
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            {tab}
            {tab === 'Pending' && allRequests.filter(r => r.status === 'Pending').length > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                {allRequests.filter(r => r.status === 'Pending').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length > 0 ? filteredRequests.map(req => (
          <div key={req.id} className="card flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-xl shrink-0 hidden sm:block">
                <FileText size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-navy-900 text-lg">{req.studentName}</h3>
                  <Badge status={req.status} />
                </div>
                <p className="text-sm text-slate-600 mb-2">
                  <span className="font-medium text-navy-800">{req.subjectName}</span> • Missed on {formatDate(req.date)}
                </p>
                <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-700 border border-slate-100">
                  <p className="font-medium text-xs text-slate-500 mb-1">Topics Missed:</p>
                  <p>{req.topics.join(', ')}</p>
                  {req.reason && (
                    <>
                      <p className="font-medium text-xs text-slate-500 mt-2 mb-1">Reason:</p>
                      <p className="text-slate-600 italic">"{req.reason}"</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {req.status === 'Pending' && (
              <div className="flex items-center gap-2 shrink-0 md:flex-col lg:flex-row">
                <button 
                  onClick={() => handleApprove(req)}
                  className="flex-1 md:w-full lg:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                >
                  <Check size={16} /> Approve
                </button>
                <button 
                  onClick={() => { setSelectedReq(req); setIsRejectModalOpen(true); }}
                  className="flex-1 md:w-full lg:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition"
                >
                  <X size={16} /> Reject
                </button>
              </div>
            )}
          </div>
        )) : (
          <div className="card">
            <EmptyState 
              icon={CalendarX} 
              title={`No ${filter.toLowerCase()} requests`} 
              description="There are no missed class requests matching this filter."
            />
          </div>
        )}
      </div>

      {/* Reject Modal */}
      <Modal open={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)} title="Reject Request">
        <form onSubmit={handleReject} className="space-y-4">
          <p className="text-sm text-slate-600">
            Rejecting the missed class report for <b>{selectedReq?.studentName}</b> ({selectedReq?.subjectName}).
          </p>
          <div>
            <label className="label">Reason for Rejection *</label>
            <textarea 
              className="input-field min-h-[100px]"
              placeholder="e.g. You were marked present in the lab..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setIsRejectModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-danger">Confirm Reject</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}