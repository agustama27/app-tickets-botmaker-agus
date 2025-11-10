# NODS IT Support Tickets

A production-ready IT support ticket management system built with Next.js 14, featuring real-time updates, drag-and-drop Kanban board, and comprehensive ticket management.

## Features

- **Kanban Board**: Drag-and-drop ticket management across 6 status columns with optimistic updates
- **Real-time Updates**: WebSocket integration for live ticket and message updates
- **Ticket Management**: Full CRUD operations with status, priority, and assignment controls
- **Messaging System**: In-ticket conversation with optimistic message sending
- **Role-Based Access Control**: Admin, Manager, and Lead roles with appropriate permissions
- **Contacts Management**: View and search all contact information
- **Admin Panel**: User management and organizational structure views
- **Dark Mode**: Full theme support with system preference detection
- **Responsive Design**: Mobile-first design with desktop optimizations

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Drag & Drop**: dnd-kit with sortable
- **Real-time**: Socket.IO Client
- **API Client**: Axios
- **Validation**: Zod
- **Date Handling**: date-fns
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ or compatible runtime
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd nods-it-support
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Configure environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edit `.env.local` with your configuration:

\`\`\`env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001

# Branding
NEXT_PUBLIC_BRAND_NAME=Grupo Nods
NEXT_PUBLIC_BRAND_PRIMARY=#1E66FF
\`\`\`

### Development

Run the development server:

\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Create a production build:

\`\`\`bash
pnpm build
\`\`\`

### Start Production Server

\`\`\`bash
pnpm start
\`\`\`

## Project Structure

\`\`\`
.
├── app/
│   ├── (app)/              # Authenticated routes
│   │   ├── admin/          # Admin pages
│   │   ├── contacts/       # Contacts listing
│   │   ├── settings/       # User settings
│   │   ├── tickets/[id]/   # Ticket detail
│   │   └── page.tsx        # Dashboard (Kanban)
│   ├── login/              # Authentication
│   └── layout.tsx          # Root layout
├── components/
│   ├── data-table/         # Reusable table component
│   ├── kanban/             # Kanban board components
│   ├── layout/             # Header, sidebar
│   ├── ticket/             # Ticket detail components
│   ├── ui/                 # shadcn/ui components
│   └── providers.tsx       # React Query & Theme providers
├── lib/
│   ├── api.ts              # API client functions
│   ├── axios.ts            # Axios instance config
│   ├── formatters.ts       # Date/label formatters
│   ├── query-client.ts     # React Query config
│   ├── rbac.ts             # Role-based access control
│   └── socket.ts           # WebSocket client
├── hooks/
│   ├── use-auth.ts         # Authentication hook
│   └── use-socket.ts       # Real-time updates hook
└── types/
    └── index.ts            # TypeScript types & Zod schemas
\`\`\`

## API Integration

The application expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/session` - Get current session

### Tickets
- `GET /api/tickets` - List tickets with filters
- `GET /api/tickets/:id` - Get ticket details
- `PATCH /api/tickets/:id` - Update ticket
- `GET /api/tickets/:id/messages` - Get ticket messages
- `POST /api/tickets/:id/reply` - Send message

### Structure
- `GET /api/areas` - List all areas
- `GET /api/teams` - List teams (optional areaId filter)

### Contacts
- `GET /api/contacts` - List all contacts

### Users
- `GET /api/users/self` - Get current user

### WebSocket Events

The application listens for these Socket.IO events:

- `TICKET_CREATED` - New ticket created
- `TICKET_UPDATED` - Ticket status/data changed
- `MESSAGE_NEW` - New message in ticket

## Features by Role

### Admin
- View all tickets across organization
- Access user management
- View organizational structure
- Assign tickets
- Full ticket management

### Manager
- View tickets in their area
- Access organizational structure
- Assign tickets within area
- Full ticket management for area

### Lead
- View tickets in their team
- Update ticket status
- Reply to tickets
- Limited administrative access

## Development Notes

- All API responses are validated using Zod schemas
- Optimistic updates with automatic rollback on errors
- WebSocket connection with automatic reconnection
- Type-safe throughout with TypeScript strict mode
- RBAC guards prevent unauthorized access
- Mobile-responsive with touch-friendly interactions

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Private - All rights reserved

## Support

For issues and questions, please contact the development team.
