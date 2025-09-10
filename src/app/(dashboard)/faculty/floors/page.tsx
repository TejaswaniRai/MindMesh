'use client'

import { useState } from 'react'
import { FloorForm } from '@/components/ui/floor-form'
import { FloorList } from '@/components/ui/floor-list'
import { Floor } from '@/types/faculty-management'

export default function FloorsPage() {
  const [editingFloor, setEditingFloor] = useState<Floor | undefined>(undefined)

  const handleEditSuccess = () => {
    setEditingFloor(undefined)
  }

  const handleCancel = () => {
    setEditingFloor(undefined)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Floor Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <FloorForm 
          floor={editingFloor} 
          onSuccess={handleEditSuccess} 
          onCancel={handleCancel} 
        />
        
        <FloorList onEdit={setEditingFloor} />
      </div>
    </div>
  )
}