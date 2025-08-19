import { ChatInterface } from "@/components/chat-interface";

export default function TicketPage({ params }: { params: { id: string } }) {
  // TODO: Replace with your real auth/user state provider
  const currentUser = { id: "demo-user", role: "user" as const };
  return <ChatInterface ticketId={params.id} currentUser={currentUser} />;
}


