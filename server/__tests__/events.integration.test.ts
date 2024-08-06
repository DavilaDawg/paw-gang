import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import express from "express";
import {
  getEvents,
  getEventsbyPark,
  getEventsbyUser,
  postEvents,
  deleteEvent,
  editEvent,
} from "../controllers/eventController";
import EventModel from "../models/events";

const app = express();
app.use(express.json());
app.get("/events", getEvents);
app.get("/events/park/:place_id", getEventsbyPark);
app.get("/events/user/:user", getEventsbyUser);
app.post("/events", postEvents);
app.delete("/events/:_id", deleteEvent);
app.put("/events/:_id", editEvent);

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await EventModel.deleteMany({});
});

describe("Event Controller Integration Tests", () => {
  let eventId: string;

  const mockEvent = {
    place_id: "123",
    park_name: "Test Park",
    address: "123 Test St",
    date: new Date().toISOString(),
    user: "testuser",
    dog_avatar: "avatar.jpg",
  };

  it("should create a new event", async () => {
    const response = await request(app)
      .post("/events")
      .send(mockEvent)
      .expect(201);

    expect(response.body).toHaveProperty("_id");
    expect(response.body.place_id).toBe(mockEvent.place_id);

    eventId = response.body._id;
  });

  it("should retrieve all events", async () => {
    await request(app).post("/events").send(mockEvent).expect(201);

    const response = await request(app).get("/events").expect(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].place_id).toBe(mockEvent.place_id);
  });

  it("should retrieve events by park", async () => {
    await request(app).post("/events").send(mockEvent).expect(201);

    const response = await request(app)
      .get(`/events/park/${mockEvent.place_id}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].place_id).toBe(mockEvent.place_id);
  });

  it("should retrieve events by user", async () => {
    await request(app).post("/events").send(mockEvent).expect(201);

    const response = await request(app)
      .get(`/events/user/${mockEvent.user}`)
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].user).toBe(mockEvent.user);
  });

  it("should edit an event", async () => {
    const createResponse = await request(app)
      .post("/events")
      .send(mockEvent)
      .expect(201);

    const eventId = createResponse.body._id;

    const updatedDate = new Date().toISOString();

    const updateResponse = await request(app)
      .put(`/events/${eventId}`)
      .send({ date: updatedDate })
      .expect(200);

    const receivedDate = new Date(
      updateResponse.body.updatedEvent.date
    ).toISOString();

    const tolerance = 1000;
    const updatedDateTime = new Date(updatedDate).getTime();
    const receivedDateTime = new Date(receivedDate).getTime();

    expect(Math.abs(updatedDateTime - receivedDateTime)).toBeLessThanOrEqual(
      tolerance
    );
    expect(updateResponse.body.message).toBe("Event updated successfully");
    expect(updateResponse.body.updatedEvent).toHaveProperty("_id", eventId);
  });

  it("should delete an event", async () => {
    const { body } = await request(app)
      .post("/events")
      .send(mockEvent)
      .expect(201);

    await request(app).delete(`/events/${body._id}`).expect(200);

    const response = await request(app).get("/events").expect(200);
    expect(response.body).toHaveLength(0);
  });
});
