'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { BookOpen, Users, Home, Building2, Calendar } from 'lucide-react'

function DashboardCard({ 
  title, 
  count, 
  icon: Icon, 
  href, 
  color 
}: { 
  title: string
  count: number
  icon: any
  href: string
  color: string 
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -5, scale: 1.02 }}
        className={`p-6 rounded-xl border ${color} backdrop-blur-md cursor-pointer`}
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('/30', '/20')}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white/70">{title}</p>
            <h3 className="text-3xl font-bold text-white">{count}</h3>
            <p className="text-xs text-white/50">Sample Data</p>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

export default function FacultyDashboard() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
        <div className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/30">
          Sample Data Loaded
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Teachers"
          count={8}
          icon={Users}
          href="/faculty/teachers"
          color="border-blue-500/30 bg-blue-500/10"
        />
        
        <DashboardCard
          title="Subjects"
          count={10}
          icon={BookOpen}
          href="/faculty/subjects"
          color="border-purple-500/30 bg-purple-500/10"
        />
        
        <DashboardCard
          title="Rooms"
          count={10}
          icon={Home}
          href="/faculty/rooms"
          color="border-green-500/30 bg-green-500/10"
        />
        
        <DashboardCard
          title="Floors"
          count={6}
          icon={Building2}
          href="/faculty/floors"
          color="border-amber-500/30 bg-amber-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white">Sample Data Overview</h2>
          <p className="text-white/70 mb-4">
            The dashboard now shows sample data for demonstration purposes.
          </p>
          <div className="space-y-2 text-sm text-white/60">
            <p>• <strong className="text-blue-400">8 Teachers</strong> - Dr. Sarah Johnson, Prof. Michael Chen, etc.</p>
            <p>• <strong className="text-purple-400">10 Subjects</strong> - CS101, MATH101, DB101, etc.</p>
            <p>• <strong className="text-green-400">10 Rooms</strong> - Computer Labs, Lecture Halls, etc.</p>
            <p>• <strong className="text-amber-400">6 Floors</strong> - Different room types per floor</p>
          </div>
        </div>

        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
          <h2 className="text-xl font-semibold mb-4 text-white flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Sample Schedule
          </h2>
          <p className="text-white/70 mb-4">
            Today's classroom bookings and schedules.
          </p>
          <div className="space-y-2 text-sm text-white/60">
            <p>• <strong>Room 101:</strong> CS2024A - Dr. Sarah Johnson (09:00-10:00)</p>
            <p>• <strong>Room 102:</strong> DS2024A - Dr. Maria Garcia (10:00-11:00)</p>
            <p>• <strong>Room 201:</strong> CS2024C - Prof. David Thompson (09:00-10:00)</p>
            <p>• <strong>Room 301:</strong> AI2024A - Prof. Alex Rodriguez (14:00-15:00)</p>
          </div>
        </div>
      </div>
    </div>
  )
}