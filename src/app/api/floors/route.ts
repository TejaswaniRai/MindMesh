import { NextRequest, NextResponse } from 'next/server'
import { floorsStore } from '@/lib/floors-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      // Get a specific floor by ID
      const floor = await floorsStore.getById(id)
      if (!floor) {
        return NextResponse.json({ error: 'Floor not found' }, { status: 404 })
      }
      return NextResponse.json(floor)
    }

    // Get all floors
    const floors = await floorsStore.getAll()
    return NextResponse.json(floors)
  } catch (error) {
    console.error('Error in floors GET route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch floors' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.number || !body.building) {
      return NextResponse.json(
        { error: 'Missing required fields: name, number, and building are required' },
        { status: 400 }
      )
    }

    // Add the floor
    const floor = await floorsStore.add({
      name: body.name,
      number: body.number,
      building: body.building
    })

    return NextResponse.json(floor, { status: 201 })
  } catch (error) {
    console.error('Error in floors POST route:', error)
    return NextResponse.json(
      { error: 'Failed to add floor' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Floor ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updatedFloor = await floorsStore.update(id, body)

    if (!updatedFloor) {
      return NextResponse.json(
        { error: 'Floor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedFloor)
  } catch (error) {
    console.error('Error in floors PATCH route:', error)
    return NextResponse.json(
      { error: 'Failed to update floor' },
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
        { error: 'Floor ID is required' },
        { status: 400 }
      )
    }

    const success = await floorsStore.delete(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Floor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in floors DELETE route:', error)
    return NextResponse.json(
      { error: 'Failed to delete floor' },
      { status: 500 }
    )
  }
}