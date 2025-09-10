'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserRole } from '@/types'

interface DashboardNavProps {
  userRole: UserRole
}

export function DashboardNav({ userRole }: DashboardNavProps) {
  const pathname = usePathname()
  
  const isAdmin = userRole === 'admin'
  const isStudent = userRole === 'student'
  const isFaculty = userRole === 'faculty'
  
  // Base links for all users
  const links = [
    {
      href: isAdmin ? '/admin' : isFaculty ? '/faculty' : '/student',
      label: 'Dashboard',
      active: pathname === (isAdmin ? '/admin' : isFaculty ? '/faculty' : '/student')
    },
    {
      href: isAdmin ? '/admin/announcements' : isFaculty ? '/faculty/announcements' : '/student/announcements',
      label: 'Announcements',
      active: pathname.includes('announcements')
    },
    {
      href: isAdmin ? '/admin/study-materials' : isFaculty ? '/faculty/study-materials' : '/student/study-materials',
      label: 'Study Materials',
      active: pathname.includes('study-materials')
    }
  ]
  
  // Faculty management links
  if (isFaculty) {
    links.push(
      {
        href: '/faculty/teachers',
        label: 'Teachers',
        active: pathname.includes('/faculty/teachers')
      },
      {
        href: '/faculty/subjects',
        label: 'Subjects',
        active: pathname.includes('/faculty/subjects')
      },
      {
        href: '/faculty/rooms',
        label: 'Rooms',
        active: pathname.includes('/faculty/rooms')
      },
      {
        href: '/faculty/floors',
        label: 'Floors',
        active: pathname.includes('/faculty/floors')
      }
    )
  }
  
  // Admin can also access faculty management
  if (isAdmin) {
    links.push({
      href: '/admin/faculty',
      label: 'Faculty Management',
      active: pathname.includes('/admin/faculty')
    })
  }
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mb-8">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            link.active
              ? "text-white"
              : "text-white/60 hover:text-white/80"
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
