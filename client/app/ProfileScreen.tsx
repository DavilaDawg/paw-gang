import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParams = {
  Profile: undefined;
  Login: undefined;
};

const profiles = [
  {
    avatar: require('../assets/avatar-Luffy.png'),
    username: 'testuser',
    name: 'Eugenio',
    dogName: 'Luffy',
    email: 'test@test.com'
  }
];

type ProfileNavigationProp = StackNavigationProp<RootStackParams, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <View className="flex-1 bg-gray-800 pt-0">
      <View className="flex-row justify-end p-4">
        <TouchableOpacity className="mr-2">
          <Image
            source={require('../assets/avatar-Luffy.png')}
            className="w-10 h-10 rounded-full border border-white"
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            source={require('../assets/avatar-Luffy.png')}
            className="w-10 h-10 rounded-full border border-white"
          />
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/avatar-Luffy.png')}
          className="w-52 h-52 rounded-full border-2 border-white mb-5"
        />
        <Text className="text-white font-bold text-xl mb-2">
          User: {profiles[0].username}
        </Text>
        <Text className="text-white font-bold text-xl mb-2">
          Name: {profiles[0].name}
        </Text>
        <Text className="text-white font-bold text-xl mb-2">
          Dog Name: {profiles[0].dogName}
        </Text>
        <Text className="text-white font-bold text-xl mb-2">
          Email: {profiles[0].email}
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
    </View>
  );
};

export default ProfileScreen;
