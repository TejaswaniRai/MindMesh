'use client'

import { useState } from 'react'
import { TeacherForm } from '@/components/ui/teacher-form'
import { TeacherList } from '@/components/ui/teacher-list'
import { Teacher } from '@/types/faculty-management'

export default function TeachersPage() {
  const [editingTeacher, setEditingTeacher] = useState<Teacher | undefined>(undefined)
  
  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleFormSuccess = () => {
    setEditingTeacher(undefined)
  }
  
  const handleCancelEdit = () => {
    setEditingTeacher(undefined)
  }
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Teacher Management</h1>
      </div>
      
      <TeacherForm 
        teacher={editingTeacher} 
        onSuccess={handleFormSuccess} 
        onCancel={handleCancelEdit}
      />
      
      <TeacherList onEdit={handleEditTeacher} />
    </div>
  )
}