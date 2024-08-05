import React, { useState } from 'react';
import {
  StyleSheet,
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
  Main: undefined;
};

type LoginNavProp = StackNavigationProp<RootStackParams, 'Login'>;

interface LoginProps {
  navigation: LoginNavProp;
}

interface FormState {
  email: string;
  password: string;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [form, setForm] = useState<FormState>({
    email: '',
    password: ''
  });

  const handleSignIn = () => {
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#cfcec9' }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            alt="App Logo"
            resizeMode="contain"
            style={styles.headerImg}
            source={require('./assets/logo.jpg')}
          />

          <Text style={styles.title}>
            Sign in to <Text style={{ color: '#008CBA' }}>Paw Gang</Text>
          </Text>

          <Text style={styles.subtitle}>
            Get your dog's tail wagging with a playdate!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>

            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              clearButtonMode="while-editing"
              keyboardType="email-address"
              onChangeText={email => setForm({ ...form, email })}
              placeholder="hachiko@example.com"
              placeholderTextColor="grey"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>

            <TextInput
              autoCorrect={false}
              clearButtonMode="while-editing"
              onChangeText={password => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="grey"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <View style={styles.formAction}>
            <TouchableOpacity onPress={handleSignIn}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Sign in</Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLink}>Forgot password?</Text>
        </View>

        <TouchableOpacity style={{ marginTop: 'auto' }}>
          <Text style={styles.formFooter}>
            Don't have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#cfcec9',
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: 'black',
    marginBottom: 6
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: 'black'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36
  },
  headerImg: {
    backgroundColor: '#cfcec9',
    width: 400,
    height: 200,
    alignSelf: 'center',
    marginBottom: 36
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center'
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
    textAlign: 'center',
    letterSpacing: 0.15
  },
  input: {
    marginBottom: 16
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: 'black',
    marginBottom: 8
  },
  inputControl: {
    height: 50,
    backgroundColor: '#cfcec9',
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: '500',
    color: 'black',
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid'
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#008CBA',
    borderColor: '#008CBA'
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
  },
});

export default Login;
