import { NextRequest, NextResponse } from 'next/server'

// Simple dummy PDF URL - just a placeholder
const createDummyPdfUrl = () => {
  return 'dummy-pdf-sample'
}

let materials: any[] = [
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

export async function GET() {
  try {
    return NextResponse.json(materials)
  } catch (error) {
    console.error('Error fetching study materials:', error)
    return NextResponse.json(materials)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newMaterial = {
      ...body,
      id: Date.now().toString(),
      uploadedAt: new Date().toISOString()
    }
    
    materials.push(newMaterial)
    return NextResponse.json(newMaterial, { status: 201 })
  } catch (error) {
    console.error('Error creating study material:', error)
    return NextResponse.json(
      { error: 'Failed to create study material' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      )
    }
    
    const materialIndex = materials.findIndex(m => m.id === id)
    if (materialIndex === -1) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      )
    }
    
    materials.splice(materialIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting study material:', error)
    return NextResponse.json(
      { error: 'Failed to delete study material' },
      { status: 500 }
    )
  }
}
