import React from 'react';
import { View, Image, Text } from 'react-native';

const LoginLogo: React.FC = () => (
  <View className="items-center justify-center my-9">
    <Image
      resizeMode="contain"
      className="bg-[#cfcec9] w-[300px] h-[150px] self-center mb-9"
      source={require('../../assets/logo.jpg')}
    />
    <Text className="text-3xl font-bold text-black mb-1.5">
      Sign in to <Text className="text-[#008CBA]">Paw Gang</Text>
    </Text>
    <Text className="text-base font-medium text-black">
      Get your dog's tail wagging with a playdate!
    </Text>
  </View>
);

export default LoginLogo;
