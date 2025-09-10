import { NextRequest, NextResponse } from 'next/server'
import { announcementsStore } from '@/lib/announcements-store'
import { z } from 'zod'

const replySchema = z.object({
  content: z.string().min(1, 'Reply content is required'),
  author: z.string().min(1, 'Author is required'),
  authorName: z.string().min(1, 'Author name is required')
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const validatedData = replySchema.parse(body)

    const announcement = await announcementsStore.getById(params.id)
    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 })
    }

    const reply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: validatedData.content,
      author: validatedData.author,
      authorName: validatedData.authorName,
      createdAt: new Date().toISOString()
    }

    if (!announcement.replies) {
      announcement.replies = []
    }

    announcement.replies.push(reply)
    await announcementsStore.update(params.id, { replies: announcement.replies })

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    console.error('Error adding reply:', error)
    return NextResponse.json({ error: 'Failed to add reply' }, { status: 500 })
  }
}
