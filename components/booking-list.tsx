"use client"

import { useState, useEffect } from "react"
import type { Booking } from "@/lib/types"
import BookingItem from "@/components/booking-item"
import { fetchAppointments, deleteAppointment } from "@/actions/appointment-actions"
import { toast } from "sonner"

export default function BookingList({ onEditBooking }: { onEditBooking: (booking: Booking) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to load appointments
  const loadAppointments = async () => {
    try {
      setIsLoading(true)
      const fetchedAppointments = await fetchAppointments()
      setBookings(fetchedAppointments)
    } catch (error) {
      console.error("Failed to fetch appointments", error)
      toast.error("Failed to load appointments")
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load of appointments
  useEffect(() => {
    loadAppointments()
  }, [])

  // Function to handle deletion
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAppointment(id)
      toast.success(result.message)
      // Reload appointments after deletion to ensure consistent state
      await loadAppointments()
    } catch (error) {
      console.error("Failed to delete appointment", error)
      toast.error("Failed to delete appointment")
    }
  }

  // Listen for custom event to refresh appointments
  useEffect(() => {
    const handleAppointmentChange = () => {
      loadAppointments()
    }

    // Add event listener
    window.addEventListener('appointment-changed', handleAppointmentChange)

    // Cleanup listener
    return () => {
      window.removeEventListener('appointment-changed', handleAppointmentChange)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>Loading appointments...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No bookings yet. Add your first appointment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingItem
          key={booking.id}
          booking={booking}
          onEdit={() => onEditBooking(booking)}
          onDelete={() => handleDelete(booking.id)}
        />
      ))}
    </div>
  )
}