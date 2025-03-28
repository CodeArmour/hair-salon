"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Booking } from "@/lib/types"

interface BookingFormProps {
  onSubmit: (booking: Booking) => void
  initialData: Booking | null
  onCancel: () => void
}

export default function BookingForm({ onSubmit, initialData, onCancel }: BookingFormProps) {
  const [formData, setFormData] = useState<Omit<Booking, "id">>({
    clientName: "",
    phoneNumber: "",
    date: "",
    time: "",
    stylist: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load initial data when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        clientName: initialData.clientName,
        phoneNumber: initialData.phoneNumber,
        date: initialData.date,
        time: initialData.time,
        stylist: initialData.stylist,
      })
    }
  }, [initialData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientName.trim()) {
      newErrors.clientName = "Client name is required"
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\+?[0-9\s-()]{8,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    } else {
      // Check if the selected date is a Sunday
      const selectedDate = new Date(formData.date)
      if (selectedDate.getDay() === 0) {
        // 0 is Sunday
        newErrors.date = "The salon is closed on Sundays"
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required"
    } else {
      // Check if the selected time is within working hours (8 AM - 8 PM)
      const hour = Number.parseInt(formData.time.split(":")[0])
      if (hour < 8 || hour >= 20) {
        newErrors.time = "The salon is open from 8 AM to 8 PM"
      }
    }

    if (!formData.stylist) {
      newErrors.stylist = "Stylist is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      if (initialData) {
        onSubmit({ ...formData, id: initialData.id })
      } else {
        onSubmit(formData as Booking)
      }

      // Reset form if not editing
      if (!initialData) {
        setFormData({
          clientName: "",
          phoneNumber: "",
          date: "",
          time: "",
          stylist: "",
        })
      }
    }
  }

  // Generate time options from 8 AM to 8 PM
  const timeOptions = Array.from({ length: 25 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8
    const minute = i % 2 === 0 ? "00" : "30"
    if (hour < 20) {
      return `${hour.toString().padStart(2, "0")}:${minute}`
    }
    return null
  }).filter(Boolean) as string[]

  // List of stylists
  const stylists = ["Emma", "Sophie", "Thomas", "Lukas", "Marie"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          className={errors.clientName ? "border-red-500" : ""}
        />
        {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          className={errors.phoneNumber ? "border-red-500" : ""}
        />
        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          min={new Date().toISOString().split("T")[0]}
          className={errors.date ? "border-red-500" : ""}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Select value={formData.time} onValueChange={(value) => handleSelectChange("time", value)}>
          <SelectTrigger className={errors.time ? "border-red-500" : ""}>
            <SelectValue placeholder="Select time" />
          </SelectTrigger>
          <SelectContent>
            {timeOptions.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.time && <p className="text-red-500 text-sm">{errors.time}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="stylist">Stylist</Label>
        <Select value={formData.stylist} onValueChange={(value) => handleSelectChange("stylist", value)}>
          <SelectTrigger className={errors.stylist ? "border-red-500" : ""}>
            <SelectValue placeholder="Select stylist" />
          </SelectTrigger>
          <SelectContent>
            {stylists.map((stylist) => (
              <SelectItem key={stylist} value={stylist}>
                {stylist}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.stylist && <p className="text-red-500 text-sm">{errors.stylist}</p>}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1">
          {initialData ? "Update Booking" : "Add Booking"}
        </Button>
        {initialData && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

