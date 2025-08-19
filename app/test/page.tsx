"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ticketsApi, messagesApi } from "@/lib/api"

export default function TestPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Load tickets
  useEffect(() => {
    setLoading(true)
    ticketsApi.list()
      .then((data) => {
        console.log("Tickets loaded:", data)
        setTickets(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("Failed to load tickets:", error)
        setLoading(false)
      })
  }, [])

  // Load messages when ticket is selected
  useEffect(() => {
    if (!selectedTicket) return
    
    messagesApi.list(selectedTicket)
      .then((data) => {
        console.log("Messages loaded:", data)
        setMessages(Array.isArray(data) ? data : [])
      })
      .catch((error) => {
        console.error("Failed to load messages:", error)
      })
  }, [selectedTicket])

  const createTicket = async () => {
    try {
      const newTicket = await ticketsApi.create({
        subject: "Test ticket " + new Date().toLocaleTimeString(),
        priority: "medium",
        tags: ["test"],
        initialMessage: "This is a test ticket"
      })
      console.log("Ticket created:", newTicket)
      setTickets(prev => [newTicket, ...prev])
      setSelectedTicket(newTicket._id)
    } catch (error) {
      console.error("Failed to create ticket:", error)
    }
  }

  const sendMessage = async () => {
    if (!selectedTicket || !newMessage.trim()) return
    
    try {
      const message = await messagesApi.send(selectedTicket, newMessage)
      console.log("Message sent:", message)
      setMessages(prev => [...prev, message])
      setNewMessage("")
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Backend API Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={createTicket} className="mb-4">
            Create Test Ticket
          </Button>
          
          {loading ? (
            <p>Loading tickets...</p>
          ) : (
            <div className="space-y-2">
              <h3 className="font-semibold">Tickets ({tickets.length}):</h3>
              {tickets.map((ticket) => (
                <div 
                  key={ticket._id} 
                  className={`p-3 border rounded cursor-pointer ${
                    selectedTicket === ticket._id ? 'bg-blue-100' : 'bg-gray-50'
                  }`}
                  onClick={() => setSelectedTicket(ticket._id)}
                >
                  <div className="font-medium">{ticket.subject}</div>
                  <div className="text-sm text-gray-600">
                    Status: {ticket.status} | Priority: {ticket.priority}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedTicket && (
        <Card>
          <CardHeader>
            <CardTitle>Messages for Ticket: {selectedTicket}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              {messages.map((message) => (
                <div key={message._id} className="p-2 border rounded">
                  <div className="font-medium">{message.senderType}: {message.content}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(message.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
