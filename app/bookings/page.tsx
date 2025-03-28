"use client"

import { useState, useEffect } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import BookingForm from "@/components/booking-form"
import BookingList from "@/components/booking-list"
import type { Booking } from "@/lib/types"

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(() => {
    // Load bookings from localStorage on client side
    if (typeof window !== "undefined") {
      const savedBookings = localStorage.getItem("salonBookings")
      return savedBookings ? JSON.parse(savedBookings) : []
    }
    return []
  })

  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("salonBookings", JSON.stringify(bookings))
  }, [bookings])

  const handleAddBooking = (booking: Booking) => {
    setBookings([...bookings, { ...booking, id: Date.now().toString() }])
  }

  const handleUpdateBooking = (updatedBooking: Booking) => {
    setBookings(bookings.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)))
    setEditingBooking(null)
  }

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter((booking) => booking.id !== id))
  }

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
  }

  const handleCancelEdit = () => {
    setEditingBooking(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-sm animate-fade-in">
            <h2 className="text-2xl font-light mb-6 tracking-wide">
              {editingBooking ? "EDIT" : "NEW"} <span className="font-medium">BOOKING</span>
            </h2>
            <BookingForm
              onSubmit={editingBooking ? handleUpdateBooking : handleAddBooking}
              initialData={editingBooking}
              onCancel={handleCancelEdit}
            />
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm animate-fade-in-delay">
            <h2 className="text-2xl font-light mb-6 tracking-wide">
              UPCOMING <span className="font-medium">APPOINTMENTS</span>
            </h2>
            <BookingList bookings={bookings} onEdit={handleEditBooking} onDelete={handleDeleteBooking} />
          </div>
        </div>
      </div>
    </div>
  )
}

