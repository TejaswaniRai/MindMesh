import { Room, RoomsStore } from '@/types/faculty-management'
import { randomUUID } from 'crypto'

const sampleRooms: Room[] = [
  {
    id: '1',
    name: 'Computer Lab 1',
    number: '101',
    floor: '1',
    capacity: 30,
    type: 'lab',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '2',
    name: 'Computer Lab 2',
    number: '102',
    floor: '1',
    capacity: 30,
    type: 'lab',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '3',
    name: 'Lecture Hall A',
    number: '201',
    floor: '2',
    capacity: 100,
    type: 'classroom',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '4',
    name: 'Lecture Hall B',
    number: '202',
    floor: '2',
    capacity: 80,
    type: 'classroom',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '5',
    name: 'Seminar Room 1',
    number: '301',
    floor: '3',
    capacity: 20,
    type: 'classroom',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '6',
    name: 'Seminar Room 2',
    number: '302',
    floor: '3',
    capacity: 20,
    type: 'classroom',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '7',
    name: 'Conference Room',
    number: '401',
    floor: '4',
    capacity: 15,
    type: 'office',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '8',
    name: 'Research Lab',
    number: '501',
    floor: '5',
    capacity: 25,
    type: 'lab',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '9',
    name: 'Mathematics Lab',
    number: '103',
    floor: '1',
    capacity: 25,
    type: 'lab',
    createdAt: '2024-01-01T09:00:00Z'
  },
  {
    id: '10',
    name: 'Library Study Room',
    number: '601',
    floor: '6',
    capacity: 10,
    type: 'office',
    createdAt: '2024-01-01T09:00:00Z'
  }
];

class InMemoryRoomsStore implements RoomsStore {
  rooms: Room[] = [...sampleRooms]

  constructor() {
    this.initialize()
  }

  async initialize(): Promise<void> {
    this.rooms = [...sampleRooms]
  }

  async save(): Promise<void> {
    // Persisted rooms in memory
  }

  async getAll(): Promise<Room[]> {
    return this.rooms
  }

  async getById(id: string): Promise<Room | undefined> {
    return this.rooms.find(room => room.id === id)
  }

  async add(roomData: Omit<Room, 'id' | 'createdAt'>): Promise<Room> {
    const room: Room = {
      ...roomData,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    }

    this.rooms.push(room)
    await this.save()
    return room
  }

  async update(id: string, roomData: Partial<Omit<Room, 'id' | 'createdAt'>>): Promise<Room | undefined> {
    const index = this.rooms.findIndex(room => room.id === id)
    if (index === -1) return undefined

    this.rooms[index] = {
      ...this.rooms[index],
      ...roomData
    }

    await this.save()
    return this.rooms[index]
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.rooms.length
    this.rooms = this.rooms.filter(room => room.id !== id)
    await this.save()
    return initialLength > this.rooms.length
  }
}

export const roomsStore = new InMemoryRoomsStore()