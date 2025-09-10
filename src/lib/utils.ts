import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Real file upload function that creates object URLs for local files
export async function uploadFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Create a local object URL for the actual uploaded file
      const objectUrl = URL.createObjectURL(file)
      resolve(objectUrl)
    }, 1000)
  })
}

// Helper function to check if a URL is a local object URL
export function isLocalObjectUrl(url: string): boolean {
  return url.startsWith('blob:') || url.startsWith('data:')
}

// Helper function to get file type from file name
export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  return extension || 'unknown'
}

// Helper function to check if URL is a mock URL
export function isMockUrl(url: string): boolean {
  return url.includes('cdn.nexathon.com') || url.includes('mock') || url.includes('demo') || url.includes('example')
}
