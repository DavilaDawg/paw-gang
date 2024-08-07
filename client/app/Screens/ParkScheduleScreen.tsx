import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Alert } from 'react-native';
import moment from 'moment-timezone';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import { ParamListBase } from '@react-navigation/native';
import DateSelector from '../ParkSchedule/DateSelector';
import EventList from '../ParkSchedule/EventList';
import AddEventModal from '../ParkSchedule/AddEvent';
import { fetchEvents, saveEvent } from '../ParkSchedule/Event';
import { Event, ParkScheduleParams } from '../Types/types';

type ParkScheduleProps = NativeStackScreenProps<ParamListBase, 'ParkSchedule'>;

const ParkSchedule = ({ route }: ParkScheduleProps): JSX.Element => {
  const { place_id, name, vicinity } = route.params as ParkScheduleParams;
  const [selectedDate, setSelectedDate] = useState(
    moment().tz('Europe/Madrid')
  );
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newEventDate, setNewEventDate] = useState('');
  const [isPrevDayDisabled, setIsPrevDayDisabled] = useState(true);

  useEffect(() => {
    fetchEvents(place_id, setEvents);
  }, [place_id]);

  useEffect(() => {
    const today = moment().tz('Europe/Madrid').startOf('day');
    setIsPrevDayDisabled(selectedDate.isSameOrBefore(today, 'day'));
  }, [selectedDate]);

  const handlePrevDay = () => {
    setSelectedDate(prev => prev.clone().subtract(1, 'day'));
  };

  const handleNextDay = () => {
    setSelectedDate(prev => prev.clone().add(1, 'day'));
  };

  const handleSaveEvent = async () => {
    try {
      await saveEvent(
        selectedDate,
        newEventDate,
        place_id,
        name,
        vicinity,
        setEvents
      );
      setModalVisible(false);
      setNewEventDate('');
    } catch (error) {
      console.error('Error saving event:', error);
      Alert.alert('Error', 'An error occurred while saving the event.');
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <DateSelector
        selectedDate={selectedDate}
        handlePrevDay={handlePrevDay}
        handleNextDay={handleNextDay}
        isPrevDayDisabled={isPrevDayDisabled}
      />
      <EventList selectedDate={selectedDate} events={events} />
      <TouchableOpacity
        className="items-center justify-center bg-[#008CBA] p-4"
        onPress={() => setModalVisible(true)}
      >
        <Text className="text-white text-lg">Add visit 🐕</Text>
      </TouchableOpacity>
      <AddEventModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        newEventDate={newEventDate}
        setNewEventDate={setNewEventDate}
        handleSaveEvent={handleSaveEvent}
      />
    </View>
  );
};

export default ParkSchedule;
