'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { gsap } from 'gsap'

interface ClassroomStatusBadgeProps {
  status: 'free' | 'occupied' | 'extra'
}

const StatusBadge = ({ status }: ClassroomStatusBadgeProps) => {
  const badgeRef = React.useRef(null)

  useEffect(() => {
    if (!badgeRef.current) return

    if (status === 'free') {
      gsap.to(badgeRef.current, {
        scale: 1.1,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    } else if (status === 'occupied') {
      gsap.to(badgeRef.current, {
        keyframes: [
          { x: -2, duration: 0.1 },
          { x: 2, duration: 0.1 },
          { x: -2, duration: 0.1 }
        ],
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      })
    } else if (status === 'extra') {
      gsap.to(badgeRef.current, {
        opacity: 0.7,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
      })
    }
  }, [status])

  const badgeColors = {
    free: 'bg-green-500',
    occupied: 'bg-red-500',
    extra: 'bg-yellow-500'
  }

  return (
    <div
      ref={badgeRef}
      className={`w-3 h-3 rounded-full ${badgeColors[status]} shadow-glow-${status}`}
    />
  )
}

interface ClassroomCardProps {
  roomNumber: string
  status: 'free' | 'occupied' | 'extra'
  currentBooking?: {
    batchName: string
    lectureName: string
    timeSlot: string
    teacherName?: string
    courseName?: string
  }
  onClick?: () => void
}

export const ClassroomCard = ({ roomNumber, status, currentBooking, onClick }: ClassroomCardProps) => {
  const [hovered, setHovered] = React.useState(false)

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 p-4 cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">{roomNumber}</h3>
          <StatusBadge status={status} />
        </div>
        
        {currentBooking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-white/70 space-y-1"
          >
            <p>{currentBooking.batchName}</p>
            <p>{currentBooking.teacherName}</p>
            <p>{currentBooking.courseName}</p>
            <p>{currentBooking.lectureName}</p>
            {currentBooking.timeSlot && (
              <p className="text-xs">{currentBooking.timeSlot}</p>
            )}
          </motion.div>
        )}
      </div>

      {hovered && (
        <div className="absolute top-0 left-full ml-2 w-48 p-2 bg-gray-900 bg-opacity-90 rounded shadow-lg text-white text-xs z-50">
          <p>Room: {roomNumber}</p>
          <p>Status: {status}</p>
          {currentBooking && (
            <>
              <p>Batch: {currentBooking.batchName}</p>
              <p>Teacher: {currentBooking.teacherName}</p>
              <p>Course: {currentBooking.courseName}</p>
              <p>Lecture: {currentBooking.lectureName}</p>
              {currentBooking.timeSlot && (
                <p>Time: {currentBooking.timeSlot}</p>
              )}
            </>
          )}
        </div>
      )}

      {status === 'free' && (
        <motion.div
          className="absolute inset-0 bg-green-500/20"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0, 0.2, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      )}
    </motion.div>
  )
}
