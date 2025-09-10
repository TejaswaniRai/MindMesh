export type UserRole = 'admin' | 'student' | 'faculty';

export type RoomStatus = 'free' | 'occupied' | 'extra';

export interface Booking {
  id: string;
  roomNumber: string;
  date: string;
  timeSlot: string;
  batchName: string;
  lectureName: string;
  status: RoomStatus;
}

export interface Classroom {
  roomNumber: string;
  floor: number;
  currentStatus: RoomStatus;
  currentBooking?: Booking;
  bookings: Booking[];
}

export interface Floor {
  number: number;
  classrooms: Classroom[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Reply {
  id: string;
  content: string;
  author: string; // 'student' or 'faculty' or 'admin'
  authorName: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  teacherName?: string;
  batchName?: string;
  createdAt: string;
  replies?: Reply[];
}
