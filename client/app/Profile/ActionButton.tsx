import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface ActionButtonsProps {
  handleLogout: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ handleLogout }) => (
  <View className="items-center mb-5">
    <TouchableOpacity className="bg-blue-600 rounded my-2 px-5 py-2">
      <Text className="text-white text-base font-bold">Edit Profile</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className="bg-red-600 rounded my-2 px-5 py-2 w-32 items-center"
      onPress={handleLogout}
    >
      <Text className="text-white text-base font-bold">Log Out</Text>
    </TouchableOpacity>
  </View>
);

export default ActionButtons;
