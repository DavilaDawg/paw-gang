import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

interface HeaderProps {
  profiles: any[];
  onAvatarPress: (index: number) => void;
  currentProfileIndex: number;
}

const Header: React.FC<HeaderProps> = ({
  profiles,
  onAvatarPress,
  currentProfileIndex
}) => (
  <View className="flex-row justify-end p-4">
    {profiles.map((profile, index) => (
      <TouchableOpacity
        key={profile.id}
        className={`mr-2 ${index === currentProfileIndex ? '' : 'opacity-20'}`}
        onPress={() => onAvatarPress(index)}
      >
        <Image
          source={profile.avatar}
          className="w-10 h-10 rounded-full border border-white"
        />
      </TouchableOpacity>
    ))}
  </View>
);

export default Header;
