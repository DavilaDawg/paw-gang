import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { User } from "../models/users";
import { BlockedUser } from "../models/blockedUsers";

dotenv.config();

const SUPER_SECRET_KEY: string = process.env.JWT_SECRET;
interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const createSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.body.userId;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      console.error("User not found");
      res.status(404).json({ error: "User not found" });
      return;
    }

    const payload: JWTPayload = { userId };
    const token = jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
