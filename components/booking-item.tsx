"use client"

import { useState, useEffect } from "react"
import type { Booking } from "@/lib/types"
import { formatDistanceToNow } from "date-fns"
import { Clock, Phone, Calendar, Scissors, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookingItemProps {
  booking: Booking
  onEdit: () => void
  onDelete: () => void
}

export default function BookingItem({ booking, onEdit, onDelete }: BookingItemProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("")
  const [isUpcoming, setIsUpcoming] = useState<boolean>(true)

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const appointmentDate = new Date(`${booking.date}T${booking.time}`)
      const now = new Date()

      if (appointmentDate > now) {
        setIsUpcoming(true)
        setTimeRemaining(formatDistanceToNow(appointmentDate, { addSuffix: true }))
      } else {
        setIsUpcoming(false)
        setTimeRemaining("Appointment has passed")
      }
    }

    calculateTimeRemaining()

    // Update time remaining every minute
    const interval = setInterval(calculateTimeRemaining, 60000)

    return () => clearInterval(interval)
  }, [booking])

  // Determine urgency level for styling
  const getUrgencyLevel = () => {
    if (!isUpcoming) return "past"

    const appointmentDate = new Date(`${booking.date}T${booking.time}`)
    const now = new Date()
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (hoursUntilAppointment <= 2) return "urgent"
    if (hoursUntilAppointment <= 24) return "soon"
    return "upcoming"
  }

  const urgencyLevel = getUrgencyLevel()

  const urgencyStyles = {
    urgent: "border-l-4 border-red-500",
    soon: "border-l-4 border-yellow-500",
    upcoming: "border-l-4 border-green-500",
    past: "border-l-4 border-gray-300 opacity-60",
  }

  const urgencyBadge = {
    urgent: <Badge className="bg-red-500">Within 2 hours</Badge>,
    soon: <Badge className="bg-yellow-500">Within 24 hours</Badge>,
    upcoming: <Badge className="bg-green-500">Upcoming</Badge>,
    past: <Badge className="bg-gray-400">Past</Badge>,
  }

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${urgencyStyles[urgencyLevel as keyof typeof urgencyStyles]}`}
    >
      <CardContent className="p-0">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-medium">{booking.clientName}</h3>
            <div className="flex items-center gap-2">
              {urgencyBadge[urgencyLevel as keyof typeof urgencyBadge]}
              <span className="text-sm text-gray-500">{timeRemaining}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              <span>{booking.phoneNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-gray-500" />
              <span>Stylist: {booking.stylist}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="flex items-center gap-1"
              disabled={!isUpcoming}
            >
              <Edit className="w-3 h-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

