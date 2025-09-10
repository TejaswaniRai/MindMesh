// Persisted floors in memory
import { Floor, FloorsStore } from '@/types/faculty-management'
import { randomUUID } from 'crypto'

class InMemoryFloorsStore implements FloorsStore {
  floors: Floor[] = []

  constructor() {
    this.initialize()
  }

  async initialize(): Promise<void> {
    // Initialize with empty array
    this.floors = []
  }

  async save(): Promise<void> {
    // In a real app, this would save to a database
  }

  async getAll(): Promise<Floor[]> {
    return this.floors
  }

  async getById(id: string): Promise<Floor | undefined> {
    return this.floors.find(floor => floor.id === id)
  }

  async add(floorData: Omit<Floor, 'id' | 'createdAt'>): Promise<Floor> {
    const floor: Floor = {
      ...floorData,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    }

    this.floors.push(floor)
    await this.save()
    return floor
  }

  async update(id: string, floorData: Partial<Omit<Floor, 'id' | 'createdAt'>>): Promise<Floor | undefined> {
    const index = this.floors.findIndex(floor => floor.id === id)
    if (index === -1) return undefined

    this.floors[index] = {
      ...this.floors[index],
      ...floorData
    }

    await this.save()
    return this.floors[index]
  }

  async delete(id: string): Promise<boolean> {
    const initialLength = this.floors.length
    this.floors = this.floors.filter(floor => floor.id !== id)
    await this.save()
    return initialLength > this.floors.length
  }
}

export const floorsStore = new InMemoryFloorsStore()