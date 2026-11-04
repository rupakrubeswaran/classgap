import { useState } from 'react';
import { ClipboardList, CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/helpers';

export default function RecoveryAssignments() {
  const { user } = useAuth();
  const { getStudentAssignments, toggleAssignmentTask, submitAssignment } = useData();
  
  const assignments = getStudentAssignments(user.uid);
  const [expandedId, setExpandedId] = useState(null);

  const handleTaskToggle = (assignmentId, taskId, currentStatus) => {
    if (currentStatus === 'Under Review' || currentStatus === 'Completed') {
      toast.error('Cannot modify tasks once submitted.');
      return;
    }
    toggleAssignmentTask(assignmentId, taskId);
  };

  const handleSubmit = (assignmentId) => {
    submitAssignment(assignmentId);
    toast.success('Assignment submitted for staff review!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">My Recovery Assignments</h1>
        <p className="page-subtitle">Complete your personalized catch-up plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignments.length > 0 ? assignments.map(asg => {
          const isExpanded = expandedId === asg.id;
          const allTasksDone = asg.tasks.every(t => t.completed);
          const canSubmit = allTasksDone && (asg.status === 'In Progress' || asg.status === 'Assigned' || asg.status === 'Revision Required');

          return (
            <div key={asg.id} className={`card transition-all duration-300 ${isExpanded ? 'ring-2 ring-brand-500/20' : ''}`}>
              <div className="flex justify-between items-start mb-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : asg.id)}>
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
                    <ClipboardList size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 leading-tight">{asg.title}</h3>
                    <p className="text-sm text-slate-500 mt-1">{asg.subjectName} • {asg.studentName}</p>
                  </div>
                </div>
                <Badge status={asg.status} />
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-lg">
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-amber-500" /> Due: {formatDate(asg.deadline)}</span>
                <span className="flex items-center gap-1.5"><AlertCircle size={14} className="text-brand-500" /> Priority: {asg.priority}</span>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
                  <h4 className="text-sm font-semibold text-navy-900 mb-3">Study Tasks</h4>
                  <div className="space-y-2 mb-6">
                    {asg.tasks.map(task => (
                      <button 
                        key={task.id}
                        onClick={() => handleTaskToggle(asg.id, task.id, asg.status)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition ${
                          task.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        {task.completed ? <CheckCircle2 size={20} className="text-emerald-500 shrink-0" /> : <Circle size={20} className="text-slate-300 shrink-0" />}
                        <span className={`text-sm ${task.completed ? 'text-emerald-800 line-through' : 'text-navy-800'}`}>
                          {task.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  {asg.feedback && (
                    <div className="mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg text-sm">
                      <p className="font-semibold text-amber-800 mb-1">Staff Feedback:</p>
                      <p className="text-amber-700 italic">"{asg.feedback}"</p>
                    </div>
                  )}

                  {canSubmit && (
                    <button onClick={() => handleSubmit(asg.id)} className="w-full btn-primary flex items-center justify-center gap-2">
                      Submit for Review
                    </button>
                  )}

                  {asg.status === 'Under Review' && (
                    <div className="text-center p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                      Waiting for staff review...
                    </div>
                  )}

                  {asg.status === 'Completed' && (
                    <div className="text-center p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Assignment Completed Successfully
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="col-span-full card">
            <EmptyState 
              icon={ClipboardList} 
              title="No assignments yet" 
              description="When you report a missed class, your instructor will create a recovery plan for you here."
            />
          </div>
        )}
      </div>
    </div>
  );
}