import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Model from "../models/users";
import { BlockedUser } from "../models/blockedUsers";

dotenv.config();

const SUPER_SECRET_KEY: string = process.env.JWT_SECRET || "default_key";
interface User {
  userId: string;
  password: string;
}
interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

export const createSession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.body;

  if (!userId) {
    res.status(400).json({ error: "User ID is required" });
    return;
  }

  try {
    const user = await Model.findOne(userId);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const payload: JWTPayload = { userId };
    const token = jwt.sign(payload, SUPER_SECRET_KEY, { expiresIn: "1h" });
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error creating session:", error.message, error.stack);
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

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await Model.find();
    res.status(200).json(users)
  } catch(error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

export const signUp = async (
  req: Request<{}, {}, User>,
  res: Response
): Promise<void> => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      res.status(400).json({ error: 'Missing required parameters.' });
    }
    const newUser: User = await Model.create({
      userId,
      password
    });
    res.status(201);
    res.json(newUser);
  } catch (error) {
    console.error('Internal server error');
    res.status(500);
  }
};