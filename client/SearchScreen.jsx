import { useState } from 'react';
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
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomButton from './customButton';

function SearchScreen() {
  const [locationInput, setLocationInput] = useState('');
  const [dogParks, setDogParks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigation = useNavigation();
  const apiKey = Constants.expoConfig.extra.googleMapsApiKey;

  const fetchDogParks = async location => {
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
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotoUrl = photoReference => {
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
      setError(err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanVisit = (place_id, name, vicinity) => {
    navigation.navigate('ParkSchedule', { place_id, name, vicinity });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Search for a dog park near you:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter location..."
          placeholderTextColor="#9DA2AB"
          value={locationInput}
          onChangeText={text => setLocationInput(text)}
        />
        <TouchableOpacity style={styles.button} onPress={handleLocationSubmit}>
          <Icon name="search" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleLocateMe}>
          <Icon name="locate" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
      <FlatList
        data={dogParks}
        keyExtractor={item => item.place_id}
        renderItem={({ item }) => (
          <View style={styles.parkItem}>
            <Text style={styles.parkName}>{item.name}</Text>
            {item.photos && item.photos.length > 0 && (
              <Image
                style={styles.parkImage}
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

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#008CBA',
    borderRadius: 5,
    justifyContent: 'center',
    marginLeft: 10,
    padding: 10
  },
  container: {
    backgroundColor: '#333',
    flex: 1
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    marginLeft: 20
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
    color: '#f9f9f9',
    flex: 1,
    height: 40,
    paddingHorizontal: 10
  },
  inputContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
    marginHorizontal: 20
  },
  label: {
    color: '#f9f9f9',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginVertical: 20
  },
  loaderContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  parkImage: {
    borderRadius: 5,
    height: 200,
    marginBottom: 10,
    objectFit: 'cover',
    width: '100%'
  },
  parkItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 20,
    padding: 10
  },
  parkName: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
