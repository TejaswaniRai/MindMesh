'use client'

import { useEffect, useState } from 'react'
import { DashboardNav } from '@/components/layout/dashboard-nav'
import { UserRole } from '@/types'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    // In a real app, this would come from an auth context or API
    // For now, we'll determine based on the URL
    const isAdminPage = window.location.pathname.startsWith('/admin')
    const isFacultyPage = window.location.pathname.startsWith('/faculty')
    if (isAdminPage) {
      setUserRole('admin')
    } else if (isFacultyPage) {
      setUserRole('faculty')
    } else {
      setUserRole('student')
    }
  }, [])

  if (!userRole) {
    // Prevent hydration mismatch by not rendering until userRole is set on client
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-950">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Classroom Scheduler</h1>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-6">
        <DashboardNav userRole={userRole} />
        {children}
      </div>
    </div>
  )
}