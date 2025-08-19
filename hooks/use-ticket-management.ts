"use client"

import { useState, useEffect } from "react"
import { ticketsApi } from "@/lib/api"
import type { Ticket, TicketActivity } from "@/types/ticket"

export function useTicketManagement() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<TicketActivity[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterPriority, setFilterPriority] = useState<string>("all")

  // Load tickets from backend
  useEffect(() => {
    ticketsApi
      .list()
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        const mappedTickets: Ticket[] = arr.map((t: any) => ({
          id: t._id,
          title: t.subject,
          description: t.subject, // Backend doesn't have separate description field
          status: t.status,
          priority: t.priority === "urgent" ? "high" : t.priority, // Map urgent to high
          category: "general", // Backend doesn't have category field
          customer: {
            id: t.createdBy,
            name: "Customer", // Would need to fetch user details
            email: "customer@example.com",
          },
          assignedAgent: t.assignedTo ? {
            id: t.assignedTo,
            name: "Agent", // Would need to fetch user details
          } : undefined,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
          tags: t.tags || [],
          messages: 0, // Would need to count messages
        }))
        setTickets(mappedTickets)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const createTicket = async (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "messages">) => {
    try {
      const newTicket = await ticketsApi.create({
        subject: ticketData.title,
        priority: ticketData.priority === "urgent" ? "high" : ticketData.priority,
        tags: ticketData.tags,
        initialMessage: ticketData.description,
      }) as any
      const mappedTicket: Ticket = {
        id: newTicket._id,
        title: newTicket.subject,
        description: newTicket.subject,
        status: newTicket.status,
        priority: newTicket.priority === "urgent" ? "high" : newTicket.priority,
        category: "general",
        customer: {
          id: newTicket.createdBy,
          name: "Customer",
          email: "customer@example.com",
        },
        createdAt: new Date(newTicket.createdAt),
        updatedAt: new Date(newTicket.updatedAt),
        tags: newTicket.tags || [],
        messages: 0,
      }
      setTickets((prev) => [mappedTicket, ...prev])
      return mappedTicket
    } catch (error) {
      console.error("Failed to create ticket:", error)
      throw error
    }
  }

  const updateTicketStatus = async (ticketId: string, status: Ticket["status"]) => {
    try {
      const updatedTicket = await ticketsApi.update(ticketId, { status }) as any
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                status: updatedTicket.status,
                updatedAt: new Date(updatedTicket.updatedAt),
                resolvedAt: status === "resolved" ? new Date() : ticket.resolvedAt,
              }
            : ticket,
        ),
      )
    } catch (error) {
      console.error("Failed to update ticket status:", error)
    }
  }

  const assignTicket = async (ticketId: string, agentId: string, agentName: string) => {
    try {
      const updatedTicket = await ticketsApi.update(ticketId, { assignedTo: agentId }) as any
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? {
                ...ticket,
                assignedAgent: { id: agentId, name: agentName },
                updatedAt: new Date(updatedTicket.updatedAt),
              }
            : ticket,
        ),
      )
    } catch (error) {
      console.error("Failed to assign ticket:", error)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const statusMatch = filterStatus === "all" || ticket.status === filterStatus
    const priorityMatch = filterPriority === "all" || ticket.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
  }

  return {
    tickets: filteredTickets,
    activities,
    loading,
    ticketStats,
    filterStatus,
    filterPriority,
    setFilterStatus,
    setFilterPriority,
    createTicket,
    updateTicketStatus,
    assignTicket,
  }
}
