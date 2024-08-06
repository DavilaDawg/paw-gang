import { Request, Response } from "express";
import * as sessionController from "../controllers/authController";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User } from "../models/users";
import { BlockedUser } from "../models/blockedUsers";
import { destroySession } from '../controllers/authController';

jest.mock("jsonwebtoken");
jest.mock("../models/users");
jest.mock("../models/blockedUsers");

dotenv.config();

const SUPER_SECRET_KEY = process.env.JWT_SECRET || "default_key";

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockToken = jwt.sign(
  { userId: "validUserId" },        // Payload
  SUPER_SECRET_KEY,                 // Key
  { expiresIn: "1h" }               // Options
);
mockedJwt.verify.mockImplementation(() => ({ userId: "mockedUserId" }));

describe("Session Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("createSession", () => {
    it("should create a session if the user exists in the database", async () => {
      mockRequest.body = { userId: "validUserId" };
      (User.findById as jest.Mock).mockResolvedValue({ _id: "validUserId" });

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(User.findById).toHaveBeenCalledWith("validUserId");
      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { userId: "validUserId" },
        SUPER_SECRET_KEY,
        { expiresIn: "1h" }
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({ token: mockToken });
    });

    it("should return 404 if the user does not exist", async () => {
      mockRequest.body = { userId: "invalidUserId" };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User not found",
      });
    });

    it("should return 400 if the user ID does not exist", async () => {
      mockRequest.body = { userId: "" };
      (User.findById as jest.Mock).mockResolvedValue(null);

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "User ID is required",
      });
    });

    it("should return 500 if an error occurs", async () => {
      mockRequest.body = { userId: "validUserId" };
      (User.findById as jest.Mock).mockRejectedValue(
        new Error("Database error")
      );

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Internal Server Error",
      });
    });
  });

  describe("getSession", () => {
    it("should return null if the token is blocked", async () => {
      (BlockedUser.findOne as jest.Mock).mockResolvedValue({
        token: "blockedToken",
      });

      const result = await sessionController.getSession("blockedToken");

      expect(result).toBeNull();
    });

    it("should return null if the token is invalid", async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.JsonWebTokenError("Invalid token");
      });

      const result = await sessionController.getSession("invalidToken");

      expect(result).toBeNull();
    });

    it("should return null if the token has expired", async () => {
      mockedJwt.verify.mockImplementation(() => {
        throw new jwt.TokenExpiredError("Token expired", new Date());
      });

      const result = await sessionController.getSession("expiredToken");

      expect(result).toBeNull();
    });
  });

  
describe('destroySession', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and save a blocked user with the provided token', async () => {
    const mockToken = 'test_token';
    const mockSave = jest.fn().mockResolvedValueOnce(undefined);
    (BlockedUser.prototype.save as jest.Mock) = mockSave;

    await destroySession(mockToken);

    expect(BlockedUser).toHaveBeenCalledWith({ token: mockToken });
    expect(mockSave).toHaveBeenCalled();
  });

  it('should handle errors during save operation', async () => {
    const mockToken = 'test_token';
    const mockError = new Error('Save failed');
    const mockSave = jest.fn().mockRejectedValueOnce(mockError);
    (BlockedUser.prototype.save as jest.Mock) = mockSave;

    await expect(destroySession(mockToken)).rejects.toThrow('Save failed');
  });
});
});