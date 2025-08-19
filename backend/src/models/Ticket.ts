import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type TicketStatus = "open" | "pending" | "resolved" | "closed";

export interface ITicket extends Document {
  subject: string;
  createdBy: Types.ObjectId; // user id
  assignedTo?: Types.ObjectId; // agent id
  status: TicketStatus;
  priority: "low" | "medium" | "high";
  tags: string[];
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>(
  {
    subject: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    status: { type: String, enum: ["open", "pending", "resolved", "closed"], default: "open", index: true },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    tags: { type: [String], default: [] },
    lastMessageAt: { type: Date, default: null }
  },
  { timestamps: true }
);

TicketSchema.index({ createdBy: 1, updatedAt: -1 });
TicketSchema.index({ assignedTo: 1, updatedAt: -1 });

export const Ticket: Model<ITicket> = mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema);


