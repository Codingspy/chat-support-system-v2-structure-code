import { ChatInterface } from "@/components/chat-interface"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Welcome to CyberSupport
          </h1>
          <p className="text-muted-foreground text-lg">
            Experience the future of customer support with our AI-powered chat system
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  )
}
