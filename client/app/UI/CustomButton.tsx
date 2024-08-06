import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';

interface Props {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
}

const CustomButton: React.FC<Props> = ({ onPress, title }) => {
  return (
    <TouchableOpacity
      className="items-center bg-[#008CBA] rounded mt-2.5 px-3.5 py-2.5"
      onPress={onPress}
    >
      <Text className="text-white text-base font-bold">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
