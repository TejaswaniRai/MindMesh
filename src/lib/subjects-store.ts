import { Subject, SubjectsStore } from '@/types/faculty-management';
import crypto from 'crypto';

const sampleSubjects: Subject[] = [
  {
    id: '1',
    name: 'Introduction to Computer Science',
    code: 'CS101',
    department: 'Computer Science',
    credits: 3,
    description: 'Fundamental concepts of computer science and programming'
  },
  {
    id: '2',
    name: 'Data Structures and Algorithms',
    code: 'CS201',
    department: 'Computer Science',
    credits: 4,
    description: 'Core data structures and algorithmic problem solving'
  },
  {
    id: '3',
    name: 'Database Management Systems',
    code: 'DB101',
    department: 'Database Systems',
    credits: 3,
    description: 'Introduction to database design and SQL'
  },
  {
    id: '4',
    name: 'Machine Learning Fundamentals',
    code: 'ML201',
    department: 'Artificial Intelligence',
    credits: 4,
    description: 'Introduction to machine learning algorithms and applications'
  },
  {
    id: '5',
    name: 'Web Development',
    code: 'WEB101',
    department: 'Web Development',
    credits: 3,
    description: 'Modern web development with HTML, CSS, and JavaScript'
  },
  {
    id: '6',
    name: 'Software Engineering',
    code: 'SE101',
    department: 'Software Engineering',
    credits: 4,
    description: 'Software development lifecycle and best practices'
  },
  {
    id: '7',
    name: 'Data Science and Analytics',
    code: 'DS101',
    department: 'Data Science',
    credits: 4,
    description: 'Data analysis, visualization, and statistical methods'
  },
  {
    id: '8',
    name: 'Cybersecurity Fundamentals',
    code: 'CSEC101',
    department: 'Cybersecurity',
    credits: 3,
    description: 'Introduction to cybersecurity principles and practices'
  },
  {
    id: '9',
    name: 'Calculus I',
    code: 'MATH101',
    department: 'Mathematics',
    credits: 4,
    description: 'Differential and integral calculus'
  },
  {
    id: '10',
    name: 'Statistics and Probability',
    code: 'STAT301',
    department: 'Mathematics',
    credits: 3,
    description: 'Statistical methods and probability theory'
  }
];

let subjects: Subject[] = [...sampleSubjects];

export const subjectsStore: SubjectsStore = {
  async initialize() {
    subjects = [...sampleSubjects];
  },

  async save() {
    // Persisted subjects in memory
  },

  async getAll() {
    return [...subjects];
  },

  async getById(id: string) {
    return subjects.find(subject => subject.id === id);
  },

  async add(subjectData) {
    const newSubject: Subject = {
      ...subjectData,
      id: crypto.randomUUID(),
    };

    subjects.push(newSubject);
    await this.save();
    return newSubject;
  },

  async update(id: string, subjectData) {
    const index = subjects.findIndex(subject => subject.id === id);
    if (index === -1) return undefined;

    const updatedSubject = {
      ...subjects[index],
      ...subjectData,
    };

    subjects[index] = updatedSubject;
    await this.save();
    return updatedSubject;
  },

  async delete(id: string) {
    const initialLength = subjects.length;
    subjects = subjects.filter(subject => subject.id !== id);
    const deleted = subjects.length < initialLength;
    
    if (deleted) {
      await this.save();
    }
    
    return deleted;
  },
};

// Initialize immediately
subjectsStore.initialize();