'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { 
  Download, 
  FileText, 
  Trash2, 
  Eye, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  File,
  FileSpreadsheet,
  Code,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { Button } from './button'
import { useToast } from './use-toast'
import { StudyMaterial } from '@/types/study-material'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog'

interface StudyMaterialListProps {
  isAdmin?: boolean
}

async function fetchStudyMaterials(): Promise<StudyMaterial[]> {
  const response = await fetch('/api/study-materials')
  if (!response.ok) throw new Error('Failed to fetch study materials')
  return response.json()
}

async function deleteStudyMaterial(id: string): Promise<{ success: boolean }> {
  const response = await fetch(`/api/study-materials?id=${id}`, {
    method: 'DELETE',
  })
  if (!response.ok) throw new Error('Failed to delete study material')
  return response.json()
}

const getFileIcon = (fileType: string) => {
  if (fileType.includes('pdf')) return File
  if (fileType.includes('image')) return FileImage
  if (fileType.includes('video')) return FileVideo
  if (fileType.includes('audio')) return FileAudio
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return FileSpreadsheet
  if (fileType.includes('text') || fileType.includes('document')) return FileText
  if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('python')) return Code
  return FileText
}

const getFileTypeColor = (fileType: string) => {
  if (fileType.includes('pdf')) return 'text-red-400'
  if (fileType.includes('image')) return 'text-green-400'
  if (fileType.includes('video')) return 'text-purple-400'
  if (fileType.includes('audio')) return 'text-blue-400'
  if (fileType.includes('spreadsheet') || fileType.includes('excel')) return 'text-emerald-400'
  if (fileType.includes('text') || fileType.includes('document')) return 'text-orange-400'
  if (fileType.includes('code')) return 'text-cyan-400'
  return 'text-gray-400'
}

const canPreview = (fileType: string) => {
  return fileType.includes('pdf') || 
         fileType.includes('image') || 
         fileType.includes('text') || 
         fileType.includes('document')
}

const isRealFile = (url: string) => {
  return url.startsWith('blob:') || url.startsWith('data:')
}

const isDummyFile = (url: string) => {
  return url === 'dummy-pdf-sample'
}

export function StudyMaterialList({ isAdmin = false }: StudyMaterialListProps) {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [previewMaterial, setPreviewMaterial] = useState<StudyMaterial | null>(null)

  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['studyMaterials'],
    queryFn: fetchStudyMaterials,
    staleTime: 1000 * 60 * 5
  })

  const deleteMutation = useMutation({
    mutationFn: deleteStudyMaterial,
    onSuccess: () => {
      toast({
        title: 'Study material deleted',
        description: 'The study material has been deleted successfully.',
      })
      queryClient.invalidateQueries({ queryKey: ['studyMaterials'] })
    },
    onError: (error: Error) => {
      toast({
        title: 'Deletion failed',
        description: error.message || 'Failed to delete study material',
      })
    }
  })

  const handleDownload = async (material: StudyMaterial) => {
    try {
      if (isRealFile(material.fileUrl)) {
        const link = document.createElement('a')
        link.href = material.fileUrl
        link.download = material.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast({
          title: 'Download started',
          description: `Downloading ${material.fileName}...`,
        })
      } else {
        toast({
          title: 'Sample file',
          description: 'This is a sample file for demonstration purposes.',
        })
      }
    } catch (error) {
      toast({
        title: 'Download failed',
        description: 'Could not download the file. Please try again.',
        variant: 'destructive'
      })
    }
  }

  const handlePreview = (material: StudyMaterial) => {
    setPreviewMaterial(material)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this study material?')) {
      deleteMutation.mutate(id)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleOpenInNewTab = (material: StudyMaterial) => {
    try {
      if (isRealFile(material.fileUrl)) {
        window.open(material.fileUrl, '_blank')
        toast({
          title: 'Opening file',
          description: 'Opening file in new tab...',
        })
      } else {
        toast({
          title: 'Sample file',
          description: 'This is a sample file for demonstration purposes.',
        })
      }
    } catch (error) {
      toast({
        title: 'File access failed',
        description: 'Could not open the file. Please try downloading it.',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 text-white">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="text-center"
        >
          Loading study materials...
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        Error loading study materials: {(error as Error).message}
      </div>
    )
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="p-6 text-center text-white/60">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-xl font-medium">No study materials available</h3>
        <p className="mt-2">
          {isAdmin 
            ? 'Upload study materials using the form above.'
            : 'Check back later for study materials from your instructors.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">
          {materials.length} Study Material{materials.length !== 1 ? 's' : ''}
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
          {materials.map((material) => {
            const FileIcon = getFileIcon(material.fileType)
            const fileTypeColor = getFileTypeColor(material.fileType)
            const canPreviewFile = canPreview(material.fileType)
            const isReal = isRealFile(material.fileUrl)
            const isDummy = isDummyFile(material.fileUrl)

            return (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg bg-white/10 ${fileTypeColor}`}>
                      <FileIcon className="h-6 w-6" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-medium truncate">{material.title}</h3>
                        {isReal && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center space-x-1 border border-green-500/30">
                            <File className="h-3 w-3" />
                            <span>Your File</span>
                          </span>
                        )}
                        {isDummy && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center space-x-1 border border-blue-500/30">
                            <FileText className="h-3 w-3" />
                            <span>Sample File</span>
                          </span>
                        )}
                      </div>
                      {material.description && (
                        <p className="mt-1 text-white/70 text-sm overflow-hidden" style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {material.description}
                        </p>
                      )}
                      
                      <div className="mt-2 flex flex-wrap gap-2 text-sm">
                        {material.subject && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs">
                            {material.subject}
                          </span>
                        )}
                        {material.batch && (
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs">
                            {material.batch}
                          </span>
                        )}
                        <span className={`px-2 py-1 bg-white/10 rounded-full text-xs ${fileTypeColor}`}>
                          {material.fileType.split('/')[1]?.toUpperCase() || material.fileType}
                        </span>
                        <span className="px-2 py-1 bg-white/10 rounded-full text-xs text-white/60">
                          {formatFileSize(material.fileSize)}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-xs text-white/50">
                        Uploaded by <span className="font-medium">{material.uploadedBy}</span> on {format(new Date(material.uploadedAt), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {canPreviewFile && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(material)}
                        className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-400"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(material)}
                      className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-green-500/20 hover:border-green-500/30 hover:text-green-400"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenInNewTab(material)}
                      className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-purple-500/20 hover:border-purple-500/30 hover:text-purple-400"
                      title="Open in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(material.id)}
                        className="h-8 w-8 p-0 bg-white/10 border-white/20 hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <Dialog open={!!previewMaterial} onOpenChange={() => setPreviewMaterial(null)}>
        <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>{previewMaterial?.title}</span>
              {previewMaterial && isRealFile(previewMaterial.fileUrl) && (
                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs flex items-center space-x-1 border border-green-500/30">
                  <File className="h-3 w-3" />
                  <span>Your File</span>
                </span>
              )}
              {previewMaterial && isDummyFile(previewMaterial.fileUrl) && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs flex items-center space-x-1 border border-blue-500/30">
                  <FileText className="h-3 w-3" />
                  <span>Sample File</span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {previewMaterial && (
            <div className="mt-4 h-[80vh]">
              {previewMaterial.fileType.includes('pdf') ? (
                <div className="h-full relative">
                  {isDummyFile(previewMaterial.fileUrl) ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white rounded-lg">
                      <div className="mb-6">
                        <File className="h-24 w-24 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sample PDF Document</h2>
                        <p className="text-gray-600 mb-4">This is a dummy PDF for demonstration purposes</p>
                      </div>
                      
                      <div className="bg-gray-50 p-6 rounded-lg max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Document Preview</h3>
                        <div className="text-left space-y-2 text-sm text-gray-600">
                          <p><strong>Title:</strong> {previewMaterial.title}</p>
                          <p><strong>Subject:</strong> {previewMaterial.subject}</p>
                          <p><strong>Batch:</strong> {previewMaterial.batch}</p>
                          <p><strong>File Size:</strong> {formatFileSize(previewMaterial.fileSize)}</p>
                          <p><strong>Uploaded by:</strong> {previewMaterial.uploadedBy}</p>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex space-x-3">
                        <Button onClick={() => handleDownload(previewMaterial)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleOpenInNewTab(previewMaterial)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in new tab
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full">
                      <iframe
                        src={`${previewMaterial.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                        className="w-full h-full border-0 rounded-lg"
                        title={previewMaterial.title}
                        style={{ 
                          minHeight: '600px',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : previewMaterial.fileType.includes('image') ? (
                <div className="flex justify-center h-full">
                  <img
                    src={previewMaterial.fileUrl}
                    alt={previewMaterial.title}
                    className="max-w-full max-h-full object-contain rounded-lg"
                    onError={() => {
                      toast({
                        title: 'Image load failed',
                        description: 'Could not load the image. Please try downloading it.',
                      })
                    }}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileText className="h-16 w-16 text-white/40 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                  <p className="text-white/60 mb-4">
                    This file type cannot be previewed in the browser.
                  </p>
                  <div className="flex space-x-2">
                    <Button onClick={() => handleDownload(previewMaterial)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" onClick={() => handleOpenInNewTab(previewMaterial)}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}