'use server'

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Dispatch client-side event for appointment changes
function dispatchAppointmentChangeEvent() {
  // This function will be handled differently on the client side
  return { changed: true }
}

// Validation schema
const AppointmentSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  phoneNumber: z.string().regex(/^\+?[0-9\s-()]{8,}$/, "Invalid phone number"),
  date: z.string().refine(val => {
    const date = new Date(val)
    return date.getDay() !== 0 // Not Sunday
  }, "Invalid date"),
  time: z.string().refine(val => {
    const [hours] = val.split(':').map(Number)
    return hours >= 8 && hours < 20 // Between 8 AM and 8 PM
  }, "Invalid time"),
  stylist: z.string().min(1, "Stylist is required")
})

// Create Appointment Action
export async function createAppointment(formData: FormData) {
  const validatedFields = AppointmentSchema.safeParse({
    clientName: formData.get('clientName'),
    phoneNumber: formData.get('phoneNumber'),
    date: formData.get('date'),
    time: formData.get('time'),
    stylist: formData.get('stylist')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to create appointment'
    }
  }

  const { clientName, phoneNumber, date, time, stylist } = validatedFields.data

  try {
    const newAppointment = await db.appointment.create({
      data: {
        clientname: clientName,
        clientphone: phoneNumber,
        date: new Date(`${date}T${time}`),
        time: new Date(`${date}T${time}`),
        stylists: stylist
      }
    })

    // Dispatch event for client-side update
    const result = dispatchAppointmentChangeEvent()

    revalidatePath('/appointments')
    return { 
      message: 'Appointment created successfully',
      appointment: {
        id: newAppointment.id,
        clientName,
        phoneNumber,
        date,
        time,
        stylist
      },
      changed: result.changed
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Failed to create appointment',
      errors: {}
    }
  }
}

// Update Appointment Action
export async function updateAppointment(id: string, formData: FormData) {
  const validatedFields = AppointmentSchema.safeParse({
    clientName: formData.get('clientName'),
    phoneNumber: formData.get('phoneNumber'),
    date: formData.get('date'),
    time: formData.get('time'),
    stylist: formData.get('stylist')
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to update appointment'
    }
  }

  const { clientName, phoneNumber, date, time, stylist } = validatedFields.data

  try {
    await db.appointment.update({
      where: { id },
      data: {
        clientname: clientName,
        clientphone: phoneNumber,
        date: new Date(`${date}T${time}`),
        time: new Date(`${date}T${time}`),
        stylists: stylist
      }
    })

    // Dispatch event for client-side update
    const result = dispatchAppointmentChangeEvent()

    revalidatePath('/appointments')
    return { 
      message: 'Appointment updated successfully',
      appointment: {
        id,
        clientName,
        phoneNumber,
        date,
        time,
        stylist
      },
      changed: result.changed
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Failed to update appointment',
      errors: {}
    }
  }
}

// Delete Appointment Action
export async function deleteAppointment(id: string) {
  try {
    await db.appointment.delete({
      where: { id }
    })

    // Dispatch event for client-side update
    const result = dispatchAppointmentChangeEvent()

    revalidatePath('/appointments')
    return { 
      message: 'Appointment deleted successfully',
      changed: result.changed 
    }
  } catch (error) {
    console.error('Database Error:', error)
    return {
      message: 'Failed to delete appointment',
      errors: {}
    }
  }
}

// Fetch Appointments Action
export async function fetchAppointments() {
  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        date: 'asc'
      }
    })

    return appointments.map(app => ({
      id: app.id,
      clientName: app.clientname,
      phoneNumber: app.clientphone,
      date: app.date.toISOString().split('T')[0],
      time: app.date.toTimeString().slice(0, 5),
      stylist: app.stylists
    }))
  } catch (error) {
    console.error('Database Error:', error)
    return []
  }
}