"use client"

import { useState, useEffect, useCallback } from "react"
import type { Booking } from "@/lib/types"
import BookingItem from "@/components/booking-item"
import { fetchAppointments, deleteAppointment } from "@/actions/appointment-actions"
import { toast } from "sonner"
import { Loader2, CalendarPlus } from "lucide-react"

export default function BookingList({ onEditBooking }: { onEditBooking: (booking: Booking) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Function to load appointments
  const loadAppointments = useCallback(async () => {
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
  }, [])

  // Initial load of appointments
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  // Function to handle deletion with immediate refresh
  const handleDelete = async (id: string) => {
    try {
      const result = await deleteAppointment(id)
      
      if (result.changed) {
        // Immediately reload appointments after successful deletion
        await loadAppointments()
        toast.success(result.message)
      } else {
        toast.error("Failed to delete appointment")
      }
    } catch (error) {
      console.error("Failed to delete appointment", error)
      toast.error("Failed to delete appointment")
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="text-lg font-semibold">Loading appointments...</p>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4 text-gray-500">
        <CalendarPlus className="h-12 w-12 opacity-50" />
        <p className="text-lg font-semibold">No bookings yet</p>
        <p className="text-sm text-gray-400">Add your first appointment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {bookings.map((booking) => (
        <div 
          key={booking.id} 
          className="transition-all duration-300 ease-in-out hover:scale-[1.01] hover:shadow-sm"
        >
          <BookingItem
            booking={booking}
            onEdit={() => onEditBooking(booking)}
            onDelete={() => handleDelete(booking.id)}
          />
        </div>
      ))}
    </div>
  )
}