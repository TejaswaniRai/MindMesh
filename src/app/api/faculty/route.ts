import { NextResponse } from 'next/server'
import { filterFaculty } from '@/lib/faculty'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = (searchParams.get('search') || '').toLowerCase().trim()
  const department = (searchParams.get('department') || '').toLowerCase().trim()

  const list = filterFaculty(search, department)
  return NextResponse.json(list)
}


