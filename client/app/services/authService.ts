import React from "react";
import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';


interface SessionProps {
email: string;
password: string;
}
 
export const createSession = async ({ email, password }: SessionProps): Promise<void> => {
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
          return;
        }
    
        const responseData = await response.json();
        const token = responseData.token;
    
        console.log("Token:", token);
        await AsyncStorage.setItem('userToken', token);

        return token
      } catch (error) {
        console.error("Error creating session:", error);
        Alert.alert("Error", "An error occurred. Please try again.");
      }
}


//export const verifySession = () => {
    
//}