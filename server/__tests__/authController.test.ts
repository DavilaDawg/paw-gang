import { Request, Response } from "express";
import * as eventController from "../controllers/authController";
import models from "../models/users";

jest.mock("../models/users");

describe("Event Controller", () => {
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
    it("should create a session", async () => {
      const mockUser = [
        { username: "squigglePiggle213", password: "iloveleaves" },
      ];
      (models.create as jest.Mock).mockResolvedValue(mockUser);

      eventController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });
});
