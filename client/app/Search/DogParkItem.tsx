import React from 'react';
import { View, Text, Image } from 'react-native';
import CustomButton from '../UI/CustomButton';
import { DogPark } from '../Types/types';

interface DogParkItemProps {
  item: DogPark;
  apiKey: string;
  handlePlanVisit: (place_id: string, name: string, vicinity: string) => void;
}

const DogParkItem: React.FC<DogParkItemProps> = ({
  item,
  apiKey,
  handlePlanVisit
}) => {
  const getPhotoUrl = (photoReference: string) => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`;
  };

  return (
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
        onPress={() => handlePlanVisit(item.place_id, item.name, item.vicinity)}
      />
    </View>
  );
};

export default DogParkItem;
