'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from './button'
import { useToast } from './use-toast'
import { Floor } from '@/types/faculty-management'

interface FloorListProps {
  onEdit?: (floor: Floor) => void
}

// Function to fetch floors
async function fetchFloors(): Promise<Floor[]> {
  const response = await fetch('/api/floors')
  if (!response.ok) throw new Error('Failed to fetch floors')
  return response.json()
}

// Function to delete a floor
async function deleteFloor(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/floors?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete floor')
  return response.json()
}

export function FloorList({ onEdit }: FloorListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching floors
  const { data: floors, isLoading, error } = useQuery({
    queryKey: ['floors'],
    queryFn: fetchFloors,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  // Mutation for deleting floor
  const deleteMutation = useMutation({
    mutationFn: deleteFloor,
    onSuccess: () => {
      toast({
        title: 'Floor deleted',
        description: 'The floor has been deleted successfully.',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['floors'] })
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete floor',
        variant: 'destructive',
      })
    }
  })

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this floor?')) {
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
          Loading floors...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading floors: {(error as Error).message}
      </div>
    )
  }

  if (!floors || floors.length === 0) {
    return (
      <div className="p-6 text-center text-white/60">
        <h3 className="text-xl font-medium">No floors available</h3>
        <p className="mt-2">Add floors using the form above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {floors.length} Floor{floors.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {floors.map((floor) => (
          <motion.div
            key={floor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{floor.name}</h3>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                    Floor {floor.number}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/60">
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Building: {floor.building}
                  </span>
                </div>
                
                <div className="mt-3 text-xs text-white/50">
                  Added on {new Date(floor.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(floor)}
                    className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(floor.id)}
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