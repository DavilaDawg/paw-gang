import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../Profile/ProfileHeader';
import ProfileInfo from '../Profile/ProfileInfo';
import ActionButtons from '../Profile/ActionButton';
import { profiles } from '../Types/types';
type RootStackParams = {
  Profile: undefined;
  Login: undefined;
};

type ProfileNavigationProp = StackNavigationProp<RootStackParams, 'Profile'>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileNavigationProp>();
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const switchProfile = (index: number) => {
    setCurrentProfileIndex(index);
  };

  return (
    <View className="flex-1 bg-gray-800 pt-0">
      <Header
        profiles={profiles}
        onAvatarPress={switchProfile}
        currentProfileIndex={currentProfileIndex}
      />
      <ProfileInfo profile={profiles[currentProfileIndex]} />
      <ActionButtons handleLogout={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
