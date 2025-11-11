-- Supabase Schema for App Tickets (Versión Segura - Idempotente)
-- Este script es seguro de ejecutar múltiples veces
-- Ejecutar este script en el SQL Editor de Supabase

-- Habilitar extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear tipos ENUM solo si no existen
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_type') THEN
    CREATE TYPE role_type AS ENUM ('ADMIN', 'MANAGER', 'LEAD');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_type') THEN
    CREATE TYPE status_type AS ENUM ('NEW', 'TRIAGED', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_type') THEN
    CREATE TYPE priority_type AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
  END IF;
END $$;

-- Tabla Areas
CREATE TABLE IF NOT EXISTS areas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Teams
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla UserApp (usuarios de la aplicación)
CREATE TABLE IF NOT EXISTS user_app (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role role_type NOT NULL,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Contacts (contactos de Botmaker)
CREATE TABLE IF NOT EXISTS contacts (
  phone TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  channel_id TEXT,
  chat_id TEXT,
  first_seen TIMESTAMP WITH TIME ZONE,
  last_seen TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Tickets
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_phone TEXT REFERENCES contacts(phone) ON DELETE SET NULL,
  chat_id TEXT,
  channel_id TEXT,
  type TEXT,
  tag TEXT,
  status status_type DEFAULT 'NEW',
  priority priority_type DEFAULT 'MEDIUM',
  area_id UUID REFERENCES areas(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  assigned_user_id UUID REFERENCES user_app(id) ON DELETE SET NULL,
  opened_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE,
  last_message_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  direction TEXT NOT NULL, -- 'inbound' o 'outbound'
  text TEXT,
  media_url TEXT,
  botmaker_message_id TEXT,
  at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla TicketEvents (eventos/historial de tickets)
CREATE TABLE IF NOT EXISTS ticket_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar rendimiento (solo si no existen)
CREATE INDEX IF NOT EXISTS idx_tickets_contact_phone ON tickets(contact_phone);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_chat_id ON tickets(chat_id);
CREATE INDEX IF NOT EXISTS idx_tickets_area_id ON tickets(area_id);
CREATE INDEX IF NOT EXISTS idx_tickets_team_id ON tickets(team_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned_user_id ON tickets(assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_messages_ticket_id ON messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_contacts_phone ON contacts(phone);
CREATE INDEX IF NOT EXISTS idx_user_app_email ON user_app(email);
CREATE INDEX IF NOT EXISTS idx_user_app_area_id ON user_app(area_id);
CREATE INDEX IF NOT EXISTS idx_user_app_team_id ON user_app(team_id);

