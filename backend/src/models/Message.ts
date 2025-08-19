import mongoose, { Schema, Document, Model, Types } from "mongoose";

export type MessageSenderType = "user" | "agent";
export type MessageStatus = "sent" | "delivered" | "read";

export interface IMessage extends Document {
  ticketId: Types.ObjectId;
  senderId: Types.ObjectId;
  senderType: MessageSenderType;
  content: string;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    senderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    senderType: { type: String, enum: ["user", "agent"], required: true },
    content: { type: String, required: true },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
  },
  { timestamps: true }
);

MessageSchema.index({ ticketId: 1, createdAt: 1 });

export const Message: Model<IMessage> = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);


