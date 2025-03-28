"use client"

import { useState } from "react"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import BookingForm from "@/components/booking-form"
import BookingList from "@/components/booking-list"
import type { Booking } from "@/lib/types"
import { Toaster } from "sonner"

export default function BookingsPage() {
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking)
  }

  const handleCancelEdit = () => {
    setEditingBooking(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster richColors />
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
              initialData={editingBooking}
              onCancel={handleCancelEdit}
            />
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm animate-fade-in-delay">
            <h2 className="text-2xl font-light mb-6 tracking-wide">
              UPCOMING <span className="font-medium">APPOINTMENTS</span>
            </h2>
            <BookingList onEditBooking={handleEditBooking} />
          </div>
        </div>
      </div>
    </div>
  )
}