import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import SearchBar from '../Search/SearchBar';
import DogParkItem from '../Search/DogParkItem';
import { fetchDogParks, handleLocateMe } from '../Search/Location';
import { DogPark, RootStackParamList } from '../Types/types';

function SearchScreen() {
  const [locationInput, setLocationInput] = useState('');
  const [dogParks, setDogParks] = useState<DogPark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey ?? '';

  const handleLocationSubmit = () => {
    fetchDogParks(locationInput, apiKey, setDogParks, setIsLoading, setError);
  };

  const handleLocateMePress = () => {
    handleLocateMe(apiKey, setDogParks, setIsLoading, setError);
  };

  const handlePlanVisit = (
    place_id: string,
    name: string,
    vicinity: string
  ) => {
    navigation.navigate('ParkSchedule', { place_id, name, vicinity });
  };

  return (
    <View className="flex-1 bg-gray-800">
      <Text className="text-lg font-bold text-gray-100 mx-5 my-5">
        Search for a dog park near you:
      </Text>
      <SearchBar
        locationInput={locationInput}
        setLocationInput={setLocationInput}
        handleLocationSubmit={handleLocationSubmit}
        handleLocateMe={handleLocateMePress}
      />
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      {error && <Text className="text-red-500 mb-5 ml-5">Error: {error}</Text>}
      <FlatList
        data={dogParks}
        keyExtractor={item => item.place_id}
        renderItem={({ item }) => (
          <DogParkItem
            item={item}
            apiKey={apiKey}
            handlePlanVisit={handlePlanVisit}
          />
        )}
      />
    </View>
  );
}

export default SearchScreen;
