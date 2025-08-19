"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChatInterface } from "@/components/chat-interface"
import { ticketsApi } from "@/lib/api"

export default function DemoPage() {
  const [ticketId, setTicketId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Create a demo ticket automatically
    const createDemoTicket = async () => {
      try {
        const ticket = await ticketsApi.create({
          subject: "Demo Support Ticket",
          priority: "medium",
          tags: ["demo"],
          initialMessage: "Hi, I need help with my account."
        })
        console.log("Demo ticket created:", ticket)
        setTicketId(ticket._id)
        setLoading(false)
      } catch (error) {
        console.error("Failed to create demo ticket:", error)
        setLoading(false)
      }
    }

    createDemoTicket()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Creating demo ticket...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!ticketId) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600">Failed to create demo ticket. Please try refreshing the page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🤖 AI Chat Support Demo</CardTitle>
          <p className="text-sm text-gray-600">
            This is a demo of the AI-powered chat support system. Try typing messages like:
          </p>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>"Hi" or "Hello" - Get a greeting response</li>
            <li>"I need help" - Get support assistance</li>
            <li>"I have an error" - Get technical support</li>
            <li>"Account problem" - Get account-related help</li>
            <li>"Payment issue" - Get billing support</li>
          </ul>
        </CardHeader>
        <CardContent>
          <ChatInterface 
            ticketId={ticketId} 
            currentUser={{ id: "demo-user", role: "user" as const }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
