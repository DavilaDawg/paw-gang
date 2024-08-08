export type RootStackParamList = {
  ParkSchedule: { place_id: string; name: string; vicinity: string };
  MapScreen: {
    destinationLat: number;
    destinationLng: number;
    destinationName: string;
  };
};

export interface DogPark {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  photos?: {
    photo_reference: string;
  }[];
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

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

export type SessionProps = {
  email: string;
  password: string;
};

export type VerifyProps = {
  token: string;
};

export type User = {
  userId: string;
  password: number;
};
