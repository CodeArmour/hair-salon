"use client"

import { useState, useEffect } from "react"
import type { Booking } from "@/lib/types"
import BookingItem from "@/components/booking-item"

interface BookingListProps {
  bookings: Booking[]
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
}

export default function BookingList({ bookings, onEdit, onDelete }: BookingListProps) {
  const [sortedBookings, setSortedBookings] = useState<Booking[]>([])

  // Sort bookings by date and time
  useEffect(() => {
    const sorted = [...bookings].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setSortedBookings(sorted)
  }, [bookings])

  if (sortedBookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No bookings yet. Add your first appointment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sortedBookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          onEdit={() => onEdit(booking)}
          onDelete={() => onDelete(booking.id)}
        />
      ))}
    </div>
  )
}

