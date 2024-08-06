import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParams = {
  Profile: undefined;
  Login: undefined;
};

type ProfileNavigationProp = StackNavigationProp<RootStackParams, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-800 pt-0">
      <Image
        source={require('../assets/avatar-Luffy.png')}
        className="w-52 h-52 rounded-full border-2 border-white mb-5"
      />
      <Text className="text-white font-bold text-xl mb-2">User: testuser</Text>
      <Text className="text-white font-bold text-xl mb-2">Name: Eugenio</Text>
      <Text className="text-white font-bold text-xl mb-2">Dog Name: Luffy</Text>
      <Text className="text-white font-bold text-xl mb-2">
        Email: test@test.com
      </Text>
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
};

export default ProfileScreen;
