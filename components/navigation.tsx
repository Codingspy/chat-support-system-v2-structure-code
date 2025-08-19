"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, TicketIcon, Users, Zap } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/",
      label: "Chat",
      icon: MessageSquare,
      description: "Customer Chat Interface",
    },
    {
      href: "/agent",
      label: "Agent Dashboard",
      icon: Users,
      description: "Agent Support Dashboard",
    },
    {
      href: "/tickets",
      label: "Tickets",
      icon: TicketIcon,
      description: "Ticket Management",
    },
  ]

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-full p-2 neon-border">
        <div className="flex items-center gap-1 px-3">
          <Zap className="h-4 w-4 text-primary" />
          <span className="font-bold text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            CyberSupport
          </span>
          <Badge variant="secondary" className="text-xs holographic">
            v2.0
          </Badge>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isActive ? "bg-primary text-primary-foreground glow-effect" : "hover:bg-accent/50 hover:glow-effect"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
