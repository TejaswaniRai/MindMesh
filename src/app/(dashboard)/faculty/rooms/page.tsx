'use client'

import { useState } from 'react'
import { RoomForm } from '@/components/ui/room-form'
import { RoomList } from '@/components/ui/room-list'
import { Room } from '@/types/faculty-management'

export default function RoomsPage() {
  const [editingRoom, setEditingRoom] = useState<Room | undefined>(undefined)
  
  const handleEditRoom = (room: Room) => {
    setEditingRoom(room)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleFormSuccess = () => {
    setEditingRoom(undefined)
  }
  
  const handleCancelEdit = () => {
    setEditingRoom(undefined)
  }
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Room Management</h1>
      </div>
      
      <RoomForm 
        room={editingRoom} 
        onSuccess={handleFormSuccess} 
        onCancel={handleCancelEdit}
      />
      
      <RoomList onEdit={handleEditRoom} />
    </div>
  )
}