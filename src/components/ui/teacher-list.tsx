'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from './button'
import { useToast } from './use-toast'
import { Teacher } from '@/types/faculty-management'

interface TeacherListProps {
  onEdit?: (teacher: Teacher) => void
}

// Function to fetch teachers
async function fetchTeachers(): Promise<Teacher[]> {
  const response = await fetch('/api/teachers')
  if (!response.ok) throw new Error('Failed to fetch teachers')
  return response.json()
}

// Function to delete a teacher
async function deleteTeacher(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/teachers?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete teacher')
  return response.json()
}

export function TeacherList({ onEdit }: TeacherListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching teachers
  const { data: teachers, isLoading, error } = useQuery({
    queryKey: ['teachers'],
    queryFn: fetchTeachers,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  // Mutation for deleting teacher
  const deleteMutation = useMutation({
    mutationFn: deleteTeacher,
    onSuccess: () => {
      toast({
        title: 'Teacher deleted',
        description: 'The teacher has been deleted successfully.',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete teacher',
        variant: 'destructive',
      })
    }
  })

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this teacher?')) {
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
          Loading teachers...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading teachers: {(error as Error).message}
      </div>
    )
  }

  if (!teachers || teachers.length === 0) {
    return (
      <div className="p-6 text-center text-white/60">
        <h3 className="text-xl font-medium">No teachers available</h3>
        <p className="mt-2">Add teachers using the form above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {teachers.length} Teacher{teachers.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="grid grid-cols-1 gap-4">
        {teachers.map((teacher) => (
          <motion.div
            key={teacher.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium">{teacher.name}</h3>
                <p className="mt-1 text-white/70">{teacher.email}</p>
                
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/60">
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Department: {teacher.department}
                  </span>
                  
                  {teacher.subjects && teacher.subjects.length > 0 && (
                    <span className="px-2 py-1 bg-white/10 rounded-full">
                      Subjects: {teacher.subjects.length}
                    </span>
                  )}
                </div>
                
                <div className="mt-3 text-xs text-white/50">
                  Joined on {format(new Date(teacher.joinedAt), 'PPP')}
                </div>
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(teacher)}
                    className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(teacher.id)}
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