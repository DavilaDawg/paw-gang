import axios from 'axios';
import moment from 'moment-timezone';
import { Event } from '../types/types';

const SERVER_URL = `http://localhost:3000`;

export const fetchEvents = async (
  place_id: string,
  setEvents: React.Dispatch<React.SetStateAction<Record<string, Event[]>>>
) => {
  try {
    const response = await axios.get<Event[]>(
      `${SERVER_URL}/events/park/${place_id}`
    );
    const data = response.data;
    const formattedEvents = data.reduce<Record<string, Event[]>>(
      (acc, event) => {
        const dateKey = moment(event.date)
          .tz('Europe/Madrid')
          .format('YYYY-MM-DD');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(event);
        return acc;
      },
      {}
    );
    setEvents(formattedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const saveEvent = async (
  selectedDate: moment.Moment,
  newEventDate: string,
  place_id: string,
  name: string,
  vicinity: string,
  setEvents: React.Dispatch<React.SetStateAction<Record<string, Event[]>>>
) => {
  const eventDate = moment
    .tz(
      `${selectedDate.format('YYYY-MM-DD')} ${newEventDate}`,
      'YYYY-MM-DD HH:mm',
      'Europe/Madrid'
    )
    .toISOString();

  const eventToAdd: Omit<Event, '_id'> = {
    place_id,
    park_name: name,
    address: vicinity,
    date: eventDate,
    user: 'isa', // FIX HARDCODE
    dog_avatar:
      'https://i.ibb.co/86gL7yK/Whats-App-Image-2024-07-25-at-15-20-30-modified.png'
  };

  const response = await axios.post(`${SERVER_URL}/events`, eventToAdd);
  const savedEvent = response.data;

  const dateKey = selectedDate.format('YYYY-MM-DD');
  setEvents(prevEvents => ({
    ...prevEvents,
    [dateKey]: [...(prevEvents[dateKey] || []), savedEvent]
  }));
};
