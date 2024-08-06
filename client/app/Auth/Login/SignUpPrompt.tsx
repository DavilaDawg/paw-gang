import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface SignUpPromptProps {
  handleSignUp: () => void;
}

const SignUpPrompt: React.FC<SignUpPromptProps> = ({ handleSignUp }) => (
  <TouchableOpacity className="mt-auto" onPress={handleSignUp}>
    <Text className="text-base font-semibold text-black text-center tracking-wide">
      Don't have an account? <Text className="underline">Sign up</Text>
    </Text>
  </TouchableOpacity>
);

export default SignUpPrompt;
