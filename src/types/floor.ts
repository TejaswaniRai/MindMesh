export type RoomStatus = 'occupied' | 'free' | 'extra'

export type Booking = {
  batchName: string
  timeSlot: string
  lectureName: string
}

export type Room = {
  roomNumber: string
  status: RoomStatus
  currentBooking?: Booking
}

export type Floor = {
  number: number
  rooms: Room[]
}
