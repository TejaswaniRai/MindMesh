'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  ExternalLink, 
  X, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  File,
  Loader2
} from 'lucide-react'
import { Button } from './button'
import { StudyMaterial } from '@/types/study-material'

interface FileViewerModalProps {
  material: StudyMaterial | null
  isOpen: boolean
  onClose: () => void
  onDownload: (material: StudyMaterial) => void
}

export function FileViewerModal({ material, isOpen, onClose, onDownload }: FileViewerModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  if (!material || !isOpen) return null

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return File
    if (fileType.includes('image')) return FileImage
    if (fileType.includes('video')) return FileVideo
    if (fileType.includes('audio')) return FileAudio
    return FileText
  }

  const FileIcon = getFileIcon(material.fileType)
  const isImage = material.fileType.includes('image')
  const isPdf = material.fileType.includes('pdf')
  const canPreview = isImage || isPdf

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      await onDownload(material)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-6 w-6 text-blue-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {material.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(material.fileSize / 1024 / 1024).toFixed(2)} MB • {material.fileType}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(material.fileUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
              {canPreview ? (
                <div className="h-full">
                  {isPdf ? (
                    <iframe
                      src={material.fileUrl}
                      className="w-full h-full border-0 rounded-lg"
                      title={material.title}
                    />
                  ) : isImage ? (
                    <div className="flex items-center justify-center h-full">
                      <img
                        src={material.fileUrl}
                        alt={material.title}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        onError={(e) => {
                          console.error('Image load error:', e)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FileIcon className="h-24 w-24 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Preview not available
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                    This file type cannot be previewed in the browser. 
                    You can download the file or open it in a new tab.
                  </p>
                  <div className="flex space-x-3">
                    <Button onClick={handleDownload} disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download File
                    </Button>
                    <Button variant="outline" onClick={() => window.open(material.fileUrl, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open in new tab
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
