'use client'

import { Floor } from "@/types"
import { ClassroomCard } from "./classroom-card"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface FloorGridProps {
  floor: Floor
}

export function FloorGrid({ floor }: FloorGridProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Floor {floor.number}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floor.classrooms.map((classroom) => (
            <ClassroomCard key={classroom.roomNumber} classroom={classroom} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
