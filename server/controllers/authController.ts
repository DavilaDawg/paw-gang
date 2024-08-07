import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import Model from "../models/users";
import { BlockedUser } from "../models/blockedUsers";
import crypto from "crypto";

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
  const { userId, password } = req.body;

  if (!userId || !password) {
    res.status(400).json({ error: "User ID and password is required" }); // change text in test!!
    return;
  }

  try {
    const user = await Model.findOne({ userId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const [salt, storedHash] = user.password.split(":");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    if (hash !== storedHash) {
      res.status(401).json({ error: "Invalid credentials" });
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

export const getSession = async (
  req: Request,
  res: Response
): Promise<JWTPayload | null> => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  try {
    const blockedToken = await BlockedUser.findOne({ token });

    if (blockedToken) {
      res.status(403).json({ error: "Token is blocked" });
      return;
    }

    const decoded = jwt.verify(token, SUPER_SECRET_KEY) as JWTPayload;
    res.status(200).json({ valid: true, userId: decoded.userId });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.log("Token has expired.");
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error.message);
      res.status(401).json({ error: "Invalid token" });
    } else {
      console.error("Error verifying token:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export const destroySession = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token } = req.params;

  try {
    const existingToken = await BlockedUser.findOne({ token });
    if (existingToken) {
      res.status(200).json({ message: "Token already blocked" });
      return;
    }

    const blockedUser = new BlockedUser({ token });
    await blockedUser.save();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: User[] = await Model.find({}, { password: 0 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signUp = async (
  req: Request<{}, {}, User>,
  res: Response
): Promise<void> => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      res.status(400).json({ error: "Missing required parameters." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    const newUser: User = await Model.create({
      userId,
      password: `${salt}:${hash}`,
    });

    res.status(201);
    res.json({
      userId: newUser.userId,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Internal server error");
    res.status(500).json({ error: "Internal Server Error" });
  }
};
