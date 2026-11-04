export const ROLES = { STUDENT: 'student', STAFF: 'staff' };

export const ASSIGNMENT_STATUS = {
  PENDING_VERIFICATION: 'Pending Verification',
  VERIFIED: 'Verified',
  ASSIGNED: 'Assigned',
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  REVISION_REQUIRED: 'Revision Required',
  COMPLETED: 'Completed',
  REJECTED: 'Rejected',
};

export const PRIORITY = { HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low' };

export const DEPARTMENTS = [
  'Computer Science', 'Information Technology', 'Electronics',
  'Mechanical', 'Civil', 'Electrical',
];

export const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
export const SECTIONS = ['A', 'B', 'C', 'D'];

export const STATUS_COLORS = {
  'Pending Verification': 'bg-amber-100 text-amber-700',
  'Verified': 'bg-blue-100 text-blue-700',
  'Assigned': 'bg-indigo-100 text-indigo-700',
  'In Progress': 'bg-cyan-100 text-cyan-700',
  'Submitted': 'bg-purple-100 text-purple-700',
  'Under Review': 'bg-violet-100 text-violet-700',
  'Revision Required': 'bg-orange-100 text-orange-700',
  'Completed': 'bg-emerald-100 text-emerald-700',
  'Rejected': 'bg-red-100 text-red-700',
  'Pending': 'bg-amber-100 text-amber-700',
  'Approved': 'bg-emerald-100 text-emerald-700',
};