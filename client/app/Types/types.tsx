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

export type RootStackParams = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};