'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Textarea } from './textarea'
import { useToast } from './use-toast'
import { Subject } from '@/types/faculty-management'

interface SubjectFormProps {
  subject?: Subject
  onSuccess?: () => void
  onCancel?: () => void
}

export function SubjectForm({ subject, onSuccess, onCancel }: SubjectFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [department, setDepartment] = useState('')
  const [credits, setCredits] = useState<number>(3)
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If editing, populate form with subject data
  useEffect(() => {
    if (subject) {
      setName(subject.name)
      setCode(subject.code)
      setDepartment(subject.department)
      setCredits(subject.credits)
      setDescription(subject.description || '')
    }
  }, [subject])

  // Mutation for adding/updating subject
  const subjectMutation = useMutation({
    mutationFn: async (data: {
      name: string
      code: string
      department: string
      credits: number
      description?: string
    }) => {
      setIsSubmitting(true)
      try {
        const url = subject 
          ? `/api/subjects?id=${subject.id}` 
          : '/api/subjects'
        
        const method = subject ? 'PATCH' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to ${subject ? 'update' : 'add'} subject`)
        }

        return response.json()
      } finally {
        setIsSubmitting(false)
      }
    },
    onSuccess: () => {
      // Reset form
      setName('')
      setCode('')
      setDepartment('')
      setCredits(3)
      setDescription('')
      
      // Show success toast
      toast({
        title: `Subject ${subject ? 'updated' : 'added'}`,
        description: `The subject has been ${subject ? 'updated' : 'added'} successfully.`,
        variant: 'default',
      })
      
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: `${subject ? 'Update' : 'Add'} failed`,
        description: error.message || `Failed to ${subject ? 'update' : 'add'} subject`,
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !code || !department || credits <= 0) {
      toast({
        title: 'Missing information',
        description: 'Please provide name, code, department, and valid credits',
        variant: 'destructive',
      })
      return
    }
    
    subjectMutation.mutate({ 
      name, 
      code, 
      department, 
      credits,
      description: description || undefined
    })
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        {subject ? 'Edit Subject' : 'Add New Subject'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Subject Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter subject name"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="code">Subject Code</Label>
          <Input
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter subject code (e.g., CS101)"
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
          <Label htmlFor="credits">Credits</Label>
          <Input
            id="credits"
            type="number"
            min="1"
            max="10"
            value={credits}
            onChange={(e) => setCredits(parseInt(e.target.value))}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter subject description"
            className="bg-white/10 border-white/20 text-white min-h-[100px]"
          />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : subject ? 'Update Subject' : 'Add Subject'}
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