'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Edit, Trash2 } from 'lucide-react'
import { Button } from './button'
import { useToast } from './use-toast'
import { Subject } from '@/types/faculty-management'

interface SubjectListProps {
  onEdit?: (subject: Subject) => void
}

// Function to fetch subjects
async function fetchSubjects(): Promise<Subject[]> {
  const response = await fetch('/api/subjects')
  if (!response.ok) throw new Error('Failed to fetch subjects')
  return response.json()
}

// Function to delete a subject
async function deleteSubject(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/subjects?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete subject')
  return response.json()
}

export function SubjectList({ onEdit }: SubjectListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  // Query for fetching subjects
  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subjects'],
    queryFn: fetchSubjects,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  // Mutation for deleting subject
  const deleteMutation = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => {
      toast({
        title: 'Subject deleted',
        description: 'The subject has been deleted successfully.',
        variant: 'default',
      })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
    onError: (error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete subject',
        variant: 'destructive',
      })
    }
  })

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
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
          Loading subjects...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading subjects: {(error as Error).message}
      </div>
    )
  }

  if (!subjects || subjects.length === 0) {
    return (
      <div className="p-6 text-center text-white/60">
        <h3 className="text-xl font-medium">No subjects available</h3>
        <p className="mt-2">Add subjects using the form above.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">
        {subjects.length} Subject{subjects.length !== 1 ? 's' : ''}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subjects.map((subject) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{subject.name}</h3>
                  <span className="px-2 py-0.5 bg-white/10 rounded-full text-xs">
                    {subject.code}
                  </span>
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-white/60">
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Department: {subject.department}
                  </span>
                  
                  <span className="px-2 py-1 bg-white/10 rounded-full">
                    Credits: {subject.credits}
                  </span>
                </div>
                
                {subject.description && (
                  <p className="mt-2 text-sm text-white/70">{subject.description}</p>
                )}
              </div>
              
              <div className="flex space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(subject)}
                    className="h-8 w-8 bg-white/10 border-white/20 hover:bg-white/20"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(subject.id)}
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