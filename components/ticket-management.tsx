"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  MessageSquare,
  Calendar,
  Tag,
  TrendingUp,
  TicketIcon,
} from "lucide-react"
import { useTicketManagement } from "@/hooks/use-ticket-management"
import type { Ticket } from "@/types/ticket"

export function TicketManagement() {
  const {
    tickets,
    ticketStats,
    filterStatus,
    filterPriority,
    setFilterStatus,
    setFilterPriority,
    createTicket,
    updateTicketStatus,
    assignTicket,
  } = useTicketManagement()

  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTicket, setNewTicket] = useState({
    title: "",
    description: "",
    priority: "medium" as Ticket["priority"],
    category: "general" as Ticket["category"],
    customerName: "",
    customerEmail: "",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-accent text-accent-foreground"
      case "in-progress":
        return "bg-secondary text-secondary-foreground"
      case "resolved":
        return "bg-primary text-primary-foreground"
      case "closed":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "border-destructive text-destructive bg-destructive/10"
      case "high":
        return "border-accent text-accent bg-accent/10"
      case "medium":
        return "border-secondary text-secondary bg-secondary/10"
      case "low":
        return "border-muted-foreground text-muted-foreground bg-muted/10"
      default:
        return "border-muted-foreground text-muted-foreground bg-muted/10"
    }
  }

  const handleCreateTicket = () => {
    if (!newTicket.title || !newTicket.customerName || !newTicket.customerEmail) return

    createTicket({
      title: newTicket.title,
      description: newTicket.description,
      status: "open",
      priority: newTicket.priority,
      category: newTicket.category,
      customer: {
        id: `cust-${Date.now()}`,
        name: newTicket.customerName,
        email: newTicket.customerEmail,
      },
      tags: [],
    })

    setNewTicket({
      title: "",
      description: "",
      priority: "medium",
      category: "general",
      customerName: "",
      customerEmail: "",
    })
    setIsCreateDialogOpen(false)
  }

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card/50 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Ticket Management
              </h1>
              <p className="text-muted-foreground">Manage and track customer support tickets</p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 glow-effect">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-sm neon-border">
                <DialogHeader>
                  <DialogTitle>Create New Ticket</DialogTitle>
                  <DialogDescription>Create a new support ticket for a customer.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newTicket.title}
                      onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                      placeholder="Brief description of the issue"
                      className="bg-input/50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTicket.description}
                      onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                      placeholder="Detailed description of the issue"
                      className="bg-input/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        value={newTicket.priority}
                        onValueChange={(value: Ticket["priority"]) => setNewTicket({ ...newTicket, priority: value })}
                      >
                        <SelectTrigger className="bg-input/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newTicket.category}
                        onValueChange={(value: Ticket["category"]) => setNewTicket({ ...newTicket, category: value })}
                      >
                        <SelectTrigger className="bg-input/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="account">Account</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="customerName">Customer Name</Label>
                      <Input
                        id="customerName"
                        value={newTicket.customerName}
                        onChange={(e) => setNewTicket({ ...newTicket, customerName: e.target.value })}
                        placeholder="Customer name"
                        className="bg-input/50"
                      />
                    </div>
                    <div>
                      <Label htmlFor="customerEmail">Customer Email</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        value={newTicket.customerEmail}
                        onChange={(e) => setNewTicket({ ...newTicket, customerEmail: e.target.value })}
                        placeholder="customer@example.com"
                        className="bg-input/50"
                      />
                    </div>
                  </div>
                  <Button onClick={handleCreateTicket} className="w-full bg-primary hover:bg-primary/90">
                    Create Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-4">
            <Card className="holographic">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TicketIcon className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-primary">{ticketStats.total}</div>
                    <div className="text-xs text-muted-foreground">Total Tickets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="holographic">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-accent" />
                  <div>
                    <div className="text-2xl font-bold text-accent">{ticketStats.open}</div>
                    <div className="text-xs text-muted-foreground">Open</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="holographic">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" />
                  <div>
                    <div className="text-2xl font-bold text-secondary">{ticketStats.inProgress}</div>
                    <div className="text-xs text-muted-foreground">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="holographic">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <div>
                    <div className="text-2xl font-bold text-primary">{ticketStats.resolved}</div>
                    <div className="text-xs text-muted-foreground">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="holographic">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <div>
                    <div className="text-2xl font-bold text-destructive">{ticketStats.urgent}</div>
                    <div className="text-xs text-muted-foreground">Urgent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input/50 border-border/50"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40 bg-input/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-40 bg-input/50">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id} className="neon-border hover:glow-effect transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{ticket.title}</h3>
                        <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority}</Badge>
                        <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm mb-3">{ticket.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TicketIcon className="h-3 w-3" />
                          {ticket.id}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {ticket.customer.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {ticket.messages} messages
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {ticket.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {ticket.assignedAgent && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                              {ticket.assignedAgent.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{ticket.assignedAgent.name}</span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTicketStatus(ticket.id, "in-progress")}
                          disabled={ticket.status === "in-progress"}
                          className="bg-transparent"
                        >
                          Start
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateTicketStatus(ticket.id, "resolved")}
                          disabled={ticket.status === "resolved"}
                          className="bg-transparent"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  </div>
                  {ticket.tags.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <div className="flex gap-1">
                        {ticket.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
