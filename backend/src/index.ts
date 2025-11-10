import express from "express"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"
import { supabase, type Ticket, type Contact, type Message, type UserApp } from "./lib/supabase"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
    credentials: true,
  },
})

app.use(
  cors({
    origin: (process.env.ALLOWED_ORIGINS || "").split(",").filter(Boolean),
    credentials: true,
  })
)
app.use(express.json())

const PORT = process.env.PORT || 8080

// Middleware para obtener usuario actual (simplificado - deberías usar JWT real)
async function getCurrentUser(req: express.Request): Promise<UserApp | null> {
  // TODO: Implementar autenticación real con JWT
  // Por ahora, obtener desde header o usar el primer usuario como mock
  const userId = req.headers["x-user-id"] as string | undefined
  
  if (userId) {
    const { data: user } = await supabase
      .from("user_app")
      .select("*")
      .eq("id", userId)
      .single()
    return user || null
  }
  
  // Mock: devolver primer usuario (solo para desarrollo)
  const { data: users } = await supabase.from("user_app").select("*").limit(1)
  return users && users.length > 0 ? users[0] : null
}

// Función para aplicar filtros según el rol del usuario
function applyRoleFilters(
  query: any,
  user: UserApp | null,
  scope?: string
): any {
  if (!user) {
    // Si no hay usuario, no devolver nada
    return query.eq("id", "00000000-0000-0000-0000-000000000000") // Query que no devuelve resultados
  }

  // Si el scope es "assigned-to-me", filtrar por usuario asignado
  if (scope === "assigned-to-me") {
    return query.eq("assigned_user_id", user.id)
  }

  // Si el scope es "my-team", filtrar por equipo
  if (scope === "my-team" && user.team_id) {
    return query.eq("team_id", user.team_id)
  }

  // Si el scope es "my-area", filtrar por área
  if (scope === "my-area" && user.area_id) {
    return query.eq("area_id", user.area_id)
  }

  // Aplicar filtros según rol
  switch (user.role) {
    case "ADMIN":
      // Administrador ve todos los tickets
      return query
    case "MANAGER":
      // Gerente ve tickets de su área
      if (user.area_id) {
        return query.eq("area_id", user.area_id)
      }
      return query
    case "LEAD":
      // Líder ve tickets de su equipo
      if (user.team_id) {
        return query.eq("team_id", user.team_id)
      }
      return query
    default:
      // Por defecto, no devolver nada
      return query.eq("id", "00000000-0000-0000-0000-000000000000")
  }
}

// Mapeo entre valores del frontend y base de datos
const statusMapToFrontend: Record<string, string> = {
  NEW: "open",
  TRIAGED: "pending",
  IN_PROGRESS: "in-progress",
  WAITING_USER: "on-hold",
  RESOLVED: "resolved",
  CLOSED: "closed",
}

const statusMapFromFrontend: Record<string, string> = {
  open: "NEW",
  pending: "TRIAGED",
  "in-progress": "IN_PROGRESS",
  "on-hold": "WAITING_USER",
  resolved: "RESOLVED",
  closed: "CLOSED",
}

const priorityMapToFrontend: Record<string, string> = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "urgent",
}

const priorityMapFromFrontend: Record<string, string> = {
  low: "LOW",
  medium: "MEDIUM",
  high: "HIGH",
  urgent: "CRITICAL",
}

// Función para transformar ticket de BD a formato frontend
function transformTicket(ticket: any, contact?: Contact | null, assignedTo?: UserApp | null) {
  return {
    id: ticket.id,
    status: statusMapToFrontend[ticket.status] || ticket.status,
    priority: priorityMapToFrontend[ticket.priority] || ticket.priority,
    subject: ticket.type || "Sin asunto",
    description: ticket.tag || "",
    userId: ticket.contact_phone || "",
    assignedToId: ticket.assigned_user_id || null,
    areaId: ticket.area_id || undefined,
    teamId: ticket.team_id || undefined,
    createdAt: ticket.opened_at,
    updatedAt: ticket.last_message_at || ticket.opened_at,
    resolvedAt: ticket.status === "RESOLVED" ? ticket.closed_at : undefined,
    closedAt: ticket.closed_at || undefined,
    contact: contact ? {
      phone: contact.phone,
      name: contact.name,
      email: contact.email,
    } : undefined,
    assignedTo: assignedTo ? {
      id: assignedTo.id,
      name: assignedTo.name,
      email: assignedTo.email,
    } : undefined,
  }
}

// Función para transformar mensaje de BD a formato frontend
function transformMessage(message: any, contactPhone?: string | null) {
  return {
    id: message.id,
    ticketId: message.ticket_id,
    userId: message.direction === "outbound" ? "system" : contactPhone || "",
    content: message.text || "",
    isInternal: message.direction === "outbound",
    createdAt: message.at,
  }
}

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true })
})

// Endpoint GET para verificar que el webhook está disponible (solo para testing)
app.get("/webhooks/botmaker", (req, res) => {
  res.json({ 
    message: "Webhook endpoint is active. Use POST method to send webhooks.",
    endpoint: "/webhooks/botmaker",
    method: "POST",
    requiredHeader: "x-bm-shared-secret"
  })
})

// Webhook Botmaker - Implementación completa
app.post("/webhooks/botmaker", async (req, res) => {
  // Aceptar el secret desde header, body, o usar auth-bm-token de Botmaker
  const secretFromHeader = req.headers["x-bm-shared-secret"]
  const secretFromBody = req.body?.secret || req.body?.bm_shared_secret
  const authBmToken = req.headers["auth-bm-token"] // Token de autenticación de Botmaker
  const secret = secretFromHeader || secretFromBody || authBmToken
  
  // Debug: Log headers recibidos (solo para debugging, remover en producción)
  console.log("Headers recibidos:", JSON.stringify(req.headers, null, 2))
  console.log("Secret recibido (header):", secretFromHeader ? "***presente***" : "no presente")
  console.log("Secret recibido (body):", secretFromBody ? "***presente***" : "no presente")
  console.log("Auth-BM-Token recibido:", authBmToken ? "***presente***" : "no presente")
  console.log("Secret esperado:", process.env.BM_SHARED_SECRET ? "***configurado***" : "NO CONFIGURADO")
  
  // Si no hay BM_SHARED_SECRET configurado, permitir acceso (solo para desarrollo)
  if (!process.env.BM_SHARED_SECRET) {
    console.log("⚠️ BM_SHARED_SECRET no configurado - permitiendo acceso sin autenticación")
  } else if (secret !== process.env.BM_SHARED_SECRET) {
    console.log("❌ Secret no coincide o falta")
    return res.status(401).json({ error: "Unauthorized" })
  }
  
  console.log("✅ Secret válido, procesando webhook...")

  try {
    // Remover el secret del body si está presente (para no guardarlo en logs)
    const payload = { ...req.body }
    if (payload.secret) delete payload.secret
    if (payload.bm_shared_secret) delete payload.bm_shared_secret
    
    console.log("Botmaker webhook received:", JSON.stringify(payload, null, 2))

    // Formato real de Botmaker:
    // - type: tipo de evento ("message", etc.)
    // - sessionId: ID de la sesión de chat
    // - chatChannelId: ID del canal
    // - whatsappNumber: número de teléfono
    // - contactId: ID del contacto
    // - messages: array de mensajes
    // - firstName, lastName: nombre del contacto
    // - variables: variables del flujo (puede contener area_id, team_id, email, etc.)

    const {
      type,
      sessionId,
      chatChannelId,
      whatsappNumber,
      contactId,
      messages,
      firstName,
      lastName,
      variables = {},
      customerId,
    } = payload

    // Mapear formato de Botmaker a formato interno
    const phone = whatsappNumber || contactId
    const chatId = sessionId
    const channelId = chatChannelId

    if (!phone || !chatId) {
      return res.status(400).json({ error: "Missing required fields: whatsappNumber/contactId, sessionId" })
    }

    // Extraer datos del contacto de las variables o del payload
    // Mapear variables de Botmaker a formato interno
    const contactFirstName = variables.contactFirstName || firstName
    const contactLastName = variables.contactLastName || lastName
    const contactEmail = variables.contactEmails || variables.contactEmail || variables.email
    const areaDeTrabajo = variables.areaDeTrabajo
    const puestoDeTrabajo = variables.puestoDeTrabajo
    
    const contactInfo = {
      name: variables.name || (contactFirstName && contactLastName 
        ? `${contactFirstName} ${contactLastName}`.trim() 
        : contactFirstName || contactLastName || undefined),
      email: contactEmail,
      area_id: variables.area_id, // Si viene como UUID directamente
      team_id: variables.team_id, // Si viene como UUID directamente
      areaDeTrabajo: areaDeTrabajo, // Nombre del área (para buscar por nombre)
      puestoDeTrabajo: puestoDeTrabajo, // Nombre del puesto/equipo (para buscar por nombre)
    }

    // Extraer tag/type de solicitud de las variables
    const tag = variables.tag || variables.tipo_solicitud || variables.request_type

    // Buscar área y equipo por nombre si vienen como texto
    let areaId: string | null = null
    let teamId: string | null = null

    if (contactInfo.areaDeTrabajo && !contactInfo.area_id) {
      // Buscar área por nombre
      const { data: area } = await supabase
        .from("areas")
        .select("id")
        .ilike("name", contactInfo.areaDeTrabajo)
        .limit(1)
        .single()
      
      if (area) {
        areaId = area.id
      } else {
        console.log(`⚠️ Área no encontrada: ${contactInfo.areaDeTrabajo}`)
      }
    } else if (contactInfo.area_id) {
      areaId = contactInfo.area_id
    }

    if (contactInfo.puestoDeTrabajo && !contactInfo.team_id) {
      // Buscar equipo por nombre (opcionalmente filtrar por área)
      let teamQuery = supabase
        .from("teams")
        .select("id")
        .ilike("name", contactInfo.puestoDeTrabajo)
      
      if (areaId) {
        teamQuery = teamQuery.eq("area_id", areaId)
      }
      
      const { data: team } = await teamQuery.limit(1).single()
      
      if (team) {
        teamId = team.id
      } else {
        console.log(`⚠️ Equipo no encontrado: ${contactInfo.puestoDeTrabajo}`)
      }
    } else if (contactInfo.team_id) {
      teamId = contactInfo.team_id
    }

    // 1. Buscar o crear contacto
    let contact: Contact | null = null
    let existingContact: Contact | null = null
    
    const { data: existingContactData } = await supabase
      .from("contacts")
      .select("*")
      .eq("phone", phone)
      .single()

    if (existingContactData) {
      existingContact = existingContactData
      // Actualizar contacto existente
      const updateData: Partial<Contact> = {
        last_seen: new Date().toISOString(),
        chat_id: chatId,
        channel_id: channelId,
      }

      // Si hay datos de registro (primera sesión), actualizar
      if (contactInfo.name) updateData.name = contactInfo.name
      if (contactInfo.email) updateData.email = contactInfo.email
      if (areaId) updateData.area_id = areaId
      if (teamId) updateData.team_id = teamId

      const { data: updatedContact } = await supabase
        .from("contacts")
        .update(updateData)
        .eq("phone", phone)
        .select()
        .single()

      contact = updatedContact
    } else {
      // Crear nuevo contacto
      const newContact: Partial<Contact> = {
        phone,
        chat_id: chatId,
        channel_id: channelId,
        first_seen: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      }

      if (contactInfo.name) newContact.name = contactInfo.name
      if (contactInfo.email) newContact.email = contactInfo.email
      if (areaId) newContact.area_id = areaId
      if (teamId) newContact.team_id = teamId

      const { data: createdContact } = await supabase
        .from("contacts")
        .insert(newContact)
        .select()
        .single()

      contact = createdContact
      existingContact = null // Es un contacto nuevo
    }

    if (!contact) {
      return res.status(500).json({ error: "Failed to create/update contact" })
    }

    // 2. Detectar si es nueva sesión o mensaje existente
    const isNewSession = !existingContact || (existingContact && sessionId !== existingContact.chat_id)
    
    // 3. Si es mensaje o nueva sesión, crear o actualizar ticket
    if (type === "message" || isNewSession) {
      // Buscar ticket existente para este chat
      const { data: existingTicket } = await supabase
        .from("tickets")
        .select("*")
        .eq("chat_id", chatId)
        .order("opened_at", { ascending: false })
        .limit(1)
        .single()

      let ticket: Ticket | null = null

      if (existingTicket && !isNewSession) {
        // Actualizar ticket existente
        const updateData: Partial<Ticket> = {
          last_message_at: new Date().toISOString(),
        }

        // Si se asignó una etiqueta (tipo de solicitud), actualizar
        if (tag) {
          updateData.tag = tag
          updateData.type = tag // El tag es el tipo de solicitud
        }

        // Si hay datos de contacto, actualizar área y equipo del ticket
        if (areaId) updateData.area_id = areaId
        else if (contact.area_id) updateData.area_id = contact.area_id
        
        if (teamId) updateData.team_id = teamId
        else if (contact.team_id) updateData.team_id = contact.team_id

        const { data: updatedTicket } = await supabase
          .from("tickets")
          .update(updateData)
          .eq("id", existingTicket.id)
          .select()
          .single()

        ticket = updatedTicket
      } else {
        // Crear nuevo ticket (cada nueva sesión es un ticket)
        const newTicket: Partial<Ticket> = {
          contact_phone: phone,
          chat_id: chatId,
          channel_id: channelId,
          status: "NEW",
          priority: "MEDIUM",
          opened_at: new Date().toISOString(),
          last_message_at: new Date().toISOString(),
        }

        if (tag) {
          newTicket.tag = tag
          newTicket.type = tag
        }

        if (areaId || contact.area_id) newTicket.area_id = areaId || contact.area_id
        if (teamId || contact.team_id) newTicket.team_id = teamId || contact.team_id

        const { data: createdTicket } = await supabase
          .from("tickets")
          .insert(newTicket)
          .select()
          .single()

        ticket = createdTicket

        // Emitir evento de nuevo ticket
        if (ticket) {
          const transformedTicket = transformTicket(ticket, contact)
          io.emit("TICKET_CREATED", transformedTicket)
        }
      }

      // 4. Si hay mensajes, guardarlos
      if (messages && Array.isArray(messages) && ticket) {
        for (const msg of messages) {
          // Determinar dirección: "bot" = outbound, otros = inbound
          const direction = msg.from === "bot" ? "outbound" : "inbound"
          
          const newMessage: Partial<Message> = {
            ticket_id: ticket.id,
            direction,
            text: msg.message || msg.text,
            botmaker_message_id: msg._id_ || msg.id,
            at: msg.date ? new Date(msg.date).toISOString() : new Date().toISOString(),
          }

          await supabase.from("messages").insert(newMessage)

          // Emitir evento de nuevo mensaje solo si es inbound (del usuario)
          if (direction === "inbound") {
            const transformedMessage = transformMessage(
              { ...newMessage, id: msg._id_ || msg.id || "" },
              phone
            )
            io.emit("MESSAGE_NEW", transformedMessage)
          }
        }
      }
    }

    res.json({ ok: true, message: "Webhook processed successfully" })
  } catch (error) {
    console.error("Webhook error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Endpoint para recibir datos de registro desde Botmaker
app.post("/api/contacts/register", async (req, res) => {
  const secret = req.headers["x-bm-shared-secret"]
  if (secret !== process.env.BM_SHARED_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { phone, name, email, area_id, team_id, channel_id, chat_id } = req.body

    if (!phone) {
      return res.status(400).json({ error: "Phone is required" })
    }

    // Validar que el email sea @gruponods.com
    if (email && !email.endsWith("@gruponods.com")) {
      return res.status(400).json({ error: "Email must be @gruponods.com" })
    }

    const contactData: Partial<Contact> = {
      phone,
      name,
      email,
      area_id,
      team_id,
      channel_id,
      chat_id,
      first_seen: new Date().toISOString(),
      last_seen: new Date().toISOString(),
    }

    const { data: contact, error } = await supabase
      .from("contacts")
      .upsert(contactData, { onConflict: "phone" })
      .select()
      .single()

    if (error) {
      console.error("Upsert contact error:", error)
      return res.status(500).json({ error: "Failed to save contact" })
    }

    res.json(contact)
  } catch (error) {
    console.error("Register contact error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Auth endpoints
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body
    // TODO: Implementar autenticación real con Supabase Auth
    const { data: user, error } = await supabase
      .from("user_app")
      .select("*")
      .eq("email", email)
      .single()

    if (error || !user) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    // Por ahora, no validamos password (deberías usar Supabase Auth)
    res.json({ user })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/auth/logout", (req, res) => {
  res.json({ ok: true })
})

app.get("/auth/session", async (req, res) => {
  try {
    // TODO: Implementar sesión real con JWT
    const { data: users } = await supabase
      .from("user_app")
      .select("*")
      .limit(1)

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    res.json({ user: users[0] })
  } catch (error) {
    console.error("Session error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Areas
app.get("/api/areas", async (req, res) => {
  try {
    const { data: areas, error } = await supabase.from("areas").select("*").order("name")

    if (error) {
      console.error("Get areas error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    res.json(areas || [])
  } catch (error) {
    console.error("Get areas error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Teams
app.get("/api/teams", async (req, res) => {
  try {
    const { areaId } = req.query
    let query = supabase.from("teams").select("*")

    if (areaId) {
      query = query.eq("area_id", areaId as string)
    }

    const { data: teams, error } = await query.order("name")

    if (error) {
      console.error("Get teams error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    res.json(teams || [])
  } catch (error) {
    console.error("Get teams error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Users
app.get("/api/users/self", async (req, res) => {
  try {
    // TODO: Implementar sesión real
    const { data: users } = await supabase.from("user_app").select("*").limit(1)

    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    res.json(users[0])
  } catch (error) {
    console.error("Get self error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Contacts
app.get("/api/contacts", async (req, res) => {
  try {
    const { data: contacts, error } = await supabase
      .from("contacts")
      .select("*")
      .order("last_seen", { ascending: false })

    if (error) {
      console.error("Get contacts error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    res.json(contacts || [])
  } catch (error) {
    console.error("Get contacts error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/contacts/upsert", async (req, res) => {
  const secret = req.headers["x-bm-shared-secret"]
  if (secret !== process.env.BM_SHARED_SECRET) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  try {
    const { phone, name, email, area_id, team_id, channel_id, chat_id } = req.body

    const contactData: Partial<Contact> = {
      phone,
      name,
      email,
      area_id,
      team_id,
      channel_id,
      chat_id,
      last_seen: new Date().toISOString(),
    }

    const { data: contact, error } = await supabase
      .from("contacts")
      .upsert(contactData, { onConflict: "phone" })
      .select()
      .single()

    if (error) {
      console.error("Upsert contact error:", error)
      return res.status(500).json({ error: "Failed to save contact" })
    }

    res.json(contact)
  } catch (error) {
    console.error("Upsert contact error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Tickets
app.get("/api/tickets", async (req, res) => {
  try {
    const {
      status,
      priority,
      areaId,
      teamId,
      assignedToId,
      q,
      page = "1",
      limit = "50",
      scope,
    } = req.query

    // Obtener usuario actual
    const user = await getCurrentUser(req)
    if (!user) {
      return res.status(401).json({ error: "Not authenticated" })
    }

    let query = supabase.from("tickets").select(`
      *,
      contact:contacts(*),
      assignedTo:user_app(*)
    `)

    // Aplicar filtros según el rol del usuario
    query = applyRoleFilters(query, user, scope as string | undefined)

    // Filtros
    if (areaId) {
      const areaIds = Array.isArray(areaId) ? areaId : [areaId]
      query = query.in("area_id", areaIds as string[])
    }
    if (teamId) {
      const teamIds = Array.isArray(teamId) ? teamId : [teamId]
      query = query.in("team_id", teamIds as string[])
    }
    if (assignedToId) {
      const assignedIds = Array.isArray(assignedToId) ? assignedToId : [assignedToId]
      query = query.in("assigned_user_id", assignedIds as string[])
    }

    // Mapear status y priority del frontend a BD
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status]
      const mappedStatuses = statusArray.map((s) => statusMapFromFrontend[String(s)] || String(s))
      query = query.in("status", mappedStatuses)
    }
    if (priority) {
      const priorityArray = Array.isArray(priority) ? priority : [priority]
      const mappedPriorities = priorityArray.map(
        (p) => priorityMapFromFrontend[String(p)] || String(p)
      )
      query = query.in("priority", mappedPriorities)
    }

    // Paginación
    const pageNum = parseInt(page as string)
    const limitNum = parseInt(limit as string)
    const skip = (pageNum - 1) * limitNum

    query = query.order("opened_at", { ascending: false }).range(skip, skip + limitNum - 1)

    const { data: tickets, error, count } = await query

    if (error) {
      console.error("Get tickets error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    // Contar total (sin paginación)
    let countQuery = supabase.from("tickets").select("*", { count: "exact", head: true })
    
    // Aplicar filtros según el rol del usuario también en el count
    countQuery = applyRoleFilters(countQuery, user, scope as string | undefined)
    
    if (areaId) {
      const areaIds = Array.isArray(areaId) ? areaId : [areaId]
      countQuery = countQuery.in("area_id", areaIds as string[])
    }
    if (teamId) {
      const teamIds = Array.isArray(teamId) ? teamId : [teamId]
      countQuery = countQuery.in("team_id", teamIds as string[])
    }
    if (assignedToId) {
      const assignedIds = Array.isArray(assignedToId) ? assignedToId : [assignedToId]
      countQuery = countQuery.in("assigned_user_id", assignedIds as string[])
    }
    if (status) {
      const statusArray = Array.isArray(status) ? status : [status]
      const mappedStatuses = statusArray.map((s) => statusMapFromFrontend[String(s)] || String(s))
      countQuery = countQuery.in("status", mappedStatuses)
    }
    if (priority) {
      const priorityArray = Array.isArray(priority) ? priority : [priority]
      const mappedPriorities = priorityArray.map(
        (p) => priorityMapFromFrontend[String(p)] || String(p)
      )
      countQuery = countQuery.in("priority", mappedPriorities)
    }

    const { count: total } = await countQuery

    const transformedTickets = (tickets || []).map((ticket: any) =>
      transformTicket(
        ticket,
        Array.isArray(ticket.contact) ? ticket.contact[0] : ticket.contact,
        Array.isArray(ticket.assignedTo) ? ticket.assignedTo[0] : ticket.assignedTo
      )
    )

    res.json({
      items: transformedTickets,
      total: total || 0,
    })
  } catch (error) {
    console.error("Get tickets error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/tickets/:id", async (req, res) => {
  try {
    const { data: ticket, error } = await supabase
      .from("tickets")
      .select(`
        *,
        contact:contacts(*),
        assignedTo:user_app(*)
      `)
      .eq("id", req.params.id)
      .single()

    if (error || !ticket) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    const transformedTicket = transformTicket(
      ticket,
      Array.isArray(ticket.contact) ? ticket.contact[0] : ticket.contact,
      Array.isArray(ticket.assignedTo) ? ticket.assignedTo[0] : ticket.assignedTo
    )

    res.json(transformedTicket)
  } catch (error) {
    console.error("Get ticket error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.patch("/api/tickets/:id", async (req, res) => {
  try {
    const updates: Partial<Ticket> = {}

    if (req.body.status) {
      updates.status = (statusMapFromFrontend[req.body.status] || req.body.status) as any
    }
    if (req.body.priority) {
      updates.priority = (priorityMapFromFrontend[req.body.priority] || req.body.priority) as any
    }
    if (req.body.areaId !== undefined) updates.area_id = req.body.areaId || null
    if (req.body.teamId !== undefined) updates.team_id = req.body.teamId || null
    if (req.body.assignedToId !== undefined) updates.assigned_user_id = req.body.assignedToId || null

    const mappedStatus = req.body.status
      ? statusMapFromFrontend[req.body.status] || req.body.status
      : null
    if (mappedStatus === "CLOSED" || mappedStatus === "RESOLVED") {
      updates.closed_at = new Date().toISOString()
    }

    const { data: ticket, error } = await supabase
      .from("tickets")
      .update(updates)
      .eq("id", req.params.id)
      .select(`
        *,
        contact:contacts(*),
        assignedTo:user_app(*)
      `)
      .single()

    if (error) {
      console.error("Update ticket error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    const transformedTicket = transformTicket(
      ticket,
      Array.isArray(ticket.contact) ? ticket.contact[0] : ticket.contact,
      Array.isArray(ticket.assignedTo) ? ticket.assignedTo[0] : ticket.assignedTo
    )

    // Emit Socket.IO event
    io.emit("TICKET_UPDATED", transformedTicket)

    res.json(transformedTicket)
  } catch (error) {
    console.error("Update ticket error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.get("/api/tickets/:id/messages", async (req, res) => {
  try {
    const { data: ticket } = await supabase
      .from("tickets")
      .select("contact_phone")
      .eq("id", req.params.id)
      .single()

    const { data: messages, error } = await supabase
      .from("messages")
      .select("*")
      .eq("ticket_id", req.params.id)
      .order("at", { ascending: true })

    if (error) {
      console.error("Get messages error:", error)
      return res.status(500).json({ error: "Internal server error" })
    }

    const transformedMessages = (messages || []).map((msg) =>
      transformMessage(msg, ticket?.contact_phone)
    )

    res.json(transformedMessages)
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

app.post("/api/tickets/:id/reply", async (req, res) => {
  try {
    const { text, attachments } = req.body

    const { data: ticket } = await supabase
      .from("tickets")
      .select("contact_phone")
      .eq("id", req.params.id)
      .single()

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" })
    }

    const newMessage: Partial<Message> = {
      ticket_id: req.params.id,
      direction: "outbound",
      text,
      media_url: attachments?.[0],
      at: new Date().toISOString(),
    }

    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert(newMessage)
      .select()
      .single()

    if (messageError) {
      console.error("Create message error:", messageError)
      return res.status(500).json({ error: "Internal server error" })
    }

    await supabase
      .from("tickets")
      .update({ last_message_at: new Date().toISOString() })
      .eq("id", req.params.id)

    // Emit Socket.IO event
    const transformedMessage = transformMessage(message, ticket.contact_phone)
    io.emit("MESSAGE_NEW", transformedMessage)

    res.json({ ok: true })
  } catch (error) {
    console.error("Reply error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Socket.IO helpers
export const ws = {
  ticketCreated: (ticket: any) => {
    io.emit("TICKET_CREATED", ticket)
  },
  ticketUpdated: (ticket: any) => {
    io.emit("TICKET_UPDATED", ticket)
  },
  messageNew: (message: any) => {
    io.emit("MESSAGE_NEW", message)
  },
}

// Start server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Graceful shutdown
process.on("SIGTERM", () => {
  httpServer.close()
})
