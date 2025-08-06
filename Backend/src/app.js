import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";
import { requestLogger } from "./middleware/requestLogger.middleware.js";

const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Secure Headers
app.use(helmet());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000,
  message: "Too many requests from this IP, Please try again later",
});
app.use(limiter);

app.use(express.json());
app.use(cookieParser());
app.use(compression());
app.use(requestLogger);

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// 404 Handler
app.use(notFound);
// Error handler
app.use(errorHandler);

export default app;
