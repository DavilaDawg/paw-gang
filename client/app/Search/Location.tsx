import axios from 'axios';
import * as Location from 'expo-location';
import { DogPark } from '../Types/types';

export const fetchDogParks = async (
  location: string,
  apiKey: string,
  setDogParks: (parks: DogPark[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
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

export const handleLocateMe = async (
  apiKey: string,
  setDogParks: (parks: DogPark[]) => void,
  setIsLoading: (loading: boolean) => void,
  setError: (error: string | null) => void
) => {
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
