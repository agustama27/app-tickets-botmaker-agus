"use client"

import { useAuth } from "@/hooks/use-auth"
import { useTicket, useReplyToTicket } from "@/hooks/use-tickets"
import { useMessages } from "@/hooks/use-messages"
import { TicketHeader } from "@/components/ticket/ticket-header"
import { MessageList } from "@/components/ticket/message-list"
import { Composer } from "@/components/ticket/composer"
import { TicketInfo } from "@/components/ticket/ticket-info"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { use } from "react"

export default function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const ticketId = resolvedParams.id

  const { user } = useAuth()
  const { data: ticket, isLoading: ticketLoading } = useTicket(ticketId)
  const { data: messages = [], isLoading: messagesLoading } = useMessages(ticketId)
  const replyMutation = useReplyToTicket()

  const handleSendMessage = async (text: string) => {
    if (!user || !ticketId) return
    try {
      await replyMutation.mutateAsync({ ticketId, text })
      toast({ title: "Mensaje enviado" })
    } catch (error) {
      toast({
        title: "Error al enviar mensaje",
        variant: "destructive",
      })
    }
  }

  if (ticketLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!ticket) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="mb-4 text-lg text-muted-foreground">Ticket no encontrado</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al Dashboard
        </Link>
      </Button>

      <TicketHeader ticket={ticket} />

      <Tabs defaultValue="conversation" className="w-full">
        <TabsList>
          <TabsTrigger value="conversation">Conversación</TabsTrigger>
          <TabsTrigger value="info">Información</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mensajes</CardTitle>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="flex h-[500px] items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </div>
              ) : (
                <MessageList messages={messages} />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Responder</CardTitle>
            </CardHeader>
            <CardContent>
              <Composer onSend={handleSendMessage} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info">
          <TicketInfo ticket={ticket} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
