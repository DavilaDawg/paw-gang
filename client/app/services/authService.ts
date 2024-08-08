import React from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SessionProps {
  // move into types!!
  email: string;
  password: string;
}

interface VerifyProps {
  token: string;
}

export const createSession = async ({
  email,
  password,
}: SessionProps): Promise<string | null> => {
  try {
    const response = await fetch("http://10.10.22.20:3000/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert("Error", errorData.error || "Login failed.");
      return null;
    }

    const responseData = await response.json();
    const token = responseData.token;

    await AsyncStorage.setItem("userToken", token);

    return token;
  } catch (error) {
    console.error("Error creating session:", error);
    Alert.alert("Error", "An error occurred. Please try again.");
    return null;
  }
};

export const verifySession = async ({ token }: VerifyProps): Promise<string | null> => {
  const verifyResponse = await fetch(
    `http://10.10.22.20:3000/sessions/${token}`
  );

  if (!verifyResponse.ok) {
    Alert.alert("Error", "Failed to verify token.");
    return null;
  }
  const verifyResponseData = await verifyResponse.json();

  const userId = verifyResponseData.userId;

  await AsyncStorage.setItem("userId", userId);
  return "verified"
};
