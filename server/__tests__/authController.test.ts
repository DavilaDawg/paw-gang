import { Request, Response } from 'express';
import * as sessionController from '../controllers/authController';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import { BlockedUser } from '../models/blockedUsers';
import crypto from 'crypto';

jest.mock('jsonwebtoken');
jest.mock('../models/users');
jest.mock('../models/blockedUsers');

dotenv.config();

const SUPER_SECRET_KEY = process.env.JWT_SECRET || 'default_key';

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockToken = jwt.sign({ userId: 'validUserId' }, SUPER_SECRET_KEY, {
  expiresIn: '1h'
});
mockedJwt.verify.mockImplementation(() => ({ userId: 'mockedUserId' }));

describe('Session Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createSession', () => {
    it('should return 404 if the user does not exist', async () => {
      mockRequest.body = { userId: 'invalidUserId', password: 'validPassword' };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User not found'
      });
    });

    it('should return 400 if the user ID or password is missing', async () => {
      mockRequest.body = { userId: '', password: '' };

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'User ID and password is required'
      });
    });

    it('should return 401 if the password is invalid', async () => {
      mockRequest.body = { userId: 'validUserId', password: 'invalidPassword' };
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: 'validUserId',
        password: 'salt:storedHash'
      });

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Invalid credentials'
      });
    });

    it('should return 500 if an error occurs', async () => {
      mockRequest.body = { userId: 'validUserId', password: 'validPassword' };
      (User.findOne as jest.Mock).mockRejectedValue(
        new Error('Database error')
      );

      await sessionController.createSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Internal Server Error'
      });
    });
  });

  describe('getSession', () => {
    it('should return 403 if the token is blocked', async () => {
      mockRequest.params = { token: 'blockedToken' };
      (BlockedUser.findOne as jest.Mock).mockResolvedValue({
        token: 'blockedToken'
      });

      await sessionController.getSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Token is blocked'
      });
    });

    it('should return 400 if the token is missing', async () => {
      mockRequest.params = { token: '' };

      await sessionController.getSession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Token is required'
      });
    });
  });

  describe('destroySession', () => {
    it('should create and save a blocked user with the provided token', async () => {
      const mockToken = 'test_token';
      mockRequest.params = { token: mockToken };

      const mockSave = jest.fn().mockResolvedValueOnce(undefined);
      (BlockedUser.prototype.save as jest.Mock) = mockSave;
      (BlockedUser.findOne as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce(null);

      await sessionController.destroySession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(BlockedUser).toHaveBeenCalledWith({ token: mockToken });
      expect(mockSave).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'User deleted successfully'
      });
    });

    it('should return 200 if the token is already blocked', async () => {
      const mockToken = 'test_token';
      mockRequest.params = { token: mockToken };

      (BlockedUser.findOne as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce({ token: mockToken });

      await sessionController.destroySession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Token already blocked'
      });
    });

    it('should return 500 if an error occurs during save operation', async () => {
      const mockToken = 'test_token';
      mockRequest.params = { token: mockToken };

      const mockError = new Error('Save failed');
      const mockSave = jest.fn().mockRejectedValueOnce(mockError);
      (BlockedUser.prototype.save as jest.Mock) = mockSave;
      (BlockedUser.findOne as jest.Mock) = jest
        .fn()
        .mockResolvedValueOnce(null);

      await sessionController.destroySession(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Internal Server Error'
      });
    });
  });
});
