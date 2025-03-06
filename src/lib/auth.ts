import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET || "", { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
};
