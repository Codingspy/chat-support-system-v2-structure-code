import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ISession extends Document {
  userId: Types.ObjectId;
  ticketId: Types.ObjectId;
  startedAt: Date;
  endedAt?: Date | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    ticketId: { type: Schema.Types.ObjectId, ref: "Ticket", required: true, index: true },
    startedAt: { type: Date, required: true, default: () => new Date() },
    endedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: null }
  },
  { timestamps: true }
);

SessionSchema.index({ ticketId: 1, startedAt: -1 });

export const Session: Model<ISession> = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);


