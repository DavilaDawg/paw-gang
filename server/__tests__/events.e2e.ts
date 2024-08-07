import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import * as eventController from '../controllers/eventController';

const app = express();
app.use(express.json());

app.get('/events', eventController.getEvents);
app.get('/events/park/:place_id', eventController.getEventsbyPark);
app.get('/events/user/:user', eventController.getEventsbyUser);
app.post('/events', eventController.postEvents);
app.delete('/events/:_id', eventController.deleteEvent);
app.put('/events/:_id', eventController.editEvent);

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/events_test')
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Event API Endpoints', () => {
  let eventId: string;

  it('should create a new event', async () => {
    const response = await request(app)
      .post('/events')
      .send({
        place_id: '12345',
        park_name: 'Central Park',
        address: '123 Park Ave',
        date: new Date(),
        user: 'user123',
        dog_avatar: 'http://example.com/avatar.png',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('place_id', '12345');
    eventId = response.body._id; 
  });

  it('should get all events', async () => {
    const response = await request(app).get('/events');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get events by park', async () => {
    const response = await request(app).get(`/events/park/12345`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should get events by user', async () => {
    const response = await request(app).get(`/events/user/user123`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should update an event', async () => {
    const response = await request(app)
      .put(`/events/${eventId}`)
      .send({ date: new Date() });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event updated successfully');
    expect(response.body.updatedEvent).toHaveProperty('date');
  });

  it('should delete an event', async () => {
    const response = await request(app).delete(`/events/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'Event deleted successfully');
  });
});