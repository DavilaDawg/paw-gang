const mongoose = require('mongoose');
const moment = require('moment-timezone');

const { Schema } = mongoose;

// defining the Schema for the Events

const events = new Schema({
  place_id: { type: String, required: true },
  park_name: { type: String, required: true },
  address: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    set: (date) => moment.tz(date, 'Europe/Madrid').toDate(),
    get: (date) => moment(date).tz('Europe/Madrid').format(),
  },
  user: { type: String, required: true },
  dog_avatar: { type: String, required: true },
});

events.set('toJSON', { getters: true });

const Events = mongoose.model('Events', events);

module.exports = Events;
