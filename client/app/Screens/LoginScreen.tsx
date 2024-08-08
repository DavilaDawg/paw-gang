import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import LoginLogo from '../Auth/Login/LoginLogo';
import LoginForm from '../Auth/Login/LoginForm';
import SignUpPrompt from '../Auth/Login/SignUpPrompt';
import { ScrollView } from 'react-native-gesture-handler';

type RootStackParams = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

type LoginNavProp = StackNavigationProp<RootStackParams, 'Login'>;

interface LoginProps {
  navigation: LoginNavProp;
}

const LoginScreen: React.FC<LoginProps> = ({ navigation }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#cfcec9]">
      <ScrollView className="flex-1">
        <View className="py-6 px-0 flex-1">
          <LoginLogo />
          <LoginForm form={form} setForm={setForm} navigation={navigation} />
          <SignUpPrompt handleSignUp={handleSignUp} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
