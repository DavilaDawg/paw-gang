import React from 'react';
import { View, Text, Image } from 'react-native';
import { ProfileInfoProps } from '../Types/types';

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profile }) => (
  <View className="flex-1 justify-center items-center">
    <Image
      source={profile.avatar}
      className="w-52 h-52 rounded-full border-2 border-white mb-5"
    />
    <Text className="text-white font-bold text-xl mb-2">
      User: {profile.username}
    </Text>
    <Text className="text-white font-bold text-xl mb-2">
      Name: {profile.name}
    </Text>
    <Text className="text-white font-bold text-xl mb-2">
      Dog Name: {profile.dogName}
    </Text>
    <Text className="text-white font-bold text-xl mb-2">
      Email: {profile.email}
    </Text>
  </View>
);

export default ProfileInfo;
