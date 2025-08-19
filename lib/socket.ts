import { io, Socket } from "socket.io-client";

function getSocketUrl(): string {
  if (typeof window !== "undefined") {
    return (window as any).NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
  }
  return process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
}

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ["websocket"],
      // auth: { token: typeof window !== 'undefined' ? localStorage.getItem('accessToken') || undefined : undefined },
    });
  }
  return socket;
}

export function joinTicketRoom(ticketId: string) {
  getSocket().emit("join:ticket", ticketId);
}

export function sendSocketMessage(payload: { ticketId: string; senderId: string; senderType: "user" | "agent"; content: string }) {
  getSocket().emit("message:send", payload);
}

export function onNewMessage(cb: (message: any) => void) {
  getSocket().on("message:new", cb);
}

export function onTypingUpdate(cb: (p: { ticketId: string; userId: string; typing: boolean }) => void) {
  getSocket().on("typing:update", cb);
}

export function emitTypingStart(ticketId: string, userId: string) {
  getSocket().emit("typing:start", { ticketId, userId });
}

export function emitTypingStop(ticketId: string, userId: string) {
  getSocket().emit("typing:stop", { ticketId, userId });
}


