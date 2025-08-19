"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot } from "lucide-react"

interface TypingIndicatorProps {
  isVisible: boolean
  userName?: string
}

export function TypingIndicator({ isVisible, userName = "Agent" }: TypingIndicatorProps) {
  if (!isVisible) return null

  return (
    <div className="flex gap-3 justify-start animate-in slide-in-from-left-2 duration-300">
      <Avatar className="h-8 w-8 mt-1">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <Card className="p-3 bg-card/80 backdrop-blur-sm neon-border">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2">{userName} is typing</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
          </div>
        </div>
      </Card>
    </div>
  )
}
