const express = require("express");
const {
  getEventsbyPark,
  getEventsbyUser,
  getEvents,
  postEvents,
  deleteEvent,
  editEvent,
} = require("./controllers/eventController");

const { getUsers, signUp, createSession, getSession, destroySession } = require("./controllers/authController")

const router = express.Router();

router.get("/events/", getEvents);
router.get("/events/park/:place_id", getEventsbyPark);
router.get("/events/user/:user", getEventsbyUser);
router.post("/events", postEvents);
router.delete("/events/:_id", deleteEvent);
router.put("/events/:_id", editEvent);

router.get("/users", getUsers) // for testing 

router.post("/users", signUp) 

router.post("/sessions", createSession); // login
router.get("/sessions/:token", getSession); // verify token
router.post("/sessions/:token", destroySession); // logout

export default router;
