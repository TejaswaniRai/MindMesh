'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { extend } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { ClassroomCard } from './classroom-card'
import { TimeSlot } from '@/lib/schedule-store'

interface Room {
  roomNumber: string
  status: 'free' | 'occupied' | 'extra'
  currentBooking?: {
    batchName: string
    teacherName?: string
    courseName?: string
    lectureName: string
    timeSlot: string
  }
}

interface Floor {
  number: number
  rooms: Room[]
}

// 3D Floor Visualization with interactive selection and tooltip
const FloorModel = ({ rooms, onRoomSelect }: { rooms: Room[], onRoomSelect: (roomNumber: string) => void }) => {
  const { viewport, camera } = useThree()
  const [hoveredRoom, setHoveredRoom] = React.useState<string | null>(null)
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null)
  const groupRef = React.useRef<THREE.Group>(null)

  // Animate pulsing effect for free rooms
  useFrame(() => {
    if (!groupRef.current) return
    groupRef.current.children.forEach((child) => {
      const mesh = child as THREE.Mesh
      if (mesh.userData.status === 'free') {
        const scale = 1 + 0.1 * Math.sin(Date.now() / 300)
        mesh.scale.set(scale, 1, scale)
      } else {
        mesh.scale.set(1, 1, 1)
      }
    })
  })

  const handlePointerOver = (event: unknown, roomNumber: string) => {
    if (event && typeof (event as Event).stopPropagation === 'function') {
      (event as Event).stopPropagation()
    }
    setHoveredRoom(roomNumber)
  }

  const handlePointerOut = (event: unknown) => {
    if (event && typeof (event as Event).stopPropagation === 'function') {
      (event as Event).stopPropagation()
    }
    setHoveredRoom(null)
  }

  const handleClick = (roomNumber: string) => {
    setSelectedRoom(roomNumber)
    onRoomSelect(roomNumber)
  }

  return (
    <>
      <group ref={groupRef} position={[0, 0, 0]}>
        {/* Floor base */}
        <mesh position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>

        {/* Rooms */}
        {rooms.map((room, index) => {
          const row = Math.floor(index / 3)
          const col = index % 3
          const x = (col - 1) * 3
          const z = (row - 1) * 3

          const baseColor = room.status === 'free'
            ? '#4ade80'
            : room.status === 'occupied'
              ? '#ef4444'
              : '#eab308'

          const isHovered = hoveredRoom === room.roomNumber
          const isSelected = selectedRoom === room.roomNumber

          return (
            <group
              key={room.roomNumber}
              position={[x, 0, z]}
              onPointerOver={(e) => handlePointerOver(e, room.roomNumber)}
              onPointerOut={handlePointerOut}
              onClick={() => handleClick(room.roomNumber)}
              scale={isSelected ? 1.2 : 1}
            >
              <mesh userData={{ status: room.status }}>
                <boxGeometry args={[2.5, 0.1, 2.5]} />
                <meshStandardMaterial
                  color={isHovered ? '#60a5fa' : baseColor}
                  transparent
                  opacity={isHovered ? 1 : 0.7}
                />
              </mesh>
              <Text
                position={[0, 0.5, 0]}
                fontSize={0.3}
                color={isHovered ? '#60a5fa' : 'white'}
                anchorX="center"
                anchorY="middle"
              >
                {room.roomNumber}
              </Text>
            </group>
          )
        })}
      </group>

      {/* Tooltip */}
      {hoveredRoom && (
        <HtmlTooltip room={rooms.find(r => r.roomNumber === hoveredRoom)!} />
      )}
    </>
  )
}

// Tooltip component for 3D rooms
const HtmlTooltip = ({ room }: { room: Room }) => {
  return (
    <div className="absolute top-10 left-10 p-2 bg-gray-900 bg-opacity-90 rounded shadow-lg text-white text-xs z-50 pointer-events-none">
      <p>Room: {room.roomNumber}</p>
      <p>Status: {room.status}</p>
      {room.currentBooking && (
        <>
          <p>Batch: {room.currentBooking.batchName}</p>
          <p>Lecture: {room.currentBooking.lectureName}</p>
          <p>Time: {room.currentBooking.timeSlot}</p>
        </>
      )}
    </div>
  )
}

interface FloorViewProps {
  floor: Floor
  currentSlot: TimeSlot
  onRoomClick?: (roomNumber: string) => void
  view?: '2d' | '3d'
}

export const FloorView = ({ floor, currentSlot, onRoomClick, view = '2d' }: FloorViewProps) => {
  const [selectedRoom, setSelectedRoom] = React.useState<string | null>(null)

  const handleRoomSelect = (roomNumber: string) => {
    setSelectedRoom(roomNumber)
    onRoomClick?.(roomNumber)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-md border border-white/10 p-6 relative"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Floor {floor.number}</h2>
        <p className="text-white/60">Current Time: {currentSlot}</p>
      </div>

      {view === '3d' ? (
        <div className="h-[500px] rounded-lg overflow-hidden relative">
          <Canvas
            camera={{ position: [0, 10, 10], fov: 50 }}
            className="w-full h-full"
          >
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <FloorModel rooms={floor.rooms} onRoomSelect={handleRoomSelect} />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {floor.rooms.map((room) => (
            <ClassroomCard
              key={room.roomNumber}
              {...room}
              onClick={() => handleRoomSelect(room.roomNumber)}
            />
          ))}
        </div>
      )}

      {/* Removed fixed position selected room tooltip as per user request */}
      {/* {selectedRoom && (
        <div className="absolute bottom-4 right-4 p-4 bg-gray-900 bg-opacity-90 rounded shadow-lg text-white text-sm z-50">
          Selected Room: {selectedRoom}
        </div>
      )} */}
    </motion.div>
  )
}
