"use client"

import { useState, useEffect, useOptimistic } from "react"
import type { Booking } from "@/lib/types"
import BookingItem from "@/components/booking-item"
import { fetchAppointments, createAppointment, updateAppointment, deleteAppointment } from "@/actions/appointment-actions"
import { toast } from "sonner"

export default function BookingList({ onEditBooking }: { onEditBooking: (booking: Booking) => void }) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Use optimistic updates for bookings
  const [optimisticBookings, addOptimisticBooking] = useOptimistic(
    bookings,
    (currentState, newBooking: Booking | { type: 'delete', id: string }) => {
      if ('type' in newBooking && newBooking.type === 'delete') {
        // Remove booking optimistically
        return currentState.filter(booking => booking.id !== newBooking.id)
      }
      
      // Add or update booking optimistically
      const existingBookingIndex = currentState.findIndex(b => b.id === (newBooking as Booking).id)
      
      if (existingBookingIndex !== -1) {
        // Update existing booking
        const updatedBookings = [...currentState]
        updatedBookings[existingBookingIndex] = newBooking as Booking
        return updatedBookings
      } else {
        // Add new booking
        return [...currentState, newBooking as Booking]
      }
    }
  )

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

  // Optimistic create/update appointment
  const handleCreateOrUpdateAppointment = async (booking: Booking, isUpdate: boolean = false) => {
    try {
      // Optimistically add/update the booking
      addOptimisticBooking(booking)

      const formData = new FormData()
      Object.entries(booking).forEach(([key, value]) => {
        if (key !== 'id') {
          formData.append(key, value)
        }
      })

      let result;
      if (isUpdate) {
        result = await updateAppointment(booking.id, formData)
      } else {
        result = await createAppointment(formData)
      }

      if (result.errors) {
        // Revert optimistic update if there are validation errors
        setBookings(currentBookings => 
          isUpdate 
            ? currentBookings 
            : currentBookings.filter(b => b.id !== booking.id)
        )
        toast.error(result.message || "Failed to save appointment")
      } else {
        // Update with the server-confirmed booking (in case of ID changes for new bookings)
        if (!isUpdate) {
          const newBooking = { ...booking, id: result.appointment.id }
          setBookings(currentBookings => 
            currentBookings.map(b => 
              b === booking ? newBooking : b
            )
          )
        }
        toast.success(result.message || "Appointment saved successfully")
      }
    } catch (error) {
      // Revert optimistic update on error
      setBookings(currentBookings => 
        isUpdate 
          ? currentBookings 
          : currentBookings.filter(b => b.id !== booking.id)
      )
      toast.error("An unexpected error occurred")
      console.error(error)
    }
  }

  // Function to handle deletion
  const handleDelete = async (id: string) => {
    try {
      // Optimistically remove the booking
      addOptimisticBooking({ type: 'delete', id })

      const result = await deleteAppointment(id)
      toast.success(result.message)
    } catch (error) {
      // Revert optimistic deletion
      setBookings(currentBookings => {
        // If the booking was already in the list, it will be added back
        const deletedBooking = bookings.find(b => b.id === id)
        return deletedBooking 
          ? [...currentBookings, deletedBooking] 
          : currentBookings
      })
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

  if (optimisticBookings.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No bookings yet. Add your first appointment!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {optimisticBookings.map((booking) => (
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