import { View, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchScreen from './SearchScreen';
import PlanScreen from './PlanScreen';
import ParkSchedule from './ParkSchedule';
import Login from './Login';
import ProfileScreen from './ProfileScreen';
import React from 'react';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const LogoHeader: React.FC = () => {
  return (
    <View className="h-16">
      <Image source={require('../assets/logo.jpg')} className="w-full h-full" />
    </View>
  );
};

const SearchStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ParkSchedule"
        component={ParkSchedule}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const MainTabs: React.FC = () => {
  let iconName: string;

  return (
    <View className="flex-1">
      <LogoHeader />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'SearchTab') {
              iconName = focused ? 'search' : 'search-outline';
            } else if (route.name === 'MyPlansTab') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'ProfileTab') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return (
              <Icon
                name={iconName || 'list-outline'}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#008CBA',
          tabBarInactiveTintColor: 'gray',
          headerShown: false
        })}
      >
        <Tab.Screen
          name="SearchTab"
          component={SearchStack}
          options={{ title: 'Search' }}
        />
        <Tab.Screen
          name="MyPlansTab"
          component={PlanScreen}
          options={{ title: 'My Plans' }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={ProfileScreen}
          options={{ title: 'Profile' }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}