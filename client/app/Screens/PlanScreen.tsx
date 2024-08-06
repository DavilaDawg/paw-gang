import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import EventItem from '../ParkPlan/PlanEvent';
import TimePickerModal from '../ParkPlan/TimePicker';
import { fetchEvents, deleteEvent, updateEvent } from '../ParkPlan/EventUtils';
import { Event } from '../types/types';

function PlanScreen(): JSX.Element {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchEvents(setEvents, setLoading);
    }, [])
  );

  const handleDelete = async (_id: string) => {
    await deleteEvent(_id, setEvents);
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setTimePickerVisibility(true);
  };

  const handleConfirm = async (time: Date) => {
    if (!selectedEvent) return;
    await updateEvent(
      selectedEvent,
      time,
      setEvents,
      setTimePickerVisibility,
      setSelectedEvent
    );
  };

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
        renderItem={({ item }) => (
          <EventItem
            item={item}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
        keyExtractor={item => item._id}
        ListEmptyComponent={
          <Text className="text-white text-xl top-[50px]">
            No upcoming events found
          </Text>
        }
      />
      <TimePickerModal
        isVisible={isTimePickerVisible}
        onConfirm={handleConfirm}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </View>
  );
}

export default PlanScreen;
