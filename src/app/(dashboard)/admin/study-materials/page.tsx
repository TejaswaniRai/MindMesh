'use client'

import { StudyMaterialUpload } from '@/components/ui/study-material-upload'
import { StudyMaterialList } from '@/components/ui/study-material-list'

export default function AdminStudyMaterialsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 to-purple-950 p-6">
      <h1 className="text-2xl font-bold mb-6">Study Materials Management</h1>
      
      <div className="grid grid-cols-1 gap-8">
        <StudyMaterialUpload />
        
        <div className="p-6 bg-white/5 rounded-lg border border-white/10">
          <StudyMaterialList isAdmin={true} />
        </div>
      </div>
    </div>
  )
}