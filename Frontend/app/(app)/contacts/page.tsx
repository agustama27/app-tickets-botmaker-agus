"use client"

import { useContacts } from "@/hooks/use-contacts"
import { useAreas } from "@/hooks/use-structure"
import { DataTable } from "@/components/data-table/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import type { Contact } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => row.original.name || "—",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.original.email || "—",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "company",
    header: "Empresa",
    cell: ({ row }) => row.original.company || "—",
  },
  {
    accessorKey: "areaId",
    header: "Área",
    cell: ({ row, table }) => {
      const areas = (table.options.meta as any)?.areas || []
      const area = row.original.areaId ? areas.find((a: any) => a.id === row.original.areaId) : null
      return area ? <Badge variant="outline">{area.name}</Badge> : "—"
    },
  },
]

export default function ContactsPage() {
  const { data: contacts = [], isLoading: contactsLoading } = useContacts()
  const { data: areas = [], isLoading: areasLoading } = useAreas()
  const isLoading = contactsLoading || areasLoading

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contactos</h1>
        <p className="text-muted-foreground">Gestiona información de contactos para tickets de soporte</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos los Contactos</CardTitle>
          <CardDescription>Ver y buscar todos los contactos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <DataTable 
              columns={columns} 
              data={contacts} 
              searchKey="name" 
              searchPlaceholder="Buscar por nombre..."
              meta={{ areas }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
