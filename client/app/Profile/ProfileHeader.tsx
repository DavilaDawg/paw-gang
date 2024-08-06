import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

const Header: React.FC = () => (
  <View className="flex-row justify-end p-4">
    <TouchableOpacity className="mr-2">
      <Image
        source={require('../../assets/avatar-Luffy.png')}
        className="w-10 h-10 rounded-full border border-white"
      />
    </TouchableOpacity>
    <TouchableOpacity>
      <Image
        source={require('../../assets/avatar-Luffy.png')}
        className="w-10 h-10 rounded-full border border-white"
      />
    </TouchableOpacity>
  </View>
);

export default Header;
