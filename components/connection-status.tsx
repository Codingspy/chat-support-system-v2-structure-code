"use client"

import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff, Users } from "lucide-react"
import type { ConnectionStatus } from "@/hooks/use-realtime-chat"

interface ConnectionStatusProps {
  status: ConnectionStatus
  onlineUsers: number
}

export function ConnectionStatusIndicator({ status, onlineUsers }: ConnectionStatusProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant={status.isConnected ? "secondary" : "destructive"} className="flex items-center gap-1 holographic">
        {status.isConnected ? (
          <>
            <Wifi className="h-3 w-3" />
            Connected
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Reconnecting...
          </>
        )}
      </Badge>

      <Badge variant="outline" className="flex items-center gap-1">
        <Users className="h-3 w-3" />
        {onlineUsers} online
      </Badge>

      {status.lastSeen && (
        <span className="text-muted-foreground">Last seen: {status.lastSeen.toLocaleTimeString()}</span>
      )}
    </div>
  )
}
