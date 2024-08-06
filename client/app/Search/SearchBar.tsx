import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  locationInput: string;
  setLocationInput: (text: string) => void;
  handleLocationSubmit: () => void;
  handleLocateMe: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  locationInput,
  setLocationInput,
  handleLocationSubmit,
  handleLocateMe
}) => (
  <View className="flex-row items-center mb-5 mx-5">
    <TextInput
      className="flex-1 h-10 border border-gray-500 text-gray-100 px-2.5"
      placeholder="Enter location..."
      placeholderTextColor="#9DA2AB"
      value={locationInput}
      onChangeText={setLocationInput}
    />
    <TouchableOpacity
      className="bg-[#008CBA] rounded items-center justify-center ml-2.5 p-2.5"
      onPress={handleLocationSubmit}
    >
      <Icon name="search" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity
      className="bg-[#008CBA] rounded items-center justify-center ml-2.5 p-2.5"
      onPress={handleLocateMe}
    >
      <Icon name="locate" size={24} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default SearchBar;
