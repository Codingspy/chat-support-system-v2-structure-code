"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testConnection = async () => {
    setLoading(true)
    setResults([])
    
    try {
      // Test 1: Basic fetch to health endpoint
      addResult("Testing basic connection to /health...")
      const healthRes = await fetch("http://localhost:4000/health")
      const healthData = await healthRes.json()
      addResult(`✅ Health check: ${JSON.stringify(healthData)}`)

      // Test 2: Test API endpoint
      addResult("Testing API endpoint /api/test...")
      const apiRes = await fetch("http://localhost:4000/api/test")
      const apiData = await apiRes.json()
      addResult(`✅ API test: ${JSON.stringify(apiData)}`)

      // Test 3: Test tickets endpoint with demo token
      addResult("Testing tickets endpoint with demo token...")
      const ticketsRes = await fetch("http://localhost:4000/api/v1/tickets", {
        headers: {
          "Authorization": "Bearer demo-token",
          "Content-Type": "application/json"
        }
      })
      const ticketsData = await ticketsRes.json()
      addResult(`✅ Tickets endpoint: ${JSON.stringify(ticketsData)}`)

      // Test 4: Test ticket creation
      addResult("Testing ticket creation...")
      const createRes = await fetch("http://localhost:4000/api/v1/tickets", {
        method: "POST",
        headers: {
          "Authorization": "Bearer demo-token",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          subject: "Debug Test Ticket",
          priority: "low",
          tags: ["debug"],
          initialMessage: "This is a debug test"
        })
      })
      const createData = await createRes.json()
      addResult(`✅ Ticket creation: ${JSON.stringify(createData)}`)

    } catch (error: any) {
      addResult(`❌ Error: ${error.message}`)
      console.error("Debug test error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>🔧 API Connection Debug</CardTitle>
          <p className="text-sm text-gray-600">
            This page tests the connection to the backend API step by step.
          </p>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testConnection} 
            disabled={loading}
            className="mb-4"
          >
            {loading ? "Testing..." : "Run Connection Tests"}
          </Button>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {results.length === 0 ? (
              <p className="text-gray-500">Click the button above to run tests</p>
            ) : (
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono mb-1">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
