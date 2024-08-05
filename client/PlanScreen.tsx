import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground
} from 'react-native';
import axios from 'axios';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const SERVER_URL = 'http://localhost:3000'
interface Event {
  _id: string;
  park_name: string;
  address: string;
  date: string;
}

function PlanScreen(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEventTime, setNewEventTime] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<Event[]>(
        `${SERVER_URL}/events/user/eugenio`
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
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents();
    }, [])
  );

  const handleDelete = async (_id: string) => {
    try {
      await axios.delete(`${SERVER_URL}/events/${_id}`);
      setEvents(prevEvents => prevEvents.filter(item => item._id !== _id));
    } catch (error) {
      console.error('Error deleting event:', error);
      Alert.alert('Error', 'An error occurred while deleting the event.');
    }
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setTimePickerVisibility(true);
  };

  const handleConfirm = async (time: Date) => {
    if (!selectedEvent) return;

    const newTime = moment(time).tz('Europe/Madrid').format('HH:mm');
    setNewEventTime(newTime);

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

      fetchEvents();
      setTimePickerVisibility(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
      Alert.alert('Error', 'An error occurred while updating the event.');
    }
  };

  const renderItem = ({ item }: { item: Event }) => (
    <View style={styles.eventItem}>
      <Text style={styles.eventText}>Park Name: {item.park_name}</Text>
      <Text style={styles.eventText}>Address: {item.address}</Text>
      <Text style={styles.eventText}>
        Date:{' '}
        {moment(item.date).tz('Europe/Madrid').format('MMMM Do YYYY, HH:mm')}
      </Text>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEdit(item)}
      >
        <Icon name="hammer-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item._id)}
      >
        <Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text style={styles.text}>No upcoming events found</Text>
        }
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={() => setTimePickerVisibility(false)}
        minuteInterval={30}
      />
    </View>
  );
}

export default PlanScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#333',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    color: '#fff',
    fontSize: 20,
    top: 50
  },
  eventItem: {
    backgroundColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    position: 'relative'
  },
  eventText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5
  },
  deleteButton: {
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 10
  },
  editButton: {
    backgroundColor: 'orange',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 10,
    right: 50
  }
});
