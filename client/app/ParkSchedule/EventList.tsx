import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';
import moment from 'moment-timezone';
import { Event } from '../Types/types';

interface EventListProps {
  selectedDate: moment.Moment;
  events: Record<string, Event[]>;
}

const EventList: React.FC<EventListProps> = ({ selectedDate, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) =>
    moment({ hour: i }).tz('Europe/Madrid').format('HH:00')
  );

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
        className={`flex-row items-center border-b border-gray-200 px-5 ${
          slotEvents.length > 0 ? 'py-0' : 'py-8'
        }`}
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

  return (
    <FlatList
      data={hours}
      renderItem={renderItem}
      keyExtractor={item => item}
    />
  );
};

export default EventList;
