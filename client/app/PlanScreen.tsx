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

// isa's:
const SERVER_URL = 'http://10.10.22.20:3000';
interface Event {
  _id: string;
  park_name: string;
  address: string;
  date: string;
  user: string;
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
        `${SERVER_URL}/events/user/isa`
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
    <View className="bg-gray-300 rounded p-4 my-2 mx-4 relative">
      <Text className="text-base text-black mb-1">
        Park Name: {item.park_name}
      </Text>
      <Text className="text-base text-black mb-1">Address: {item.address}</Text>
      <Text className="text-base text-black mb-1">
        Date:{' '}
        {moment(item.date).tz('Europe/Madrid').format('MMMM Do YYYY, HH:mm')}
      </Text>
      <TouchableOpacity
        className="bg-orange-500 w-[30px] h-[30px] rounded-full justify-center items-center absolute bottom-2.5 right-[50px]"
        onPress={() => handleEdit(item)}
      >
        <Icon name="hammer-outline" size={20} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        className="bg-red-500 w-[30px] h-[30px] rounded-full justify-center items-center absolute bottom-2.5 right-2.5"
        onPress={() => handleDelete(item._id)}
      >
        <Icon name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-800">
        <Text className="text-white text-xl top-[50px]">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-gray-800">
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text className="text-white text-xl top-[50px]">
            No upcoming events found
          </Text>
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
