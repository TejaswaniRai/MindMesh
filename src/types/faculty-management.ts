export interface Teacher {
  id: string;
  name: string;
  email: string;
  department: string;
  subjects: string[];
  joinedAt: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  batch: string;
  enrollmentNumber: string;
  joinedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  credits: number;
  description?: string;
}

export interface Room {
  id: string;
  name: string;
  number: string;
  floor: string;
  capacity: number;
  type: string; // classroom, lab, office, etc.
  createdAt: string;
}

export interface Floor {
  id: string;
  name: string;
  number: string;
  building: string;
  createdAt: string;
}

export interface TeachersStore {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  getAll: () => Promise<Teacher[]>;
  getById: (id: string) => Promise<Teacher | undefined>;
  add: (teacher: Omit<Teacher, 'id' | 'joinedAt'>) => Promise<Teacher>;
  update: (id: string, teacher: Partial<Omit<Teacher, 'id' | 'joinedAt'>>) => Promise<Teacher | undefined>;
  delete: (id: string) => Promise<boolean>;
}

export interface StudentsStore {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  getAll: () => Promise<Student[]>;
  getById: (id: string) => Promise<Student | undefined>;
  add: (student: Omit<Student, 'id' | 'joinedAt'>) => Promise<Student>;
  update: (id: string, student: Partial<Omit<Student, 'id' | 'joinedAt'>>) => Promise<Student | undefined>;
  delete: (id: string) => Promise<boolean>;
}

export interface SubjectsStore {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  getAll: () => Promise<Subject[]>;
  getById: (id: string) => Promise<Subject | undefined>;
  add: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
  update: (id: string, subject: Partial<Omit<Subject, 'id'>>) => Promise<Subject | undefined>;
  delete: (id: string) => Promise<boolean>;
}

export interface RoomsStore {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  getAll: () => Promise<Room[]>;
  getById: (id: string) => Promise<Room | undefined>;
  add: (room: Omit<Room, 'id' | 'createdAt'>) => Promise<Room>;
  update: (id: string, room: Partial<Omit<Room, 'id' | 'createdAt'>>) => Promise<Room | undefined>;
  delete: (id: string) => Promise<boolean>;
}

export interface FloorsStore {
  initialize: () => Promise<void>;
  save: () => Promise<void>;
  getAll: () => Promise<Floor[]>;
  getById: (id: string) => Promise<Floor | undefined>;
  add: (floor: Omit<Floor, 'id' | 'createdAt'>) => Promise<Floor>;
  update: (id: string, floor: Partial<Omit<Floor, 'id' | 'createdAt'>>) => Promise<Floor | undefined>;
  delete: (id: string) => Promise<boolean>;
}