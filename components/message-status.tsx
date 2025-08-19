"use client"

import { Badge } from "@/components/ui/badge"
import { Check, CheckCheck, Clock, Send } from "lucide-react"

interface MessageStatusProps {
  status?: "sending" | "sent" | "delivered" | "read"
  timestamp: Date
}

export function MessageStatus({ status, timestamp }: MessageStatusProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "sending":
        return <Clock className="h-3 w-3 animate-spin" />
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
        return <CheckCheck className="h-3 w-3" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-primary" />
      default:
        return <Send className="h-3 w-3" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "sending":
        return "Sending..."
      case "sent":
        return "Sent"
      case "delivered":
        return "Delivered"
      case "read":
        return "Read"
      default:
        return ""
    }
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>{timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      {status && (
        <Badge variant="outline" className="text-xs px-1 py-0 flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
      )}
    </div>
  )
}
