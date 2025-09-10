'use client'


import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { format } from 'date-fns'
import { getCurrentTimeSlot, TIME_SLOTS, type TimeSlot, isStaffRoom } from '@/lib/schedule-store'
import { FloorView } from '@/components/ui/floor-view'
import { RoomBookingsModal } from '@/components/ui/room-bookings-modal'
import { ScheduleCalendar } from '@/components/ui/schedule-calendar'
import type { Floor, Room, RoomStatus } from '@/types/floor'

interface BookingDetails {
  batchName: string
  teacherName?: string
  courseName?: string
  date?: string
}

interface RoomSchedule {
  [timeSlot: string]: BookingDetails | null
}

interface DailySchedule {
  [roomNumber: string]: RoomSchedule
}

// Function to fetch schedule data
async function fetchSchedule(date: string): Promise<DailySchedule> {
  const response = await fetch(`/api/schedule?date=${date}`)
  if (!response.ok) throw new Error('Failed to fetch schedule')
  return response.json()
}

// Function to transform API data into floor data
function transformScheduleData(schedule: DailySchedule, currentSlot: string): Floor[] {
  const floors = Array.from({ length: 5 }, (_, i) => i + 1).map(floorNumber => {
    const rooms = Array.from({ length: 6 }, (_, j) => {
      const roomNumber = `CSE-${floorNumber}${(j + 1).toString().padStart(2, '0')}`
      const roomSchedule = schedule[roomNumber] || {}

      const isStaff = isStaffRoom(roomNumber)
      // Student behavior: occupied/free strictly for the selected time slot (or staff room)
      const bookingForSelected = (roomSchedule as any)[currentSlot as string] || null
      const isOccupiedAtSelected = isStaff || Boolean(bookingForSelected)
      
      return {
        roomNumber,
        status: (isOccupiedAtSelected ? 'occupied' : 'free') as RoomStatus,
        currentBooking: isStaff
          ? {
              batchName: '',
              timeSlot: '',
              lectureName: 'Teachers Department CSE-AI'
            }
          : bookingForSelected
            ? {
                batchName: (bookingForSelected as any).batchName,
                timeSlot: '',
                lectureName: (bookingForSelected as any).courseName || 'Lecture',
                teacherName: (bookingForSelected as any).teacherName,
                courseName: (bookingForSelected as any).courseName
              }
            : undefined
      }
    })

    return {
      number: floorNumber,
      rooms
    }
  })

  return floors
}

export default function StudentDashboard() {
  const currentTimeSlot = getCurrentTimeSlot()
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const formattedDate = format(selectedDate, 'yyyy-MM-dd')
  const [selectedRoomForModal, setSelectedRoomForModal] = useState<string | null>(null)
  const [facultySearch, setFacultySearch] = useState('')
  const [facultyDepartment, setFacultyDepartment] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot>(currentTimeSlot as TimeSlot)

  // Fetch schedule data with React Query
  const { data: scheduleData, error } = useQuery({
    queryKey: ['schedule', formattedDate],
    queryFn: () => fetchSchedule(formattedDate),
    refetchInterval: 5000 // Refetch every 5 seconds
  })

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading schedule: {error.message}
      </div>
    )
  }

  if (!scheduleData) {
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
          Loading...
        </motion.div>
      </div>
    )
  }

  const floors = transformScheduleData(scheduleData, selectedTimeSlot)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-950">
      {/* Timeline */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md p-4 border-b border-white/10">
        <div className="flex flex-wrap justify-between items-center gap-2 max-w-7xl mx-auto overflow-x-hidden">
          {TIME_SLOTS.map((slot) => (
            <motion.div
              key={slot}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                slot === selectedTimeSlot
                  ? 'bg-white/20 text-white'
                  : 'text-white/60 hover:text-white/80 cursor-pointer'
              }`}
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedTimeSlot(slot)}
            >
              {slot}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Faculty Search (moved to top) */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white/5 rounded-lg border border-white/10 p-4">
          <h2 className="text-xl font-semibold text-white mb-4">Faculty</h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              value={facultySearch}
              onChange={(e) => setFacultySearch(e.target.value)}
              placeholder="Search by name or email"
              className="flex-1 px-3 py-2 rounded bg-white text-black"
            />
            <select
              value={facultyDepartment}
              onChange={(e) => setFacultyDepartment(e.target.value)}
              className="px-3 py-2 rounded bg-white text-black"
            >
              <option value="">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="CSE-AI">CSE-AI</option>
              <option value="CS-DS">CS-DS</option>
            </select>
          </div>
          <StudentFacultyResults search={facultySearch} department={facultyDepartment} />
        </div>
      </div>

      {/* Date Picker */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center space-x-4">
          <ScheduleCalendar
            date={selectedDate}
            onSelect={(date) => setSelectedDate(date)}
          />
          <p className="text-white/60">
            Viewing schedule for {format(selectedDate, 'MMMM d, yyyy')}
          </p>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-end mb-6">
          <div className="bg-white/10 rounded-lg p-1 backdrop-blur-md">
            <button
              className="px-4 py-2 rounded-md text-sm bg-white/20 text-white cursor-default"
            >
              2D View
            </button>
          </div>
        </div>

        {/* Floors */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Floor Plans */}
          <div className="lg:col-span-2 space-y-8">
            {floors.map((floor) => (
              <FloorView
                key={floor.number}
                floor={floor}
                currentSlot={selectedTimeSlot as TimeSlot}
                view="2d"
                onRoomClick={(room) => setSelectedRoomForModal(room)}
              />
            ))}
          </div>

          {/* Booking Details removed to keep student/admin in sync */}
        </div>
      </div>
      {/* Room Bookings Modal */}
      {selectedRoomForModal && (
        <RoomBookingsModal
          isOpen={Boolean(selectedRoomForModal)}
          onClose={() => setSelectedRoomForModal(null)}
          roomNumber={selectedRoomForModal}
          roomSchedule={scheduleData?.[selectedRoomForModal] || null}
          isStaffRoom={isStaffRoom(selectedRoomForModal)}
        />
      )}

      
    </div>
  )
}

function StudentFacultyResults({ search, department }: { search: string; department: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['faculty', { search, department }],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (department) params.set('department', department)
      const res = await fetch(`/api/faculty?${params.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch faculty')
      return res.json() as Promise<Array<{
        id: string
        name: string
        email: string
        phone: string
      }>>
    }
  })

  if (!search.trim()) {
    return <p className="text-white/60">Type a teacher name or email to search.</p>
  }
  if (isLoading) return <p className="text-white/70">Loading...</p>
  if (error) return <p className="text-red-400">Error loading faculty.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(data || []).map((f) => (
        <div key={f.id} className="p-4 rounded-lg border border-white/10 bg-white/5 text-white">
          <h3 className="text-lg font-semibold">{f.name}</h3>
          <div className="mt-2 space-y-1 text-sm text-white/80">
            <p><strong>Email:</strong> {f.email}</p>
            <p><strong>Phone:</strong> {f.phone}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
