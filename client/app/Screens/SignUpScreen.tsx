import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import SignUpLogo from '../Auth/SignUp/SignUpLogo';
import SignUpForm from '../Auth/SignUp/SignUpForm';
import LoginPrompt from '../Auth/SignUp/LoginPrompt';
import { ScrollView } from 'react-native-gesture-handler';

type RootStackParams = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
};

type SignUpNavProp = StackNavigationProp<RootStackParams, 'SignUp'>;

interface SignUpProps {
  navigation: SignUpNavProp;
}

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUpScreen: React.FC<SignUpProps> = ({ navigation }) => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#cfcec9]">
      <View className="py-6 px-0 flex-1">
        <SignUpLogo />
        <SignUpForm form={form} setForm={setForm} navigation={navigation} />
        <LoginPrompt handleLogin={handleLogin} />
      </View>
    </SafeAreaView>
  );
};

export default SignUpScreen;
