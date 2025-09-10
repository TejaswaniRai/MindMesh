"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import { DayPicker } from 'react-day-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'
import { Button } from './button'
import { Label } from './label'
import { Input } from './input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { cn } from '@/lib/utils'
import { TIME_SLOTS } from '@/lib/schedule-store'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { 
    roomNumber: string
    timeSlot: string
    batchName: string
    teacherName?: string
    courseName?: string
    date: Date 
  }) => void
  selectedRoom?: string
  isPending?: boolean
}

const steps = [
  { title: 'Select Room', field: 'roomNumber' },
  { title: 'Select Date', field: 'date' },
  { title: 'Choose Time', field: 'timeSlot' },
  { title: 'Enter Details', field: 'batchName' }
] as const

export function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  selectedRoom,
  isPending = false
}: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(selectedRoom ? 1 : 0)
  const [formData, setFormData] = useState({
    roomNumber: selectedRoom || '',
    timeSlot: '',
    batchName: '',
    teacherName: '',
    courseName: '',
    date: null as Date | null
  })

  // Set date on client to avoid hydration mismatch
  React.useEffect(() => {
    if (formData.date === null) {
      setFormData((prev) => ({ ...prev, date: new Date() }))
    }
  }, [formData.date])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Ensure date is a Date object before submitting
      const submitData = {
        ...formData,
        date: formData.date instanceof Date ? formData.date : new Date(formData.date)
      }
      onSubmit(submitData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-xl border-white/20 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Book a Classroom</DialogTitle>
          <div className="relative h-2 bg-white/10 rounded-full mt-4">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 py-4"
          >
            {currentStep === 0 && (
              <div className="space-y-4">
                <Label htmlFor="room" className="text-white">Select Room</Label>
                <Select
                  value={formData.roomNumber}
                  onValueChange={(value) => setFormData({ ...formData, roomNumber: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, floor) => 
                      Array.from({ length: 6 }, (_, room) => {
                        const roomNumber = `CSE-${floor + 1}${(room + 1).toString().padStart(2, '0')}`
                        return (
                          <SelectItem key={roomNumber} value={roomNumber}>
                            {roomNumber}
                          </SelectItem>
                        )
                      })
                    ).flat()}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <Label htmlFor="date" className="text-white">Select Date</Label>
                <input
                  id="date"
                  type="date"
                  min={typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : ''}
                  className="w-full p-2 rounded-md bg-white/10 border border-white/20 text-white"
                  value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : formData.date || ''}
                  onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                  disabled={formData.date === null}
                />
                <div className="text-sm text-blue-300">
                  * You can only book on weekdays for future dates
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <Label htmlFor="timeSlot" className="text-white">Choose Time Slot</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <motion.button
                      key={slot}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData({ ...formData, timeSlot: slot })}
                      className={`p-3 rounded-lg text-sm transition-colors ${
                        formData.timeSlot === slot
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {slot}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <Label htmlFor="batch" className="text-white">Batch Name</Label>
                <Input
                  id="batch"
                  value={formData.batchName}
                  onChange={(e) => setFormData({ ...formData, batchName: e.target.value })}
                  placeholder="e.g., AI-A"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Label htmlFor="teacher" className="text-white mt-4">Teacher Name</Label>
                <Input
                  id="teacher"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="e.g., Dr. Smith"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                <Label htmlFor="course" className="text-white mt-4">Course Name</Label>
                <Input
                  id="course"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  placeholder="e.g., AI Fundamentals"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={currentStep === 0 ? onClose : handleBack}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 0 && !formData.roomNumber) ||
              (currentStep === 1 && !formData.date) ||
              (currentStep === 2 && !formData.timeSlot) ||
              (currentStep === 3 && !formData.batchName) ||
              isPending
            }
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
          >
            {isPending ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
              />
            ) : currentStep === steps.length - 1 ? (
              'Book Room'
            ) : (
              'Next'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
