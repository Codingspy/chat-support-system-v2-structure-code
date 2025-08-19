export interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: "technical" | "billing" | "account" | "general"
  customer: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  assignedAgent?: {
    id: string
    name: string
    avatar?: string
  }
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  tags: string[]
  messages: number
  estimatedResolution?: Date
}

export interface TicketActivity {
  id: string
  ticketId: string
  type: "created" | "updated" | "assigned" | "status_changed" | "priority_changed" | "resolved" | "reopened"
  description: string
  performedBy: {
    id: string
    name: string
    role: "customer" | "agent" | "system"
  }
  timestamp: Date
  metadata?: Record<string, any>
}
