import { axiosInstance } from "./axios"
import {
  type User,
  UserSchema,
  type Area,
  AreaSchema,
  type Team,
  TeamSchema,
  type Ticket,
  TicketSchema,
  type TicketsResponse,
  TicketsResponseSchema,
  type Message,
  MessageSchema,
  type Contact,
  ContactSchema,
  type TicketFilters,
} from "@/types"

// Auth
export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await axiosInstance.post("/auth/login", { email, password })
    return data
  },
  logout: async () => {
    await axiosInstance.post("/auth/logout")
  },
  getSession: async (): Promise<{ user: User }> => {
    const { data } = await axiosInstance.get("/auth/session")
    return { user: UserSchema.parse(data.user) }
  },
}

// Areas & Teams
export const structureApi = {
  getAreas: async (): Promise<Area[]> => {
    const { data } = await axiosInstance.get("/api/areas")
    return z.array(AreaSchema).parse(data)
  },
  getTeams: async (areaId?: string): Promise<Team[]> => {
    const { data } = await axiosInstance.get("/api/teams", {
      params: areaId ? { areaId } : undefined,
    })
    return z.array(TeamSchema).parse(data)
  },
}

// Users
export const usersApi = {
  getSelf: async (): Promise<User> => {
    const { data } = await axiosInstance.get("/api/users/self")
    return UserSchema.parse(data)
  },
}

// Tickets
export const ticketsApi = {
  getTickets: async (filters: TicketFilters = {}): Promise<TicketsResponse> => {
    const { data } = await axiosInstance.get("/api/tickets", { params: filters })
    return TicketsResponseSchema.parse(data)
  },
  getTicket: async (id: string): Promise<Ticket> => {
    const { data } = await axiosInstance.get(`/api/tickets/${id}`)
    return TicketSchema.parse(data)
  },
  updateTicket: async (id: string, updates: Partial<Ticket>): Promise<Ticket> => {
    const { data } = await axiosInstance.patch(`/api/tickets/${id}`, updates)
    return TicketSchema.parse(data)
  },
  getMessages: async (ticketId: string): Promise<Message[]> => {
    const { data } = await axiosInstance.get(`/api/tickets/${ticketId}/messages`)
    return z.array(MessageSchema).parse(data)
  },
  replyToTicket: async (ticketId: string, text: string, attachments?: string[]): Promise<{ ok: boolean }> => {
    const { data } = await axiosInstance.post(`/api/tickets/${ticketId}/reply`, { text, attachments })
    return data
  },
}

// Contacts
export const contactsApi = {
  getContacts: async (): Promise<Contact[]> => {
    const { data } = await axiosInstance.get("/api/contacts")
    return z.array(ContactSchema).parse(data)
  },
}

import { z } from "zod"
