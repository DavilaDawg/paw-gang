import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as Location from 'expo-location';
import { GOOGLE_MAPS_API_KEY } from '@env';

const API_KEY = GOOGLE_MAPS_API_KEY;

const getUserCurrentLocation = async (): Promise<{
  latitude: number;
  longitude: number;
} | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    return { latitude, longitude };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number }
): Promise<Array<{ latitude: number; longitude: number }> | null> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${API_KEY}`
    );

    if (response.data.routes.length === 0) {
      console.error('No routes found');
      return null;
    }

    const points = response.data.routes[0]?.overview_polyline?.points;
    if (!points) {
      console.error('Polyline points not found in response');
      return null;
    }

    return decodePolyline(points);
  } catch (error) {
    console.error('Error fetching directions:', error);
    return null;
  }
};
function decodePolyline(encoded: string) {
  const poly = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({ latitude: lat / 100000, longitude: lng / 100000 });
  }

  return poly;
}

function MapScreen() {
  const route = useRoute();
  const { destinationLat, destinationLng, destinationName } = route.params as {
    destinationLat: number;
    destinationLng: number;
    destinationName: string;
  };

  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [directions, setDirections] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const location = await getUserCurrentLocation();
      if (location) {
        setUserLocation(location);
        await fetchDirections(location);
      }
    };

    fetchUserLocation();
  }, []);
  const fetchDirections = async (origin: {
    latitude: number;
    longitude: number;
  }) => {
    const result = await getDirections(origin, {
      latitude: destinationLat,
      longitude: destinationLng
    });
    if (result) {
      setDirections(result);
    } else {
      console.log('No directions received');
    }
  };

  return (
    <View className="container">
      <MapView
        className="map"
        showsCompass={true}
        initialRegion={{
          latitude: destinationLat,
          longitude: destinationLng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="blue"
          />
        )}
        <Marker
          coordinate={{ latitude: destinationLat, longitude: destinationLng }}
          title={destinationName}
        />
        {directions.length > 0 && (
          <Polyline
            coordinates={directions}
            strokeWidth={4}
            strokeColor="red"
          />
        )}
      </MapView>
    </View>
  );
}

export default MapScreen;
