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
    it('should return events for a specific park', async () => {});

    it('should handle missing place_id', async () => {});
  });

  describe('getEventsbyUser', () => {
    it('should return events ', async () => {});

    it('should handle missing user', async () => {});
  });

  describe('postEvents', () => {
    it('should create a new event', async () => {});

    it('should handle missing', async () => {});
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {});

    it('should', async () => {});
  });

  describe('editEvent', () => {
    it('should', async () => {});
  });
});
