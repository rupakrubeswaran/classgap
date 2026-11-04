// Rich demo data - realistic sample for ClassGap

export const demoUsers = [
  {
    uid: 'staff_001',
    role: 'staff',
    name: 'Dr. Priya Sharma',
    email: 'staff@classgap.demo',
    password: 'staff123',
    staffId: 'STF-1001',
    department: 'Computer Science',
    designation: 'Associate Professor',
    avatar: 'PS',
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    uid: 'staff_002',
    role: 'staff',
    name: 'Prof. Rajesh Kumar',
    email: 'rajesh@classgap.demo',
    password: 'staff123',
    staffId: 'STF-1002',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    avatar: 'RK',
    createdAt: '2025-01-12T09:00:00Z',
  },
  {
    uid: 'stu_001',
    role: 'student',
    name: 'Arjun Mehta',
    email: 'student@classgap.demo',
    password: 'student123',
    registerNumber: 'CS21B001',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    college: 'National Institute of Technology',
    avatar: 'AM',
    createdAt: '2025-01-15T09:00:00Z',
  },
  {
    uid: 'stu_002',
    role: 'student',
    name: 'Sneha Patel',
    email: 'sneha@classgap.demo',
    password: 'student123',
    registerNumber: 'CS21B002',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    college: 'National Institute of Technology',
    avatar: 'SP',
    createdAt: '2025-01-16T09:00:00Z',
  },
  {
    uid: 'stu_003',
    role: 'student',
    name: 'Karthik Reddy',
    email: 'karthik@classgap.demo',
    password: 'student123',
    registerNumber: 'CS21B003',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'B',
    college: 'National Institute of Technology',
    avatar: 'KR',
    createdAt: '2025-01-18T09:00:00Z',
  },
  {
    uid: 'stu_004',
    role: 'student',
    name: 'Ananya Iyer',
    email: 'ananya@classgap.demo',
    password: 'student123',
    registerNumber: 'CS21B004',
    department: 'Computer Science',
    year: '3rd Year',
    section: 'A',
    college: 'National Institute of Technology',
    avatar: 'AI',
    createdAt: '2025-01-20T09:00:00Z',
  },
];

export const demoSubjects = [
  { id: 'sub_001', name: 'Data Structures', code: 'CS301', department: 'Computer Science', year: '3rd Year', staffId: 'staff_001', credits: 4, color: '#6366f1' },
  { id: 'sub_002', name: 'Database Management', code: 'CS302', department: 'Computer Science', year: '3rd Year', staffId: 'staff_001', credits: 4, color: '#0ea5e9' },
  { id: 'sub_003', name: 'Operating Systems', code: 'CS303', department: 'Computer Science', year: '3rd Year', staffId: 'staff_002', credits: 3, color: '#10b981' },
  { id: 'sub_004', name: 'Computer Networks', code: 'CS304', department: 'Computer Science', year: '3rd Year', staffId: 'staff_002', credits: 3, color: '#f59e0b' },
  { id: 'sub_005', name: 'Web Technologies', code: 'CS305', department: 'Computer Science', year: '3rd Year', staffId: 'staff_001', credits: 3, color: '#ec4899' },
];

export const demoChapters = [
  { id: 'chap_001', subjectId: 'sub_001', name: 'Arrays & Linked Lists', order: 1 },
  { id: 'chap_002', subjectId: 'sub_001', name: 'Stacks & Queues', order: 2 },
  { id: 'chap_003', subjectId: 'sub_001', name: 'Trees & Graphs', order: 3 },
  { id: 'chap_004', subjectId: 'sub_002', name: 'ER Model & Normalization', order: 1 },
  { id: 'chap_005', subjectId: 'sub_002', name: 'SQL & Joins', order: 2 },
  { id: 'chap_006', subjectId: 'sub_003', name: 'Process Management', order: 1 },
  { id: 'chap_007', subjectId: 'sub_003', name: 'Memory Management', order: 2 },
];

export const demoTopics = [
  { id: 'top_001', chapterId: 'chap_001', subjectId: 'sub_001', name: 'Single Linked List' },
  { id: 'top_002', chapterId: 'chap_001', subjectId: 'sub_001', name: 'Doubly Linked List' },
  { id: 'top_003', chapterId: 'chap_002', subjectId: 'sub_001', name: 'Stack using Arrays' },
  { id: 'top_004', chapterId: 'chap_002', subjectId: 'sub_001', name: 'Queue Implementation' },
  { id: 'top_005', chapterId: 'chap_003', subjectId: 'sub_001', name: 'Binary Trees' },
  { id: 'top_006', chapterId: 'chap_003', subjectId: 'sub_001', name: 'BFS & DFS' },
  { id: 'top_007', chapterId: 'chap_004', subjectId: 'sub_002', name: 'Normalization Forms' },
  { id: 'top_008', chapterId: 'chap_005', subjectId: 'sub_002', name: 'SQL Joins' },
  { id: 'top_009', chapterId: 'chap_006', subjectId: 'sub_003', name: 'Process Scheduling' },
  { id: 'top_010', chapterId: 'chap_007', subjectId: 'sub_003', name: 'Paging & Segmentation' },
];

export const demoResources = [
  { id: 'res_001', subjectId: 'sub_001', topicId: 'top_001', title: 'Linked List - Complete Notes', type: 'pdf', url: 'https://example.com/linked-list.pdf', staffId: 'staff_001', size: '1.2 MB', createdAt: '2025-09-01T10:00:00Z' },
  { id: 'res_002', subjectId: 'sub_001', topicId: 'top_003', title: 'Stack Operations PPT', type: 'ppt', url: 'https://example.com/stack.pptx', staffId: 'staff_001', size: '3.4 MB', createdAt: '2025-09-05T10:00:00Z' },
  { id: 'res_003', subjectId: 'sub_001', topicId: 'top_005', title: 'Binary Trees Video Lecture', type: 'video', url: 'https://youtube.com/watch?v=example1', staffId: 'staff_001', createdAt: '2025-09-10T10:00:00Z' },
  { id: 'res_004', subjectId: 'sub_002', topicId: 'top_007', title: 'Normalization Guide', type: 'pdf', url: 'https://example.com/normalization.pdf', staffId: 'staff_001', size: '2.1 MB', createdAt: '2025-09-12T10:00:00Z' },
  { id: 'res_005', subjectId: 'sub_002', topicId: 'top_008', title: 'SQL Joins Reference', type: 'link', url: 'https://w3schools.com/sql/sql_join.asp', staffId: 'staff_001', createdAt: '2025-09-15T10:00:00Z' },
  { id: 'res_006', subjectId: 'sub_003', topicId: 'top_009', title: 'Scheduling Algorithms', type: 'pdf', url: 'https://example.com/scheduling.pdf', staffId: 'staff_002', size: '1.8 MB', createdAt: '2025-09-18T10:00:00Z' },
];

export const demoMissedClasses = [
  {
    id: 'miss_001', studentId: 'stu_001', studentName: 'Arjun Mehta',
    subjectId: 'sub_001', subjectName: 'Data Structures',
    date: '2025-10-20', topics: ['Single Linked List', 'Doubly Linked List'],
    reason: 'Fever - medical certificate attached',
    status: 'Approved', reviewedBy: 'staff_001', reviewedAt: '2025-10-21T11:00:00Z',
    createdAt: '2025-10-20T18:00:00Z',
  },
  {
    id: 'miss_002', studentId: 'stu_001', studentName: 'Arjun Mehta',
    subjectId: 'sub_003', subjectName: 'Operating Systems',
    date: '2025-10-25', topics: ['Process Scheduling'],
    reason: 'Family emergency',
    status: 'Pending', createdAt: '2025-10-25T19:00:00Z',
  },
  {
    id: 'miss_003', studentId: 'stu_002', studentName: 'Sneha Patel',
    subjectId: 'sub_002', subjectName: 'Database Management',
    date: '2025-10-22', topics: ['Normalization Forms', 'SQL Joins'],
    reason: 'Medical appointment',
    status: 'Approved', reviewedBy: 'staff_001', reviewedAt: '2025-10-23T10:00:00Z',
    createdAt: '2025-10-22T17:00:00Z',
  },
  {
    id: 'miss_004', studentId: 'stu_003', studentName: 'Karthik Reddy',
    subjectId: 'sub_001', subjectName: 'Data Structures',
    date: '2025-10-23', topics: ['BFS & DFS'],
    reason: '',
    status: 'Pending', createdAt: '2025-10-23T20:00:00Z',
  },
];

export const demoAssignments = [
  {
    id: 'asg_001',
    missedClassId: 'miss_001',
    studentId: 'stu_001',
    studentName: 'Arjun Mehta',
    staffId: 'staff_001',
    subjectId: 'sub_001',
    subjectName: 'Data Structures',
    title: 'Data Structures - Linked Lists Recovery',
    topics: ['Single Linked List', 'Doubly Linked List'],
    resourceIds: ['res_001'],
    tasks: [
      { id: 'task_001', title: 'Read Linked List notes', completed: true },
      { id: 'task_002', title: 'Practice insertion & deletion code', completed: false },
      { id: 'task_003', title: 'Complete topic quiz', completed: false },
    ],
    priority: 'High',
    startDate: '2025-10-21',
    deadline: '2025-11-05',
    status: 'In Progress',
    assessmentId: 'quiz_001',
    feedback: '',
    createdAt: '2025-10-21T11:30:00Z',
  },
  {
    id: 'asg_002',
    missedClassId: 'miss_003',
    studentId: 'stu_002',
    studentName: 'Sneha Patel',
    staffId: 'staff_001',
    subjectId: 'sub_002',
    subjectName: 'Database Management',
    title: 'DBMS - Normalization & SQL Recovery',
    topics: ['Normalization Forms', 'SQL Joins'],
    resourceIds: ['res_004', 'res_005'],
    tasks: [
      { id: 'task_004', title: 'Study all Normal Forms (1NF to BCNF)', completed: true },
      { id: 'task_005', title: 'Solve 5 practice SQL queries with joins', completed: true },
      { id: 'task_006', title: 'Attempt DBMS topic quiz', completed: true },
    ],
    priority: 'Medium',
    startDate: '2025-10-23',
    deadline: '2025-11-02',
    status: 'Completed',
    assessmentId: 'quiz_002',
    feedback: 'Excellent work! Well-written queries and thorough understanding of normalization.',
    createdAt: '2025-10-23T10:30:00Z',
  },
];

export const demoAssessments = [
  {
    id: 'quiz_001',
    title: 'Linked Lists Quiz',
    subjectId: 'sub_001',
    subjectName: 'Data Structures',
    staffId: 'staff_001',
    duration: 15,
    deadline: '2025-11-10',
    createdAt: '2025-10-21T12:00:00Z',
    questions: [
      { id: 'q1', question: 'What is the time complexity of inserting at the beginning of a singly linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], correctAnswer: 0, explanation: 'Insertion at the head is O(1) since we only need to update one pointer.' },
      { id: 'q2', question: 'Which data structure uses LIFO order?', options: ['Queue', 'Stack', 'Linked List', 'Tree'], correctAnswer: 1, explanation: 'Stack follows Last-In-First-Out (LIFO) order.' },
      { id: 'q3', question: 'In a doubly linked list, each node has:', options: ['One pointer', 'Two pointers', 'Three pointers', 'No pointers'], correctAnswer: 1, explanation: 'Doubly linked list nodes have both prev and next pointers.' },
      { id: 'q4', question: 'Which operation is NOT efficient in a singly linked list?', options: ['Insert at head', 'Delete at head', 'Access by index', 'Insert at tail with tail pointer'], correctAnswer: 2, explanation: 'Accessing by index requires O(n) traversal in a linked list.' },
      { id: 'q5', question: 'How many edges can a tree with n nodes have?', options: ['n', 'n-1', 'n+1', '2n'], correctAnswer: 1, explanation: 'A tree with n nodes has exactly n-1 edges.' },
    ],
  },
  {
    id: 'quiz_002',
    title: 'DBMS - Normalization Quiz',
    subjectId: 'sub_002',
    subjectName: 'Database Management',
    staffId: 'staff_001',
    duration: 15,
    deadline: '2025-11-05',
    createdAt: '2025-10-23T10:00:00Z',
    questions: [
      { id: 'q1', question: 'Which normal form eliminates partial dependency?', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: 1, explanation: '2NF eliminates partial dependencies on the primary key.' },
      { id: 'q2', question: 'Which SQL JOIN returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correctAnswer: 3, explanation: 'FULL OUTER JOIN returns all rows from both tables with NULLs where no match.' },
      { id: 'q3', question: 'What does 3NF ensure?', options: ['No transitive dependency', 'No partial dependency', 'No multi-valued dependency', 'No NULL values'], correctAnswer: 0, explanation: '3NF removes transitive dependencies on the primary key.' },
    ],
  },
];

export const demoAssessmentResults = [
  {
    id: 'res_001_result',
    assessmentId: 'quiz_002',
    studentId: 'stu_002',
    studentName: 'Sneha Patel',
    score: 3, total: 3, percentage: 100,
    answers: { q1: 1, q2: 3, q3: 0 },
    submittedAt: '2025-10-28T15:00:00Z',
  },
];

export const demoNotifications = [
  { id: 'notif_001', userId: 'stu_001', title: 'New Recovery Assignment', message: 'You have been assigned a Data Structures recovery plan by Dr. Priya Sharma.', type: 'assignment', read: false, createdAt: '2025-10-21T11:35:00Z' },
  { id: 'notif_002', userId: 'stu_001', title: 'Assessment Available', message: 'Linked Lists Quiz is now available. Deadline: Nov 10, 2025.', type: 'assessment', read: false, createdAt: '2025-10-21T12:05:00Z' },
  { id: 'notif_003', userId: 'stu_001', title: 'Missed Class Approved', message: 'Your missed class report for Oct 20 (Data Structures) has been approved.', type: 'approval', read: true, createdAt: '2025-10-21T11:00:00Z' },
  { id: 'notif_004', userId: 'stu_002', title: 'Recovery Assignment Completed', message: 'Great job! Your DBMS recovery assignment has been marked complete.', type: 'completion', read: true, createdAt: '2025-10-30T10:00:00Z' },
];

export const demoAnnouncements = [
  { id: 'ann_001', staffId: 'staff_001', staffName: 'Dr. Priya Sharma', title: 'Mid-Semester Exams Schedule', message: 'Mid-semester exams will begin from Nov 15. Check the portal for detailed schedule.', targetDept: 'Computer Science', targetYear: '3rd Year', createdAt: '2025-10-25T10:00:00Z' },
  { id: 'ann_002', staffId: 'staff_002', staffName: 'Prof. Rajesh Kumar', title: 'OS Lab Rescheduled', message: 'OS Lab for Section A is rescheduled to Friday 2 PM this week.', targetDept: 'Computer Science', targetYear: '3rd Year', createdAt: '2025-10-27T09:00:00Z' },
];

export const demoStudyTasks = [
  { id: 'task_a1', studentId: 'stu_001', title: 'Complete Linked List practice problems', subjectId: 'sub_001', date: '2025-11-01', completed: false, priority: 'High' },
  { id: 'task_a2', studentId: 'stu_001', title: 'Watch Binary Trees lecture', subjectId: 'sub_001', date: '2025-11-02', completed: false, priority: 'Medium' },
  { id: 'task_a3', studentId: 'stu_001', title: 'Attempt Linked Lists Quiz', subjectId: 'sub_001', date: '2025-11-03', completed: false, priority: 'High' },
];