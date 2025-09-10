import { Student, StudentsStore } from '@/types/faculty-management';
import crypto from 'crypto';

// In-memory store for students
let students: Student[] = [];

export const studentsStore: StudentsStore = {
  async initialize() {
    // In a real app, this would load from a database
    students = [];
  },

  async save() {
    // In a real app, this would save to a database
    // Persisted students in memory
  },

  async getAll() {
    return [...students];
  },

  async getById(id: string) {
    return students.find(student => student.id === id);
  },

  async add(studentData) {
    const newStudent: Student = {
      ...studentData,
      id: crypto.randomUUID(),
      joinedAt: new Date().toISOString(),
    };

    students.push(newStudent);
    await this.save();
    return newStudent;
  },

  async update(id: string, studentData) {
    const index = students.findIndex(student => student.id === id);
    if (index === -1) return undefined;

    const updatedStudent = {
      ...students[index],
      ...studentData,
    };

    students[index] = updatedStudent;
    await this.save();
    return updatedStudent;
  },

  async delete(id: string) {
    const initialLength = students.length;
    students = students.filter(student => student.id !== id);
    const deleted = students.length < initialLength;
    
    if (deleted) {
      await this.save();
    }
    
    return deleted;
  },
};

// Initialize the store
studentsStore.initialize();