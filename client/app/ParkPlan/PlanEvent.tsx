import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import moment from 'moment-timezone';
import Icon from 'react-native-vector-icons/Ionicons';
import { Event } from '../Types/types';

interface EventItemProps {
  item: Event;
  handleEdit: (event: Event) => void;
  handleDelete: (id: string) => void;
}

const EventItem: React.FC<EventItemProps> = ({
  item,
  handleEdit,
  handleDelete
}) => (
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

export default EventItem;
