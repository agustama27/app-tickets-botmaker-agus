import type { User, Ticket, Message, Contact, Area, Team } from "@/types"

// Mock Users
export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "agent@company.com",
    name: "Support Agent",
    role: "agent",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    email: "user@company.com",
    name: "Regular User",
    role: "user",
    areaId: "2",
    teamId: "2",
    createdAt: new Date("2024-01-01"),
  },
]

// Mock Areas
export const mockAreas: Area[] = [
  { id: "1", name: "Technical Support", description: "IT and technical issues" },
  { id: "2", name: "Customer Service", description: "General customer inquiries" },
  { id: "3", name: "Sales", description: "Sales and business development" },
]

// Mock Teams
export const mockTeams: Team[] = [
  { id: "1", name: "Level 1 Support", areaId: "1" },
  { id: "2", name: "Level 2 Support", areaId: "1" },
  { id: "3", name: "Customer Care", areaId: "2" },
  { id: "4", name: "Sales Team", areaId: "3" },
]

// Mock Tickets
export const mockTickets: Ticket[] = [
  {
    id: "1",
    subject: "Cannot access email account",
    description: "I have been locked out of my email account since this morning. Need urgent help.",
    status: "open",
    priority: "high",
    userId: "3",
    assignedToId: "2",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-15T09:30:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
  },
  {
    id: "2",
    subject: "VPN connection issues",
    description: "VPN keeps disconnecting every few minutes when working from home.",
    status: "in-progress",
    priority: "medium",
    userId: "3",
    assignedToId: "2",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-15T08:15:00"),
  },
  {
    id: "3",
    subject: "Software installation request",
    description: "Need Adobe Creative Suite installed on my workstation for upcoming project.",
    status: "pending",
    priority: "low",
    userId: "3",
    assignedToId: null,
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-13T11:00:00"),
    updatedAt: new Date("2024-01-13T11:00:00"),
  },
  {
    id: "4",
    subject: "Printer not working",
    description: "Office printer on 3rd floor shows error message and will not print.",
    status: "on-hold",
    priority: "medium",
    userId: "3",
    assignedToId: "2",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-12T10:45:00"),
    updatedAt: new Date("2024-01-14T16:30:00"),
  },
  {
    id: "5",
    subject: "Password reset needed",
    description: "Forgot my password for the HR portal, need it reset.",
    status: "resolved",
    priority: "low",
    userId: "3",
    assignedToId: "2",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-10T13:20:00"),
    updatedAt: new Date("2024-01-10T15:45:00"),
    resolvedAt: new Date("2024-01-10T15:45:00"),
  },
  {
    id: "6",
    subject: "Computer running very slow",
    description: "My laptop has become extremely slow over the past week. Takes forever to start up.",
    status: "closed",
    priority: "medium",
    userId: "3",
    assignedToId: "2",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-08T09:00:00"),
    updatedAt: new Date("2024-01-09T17:00:00"),
    resolvedAt: new Date("2024-01-09T16:30:00"),
    closedAt: new Date("2024-01-09T17:00:00"),
  },
]

// Mock Messages
export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      ticketId: "1",
      userId: "3",
      content: "I have been locked out of my email account since this morning. Need urgent help.",
      isInternal: false,
      createdAt: new Date("2024-01-15T09:30:00"),
    },
    {
      id: "m2",
      ticketId: "1",
      userId: "2",
      content: "Hi, I can help you with that. Can you please provide your employee ID?",
      isInternal: false,
      createdAt: new Date("2024-01-15T09:35:00"),
    },
    {
      id: "m3",
      ticketId: "1",
      userId: "3",
      content: "My employee ID is EMP-2024-0567",
      isInternal: false,
      createdAt: new Date("2024-01-15T09:37:00"),
    },
  ],
  "2": [
    {
      id: "m4",
      ticketId: "2",
      userId: "3",
      content: "VPN keeps disconnecting every few minutes when working from home.",
      isInternal: false,
      createdAt: new Date("2024-01-14T14:20:00"),
    },
    {
      id: "m5",
      ticketId: "2",
      userId: "2",
      content: "Let me check if there are any known issues with the VPN server.",
      isInternal: true,
      createdAt: new Date("2024-01-14T14:25:00"),
    },
    {
      id: "m6",
      ticketId: "2",
      userId: "2",
      content:
        "Have you tried switching to a different VPN server location? Please try connecting to the US-East server.",
      isInternal: false,
      createdAt: new Date("2024-01-14T14:30:00"),
    },
  ],
  "3": [
    {
      id: "m7",
      ticketId: "3",
      userId: "3",
      content: "Need Adobe Creative Suite installed on my workstation for upcoming project.",
      isInternal: false,
      createdAt: new Date("2024-01-13T11:00:00"),
    },
  ],
  "4": [
    {
      id: "m8",
      ticketId: "4",
      userId: "3",
      content: "Office printer on 3rd floor shows error message and will not print.",
      isInternal: false,
      createdAt: new Date("2024-01-12T10:45:00"),
    },
    {
      id: "m9",
      ticketId: "4",
      userId: "2",
      content: "We are waiting for replacement parts. Should arrive tomorrow.",
      isInternal: false,
      createdAt: new Date("2024-01-14T16:30:00"),
    },
  ],
  "5": [
    {
      id: "m10",
      ticketId: "5",
      userId: "3",
      content: "Forgot my password for the HR portal, need it reset.",
      isInternal: false,
      createdAt: new Date("2024-01-10T13:20:00"),
    },
    {
      id: "m11",
      ticketId: "5",
      userId: "2",
      content: "Password has been reset. Check your email for the new temporary password.",
      isInternal: false,
      createdAt: new Date("2024-01-10T15:45:00"),
    },
  ],
  "6": [
    {
      id: "m12",
      ticketId: "6",
      userId: "3",
      content: "My laptop has become extremely slow over the past week. Takes forever to start up.",
      isInternal: false,
      createdAt: new Date("2024-01-08T09:00:00"),
    },
    {
      id: "m13",
      ticketId: "6",
      userId: "2",
      content: "I have optimized your startup programs and cleared cache. Please restart your laptop.",
      isInternal: false,
      createdAt: new Date("2024-01-09T16:30:00"),
    },
    {
      id: "m14",
      ticketId: "6",
      userId: "3",
      content: "Much better now! Thank you so much!",
      isInternal: false,
      createdAt: new Date("2024-01-09T17:00:00"),
    },
  ],
}

// Mock Contacts
export const mockContacts: Contact[] = [
  {
    id: "1",
    email: "john.doe@company.com",
    name: "John Doe",
    phone: "+1-555-0123",
    company: "Acme Corporation",
    areaId: "1",
    teamId: "1",
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    email: "jane.smith@company.com",
    name: "Jane Smith",
    phone: "+1-555-0124",
    company: "Tech Solutions Inc",
    areaId: "2",
    teamId: "3",
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    email: "bob.johnson@company.com",
    name: "Bob Johnson",
    phone: "+1-555-0125",
    company: "Digital Innovations",
    areaId: "1",
    teamId: "2",
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "4",
    email: "alice.williams@company.com",
    name: "Alice Williams",
    phone: "+1-555-0126",
    company: "Global Enterprises",
    areaId: "3",
    teamId: "4",
    createdAt: new Date("2024-01-04"),
  },
  {
    id: "5",
    email: "charlie.brown@company.com",
    name: "Charlie Brown",
    phone: "+1-555-0127",
    company: "Startup Ventures",
    areaId: "2",
    teamId: "3",
    createdAt: new Date("2024-01-05"),
  },
]

// Helper functions to get user by id
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((u) => u.id === id)
}

// Helper function to get area by id
export const getAreaById = (id: string): Area | undefined => {
  return mockAreas.find((a) => a.id === id)
}

// Helper function to get team by id
export const getTeamById = (id: string): Team | undefined => {
  return mockTeams.find((t) => t.id === id)
}
