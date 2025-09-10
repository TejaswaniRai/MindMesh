import { NextRequest, NextResponse } from 'next/server'
import { roomsStore } from '@/lib/rooms-store'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const room = await roomsStore.getById(id)
      if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 })
      }
      return NextResponse.json(room)
    }

    // Force initialization
    await roomsStore.initialize()
    const rooms = await roomsStore.getAll()
    
    // Removed noisy console log
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error in rooms GET route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.name || !body.number || !body.floor || !body.capacity || !body.type) {
      return NextResponse.json(
        { error: 'Missing required fields: name, number, floor, capacity, and type are required' },
        { status: 400 }
      )
    }

    const room = await roomsStore.add({
      name: body.name,
      number: body.number,
      floor: body.floor,
      capacity: body.capacity,
      type: body.type
    })

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Error in rooms POST route:', error)
    return NextResponse.json(
      { error: 'Failed to add room' },
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
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const updatedRoom = await roomsStore.update(id, body)

    if (!updatedRoom) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedRoom)
  } catch (error) {
    console.error('Error in rooms PATCH route:', error)
    return NextResponse.json(
      { error: 'Failed to update room' },
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
        { error: 'Room ID is required' },
        { status: 400 }
      )
    }

    const success = await roomsStore.delete(id)

    if (!success) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in rooms DELETE route:', error)
    return NextResponse.json(
      { error: 'Failed to delete room' },
      { status: 500 }
    )
  }
}