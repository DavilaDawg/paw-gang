import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Modal,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import moment from 'moment-timezone';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import axios from 'axios';
import { ParamListBase } from '@react-navigation/native';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';

const isaIP = '10.10.22.20';
const SERVER_URL = `http://${isaIP}:3000`;

type ParkScheduleParams = {
  place_id: string;
  name: string;
  vicinity: string;
};
type ParkScheduleProps = NativeStackScreenProps<ParamListBase, 'ParkSchedule'>;

type Event = {
  _id: string;
  place_id: string;
  park_name: string;
  address: string;
  date: string;
  user: string;
  dog_avatar: string;
};

function ParkSchedule({ route }: ParkScheduleProps): JSX.Element {
  const { place_id, name, vicinity } = route.params as ParkScheduleParams;
  const [selectedDate, setSelectedDate] = useState(
    moment().tz('Europe/Madrid')
  );
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isPrevDayDisabled, setIsPrevDayDisabled] = useState(true);
  useEffect(() => {
    const fetchEvents = async () => {
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

    fetchEvents();
  }, [place_id]);

  useEffect(() => {
    const today = moment().tz('Europe/Madrid').startOf('day');
    setIsPrevDayDisabled(selectedDate.isSameOrBefore(today, 'day'));
  }, [selectedDate]);

  const handlePrevDay = () => {
    const newDate = selectedDate.clone().subtract(1, 'day');
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = selectedDate.clone().add(1, 'day');
    setSelectedDate(newDate);
  };

  const handleSaveEvent = async () => {
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

    try {
      await axios.post(`${SERVER_URL}/events`, eventToAdd);

      const dateKey = selectedDate.format('YYYY-MM-DD');
      setEvents(prevEvents => ({
        ...prevEvents,
        [dateKey]: [...(prevEvents[dateKey] || []), eventToAdd as Event]
      }));

      setModalVisible(false);
      setNewEventDate('');
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'An error occurred while saving the event.');
    }
  };
  const renderEvent = ({ item }: { item: Event }) => (
    <View className="bg-gray-100 rounded p-2.5">
      <Image
        source={{ uri: item.dog_avatar }}
        className="w-[90px] h-[90px] rounded-full"
      />
    </View>
  );

  const renderItem = ({ item }: { item: string }) => {
    const dayEvents = events[selectedDate.format('YYYY-MM-DD')] || [];
    const slotEvents = dayEvents.filter(event =>
      moment(event.date)
        .tz('Europe/Madrid')
        .isSame(selectedDate.clone().hour(moment(item, 'HH:mm').hour()), 'hour')
    );

    return (
      <View
        className={`flex-row items-center border-b border-gray-200 px-5 ${slotEvents.length > 0 ? 'py-0' : 'py-8'}`}
      >
        <Text className="text-base font-bold w-[60px]">{item}</Text>
        {slotEvents.length > 0 && (
          <FlatList
            horizontal
            data={slotEvents}
            renderItem={renderEvent}
            keyExtractor={event => `${event._id}-${event.date}-${event.user}`}
            className="flex-1 pl-0"
          />
        )}
      </View>
    );
  };

  const hours = Array.from({ length: 24 }, (_, i) =>
    moment({ hour: i }).tz('Europe/Madrid').format('HH:00')
  );

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (time: Date) => {
    const formattedTime = moment(time)
      .tz('Europe/Madrid')
      .minute(0)
      .format('HH:mm');
    setNewEventDate(formattedTime);
    hideTimePicker();
  };

  return (
    <View className="flex-1 bg-gray-100">
      <View className="flex-row justify-between items-center bg-gray-100 border-b border-gray-300 p-2.5">
        <Button
          title="Prev Day"
          onPress={handlePrevDay}
          disabled={isPrevDayDisabled}
        />
        <Text className="text-lg font-bold">
          {selectedDate.format('dddd, D MMM')}
        </Text>
        <Button title="Next Day" onPress={handleNextDay} />
      </View>
      <FlatList
        data={hours}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
      <TouchableOpacity
        className="items-center justify-center bg-[#008CBA] p-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-lg">Add visit 🐕</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center p-5">
          <Text className="text-2xl mb-5">Plan your visit 🐶</Text>
          <TouchableOpacity
            onPress={showTimePicker}
            className="h-10 justify-center border border-gray-300 mb-5 px-2.5"
          >
            <Text
              className={
                newEventDate
                  ? 'text-base text-black'
                  : 'text-base text-gray-400'
              }
            >
              {newEventDate || 'Start Time (HH:00)'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirm}
            onCancel={hideTimePicker}
            minuteInterval={30}
          />
          <View className="flex-row justify-between">
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Save" onPress={handleSaveEvent} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default ParkSchedule;
