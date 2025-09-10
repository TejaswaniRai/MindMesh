'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { useToast } from './use-toast'
import { Teacher } from '@/types/faculty-management'

interface TeacherFormProps {
  teacher?: Teacher
  onSuccess?: () => void
  onCancel?: () => void
}

export function TeacherForm({ teacher, onSuccess, onCancel }: TeacherFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [department, setDepartment] = useState('')
  const [subjects, setSubjects] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If editing, populate form with teacher data
  useEffect(() => {
    if (teacher) {
      setName(teacher.name)
      setEmail(teacher.email)
      setDepartment(teacher.department)
      setSubjects(teacher.subjects.join(', '))
    }
  }, [teacher])

  // Mutation for adding/updating teacher
  const teacherMutation = useMutation({
    mutationFn: async (data: {
      name: string
      email: string
      department: string
      subjects: string[]
    }) => {
      setIsSubmitting(true)
      try {
        const url = teacher 
          ? `/api/teachers?id=${teacher.id}` 
          : '/api/teachers'
        
        const method = teacher ? 'PATCH' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to ${teacher ? 'update' : 'add'} teacher`)
        }

        return response.json()
      } finally {
        setIsSubmitting(false)
      }
    },
    onSuccess: () => {
      // Reset form
      setName('')
      setEmail('')
      setDepartment('')
      setSubjects('')
      
      // Show success toast
      toast({
        title: `Teacher ${teacher ? 'updated' : 'added'}`,
        description: `The teacher has been ${teacher ? 'updated' : 'added'} successfully.`,
        variant: 'default',
      })
      
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['teachers'] })
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: `${teacher ? 'Update' : 'Add'} failed`,
        description: error.message || `Failed to ${teacher ? 'update' : 'add'} teacher`,
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !email || !department) {
      toast({
        title: 'Missing information',
        description: 'Please provide name, email, and department',
        variant: 'destructive',
      })
      return
    }
    
    // Convert subjects string to array
    const subjectsArray = subjects
      ? subjects.split(',').map(subject => subject.trim()).filter(Boolean)
      : []
    
    teacherMutation.mutate({ 
      name, 
      email, 
      department, 
      subjects: subjectsArray 
    })
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        {teacher ? 'Edit Teacher' : 'Add New Teacher'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="Enter department"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subjects">Subjects (comma separated)</Label>
          <Input
            id="subjects"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="Enter subjects, separated by commas"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : teacher ? 'Update Teacher' : 'Add Teacher'}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}