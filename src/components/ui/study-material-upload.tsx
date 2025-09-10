'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, X } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Label } from './label'
import { useToast } from './use-toast'

interface StudyMaterialUploadProps {
  onSuccess?: () => void
}

export function StudyMaterialUpload({ onSuccess }: StudyMaterialUploadProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState('')
  const [batch, setBatch] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Mock file upload function (in a real app, this would upload to a storage service)
  const uploadFile = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Return a mock URL - in a real app, this would be the URL from your storage service
    return `https://example.com/files/${file.name}`
  }

  // Mutation for uploading study material
  const uploadMutation = useMutation({
    mutationFn: async (data: {
      title: string
      description: string
      file: File
      subject?: string
      batch?: string
    }) => {
      setIsUploading(true)
      try {
        // First upload the file
        const fileUrl = await uploadFile(data.file)
        
        // Then create the study material record
        const response = await fetch('/api/study-materials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            fileUrl,
            fileName: data.file.name,
            fileType: data.file.type,
            fileSize: data.file.size,
            uploadedBy: 'Admin', // In a real app, this would be the current user
            subject: data.subject,
            batch: data.batch
          })
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to upload study material')
        }

        return response.json()
      } finally {
        setIsUploading(false)
      }
    },
    onSuccess: () => {
      // Reset form
      setTitle('')
      setDescription('')
      setSubject('')
      setBatch('')
      setFile(null)
      
      // Show success toast
      toast({
        title: 'Study material uploaded',
        description: 'The study material has been uploaded successfully.',
        variant: 'default',
      })
      
      // Invalidate query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['studyMaterials'] })
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess()
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload study material',
        variant: 'destructive',
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title || !file) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and select a file',
        variant: 'destructive',
      })
      return
    }
    
    uploadMutation.mutate({ title, description, file, subject, batch })
  }

  return (
    <div className="p-6 bg-white/5 rounded-lg border border-white/10">
      <h2 className="text-xl font-semibold mb-4">Upload Study Material</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
            className="bg-white/10 border-white/20 text-white"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            className="bg-white/10 border-white/20 text-white"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject (Optional)</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batch">Batch (Optional)</Label>
            <Input
              id="batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              placeholder="Enter batch"
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          {file ? (
            <div className="flex items-center justify-between p-2 bg-white/10 rounded border border-white/20">
              <span className="truncate max-w-[80%]">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setFile(null)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-center p-6 border border-dashed border-white/20 rounded-lg bg-white/5 cursor-pointer">
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-8 w-8 mb-2 text-white/60" />
                <span className="text-sm text-white/60">Click to select a file</span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
              </label>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isUploading || !title || !file}
        >
          {isUploading ? 'Uploading...' : 'Upload Material'}
        </Button>
      </form>
    </div>
  )
}