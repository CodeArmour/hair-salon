"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Booking } from "@/lib/types"
import { createAppointment, updateAppointment } from "@/actions/appointment-actions"
import { toast } from "sonner"

interface BookingFormProps {
  initialData?: Booking | null
  onCancel?: () => void
  onRefresh?: () => void  // New prop for refresh callback
}
export default function BookingForm({ initialData, onCancel,onRefresh }: BookingFormProps) {
  const [formData, setFormData] = useState<Omit<Booking, "id">>({
    clientName: "",
    phoneNumber: "",
    date: "",
    time: "",
    stylist: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    const formDataObject = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      formDataObject.append(key, value)
    })

    try {
      let result;
      if (initialData) {
        result = await updateAppointment(initialData.id, formDataObject)
      } else {
        result = await createAppointment(formDataObject)
      }

      if (result.errors) {
        setErrors(
          Object.fromEntries(
            Object.entries(result.errors).map(([key, value]) => [key, value[0]])
          )
        )
        toast.error(result.message || "Failed to save appointment")
      } else {
        toast.success(result.message || "Appointment saved successfully")
        
        // Trigger refresh if callback is provided
        onRefresh?.()
        
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
        
        // Close edit mode or modal
        onCancel?.()
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsSubmitting(false)
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
  const stylists = ["Tomi", "Norbi", "AbdulAllah", "Other"]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientName">Client Name</Label>
        <Input
          id="clientName"
          name="clientName"
          value={formData.clientName}
          onChange={handleChange}
          disabled={isSubmitting}
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
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : (initialData ? "Update Booking" : "Add Booking")}
        </Button>
        {initialData && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}