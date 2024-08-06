import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Header from '../Profile/ProfileHeader';
import ProfileInfo from '../Profile/ProfileInfo';
import ActionButtons from '../Profile/ActionButton';

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
    <View className="flex-1 bg-gray-800 pt-0">
      <Header />
      <ProfileInfo />
      <ActionButtons handleLogout={handleLogout} />
    </View>
  );
};

export default ProfileScreen;
