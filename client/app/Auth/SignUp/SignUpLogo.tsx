import React from 'react';
import { View, Image, Text } from 'react-native';

const SignUpLogo: React.FC = () => (
  <View className="items-center justify-center my-9">
    <Image
      resizeMode="contain"
      className="bg-[#cfcec9] w-[250px] h-[125px] self-center mb-9"
      source={require('../../../assets/logo.jpg')}
    />
    <Text className="text-3xl font-bold text-black mb-1.5">
      Sign up for <Text className="text-[#008CBA]">Paw Gang</Text>
    </Text>
    <Text className="text-base font-medium text-black">
      Join the pack and start planning playdates!
    </Text>
  </View>
);

export default SignUpLogo;
