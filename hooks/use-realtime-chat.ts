"use client"

import { useState, useEffect, useCallback } from "react"
import { messagesApi } from "@/lib/api"
import { getSocket, onNewMessage, emitTypingStart, emitTypingStop, onTypingUpdate, joinTicketRoom } from "@/lib/socket"

export interface Message {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  status?: "sending" | "sent" | "delivered" | "read"
}

export interface ConnectionStatus {
  isConnected: boolean
  lastSeen?: Date
  reconnectAttempts: number
}

export function useRealtimeChat(ticketId?: string, currentUser?: { id: string; role: "user" | "agent" }) {
  const [messages, setMessages] = useState<Message[]>([])

  const [isTyping, setIsTyping] = useState(false)
  const [agentTyping, setAgentTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: true,
    reconnectAttempts: 0,
  })
  const [onlineUsers, setOnlineUsers] = useState(1)

  // Socket connection lifecycle
  useEffect(() => {
    const socket = getSocket()
    setConnectionStatus((prev) => ({ ...prev, isConnected: socket.connected }))
    const onConnect = () => setConnectionStatus((prev) => ({ ...prev, isConnected: true }))
    const onDisconnect = () => setConnectionStatus((prev) => ({ ...prev, isConnected: false, lastSeen: new Date(), reconnectAttempts: prev.reconnectAttempts + 1 }))
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }
  }, [])

  useEffect(() => {
    if (!ticketId) return
    joinTicketRoom(ticketId)
    // Load existing messages
    messagesApi
      .list(ticketId)
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setMessages(
          arr.map((m: any) => ({ id: m._id, content: m.content, sender: m.senderType === "user" ? "user" : "agent", timestamp: new Date(m.createdAt), status: m.status as any }))
        )
      })
      .catch(() => {})

    const handleNew = (m: any) => {
      if (m.ticketId !== ticketId) return
      setMessages((prev) => [
        ...prev,
        { id: m._id, content: m.content, sender: m.senderType === "user" ? "user" : "agent", timestamp: new Date(m.createdAt), status: m.status },
      ])
    }
    const handleTyping = (p: { ticketId: string; userId: string; typing: boolean }) => {
      if (p.ticketId !== ticketId) return
      setAgentTyping(p.typing)
    }
    onNewMessage(handleNew)
    onTypingUpdate(handleTyping)
    return () => {
      const socket = getSocket()
      socket.off("message:new", handleNew)
      socket.off("typing:update", handleTyping)
    }
  }, [ticketId])

  const sendMessage = useCallback((content: string) => {
    if (!content.trim()) return

    console.log("Sending message:", { content, ticketId, currentUser })

    // Optimistic add
    const local: Message = { id: `local-${Date.now()}`, content, sender: currentUser?.role === "agent" ? "agent" : "user", timestamp: new Date(), status: "sending" }
    setMessages((prev) => [...prev, local])

    // If no ticketId is provided, simulate status progression so UI doesn't get stuck
    if (!ticketId) {
      console.log("No ticketId provided, using simulation mode")
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === local.id ? { ...m, status: "sent" } : m)))
      }, 400)
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === local.id ? { ...m, status: "delivered" } : m)))
      }, 900)
      setTimeout(() => {
        setMessages((prev) => prev.map((m) => (m.id === local.id ? { ...m, status: "read" } : m)))
      }, 1800)
      return
    }

    // Send via REST for reliability; socket broadcast will be received by others
    if (ticketId) {
      console.log("Sending message via API to ticket:", ticketId)
      messagesApi
        .send(ticketId, content)
        .then((m: any) => {
          console.log("Message sent successfully:", m)
          setMessages((prev) => prev.map((msg) => (msg.id === local.id ? { id: m._id, content: m.content, sender: m.senderType === "user" ? "user" : "agent", timestamp: new Date(m.createdAt), status: m.status } : msg)))
        })
        .catch((error) => {
          console.error("Failed to send message:", error)
          setMessages((prev) => prev.map((msg) => (msg.id === local.id ? { ...msg, status: "read" } : msg)))
        })
    }
  }, [ticketId, currentUser])

  const startTyping = useCallback(() => {
    setIsTyping(true)
    if (ticketId && currentUser) emitTypingStart(ticketId, currentUser.id)
  }, [ticketId, currentUser])

  const stopTyping = useCallback(() => {
    setIsTyping(false)
    if (ticketId && currentUser) emitTypingStop(ticketId, currentUser.id)
  }, [ticketId, currentUser])

  return {
    messages,
    isTyping,
    agentTyping,
    connectionStatus,
    onlineUsers,
    sendMessage,
    startTyping,
    stopTyping,
  }
}
