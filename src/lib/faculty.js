// Fake faculty data and helpers (JS module)

/** @typedef {{ rating: number, comment: string }} Feedback */
/**
 * @typedef {Object} Faculty
 * @property {string} id
 * @property {string} name
 * @property {string} department
 * @property {string} email
 * @property {string} phone
 * @property {string[]} courses
 * @property {Feedback[]} feedback
 * @property {number} classesHandled
 */

/** @type {Faculty[]} */
export const FACULTY = [
  // CSE
  {
    id: '1',
    name: 'Dr. Lisa Verma',
    department: 'CSE',
    email: 'lv@bwu.ac.in',
    phone: '9876543210',
    courses: ['AI', 'ML'],
    feedback: [
      { rating: 5, comment: 'Great teacher' },
      { rating: 4, comment: 'Good explanations' }
    ],
    classesHandled: 42
  },
  {
    id: '2',
    name: 'Prof. Karthik Iyer',
    department: 'CSE',
    email: 'ki@bwu.ac.in',
    phone: '9123456789',
    courses: ['Operating Systems'],
    feedback: [
      { rating: 3, comment: 'Too fast in lectures' },
      { rating: 4, comment: 'Helpful in doubts' }
    ],
    classesHandled: 30
  },
  {
    id: '3',
    name: 'Dr. Priyanka Saha',
    department: 'CSE',
    email: 'ps@bwu.ac.in',
    phone: '9811122233',
    courses: ['Artificial Intelligence'],
    feedback: [
      { rating: 5, comment: 'Very engaging' },
      { rating: 5, comment: 'Excellent content' }
    ],
    classesHandled: 55
  },
  // CSE-AI
  {
    id: '4',
    name: 'Dr. Anirban Sen',
    department: 'CSE-AI',
    email: 'as@bwu.ac.in',
    phone: '9898989898',
    courses: ['Deep Learning', 'Neural Networks'],
    feedback: [
      { rating: 5, comment: 'Inspiring sessions' },
      { rating: 4, comment: 'Hands-on approach' }
    ],
    classesHandled: 28
  },
  {
    id: '5',
    name: 'Ms. Debasmita Saha',
    department: 'CSE-AI',
    email: 'ds@bwu.ac.in',
    phone: '9000012345',
    courses: ['Computer Vision'],
    feedback: [
      { rating: 4, comment: 'Clear explanations' },
      { rating: 4, comment: 'Supportive' }
    ],
    classesHandled: 24
  },
  {
    id: '6',
    name: 'Dr. Amit Roy',
    department: 'CSE-AI',
    email: 'ar@bwu.ac.in',
    phone: '9111122233',
    courses: ['Machine Learning'],
    feedback: [
      { rating: 5, comment: 'Excellent content' },
      { rating: 4, comment: 'Engaging' }
    ],
    classesHandled: 40
  },
  // CS-DS
  {
    id: '7',
    name: 'Dr. Sonali Mondal',
    department: 'CS-DS',
    email: 'sm@bwu.ac.in',
    phone: '9333344444',
    courses: ['Data Mining', 'Big Data Analytics'],
    feedback: [
      { rating: 5, comment: 'Great insights' },
      { rating: 4, comment: 'Good practicals' }
    ],
    classesHandled: 38
  },
  {
    id: '8',
    name: 'Mr. Rajat Gupta',
    department: 'CS-DS',
    email: 'rg@bwu.ac.in',
    phone: '9555566666',
    courses: ['DBMS Lab', 'Operating Systems Lab'],
    feedback: [
      { rating: 4, comment: 'Very helpful' },
      { rating: 4, comment: 'Good lab sessions' }
    ],
    classesHandled: 26
  },
  {
    id: '9',
    name: 'Prof. Manas Saha',
    department: 'CS-DS',
    email: 'ms@bwu.ac.in',
    phone: '9777788888',
    courses: ['Probability & Statistics'],
    feedback: [
      { rating: 4, comment: 'Concept driven' },
      { rating: 4, comment: 'Well structured' }
    ],
    classesHandled: 31
  }
];

/**
 * @param {Faculty} f
 */
export function withAverage(f) {
  const avg = f.feedback && f.feedback.length
    ? f.feedback.reduce((s, x) => s + (x.rating || 0), 0) / f.feedback.length
    : 0;
  return { ...f, averageRating: Number(avg.toFixed(2)) };
}

/**
 * @param {string} search
 * @param {string} department
 */
export function filterFaculty(search = '', department = '') {
  const s = (search || '').toLowerCase().trim();
  const d = (department || '').toLowerCase().trim();
  let list = FACULTY.slice();
  if (s) {
    list = list.filter(f => f.name.toLowerCase().includes(s) || f.email.toLowerCase().includes(s));
  }
  if (d) {
    list = list.filter(f => f.department.toLowerCase() === d);
  }
  return list.map(withAverage);
}
