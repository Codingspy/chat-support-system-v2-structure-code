import { ITicket, Ticket } from "../models/Ticket";

export async function canAccessTicket(user: { id: string; role: "user" | "agent" | "admin" }, ticketId: string): Promise<boolean> {
  if (user.role === "admin") return true;
  const ticket = await Ticket.findById(ticketId).select("createdBy assignedTo");
  if (!ticket) return false;
  if (user.role === "user") return ticket.createdBy.toString() === user.id;
  if (user.role === "agent") return !ticket.assignedTo || ticket.assignedTo.toString() === user.id;
  return false;
}

export function assertAccess(result: boolean): void {
  if (!result) {
    const err: any = new Error("Forbidden");
    err.status = 403;
    throw err;
  }
}


