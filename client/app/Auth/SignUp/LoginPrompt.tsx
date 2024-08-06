import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface LoginPromptProps {
  handleLogin: () => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ handleLogin }) => (
  <TouchableOpacity className="mt-auto" onPress={handleLogin}>
    <Text className="text-base font-semibold text-black text-center tracking-wide">
      Already have an account? <Text className="underline">Log in</Text>
    </Text>
  </TouchableOpacity>
);

export default LoginPrompt;
