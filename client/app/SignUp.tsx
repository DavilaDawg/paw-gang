import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

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

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const handleSignUp = () => {
    navigation.replace('Main');
  };
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#cfcec9]">
      <View className="py-6 px-0 flex-1">
        <View className="items-center justify-center my-9">
          <Image
            alt="App Logo"
            resizeMode="contain"
            className="bg-[#cfcec9] w-[250px] h-[125px] self-center mb-9"
            source={require('../assets/logo.jpg')}
          />

          <Text className="text-3xl font-bold text-black mb-1.5">
            Sign up for <Text className="text-[#008CBA]">Paw Gang</Text>
          </Text>

          <Text className="text-base font-medium text-black">
            Join the pack and start planning playdates!
          </Text>
        </View>

        <View className="mb-6 px-6 flex-1">
          <View className="mb-4">
            <Text className="text-lg font-semibold text-black mb-2">
              Email address
            </Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="hachiko@example.com"
              placeholderTextColor="grey"
              className="h-[50px] bg-[#cfcec9] px-4 rounded-xl text-base font-medium text-black border border-black"
              value={form.email}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-semibold text-black mb-2">
              Password
            </Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="grey"
              className="h-[50px] bg-[#cfcec9] px-4 rounded-xl text-base font-medium text-black border border-black"
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-semibold text-black mb-2">
              Confirm Password
            </Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={confirmPassword =>
                setForm({ ...form, confirmPassword })
              }
              placeholder="********"
              placeholderTextColor="grey"
              className="h-[50px] bg-[#cfcec9] px-4 rounded-xl text-base font-medium text-black border border-black"
              secureTextEntry={true}
              value={form.confirmPassword}
            />
          </View>

          <View className="mt-1 mb-4">
            <TouchableOpacity onPress={handleSignUp}>
              <View className="flex-row items-center justify-center rounded-3xl py-2.5 px-5 border border-[#008CBA] bg-[#008CBA]">
                <Text className="text-lg leading-7 font-semibold text-white">
                  Sign up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity className="mt-auto" onPress={handleLogin}>
          <Text className="text-base font-semibold text-black text-center tracking-wide">
            Already have an account? <Text className="underline">Log in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
