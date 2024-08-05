// __tests__/events.controller.test.ts

import { Request, Response } from 'express';
import * as eventController from '../controllers/eventController';
import models from '../models/events';

jest.mock('../models/events');

describe('Event Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      const mockEvents = [{ id: '1', park_name: 'Test Park' }];
      (models.find as jest.Mock).mockResolvedValue(mockEvents);

      await eventController.getEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle errors', async () => {
      (models.find as jest.Mock).mockRejectedValue(new Error('Test Error'));

      await eventController.getEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getEventsbyPark', () => {
    it('should return events for a specific park', async () => {
      const mockEvents = [{ id: '1', park_name: 'Test Park' }];
      (models.find as jest.Mock).mockResolvedValue(mockEvents);

      await eventController.getEventsbyPark(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle missing place_id', async () => {
      await eventController.getEventsbyPark(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing park_id'
      });
    });
  });

  describe('getEventsbyUser', () => {
    it('should return events ', async () => {
      const mockEvents = [{ id: '1', park_name: 'Test Park' }];
      (models.find as jest.Mock).mockResolvedValue(mockEvents);

      await eventController.getEventsbyUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvents);
    });

    it('should handle missing user', async () => {
      await eventController.getEventsbyUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing user_id'
      });
    });
  });

  describe('postEvents', () => {
    it('should create a new event', async () => {
      const mockEvent = { id: '1', park_name: 'Test Park' };
      (models.create as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.postEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle missing', async () => {
      await eventController.postEvents(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing event data'
      });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      const mockEvent = { id: '1', park_name: 'Test Park' };
      (models.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.deleteEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should', async () => {
      await eventController.deleteEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Missing event_id'
      });
    });
  });

  describe('editEvent', () => {
    it('should', async () => {
      const mockEvent = { id: '1', park_name: 'Test Park' };
      (models.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.editEvent(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });
  });
});
