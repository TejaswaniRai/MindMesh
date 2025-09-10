"use client"

import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getCurrentTimeSlot, TIME_SLOTS, isStaffRoom } from '@/lib/schedule-store'
import { BookingModal } from '@/components/ui/booking-modal'
import { useToast } from '@/components/ui/use-toast'
import { DashboardStats } from '@/components/ui/dashboard-stats'
import { FloorView } from '@/components/ui/floor-view'
import { RoomBookingsModal } from '@/components/ui/room-bookings-modal'
import type { Room, Floor } from '@/types/floor'

// Fetch schedule data
async function fetchSchedule(date?: string) {
  const url = date 
    ? `/api/schedule?date=${date}`
    : '/api/schedule'
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch schedule')
  return response.json()
}

interface BookingRequest {
  roomNumber: string
  timeSlot: string
  batchName: string
  date: string
  teacherName?: string
  courseName?: string
}

async function bookClassroom({ roomNumber, timeSlot, batchName, date, teacherName, courseName }: BookingRequest) {
  if (!date || (typeof date !== 'string' && !(date as any).toISOString)) {
    throw new Error('Invalid date value provided for booking')
  }
  const dateString = typeof date === 'string' ? date : (date as Date).toISOString()
  const response = await fetch('/api/schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ roomNumber, timeSlot, batchName, date: dateString, teacherName, courseName })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Failed to book classroom')
  }

  return response.json()
}

interface BookingDetails {
  batchName: string;
  teacherName?: string;
  courseName?: string;
}

interface DailySchedule {
  [roomNumber: string]: {
    [timeSlot in typeof TIME_SLOTS[number]]?: BookingDetails | null;
  };
}

interface Schedule extends DailySchedule {
  dates: {
    [date: string]: DailySchedule;
  };
}

export default function AdminDashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState('')
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const currentTimeSlot = getCurrentTimeSlot() as typeof TIME_SLOTS[number]
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<typeof TIME_SLOTS[number]>(currentTimeSlot)

  // Set selectedDate on client to avoid hydration mismatch
  React.useEffect(() => {
    if (selectedDate === null) {
      setSelectedDate(new Date())
    }
  }, [selectedDate])

  // Helper to get next 7 weekdays dates as strings YYYY-MM-DD
  const getNextWeekdays = () => {
    const dates: string[] = []
    let date = new Date()
    while (dates.length < 7) {
      const day = date.getDay()
      if (day !== 0 && day !== 6) {
        dates.push(date.toISOString().split('T')[0])
      }
      date = new Date(date.getTime() + 24 * 60 * 60 * 1000)
    }
    return dates
  }

  const nextWeekdays = getNextWeekdays()

  // Fetch schedules for next 7 weekdays
  const schedulesQueries = useQueries({
    queries: nextWeekdays.map(dateStr => ({
      queryKey: ['schedule', dateStr],
      queryFn: () => fetchSchedule(dateStr),
      staleTime: 1000 * 60 * 5 // 5 minutes cache
    }))
  })

  // Aggregate upcoming bookings from multiple dates
  const upcomingBookings = useMemo(() => {
    const bookings: {
      room: string
      time: string
      batch: string
      date: string
    }[] = []

    schedulesQueries.forEach((query, idx) => {
      if (query.data) {
        const dateStr = nextWeekdays[idx]
        const rooms = Object.entries(query.data as Record<string, Record<string, BookingDetails | null>>)
        rooms.forEach(([roomNumber, roomSchedule]) => {
          Object.entries(roomSchedule).forEach(([timeSlot, booking]) => {
            if (booking) {
              bookings.push({
                room: roomNumber,
                time: timeSlot,
                batch: (booking as BookingDetails).batchName,
                date: dateStr
              })
            }
          })
        })
      }
    })

    // Sort bookings by date and time slot
    bookings.sort((a, b) => {
      if (a.date === b.date) {
        return TIME_SLOTS.indexOf(a.time as typeof TIME_SLOTS[number]) - TIME_SLOTS.indexOf(b.time as typeof TIME_SLOTS[number])
      }
      return a.date.localeCompare(b.date)
    })

    return bookings.slice(0, 10) // Limit to 10 upcoming bookings
  }, [schedulesQueries, nextWeekdays])

  // Use selectedDate schedule for floorData
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  const selectedIndex = nextWeekdays.indexOf(selectedDateStr)
  const selectedSchedule = selectedIndex !== -1 ? schedulesQueries[selectedIndex]?.data : undefined

  const floorData: Floor[] = useMemo(() => {
    if (!selectedSchedule) return []

    return Array.from({ length: 5 }, (_, floor) => {
      const rooms = Array.from({ length: 6 }, (_, room) => {
        const roomNumber = `CSE-${floor + 1}${(room + 1).toString().padStart(2, '0')}`
        const roomSchedule = selectedSchedule[roomNumber] || {}

        const isStaff = isStaffRoom(roomNumber)
        // Admin/faculty behavior: availability strictly for the selected time slot
        const bookingForSelected = (roomSchedule as any)[selectedTimeSlot as string] || null
        const isOccupiedAtSelected = isStaff || Boolean(bookingForSelected)

        return {
          roomNumber,
          status: isOccupiedAtSelected ? 'occupied' : 'free' as Room['status'],
          currentBooking: isStaff
            ? {
                batchName: undefined as unknown as string,
                teacherName: undefined,
                courseName: undefined,
                timeSlot: '',
                lectureName: 'Teachers Department CSE-AI'
              }
            : bookingForSelected
              ? {
                  batchName: (bookingForSelected as any).batchName,
                  teacherName: (bookingForSelected as any).teacherName,
                  courseName: (bookingForSelected as any).courseName,
                  timeSlot: '',
                  lectureName: 'Lecture'
                }
              : undefined
        }
      })

      return {
        number: floor + 1,
        rooms
      }
    })
  }, [selectedSchedule, selectedTimeSlot])

  // Calculate dashboard stats
  const stats = useMemo(() => {
    if (!floorData.length) return null

    const rooms = floorData.flatMap(floor => floor.rooms)
    const freeRooms = rooms.filter(room => room.status === 'free').length
    const bookedRooms = rooms.filter(room => room.status === 'occupied').length

    return { freeRooms, bookedRooms, upcomingBookings }
  }, [floorData, upcomingBookings])

  // Handler to update selectedDate when clicking on upcoming booking
  const handleUpcomingBookingClick = (date: string) => {
    setSelectedDate(new Date(date))
  }

  // Mutation for booking
  const bookMutation = useMutation({
    mutationFn: bookClassroom,
    onSuccess: () => {
      // Invalidate all schedule queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['schedule'] })
      toast({
        title: 'Success',
        description: 'Classroom booked successfully'
      })
      setIsBookingModalOpen(false)
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      })
    }
  })

const handleBookingSubmit = (data: { roomNumber: string; timeSlot: string; batchName: string; date: string | Date; teacherName?: string; courseName?: string }) => {
    const bookingData = {
      ...data,
      date: typeof data.date === 'string' ? data.date : (data.date as Date).toISOString().split('T')[0] // Convert Date to YYYY-MM-DD string if Date object
    }
    bookMutation.mutate(bookingData)
  }

  const handleRoomClick = (roomNumber: string) => {
    setSelectedRoom(roomNumber)
    setSelectedRoomForModal(roomNumber)
  }

  if (!selectedSchedule || !stats || !selectedDate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-950 p-6">
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
          className="text-center text-white"
        >
          Loading...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-950">
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Timeline */}
        <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md p-4 border border-white/10 rounded-md">
          <div className="flex flex-wrap justify-between items-center gap-2 max-w-7xl mx-auto overflow-x-hidden">
            {TIME_SLOTS.map((slot) => (
              <motion.div
                key={slot}
                whileHover={{ scale: 1.05 }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  slot === selectedTimeSlot ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white/80 cursor-pointer'
                }`}
                onClick={() => setSelectedTimeSlot(slot)}
              >
                {slot}
              </motion.div>
            ))}
          </div>
        </div>
        {/* Date Picker */}
        <div className="flex justify-center">
          <div className="bg-white/10 backdrop-blur-xl rounded-lg p-4 border border-white/20 max-w-xs">
            <input
              type="date"
              className="w-full p-2 rounded bg-white text-black"
              value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
              min={typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : ''}
              onChange={(e) => {
                const date = new Date(e.target.value)
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                  setSelectedDate(date)
                }
              }}
              disabled={selectedDate === null}
            />
            <p className="text-xs text-white mt-1">Select a date (weekdays only)</p>
          </div>
        </div>

        {/* Dashboard Stats */}
        <DashboardStats freeRooms={stats?.freeRooms} bookedRooms={stats?.bookedRooms} />

        {/* Book a Classroom Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsBookingModalOpen(true)}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold"
          >
            Book a Classroom
          </button>
        </div>

        {/* Upcoming Bookings removed as regular classes drive availability */}

        {/* Floor Plans */}
        {floorData.map((floor) => (
          <FloorView
            key={floor.number}
            floor={floor}
            currentSlot={selectedTimeSlot}
            onRoomClick={handleRoomClick}
            view="2d"
          />
        ))}


        {/* Room Bookings Modal */}
        {selectedRoomForModal && (
          <RoomBookingsModal
            isOpen={Boolean(selectedRoomForModal)}
            onClose={() => setSelectedRoomForModal(null)}
            roomNumber={selectedRoomForModal}
            roomSchedule={selectedSchedule?.[selectedRoomForModal] || null}
            isStaffRoom={isStaffRoom(selectedRoomForModal)}
          />
        )}

        {/* Booking Modal */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookingSubmit}
          selectedRoom={selectedRoom}
          isPending={bookMutation.isPending}
        />
      </div>
    </div>
  )
}
