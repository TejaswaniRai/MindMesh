'use client'

import { useState } from 'react'
import { SubjectForm } from '@/components/ui/subject-form'
import { SubjectList } from '@/components/ui/subject-list'
import { Subject } from '@/types/faculty-management'

export default function SubjectsPage() {
  const [editingSubject, setEditingSubject] = useState<Subject | undefined>(undefined)
  
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  const handleFormSuccess = () => {
    setEditingSubject(undefined)
  }
  
  const handleCancelEdit = () => {
    setEditingSubject(undefined)
  }
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Subject Management</h1>
      </div>
      
      <SubjectForm 
        subject={editingSubject} 
        onSuccess={handleFormSuccess} 
        onCancel={handleCancelEdit}
      />
      
      <SubjectList onEdit={handleEditSubject} />
    </div>
  )
}