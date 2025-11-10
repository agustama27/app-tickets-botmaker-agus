import { createClient } from "@supabase/supabase-js"

if (!process.env.SUPABASE_URL) {
  throw new Error("SUPABASE_URL is required")
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required")
}

// Cliente de Supabase con service_role para operaciones del backend
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

// Tipos para las tablas
export type Role = "ADMIN" | "MANAGER" | "LEAD"
export type Status = "NEW" | "TRIAGED" | "IN_PROGRESS" | "WAITING_USER" | "RESOLVED" | "CLOSED"
export type Priority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"

export interface Area {
  id: string
  name: string
  created_at?: string
}

export interface Team {
  id: string
  name: string
  area_id?: string | null
  created_at?: string
}

export interface UserApp {
  id: string
  name: string
  email: string
  role: Role
  area_id?: string | null
  team_id?: string | null
  created_at?: string
}

export interface Contact {
  phone: string
  name?: string | null
  email?: string | null
  area_id?: string | null
  team_id?: string | null
  channel_id?: string | null
  chat_id?: string | null
  first_seen?: string | null
  last_seen?: string | null
  created_at?: string
}

export interface Ticket {
  id: string
  contact_phone?: string | null
  chat_id?: string | null
  channel_id?: string | null
  type?: string | null
  tag?: string | null
  status: Status
  priority: Priority
  area_id?: string | null
  team_id?: string | null
  assigned_user_id?: string | null
  opened_at: string
  closed_at?: string | null
  last_message_at?: string | null
  created_at?: string
}

export interface Message {
  id: string
  ticket_id: string
  direction: string
  text?: string | null
  media_url?: string | null
  botmaker_message_id?: string | null
  at: string
  created_at?: string
}

export interface TicketEvent {
  id: string
  ticket_id: string
  event_type: string
  payload?: any
  created_at: string
}

