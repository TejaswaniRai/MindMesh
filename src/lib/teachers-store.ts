import { Teacher, TeachersStore } from '@/types/faculty-management';
import crypto from 'crypto';

const sampleTeachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@nexathon.edu',
    department: 'Computer Science',
    subjects: ['CS101', 'CS201', 'CS301'],
    joinedAt: '2020-08-15T09:00:00Z'
  },
  {
    id: '2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@nexathon.edu',
    department: 'Mathematics',
    subjects: ['MATH101', 'MATH201', 'STAT301'],
    joinedAt: '2019-09-01T09:00:00Z'
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'emily.davis@nexathon.edu',
    department: 'Database Systems',
    subjects: ['DB101', 'DB201', 'DB301'],
    joinedAt: '2021-01-15T09:00:00Z'
  },
  {
    id: '4',
    name: 'Prof. Alex Rodriguez',
    email: 'alex.rodriguez@nexathon.edu',
    department: 'Artificial Intelligence',
    subjects: ['AI101', 'ML201', 'AI301'],
    joinedAt: '2020-03-01T09:00:00Z'
  },
  {
    id: '5',
    name: 'Dr. Lisa Wang',
    email: 'lisa.wang@nexathon.edu',
    department: 'Web Development',
    subjects: ['WEB101', 'WEB201', 'WEB301'],
    joinedAt: '2021-08-20T09:00:00Z'
  },
  {
    id: '6',
    name: 'Prof. David Thompson',
    email: 'david.thompson@nexathon.edu',
    department: 'Software Engineering',
    subjects: ['SE101', 'SE201', 'SE301'],
    joinedAt: '2018-09-01T09:00:00Z'
  },
  {
    id: '7',
    name: 'Dr. Maria Garcia',
    email: 'maria.garcia@nexathon.edu',
    department: 'Data Science',
    subjects: ['DS101', 'DS201', 'DS301'],
    joinedAt: '2022-01-10T09:00:00Z'
  },
  {
    id: '8',
    name: 'Prof. James Wilson',
    email: 'james.wilson@nexathon.edu',
    department: 'Cybersecurity',
    subjects: ['CSEC101', 'CSEC201', 'CSEC301'],
    joinedAt: '2019-06-15T09:00:00Z'
  }
];

let teachers: Teacher[] = [...sampleTeachers];

export const teachersStore: TeachersStore = {
  async initialize() {
    teachers = [...sampleTeachers];
  },

  async save() {
    // Persisted teachers in memory
  },

  async getAll() {
    return [...teachers];
  },

  async getById(id: string) {
    return teachers.find(teacher => teacher.id === id);
  },

  async add(teacherData) {
    const newTeacher: Teacher = {
      ...teacherData,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString(),
    };

    teachers.push(newTeacher);
    await this.save();
    return newTeacher;
  },

  async update(id: string, teacherData) {
    const index = teachers.findIndex(teacher => teacher.id === id);
    if (index === -1) return undefined;

    const updatedTeacher = {
      ...teachers[index],
      ...teacherData,
    };

    teachers[index] = updatedTeacher;
    await this.save();
    return updatedTeacher;
  },

  async delete(id: string) {
    const initialLength = teachers.length;
    teachers = teachers.filter(teacher => teacher.id !== id);
    const deleted = teachers.length < initialLength;
    
    if (deleted) {
      await this.save();
    }
    
    return deleted;
  },
};

// Initialize immediately
teachersStore.initialize();