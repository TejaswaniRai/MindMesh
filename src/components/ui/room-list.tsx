'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from './button'
import { useToast } from './use-toast'
import { Room } from '@/types/faculty-management'

interface RoomListProps {
  onEdit?: (room: Room) => void
}

// Function to fetch rooms
async function fetchRooms(): Promise<Room[]> {
  const response = await fetch('/api/rooms')
  if (!response.ok) throw new Error('Failed to fetch rooms')
  return response.json()
}

// Function to delete a room
async function deleteRoom(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/rooms?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete room')
  return response.json()
}

export function RoomList({ onEdit }: RoomListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching rooms
  const { data: rooms, isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  // Mutation for deleting room
  const deleteMutation = useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      toast({
        title: 'Room deleted',
        description: 'The room has been deleted successfully.',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete room',
        variant: 'destructive',
      })
    }
  })

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this room?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-center"
        >
          Loading rooms...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading rooms: {(error as Error).message}
      </div>
    )
  }

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-6 text-center text-white/60">
        <h3 className="text-xl font-medium">No rooms available</h3>
        <p className="mt-2">Add rooms using the form above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {rooms.length} Room{rooms.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{room.name}</h3>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                    Room {room.number}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/60">
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Floor: {room.floor}
                  </span>
                  
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Type: {room.type}
                  </span>
                  
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Capacity: {room.capacity}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(room)}
                    className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(room.id)}
                  className="h-8 w-8 bg-white/10 border-white/20 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}