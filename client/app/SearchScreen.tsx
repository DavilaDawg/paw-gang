import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from './customButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Constants from 'expo-constants';

type RootStackParamList = {
  ParkSchedule: { place_id: string; name: string; vicinity: string };
};
export type DogPark = {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  photos?: Array<{ photo_reference: string }>;
};

function SearchScreen() {
  const [locationInput, setLocationInput] = useState('');
  const [dogParks, setDogParks] = useState<DogPark[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const apiKey = Constants.expoConfig?.extra?.googleMapsApiKey ?? '';

  const fetchDogParks = async (location: string) => {
    if (location.trim() === '') {
      setDogParks([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const geocodeResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${apiKey}`
      );

      const geocodeResults = geocodeResponse.data.results;
      if (geocodeResults?.length > 0) {
        const { lat, lng } = geocodeResults[0].geometry.location;

        const placesResponse = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=park&keyword=dog%20park&key=${apiKey}`
        );

        setDogParks(placesResponse.data.results || []);
      } else {
        setDogParks([]);
        setError('Location not found.');
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  };

  const handleLocationSubmit = () => {
    fetchDogParks(locationInput);
  };

  const handleLocateMe = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const placesResponse = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=park&keyword=dog%20park&key=${apiKey}`
      );

      setDogParks(placesResponse.data.results || []);
    } catch (err) {
      setError((err as Error).message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
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
      <View className="flex-row items-center mb-5 mx-5">
        <TextInput
          className="flex-1 h-10 border border-gray-500 text-gray-100 px-2.5"
          placeholder="Enter location..."
          placeholderTextColor="#9DA2AB"
          value={locationInput}
          onChangeText={text => setLocationInput(text)}
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
          <View className="bg-gray-100 rounded-md mb-5 mx-5 p-2.5">
            <Text className="text-lg font-bold">{item.name}</Text>
            {item.photos && item.photos.length > 0 && (
              <Image
                className="w-full h-[200px] rounded-md mb-2.5 object-cover"
                source={{ uri: getPhotoUrl(item.photos[0].photo_reference) }}
              />
            )}
            <Text>{item.vicinity}</Text>
            <Text>Rating: {item.rating}</Text>
            <CustomButton
              title="Plan visit 🐾"
              onPress={() =>
                handlePlanVisit(item.place_id, item.name, item.vicinity)
              }
            />
          </View>
        )}
      />
    </View>
  );
}

export default SearchScreen;
