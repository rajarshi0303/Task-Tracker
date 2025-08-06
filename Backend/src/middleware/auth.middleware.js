import { verifyAccessToken } from "../utils/token.util.js";

export const authenticate = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Access token missing" });

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    res.status(401).json({ message: "Invalid or expired access token" });
  }
};
