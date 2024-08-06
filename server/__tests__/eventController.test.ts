import { Request, Response } from 'express';
import * as eventController from '../controllers/eventController';
import models from '../models/events';

jest.mock('../models/events');

describe('Event Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockEvent: any;

  beforeEach(() => {
    mockEvent = {
      _id: '1',
      place_id: '123',
      park_name: 'Test Park',
      address: '123 Test St',
      date: new Date().toISOString(),
      user: 'testuser',
      dog_avatar: 'avatar.jpg'
    };

    mockRequest = {
      params: { place_id: '123', user: 'testuser', _id: '1' },
      body: mockEvent
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      (models.find as jest.Mock).mockResolvedValue([mockEvent]);

      await eventController.getEvents(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([mockEvent]);
    });

    it('should handle errors', async () => {
      (models.find as jest.Mock).mockRejectedValue(new Error('Test Error'));

      await eventController.getEvents(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });

  describe('getEventsbyPark', () => {
    it('should return events for a specific park', async () => {
      (models.find as jest.Mock).mockResolvedValue([mockEvent]);

      await eventController.getEventsbyPark(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([mockEvent]);
    });

    it('should handle missing place_id', async () => {
      mockRequest.params = {};

      await eventController.getEventsbyPark(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'place_id is required' });
    });
  });

  describe('getEventsbyUser', () => {
    it('should return events for a specific user', async () => {
      (models.find as jest.Mock).mockResolvedValue([mockEvent]);

      await eventController.getEventsbyUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith([mockEvent]);
    });

    it('should handle missing user', async () => {
      mockRequest.params = {};

      await eventController.getEventsbyUser(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'user is required' });
    });
  });

  describe('postEvents', () => {
    it('should create a new event', async () => {
      (models.create as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.postEvents(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockEvent);
    });

    it('should handle missing event data', async () => {
      mockRequest.body = {};

      await eventController.postEvents(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Missing required parameters.' });
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', async () => {
      (models.findByIdAndDelete as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.deleteEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event deleted successfully', deletedEvent: mockEvent });
    });

    it('should handle missing event_id', async () => {
      mockRequest.params = {};

      await eventController.deleteEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '_id is required' });
    });
  });

  describe('editEvent', () => {
    it('should edit an event', async () => {
      (models.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockEvent);

      await eventController.editEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event updated successfully', updatedEvent: mockEvent });
    });

    it('should handle missing _id', async () => {
      mockRequest.params = {};

      await eventController.editEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: '_id is required' });
    });

    it('should handle missing date', async () => {
      mockRequest.body = {};

      await eventController.editEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'date is required for updating' });
    });

    it('should handle event not found', async () => {
      (models.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await eventController.editEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Event not found' });
    });

    it('should handle internal server error', async () => {
      (models.findByIdAndUpdate as jest.Mock).mockRejectedValue(new Error('Test Error'));

      await eventController.editEvent(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
  });
});