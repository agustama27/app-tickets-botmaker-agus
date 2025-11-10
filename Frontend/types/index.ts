import { z } from "zod"

export const RoleSchema = z.enum(["ADMIN", "MANAGER", "LEAD"])
export const TicketStatusSchema = z.enum(["open", "pending", "in-progress", "on-hold", "resolved", "closed"])
export const TicketPrioritySchema = z.enum(["low", "medium", "high", "urgent"])

export type Role = z.infer<typeof RoleSchema>
export type TicketStatus = z.infer<typeof TicketStatusSchema>
export type TicketPriority = z.infer<typeof TicketPrioritySchema>

// Models
export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: RoleSchema,
  areaId: z.string().optional(),
  teamId: z.string().optional(),
  createdAt: z.date(),
})

export const AreaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
})

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  areaId: z.string(),
})

export const ContactSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  areaId: z.string().optional(),
  teamId: z.string().optional(),
  createdAt: z.date(),
})

export const TicketSchema = z.object({
  id: z.string(),
  subject: z.string(),
  description: z.string(),
  status: TicketStatusSchema,
  priority: TicketPrioritySchema,
  userId: z.string(),
  assignedToId: z.string().nullable(),
  areaId: z.string().optional(),
  teamId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  resolvedAt: z.date().optional(),
  closedAt: z.date().optional(),
})

export const MessageSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  userId: z.string(),
  content: z.string(),
  isInternal: z.boolean(),
  createdAt: z.date(),
})

// Infer types
export type User = z.infer<typeof UserSchema>
export type Area = z.infer<typeof AreaSchema>
export type Team = z.infer<typeof TeamSchema>
export type Contact = z.infer<typeof ContactSchema>
export type Ticket = z.infer<typeof TicketSchema>
export type Message = z.infer<typeof MessageSchema>

export const TicketsResponseSchema = z.object({
  items: z.array(TicketSchema),
  total: z.number(),
})

export type TicketsResponse = z.infer<typeof TicketsResponseSchema>

// Filters
export interface TicketFilters {
  status?: TicketStatus[]
  priority?: TicketPriority[]
  areaId?: string[]
  teamId?: string[]
  assignedToId?: string[]
  q?: string
  page?: number
  limit?: number
  scope?: "all" | "my-area" | "my-team" | "assigned-to-me"
}
