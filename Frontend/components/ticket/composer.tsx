"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface ComposerProps {
  onSend: (text: string) => Promise<void>
  disabled?: boolean
}

export function Composer({ onSend, disabled = false }: ComposerProps) {
  const [text, setText] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSending || disabled) return

    setIsSending(true)
    try {
      await onSend(text)
      setText("")
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        disabled={disabled || isSending}
        className="min-h-[80px] resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
          }
        }}
      />
      <Button type="submit" size="icon" disabled={!text.trim() || disabled || isSending}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  )
}
