'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { useToast } from './use-toast'
import { Floor } from '@/types/faculty-management'

interface FloorFormProps {
  floor?: Floor
  onSuccess?: () => void
  onCancel?: () => void
}

export function FloorForm({ floor, onSuccess, onCancel }: FloorFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [building, setBuilding] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // If editing, populate form with floor data
  useEffect(() => {
    if (floor) {
      setName(floor.name)
      setNumber(floor.number)
      setBuilding(floor.building)
    }
  }, [floor])

  // Mutation for adding/updating floor
  const floorMutation = useMutation({
    mutationFn: async (data: {
      name: string
      number: string
      building: string
    }) => {
      setIsSubmitting(true)
      try {
        const url = floor 
          ? `/api/floors?id=${floor.id}` 
          : '/api/floors'
        
        const method = floor ? 'PATCH' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to ${floor ? 'update' : 'add'} floor`)
        }

        return response.json()
      } finally {
        setIsSubmitting(false)
      }
    },
    onSuccess: () => {
      // Reset form
      setName('')
      setNumber('')
      setBuilding('')
      
      // Show success toast
      toast({
        title: `Floor ${floor ? 'updated' : 'added'}`,
        description: `The floor has been ${floor ? 'updated' : 'added'} successfully.`,
        variant: 'default',
      })
      
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['floors'] })
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: `${floor ? 'Update' : 'Add'} failed`,
        description: error.message || `Failed to ${floor ? 'update' : 'add'} floor`,
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !number || !building) {
      toast({
        title: 'Missing information',
        description: 'Please provide name, number, and building',
        variant: 'destructive',
      })
      return
    }
    
    floorMutation.mutate({ 
      name, 
      number, 
      building
    })
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        {floor ? 'Edit Floor' : 'Add New Floor'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Floor Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter floor name (e.g., Ground Floor)"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="number">Floor Number</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter floor number (e.g., 0, 1, 2)"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="building">Building</Label>
          <Input
            id="building"
            value={building}
            onChange={(e) => setBuilding(e.target.value)}
            placeholder="Enter building name"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : floor ? 'Update Floor' : 'Add Floor'}
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