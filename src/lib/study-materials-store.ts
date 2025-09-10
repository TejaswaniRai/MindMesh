import { create } from 'zustand'
import { StudyMaterial } from '@/types/study-material'

interface StudyMaterialInput extends Omit<StudyMaterial, 'id' | 'uploadedAt'> {
  file?: File
}

interface StudyMaterialsStore {
  materials: StudyMaterial[]
  addMaterial: (material: StudyMaterialInput) => Promise<void>
  deleteMaterial: (id: string) => Promise<void>
  updateMaterial: (id: string, updates: Partial<StudyMaterial>) => Promise<void>
  getMaterialsBySubject: (subjectId: string) => StudyMaterial[]
  fetchMaterials: () => Promise<void>
}

const createFileUrl = (file: File): string => {
  return URL.createObjectURL(file)
}

// Simple dummy PDF URL - just a placeholder
const createDummyPdfUrl = () => {
  return 'dummy-pdf-sample'
}

const sampleMaterials: StudyMaterial[] = [
  {
    id: '1',
    title: 'Introduction to React',
    description: 'Complete guide to React fundamentals and hooks',
    fileUrl: createDummyPdfUrl(),
    fileName: 'react-intro.pdf',
    fileType: 'application/pdf',
    fileSize: 2048576,
    uploadedBy: 'Dr. Sarah Johnson',
    uploadedAt: '2024-01-15T10:30:00Z',
    subject: 'Computer Science',
    batch: '2024'
  },
  {
    id: '2',
    title: 'JavaScript ES6+ Features',
    description: 'Modern JavaScript features and best practices',
    fileUrl: createDummyPdfUrl(),
    fileName: 'js-es6.pdf',
    fileType: 'application/pdf',
    fileSize: 1536000,
    uploadedBy: 'Prof. Mike Chen',
    uploadedAt: '2024-01-14T14:20:00Z',
    subject: 'Programming',
    batch: '2024'
  },
  {
    id: '3',
    title: 'Database Design Principles',
    description: 'Fundamentals of database design and normalization',
    fileUrl: createDummyPdfUrl(),
    fileName: 'database-design.pdf',
    fileType: 'application/pdf',
    fileSize: 3072000,
    uploadedBy: 'Dr. Emily Davis',
    uploadedAt: '2024-01-13T09:15:00Z',
    subject: 'Database Systems',
    batch: '2024'
  },
  {
    id: '4',
    title: 'Machine Learning Basics',
    description: 'Introduction to ML algorithms and applications',
    fileUrl: createDummyPdfUrl(),
    fileName: 'ml-basics.pdf',
    fileType: 'application/pdf',
    fileSize: 4096000,
    uploadedBy: 'Dr. Alex Rodriguez',
    uploadedAt: '2024-01-12T16:45:00Z',
    subject: 'Artificial Intelligence',
    batch: '2024'
  },
  {
    id: '5',
    title: 'Web Development Best Practices',
    description: 'Modern web development techniques and tools',
    fileUrl: createDummyPdfUrl(),
    fileName: 'web-dev-practices.pdf',
    fileType: 'application/pdf',
    fileSize: 2560000,
    uploadedBy: 'Prof. Lisa Wang',
    uploadedAt: '2024-01-11T11:30:00Z',
    subject: 'Web Development',
    batch: '2024'
  }
]

export const useStudyMaterialsStore = create<StudyMaterialsStore>((set, get) => ({
  materials: sampleMaterials,
  
  addMaterial: async (materialData) => {
    try {
      let fileUrl = materialData.fileUrl
      
      if (materialData.file) {
        fileUrl = createFileUrl(materialData.file)
      }
      
      const newMaterial: StudyMaterial = {
        ...materialData,
        id: Date.now().toString(),
        uploadedAt: new Date().toISOString(),
        fileUrl,
      }
      
      set((state) => ({
        materials: [...state.materials, newMaterial]
      }))
    } catch (error) {
      console.error('Error adding material:', error)
      throw error
    }
  },
  
  deleteMaterial: async (id) => {
    try {
      set((state) => ({
        materials: state.materials.filter(material => material.id !== id)
      }))
    } catch (error) {
      console.error('Error deleting material:', error)
      throw error
    }
  },
  
  updateMaterial: async (id, updates) => {
    try {
      set((state) => ({
        materials: state.materials.map(material =>
          material.id === id ? { ...material, ...updates } : material
        )
      }))
    } catch (error) {
      console.error('Error updating material:', error)
      throw error
    }
  },
  
  getMaterialsBySubject: (subjectId) => {
    return get().materials.filter(material => material.subject === subjectId)
  },
  
  fetchMaterials: async () => {
    try {
      // Fetching materials from local state
    } catch (error) {
      console.error('Error fetching materials:', error)
      throw error
    }
  }
}))

export const addStudyMaterial = async (materialData: StudyMaterialInput) => {
  const store = useStudyMaterialsStore.getState()
  return store.addMaterial(materialData)
}

export const deleteStudyMaterial = async (id: string) => {
  const store = useStudyMaterialsStore.getState()
  return store.deleteMaterial(id)
}

export const deleteStudyMaterialById = async (id: string) => {
  const store = useStudyMaterialsStore.getState()
  return store.deleteMaterial(id)
}

export const updateStudyMaterial = async (id: string, updates: Partial<StudyMaterial>) => {
  const store = useStudyMaterialsStore.getState()
  return store.updateMaterial(id, updates)
}

export const getStudyMaterialsBySubject = (subjectId: string) => {
  const store = useStudyMaterialsStore.getState()
  return store.getMaterialsBySubject(subjectId)
}

export const getAllStudyMaterials = () => {
  const store = useStudyMaterialsStore.getState()
  return store.materials
}

export const getStudyMaterialById = (id: string) => {
  const store = useStudyMaterialsStore.getState()
  return store.materials.find(material => material.id === id)
}

export const fetchAllStudyMaterials = async () => {
  const store = useStudyMaterialsStore.getState()
  return store.fetchMaterials()
}