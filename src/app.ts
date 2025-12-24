import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import { envVar } from "./config/env.config";

const app: Application = express();
app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: true,
    credentials: true,
  })
);

//parser
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: envVar.NODE_ENV,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
