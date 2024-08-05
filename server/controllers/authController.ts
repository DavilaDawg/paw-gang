import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/users";
import { BlockedUser } from "../models/blockedUsers";

dotenv.config();

const SUPER_SECRET_KEY: string = process.env.JWT_SECRET;
interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const createSession = async (userId: string): Promise<string> => {
  const user = await User.findById(userId);

  if (!user) {
    console.error("User not found");
    return null;
  }

  const payload: JWTPayload = { userId };
  return jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: "1h" });
};

export const getSession = async (token: string): Promise<JWTPayload | null> => {
  try {
    const blockedToken = await BlockedUser.findOne({ token });
    if (blockedToken) return null;

    const decoded = jwt.verify(token, SUPER_SECRET_KEY) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token has expired.");
    } else {
      console.error("Invalid token:", error);
    }
    return null;
  }
};

export const destroySession = async (token: string): Promise<void> => {
  const blockedUser = new BlockedUser({ token });
  await blockedUser.save();
};
