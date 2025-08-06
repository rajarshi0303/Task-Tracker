import { v4 as uuidv4 } from "uuid";

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const traceId = uuidv4();

  req.traceId = traceId;
  res.setHeader("X-Trace-Id", traceId);

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${traceId}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
