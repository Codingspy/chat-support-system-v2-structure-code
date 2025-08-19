"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Bot, User, Zap, MessageCircle, Settings } from "lucide-react"
import { useRealtimeChat } from "@/hooks/use-realtime-chat"
import { ConnectionStatusIndicator } from "@/components/connection-status"
import { TypingIndicator } from "@/components/typing-indicator"
import { MessageStatus } from "@/components/message-status"

export function ChatInterface({
  ticketId,
  currentUser,
}: {
  ticketId: string
  currentUser: { id: string; role: "user" | "agent" }
}) {
  const { messages, isTyping, agentTyping, connectionStatus, onlineUsers, sendMessage, startTyping, stopTyping } =
    useRealtimeChat(ticketId, currentUser)

  const [newMessage, setNewMessage] = useState("")
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleInputChange = (value: string) => {
    setNewMessage(value)

    if (value.trim() && !isTyping) {
      startTyping()
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing
    const timeout = setTimeout(() => {
      stopTyping()
    }, 1000)

    setTypingTimeout(timeout)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    sendMessage(newMessage)
    setNewMessage("")
    stopTyping()

    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }, [typingTimeout])

  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 glow-effect">
                  <AvatarImage src="/futuristic-ai-avatar.png" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background ${
                    connectionStatus.isConnected ? "bg-secondary animate-pulse" : "bg-muted"
                  }`}
                />
              </div>
              <div>
                <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  CyberSupport AI
                </h2>
                <p className="text-sm text-muted-foreground">
                  {connectionStatus.isConnected ? "Online • Avg response: 30s" : "Reconnecting..."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="holographic">
                <Zap className="h-3 w-3 mr-1" />
                Premium Support
              </Badge>
              <Button variant="ghost" size="sm" className="hover:glow-effect">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2">
            <ConnectionStatusIndicator status={connectionStatus} onlineUsers={onlineUsers} />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.sender === "agent" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}

              <div className={`max-w-xs lg:max-w-md ${message.sender === "user" ? "order-1" : ""}`}>
                <Card
                  className={`p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto holographic"
                      : "bg-card/80 backdrop-blur-sm neon-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </Card>
                <div className={`mt-1 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                  <MessageStatus status={message.status} timestamp={message.timestamp} />
                </div>
              </div>

              {message.sender === "user" && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}

          <TypingIndicator isVisible={agentTyping} userName="CyberSupport AI" />
        </div>

        {/* Message Input */}
        <div className="border-t border-border bg-card/50 backdrop-blur-sm p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={newMessage}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Type your message..."
                className="pr-12 bg-input/80 backdrop-blur-sm border-border/50 focus:border-primary focus:glow-effect"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={!connectionStatus.isConnected}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 glow-effect"
              disabled={!newMessage.trim() || !connectionStatus.isConnected}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-muted-foreground">{isTyping && "You are typing..."}</div>
            <p className="text-xs text-muted-foreground text-center">
              Powered by CyberSupport AI • End-to-end encrypted
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
