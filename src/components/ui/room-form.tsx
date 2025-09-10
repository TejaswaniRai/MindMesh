'use client'

import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { useToast } from './use-toast'
import { Room, Floor } from '@/types/faculty-management'

interface RoomFormProps {
  room?: Room
  onSuccess?: () => void
  onCancel?: () => void
}

// Function to fetch floors for dropdown
async function fetchFloors(): Promise<Floor[]> {
  const response = await fetch('/api/floors')
  if (!response.ok) throw new Error('Failed to fetch floors')
  return response.json()
}

export function RoomForm({ room, onSuccess, onCancel }: RoomFormProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')
  const [number, setNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [capacity, setCapacity] = useState<number>(30)
  const [type, setType] = useState('classroom')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Query for fetching floors
  const { data: floors } = useQuery({
    queryKey: ['floors'],
    queryFn: fetchFloors,
    staleTime: 1000 * 60 * 5 // 5 minutes cache
  })

  // If editing, populate form with room data
  useEffect(() => {
    if (room) {
      setName(room.name)
      setNumber(room.number)
      setFloor(room.floor)
      setCapacity(room.capacity)
      setType(room.type)
    }
  }, [room])

  // Mutation for adding/updating room
  const roomMutation = useMutation({
    mutationFn: async (data: {
      name: string
      number: string
      floor: string
      capacity: number
      type: string
    }) => {
      setIsSubmitting(true)
      try {
        const url = room 
          ? `/api/rooms?id=${room.id}` 
          : '/api/rooms'
        
        const method = room ? 'PATCH' : 'POST'
        
        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || `Failed to ${room ? 'update' : 'add'} room`)
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
      setFloor('')
      setCapacity(30)
      setType('classroom')
      
      // Show success toast
      toast({
        title: `Room ${room ? 'updated' : 'added'}`,
        description: `The room has been ${room ? 'updated' : 'added'} successfully.`,
        variant: 'default',
      })
      
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['rooms'] })
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: `${room ? 'Update' : 'Add'} failed`,
        description: error.message || `Failed to ${room ? 'update' : 'add'} room`,
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !number || !floor || capacity <= 0 || !type) {
      toast({
        title: 'Missing information',
        description: 'Please provide all required fields',
        variant: 'destructive',
      })
      return
    }
    
    roomMutation.mutate({ 
      name, 
      number, 
      floor, 
      capacity,
      type
    })
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">
        {room ? 'Edit Room' : 'Add New Room'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Room Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter room name"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="number">Room Number</Label>
          <Input
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter room number"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Select 
            value={floor} 
            onValueChange={setFloor}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              {floors ? (
                floors.map((floorOption) => (
                  <SelectItem key={floorOption.id} value={floorOption.number}>
                    {floorOption.name} (Floor {floorOption.number})
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="1">Floor 1</SelectItem>
              )}
              {/* Fallback options if no floors are loaded */}
              {(!floors || floors.length === 0) && [
                <SelectItem key="1" value="1">Floor 1</SelectItem>,
                <SelectItem key="2" value="2">Floor 2</SelectItem>,
                <SelectItem key="3" value="3">Floor 3</SelectItem>
              ]}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            min="1"
            value={capacity}
            onChange={(e) => setCapacity(parseInt(e.target.value))}
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Room Type</Label>
          <Select 
            value={type} 
            onValueChange={setType}
          >
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select room type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classroom">Classroom</SelectItem>
              <SelectItem value="lab">Laboratory</SelectItem>
              <SelectItem value="office">Office</SelectItem>
              <SelectItem value="conference">Conference Room</SelectItem>
              <SelectItem value="auditorium">Auditorium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : room ? 'Update Room' : 'Add Room'}
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