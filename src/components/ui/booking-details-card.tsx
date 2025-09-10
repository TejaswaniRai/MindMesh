'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { BookOpen, Clock, GraduationCap, User } from 'lucide-react'

interface BookingDetails {
  batchName: string
  timeSlot: string
  lectureName: string
  teacherName?: string
  courseName?: string
  date: string
}

interface BookingDetailsCardProps {
  roomNumber: string
  booking: BookingDetails
}

export function BookingDetailsCard({ roomNumber, booking }: BookingDetailsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-4 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{roomNumber}</h3>
        <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-sm border border-red-500/30">
          Booked
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-white/80 space-x-2">
          <Clock className="w-4 h-4" />
          <span>{booking.timeSlot}</span>
        </div>

        <div className="flex items-center text-white/80 space-x-2">
          <GraduationCap className="w-4 h-4" />
          <span>{booking.batchName}</span>
        </div>

        {booking.teacherName && (
          <div className="flex items-center text-white/80 space-x-2">
            <User className="w-4 h-4" />
            <span>{booking.teacherName}</span>
          </div>
        )}

        {booking.courseName && (
          <div className="flex items-center text-white/80 space-x-2">
            <BookOpen className="w-4 h-4" />
            <span>{booking.courseName}</span>
          </div>
        )}

        <div className="flex items-center text-white/60 space-x-2 text-sm">
          <span>{format(new Date(booking.date), 'MMMM d, yyyy')}</span>
        </div>
      </div>
    </motion.div>
  )
}
