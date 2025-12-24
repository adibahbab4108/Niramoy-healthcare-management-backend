import { Server } from "http";
import { envVar } from "./config/env.config";
import app from "./app";
import connectDB from "./config/db.config";

async function bootstrap() {
  let server: Server | undefined;

  try {
    await connectDB()
    server = app.listen(envVar.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${envVar.PORT}`);
    });

    const exitHandler = () => {
      if (server) {
        server.close(() => {
          console.log("Server closed gracefully.");
          process.exit(0);
        });
      } else {
        process.exit(0);
      }
    };

    process.on("SIGTERM", exitHandler);
    process.on("SIGINT", exitHandler);

    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      exitHandler();
    });

    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      process.exit(1);
    });

  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

bootstrap();
