import { motion } from 'framer-motion'
import { Clock, Users, AlertTriangle } from 'lucide-react'
import { getCurrentTimeSlot } from '@/lib/schedule-store'

interface DashboardStatsProps {
  freeRooms: number
  bookedRooms: number
}

export function DashboardStats({ freeRooms, bookedRooms }: DashboardStatsProps) {
  const currentTimeSlot = getCurrentTimeSlot()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-md"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-500/20">
            <Users className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-400">Free Rooms</p>
            <h3 className="text-2xl font-bold text-blue-300">{freeRooms}</h3>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-md"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-red-500/20">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-400">Booked Rooms</p>
            <h3 className="text-2xl font-bold text-red-300">{bookedRooms}</h3>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="p-6 rounded-xl border border-white/20 bg-white/5 backdrop-blur-md"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 rounded-full bg-white/10">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">Current Slot</p>
            <h3 className="text-xl font-bold text-white">{currentTimeSlot}</h3>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
