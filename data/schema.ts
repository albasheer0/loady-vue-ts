import { z } from 'zod'
import { predefinedLocations } from './predefined'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>

// Driver schema with location validation to prevent numbers
export const driverSchema = z.object({
  id: z.string(),
  name: z.string()
    .min(1, "Name is required"),
  location: z.string()
    .min(1, "Location is required")
})

export type Driver = z.infer<typeof driverSchema>

// Define possible tour statuses
export const tourStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'] as const;
export type TourStatus = typeof tourStatuses[number];

// Tour schema with validation for assigned driver and status
export const tourSchema = z.object({
  id: z.string(),
  customerName: z.string()
    .min(1, "Customer name is required"),
  shipmentDate: z.string()
    .min(1, "Shipment date is required"),
  locationFrom: z.string()
    .min(1, "Pickup location is required"),
  locationTo: z.string()
    .min(1, "Delivery location is required"),
  driverId: z.string()
    .min(1, "Driver is required"),
  status: z.enum(tourStatuses).default('Scheduled'),
})

export type Tour = z.infer<typeof tourSchema>
