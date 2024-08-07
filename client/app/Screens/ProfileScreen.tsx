import React, { useState, useEffect } from "react";
import { View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../Profile/ProfileHeader";
import ProfileInfo from "../Profile/ProfileInfo";
import ActionButtons from "../Profile/ActionButton";

type RootStackParams = {
  navigate(arg0: string): unknown;
  Profile: undefined;
  Login: undefined;
};

const ProfileScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigation = useNavigation<RootStackParams>();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const result = await AsyncStorage.getItem("userId");
      setUserId(result);
      if (!result) {
        Alert.alert("Error", "No userId found.");
      }
    } catch (error) {
      console.error("Error fetching userId from AsyncStorage:", error);
      Alert.alert("Error", "Failed to retrieve userId.");
    }
  };

  const handleLogout = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) throw new Error("No token found");

    const response = await fetch(
      `http://10.10.22.20:3000/sessions/${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const responseData = await response.json();

      if (!response.ok) {
        Alert.alert('Error', responseData.error || 'Logout failed');
        return;
      }
    } else {
      const responseText = await response.text();
      console.error("Unexpected response format:", responseText);
      Alert.alert('Error', 'Logout failed. Unexpected response format.');
      return;
    }

    await AsyncStorage.removeItem("userToken");
    await AsyncStorage.removeItem("userId");
    navigation.navigate("Login");
  } catch (error) {
    console.error("Error during logout:", error);
    Alert.alert("Error", "Logout failed. Please try again.");
  }
};


  const handleDelete = async () => {
    if (!userId) {
      Alert.alert("Error", "No userId found.");
      return;
    }

    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("No token found");

      const response = await fetch(`http://10.10.22.20:3000/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
      Alert.alert("Success", "Your account has been deleted.");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error during account deletion:", error);
      Alert.alert("Error", "Failed to delete account. Please try again.");
    }
  };

  return (
    <View className="flex-1 bg-gray-800 pt-0">
      <Header />
      <ProfileInfo userId={userId} />
      <ActionButtons handleLogout={handleLogout} handleDelete={handleDelete} />
    </View>
  );
};

export default ProfileScreen;
