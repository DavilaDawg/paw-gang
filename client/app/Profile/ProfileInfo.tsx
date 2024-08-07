import React from 'react';
import { View, Text, Image } from 'react-native';

const profiles = [
  {
    avatar: require('../../assets/avatar-Luffy.png'),
    username: 'testuser',
    dogName: 'Luffy',
    email: 'test@test.com'
  }
];
interface ProfileInfoProps {
  userId: string | null;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({userId}) => (
  <View className="flex-1 justify-center items-center">
    <Image
      source={require('../../assets/avatar-Luffy.png')}
      className="w-52 h-52 rounded-full border-2 border-white mb-5"
    />
    <Text className="text-white font-bold text-xl mb-2">
      Username: {userId}
    </Text>
    <Text className="text-white font-bold text-xl mb-2">
      Dog Name: {profiles[0].dogName}
    </Text>
    <Text className="text-white font-bold text-xl mb-2">
      Email: {profiles[0].email}
    </Text>
  </View>
);

export default ProfileInfo;
