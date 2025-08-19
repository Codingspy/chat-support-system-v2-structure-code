import http from "http";
import { createApp } from "./app";
import { connectToDatabase } from "./config/db";
import { env } from "./config/env";
import { registerSocketServer } from "./sockets";

async function bootstrap() {
  await connectToDatabase();
  const app = createApp();
  const server = http.createServer(app);

  registerSocketServer(server);

  server.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

bootstrap().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Fatal error during bootstrap:", err);
  process.exit(1);
});


