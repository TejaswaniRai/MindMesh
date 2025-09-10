'use client'

import { useState } from 'react'
import { Classroom } from '@/types'
import { Card, CardContent } from '../ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'

interface ClassroomCardProps {
  classroom: Classroom
}


export function ClassroomCard({ classroom }: ClassroomCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Card
        className="cursor-default relative bg-[#251C54] text-white hover:bg-[#2D225E] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {classroom.currentStatus === 'occupied' && (
          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-red-500" />
        )}
        <CardContent className="p-6">
          <div className="mb-3">
            <h3 className="text-lg font-semibold">{classroom.roomNumber}</h3>
          </div>
          {classroom.currentBooking ? (
            <div className="space-y-1 text-sm text-gray-200">
              <p>{classroom.currentBooking.batchName}</p>
              <p>{classroom.currentBooking.lectureName}</p>
              <p>{classroom.currentBooking.timeSlot}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-200">Available</p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{classroom.roomNumber} Schedule</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {classroom.bookings.map((booking) => (
              <div
                key={booking.id}
                className="p-4 rounded-lg bg-gray-50"
              >
                <p className="font-medium">{booking.timeSlot}</p>
                <p className="text-sm text-gray-600">{booking.batchName}</p>
                <p className="text-sm text-gray-600">{booking.lectureName}</p>
              </div>
            ))}
            {classroom.bookings.length === 0 && (
              <p className="text-center text-gray-500">No bookings for today</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
