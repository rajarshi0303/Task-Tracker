import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const createAccessToken = ({ id, role }) => {
  return jwt.sign({ id, role }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const createRefreshToken = ({ id, role }) => {
  return jwt.sign({ id, role }, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);
export const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);
