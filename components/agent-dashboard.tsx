"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Search,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"
import { ticketsApi } from "@/lib/api"
import { ChatInterface } from "./chat-interface"

interface Conversation {
  id: string
  customer: {
    name: string
    email: string
    avatar?: string
    location: string
  }
  lastMessage: string
  timestamp: Date
  status: "active" | "waiting" | "resolved"
  priority: "low" | "medium" | "high"
  unreadCount: number
}

interface AgentStats {
  activeChats: number
  resolvedToday: number
  avgResponseTime: string
  satisfaction: number
}

export function AgentDashboard() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const agentStats: AgentStats = {
    activeChats: 12,
    resolvedToday: 28,
    avgResponseTime: "2m 15s",
    satisfaction: 4.8,
  }

  // Load tickets from backend
  useEffect(() => {
    ticketsApi
      .list()
      .then((data) => {
        const arr = Array.isArray(data) ? data : []
        setTickets(arr)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Convert tickets to conversations format
  const conversations: Conversation[] = tickets.map((ticket: any) => ({
    id: ticket._id,
    customer: {
      name: "Customer", // Would need to fetch user details
      email: "customer@example.com",
      location: "Unknown",
    },
    lastMessage: ticket.subject,
    timestamp: new Date(ticket.updatedAt),
    status: ticket.status === "open" ? "waiting" : ticket.status === "resolved" ? "resolved" : "active",
    priority: ticket.priority === "urgent" ? "high" : ticket.priority,
    unreadCount: 0, // Would need to count unread messages
  }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-secondary"
      case "waiting":
        return "bg-accent"
      case "resolved":
        return "bg-muted"
      default:
        return "bg-muted"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-destructive text-destructive"
      case "medium":
        return "border-accent text-accent"
      case "low":
        return "border-muted-foreground text-muted-foreground"
      default:
        return "border-muted-foreground text-muted-foreground"
    }
  }

  if (selectedConversation) {
    return (
      <ChatInterface 
        ticketId={selectedConversation} 
        currentUser={{ id: "agent-1", role: "agent" }} 
      />
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Conversations List */}
      <div className="w-80 border-r border-border bg-card/30 backdrop-blur-sm flex flex-col">
        {/* Agent Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-10 w-10 glow-effect">
              <AvatarFallback className="bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Agent Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">John Doe • Online</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <Card className="p-2 holographic">
              <div className="text-center">
                <div className="text-lg font-bold text-primary">{agentStats.activeChats}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </Card>
            <Card className="p-2 holographic">
              <div className="text-center">
                <div className="text-lg font-bold text-secondary">{agentStats.resolvedToday}</div>
                <div className="text-xs text-muted-foreground">Resolved</div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input/50 border-border/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="active" className="text-xs">
                  Active
                </TabsTrigger>
                <TabsTrigger value="waiting" className="text-xs">
                  Waiting
                </TabsTrigger>
                <TabsTrigger value="resolved" className="text-xs">
                  Resolved
                </TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-2">
                {conversations
                  .filter((c) => c.status === "active")
                  .map((conversation) => (
                    <Card
                      key={conversation.id}
                      className={`p-3 cursor-pointer transition-all hover:glow-effect ${
                        selectedConversation === conversation.id ? "neon-border bg-card/80" : "bg-card/40"
                      }`}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                            {conversation.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium text-sm truncate">{conversation.customer.name}</h4>
                            {conversation.unreadCount > 0 && (
                              <Badge variant="secondary" className="h-5 w-5 p-0 text-xs rounded-full">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate mb-2">{conversation.lastMessage}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {conversation.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(conversation.priority)}`}>
                              {conversation.priority}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="waiting" className="space-y-2">
                {conversations
                  .filter((c) => c.status === "waiting")
                  .map((conversation) => (
                    <Card
                      key={conversation.id}
                      className="p-3 cursor-pointer transition-all hover:glow-effect bg-card/40"
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                            {conversation.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{conversation.customer.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>

              <TabsContent value="resolved" className="space-y-2">
                {conversations
                  .filter((c) => c.status === "resolved")
                  .map((conversation) => (
                    <Card
                      key={conversation.id}
                      className="p-3 cursor-pointer transition-all hover:glow-effect bg-card/20"
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                            {conversation.customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{conversation.customer.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
            <p className="text-muted-foreground">Choose a conversation from the sidebar to start chatting</p>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Customer Info & Stats */}
      <div className="w-80 border-l border-border bg-card/30 backdrop-blur-sm p-4">
        <div className="space-y-4">
          {/* Performance Stats */}
          <Card className="holographic">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Today's Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Response</span>
                <span className="text-sm font-medium text-primary">{agentStats.avgResponseTime}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Satisfaction</span>
                <span className="text-sm font-medium text-secondary">{agentStats.satisfaction}/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resolved</span>
                <span className="text-sm font-medium text-accent">{agentStats.resolvedToday}</span>
              </div>
            </CardContent>
          </Card>

          {/* Customer Details */}
          {selectedConversation && (
            <Card className="neon-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <p className="text-sm font-medium">Alex Chen</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Email</label>
                  <p className="text-sm">alex.chen@example.com</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Location</label>
                  <p className="text-sm">San Francisco, CA</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Customer Since</label>
                  <p className="text-sm">March 2023</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Previous Tickets</label>
                  <p className="text-sm">3 resolved</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="holographic">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark as Resolved
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                Transfer to Team
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                <Clock className="h-4 w-4 mr-2" />
                Set Follow-up
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
