const express = require("express");
const {
  getEventsbyPark,
  getEventsbyUser,
  getEvents,
  postEvents,
  deleteEvent,
  editEvent,
} = require("./controllers/eventController");
const router = express.Router();

router.get("/events/", getEvents);
router.get("/events/park/:place_id", getEventsbyPark);
router.get("/events/user/:user", getEventsbyUser);
router.post("/events", postEvents);
router.delete("/events/:_id", deleteEvent);
router.put("/events/:_id", editEvent);

export default router;
