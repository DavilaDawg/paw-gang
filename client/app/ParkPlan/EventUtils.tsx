import axios from 'axios';
import moment from 'moment-timezone';
import { Alert } from 'react-native';
import { Event } from '../Types/types';

const SERVER_URL = `http://10.0.2.2:3000`;

export const fetchEvents = async (
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await axios.get<Event[]>(
      `${SERVER_URL}/events/user/testUser`
    );
    const currentTime = moment().tz('Europe/Madrid');
    const upcomingEvents = response.data.filter(event =>
      moment(event.date)
        .tz('Europe/Madrid')
        .isSameOrAfter(currentTime, 'minute')
    );

    upcomingEvents.sort(
      (a, b) =>
        moment(a.date).tz('Europe/Madrid').valueOf() -
        moment(b.date).tz('Europe/Madrid').valueOf()
    );

    setEvents(upcomingEvents);
  } catch (error) {
    console.error('Error fetching events fetchEvents2:', error);
  } finally {
    setLoading(false);
  }
};

export const deleteEvent = async (
  _id: string,
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>
) => {
  try {
    await axios.delete(`${SERVER_URL}/events/${_id}`);
    setEvents(prevEvents => prevEvents.filter(item => item._id !== _id));
  } catch (error) {
    console.error('Error deleting event:', error);
    Alert.alert('Error', 'An error occurred while deleting the event.');
  }
};

export const updateEvent = async (
  selectedEvent: Event,
  time: Date,
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>,
  setTimePickerVisibility: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedEvent: React.Dispatch<React.SetStateAction<Event | null>>
) => {
  const updatedEventDate = moment(selectedEvent.date)
    .tz('Europe/Madrid')
    .set({
      hour: moment(time).hour(),
      minute: 0,
      second: 0
    })
    .toISOString();

  try {
    await axios.put(`${SERVER_URL}/events/${selectedEvent._id}`, {
      ...selectedEvent,
      date: updatedEventDate
    });

    fetchEvents(setEvents, () => {});
    setTimePickerVisibility(false);
    setSelectedEvent(null);
  } catch (error) {
    console.error('Error updating event:', error);
    Alert.alert('Error', 'An error occurred while updating the event.');
  }
};
