import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

interface ActionButtonsProps {
  handleLogout: () => void;
  handleDelete?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  handleLogout,
  handleDelete,
}) => (
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

    {handleDelete && (
      <TouchableOpacity
        className="bg-red-600 rounded my-2 px-5 py-2 w-32"
        onPress={handleDelete}
      >
        <Text className="text-white text-base font-bold text-center">Delete Account</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default ActionButtons;
