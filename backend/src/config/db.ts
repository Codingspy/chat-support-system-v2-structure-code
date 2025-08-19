import mongoose from "mongoose";
import { env } from "./env";

export async function connectToDatabase(): Promise<void> {
  const uri = env.mongoUri;
  await mongoose.connect(uri, {
    autoIndex: env.nodeEnv !== "production"
  });
}


