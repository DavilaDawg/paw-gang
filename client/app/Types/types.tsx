export type RootStackParamList = {
  ParkSchedule: { place_id: string; name: string; vicinity: string };
};

export type DogPark = {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  photos?: Array<{ photo_reference: string }>;
};

export type ParkScheduleParams = {
  place_id: string;
  name: string;
  vicinity: string;
};

export type Event = {
  _id: string;
  place_id: string;
  park_name: string;
  address: string;
  date: string;
  user: string;
  dog_avatar: string;
};

export interface ProfileInfoProps {
  profile: {
    avatar: any;
    username: string;
    name: string;
    dogName: string;
    email: string;
  };
}
export const profiles = [
  {
    id: 1,
    avatar: require('../../assets/avatar-Luffy.png'),
    username: 'testuser',
    name: 'Eugenio',
    dogName: 'Luffy',
    email: 'test@test.com'
  },
  {
    id: 2,
    avatar: require('../../assets/avatar-Luffy.png'),
    username: 'testuser2',
    name: 'Jack',
    dogName: 'Max',
    email: 'jack@test.com'
  }
];
