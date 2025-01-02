import { useNavigation } from '@react-navigation/native';
import { Keyboard, KeyboardAvoidingView, SafeAreaView, StyleSheet, View, Alert, Platform, Image } from 'react-native';
import { Text } from 'react-native'; 
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { Animated } from 'react-native';
import { Dimensions } from 'react-native';
import golos from '../assets/fonts/gt.ttf';
import { useLoadAssets } from './hooks/useLoadAssets';
import LoadingScreen from './CustomerScreens/Components/LoadingScreen';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const API_URL = "http://localhost:3500/auth/login";

// Add image mapping
const loginImages = {
  eggs: require('../assets/images/eggsLogin.png'),
  breast: require('../assets/images/breastLogin.png'),
  boneless: require('../assets/images/bonelessLogin.png'),
  logo: require('../assets/images/natiCocoIcon.png'),
  leg: require('../assets/images/legLogin.png'),
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const circleAnimation = new Animated.Value(0);
  const isLoading = useLoadAssets(loginImages);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener('keyboardWillShow', () => {
      Animated.timing(circleAnimation, {
        toValue: -110,
        duration: 200,
        useNativeDriver: true
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener('keyboardWillHide', () => {
      Animated.timing(circleAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // const response = await axios.post("http://192.168.29.165:3500/auth/login", {
      //   mobileno: phoneNumber,
      //   password: password
      // }, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });

      // if (response.status === 200) {
        // Handle different user types
        if (phoneNumber === '12345') {
          navigation.navigate('AdminHome');
        } else if (phoneNumber === '0') {
          navigation.navigate('DeliveryTab');
        } else if (phoneNumber === '1') {
          navigation.navigate('StoreStack');
        } else {
          // await login(response.data.user, response.data.accessToken);
          navigation.navigate('StoreType');
        }
      // }
    // } catch (error) {
    //   console.error('Login error:', error);
    //   Alert.alert(
    //     'Login Failed',
    //     error.response?.data?.message || 'Invalid credentials'
    //   );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.formContainer}>
            <Image source={loginImages.eggs} style={styles.egg} />
            <Image source={loginImages.breast} style={styles.breast} />
            <Image 
              source={loginImages.boneless} 
              style={styles.boneless}
              resizeMode='contain' 
            />
            <Image source={loginImages.logo} style={styles.logo} />
            <Image 
              source={loginImages.leg} 
              style={styles.leg}
              resizeMode='contain' 
            />
          </View>
          
          {/* Circle container with animation */}
          <Animated.View 
            style={[
              styles.circleContainer,
              {
                transform: [{ translateY: circleAnimation }]
              }
            ]}
          >
            <View style={styles.circle} />
          </Animated.View>

          <Animated.View style={[styles.formContent, {transform: [{ translateY: circleAnimation }]}]}>
            {/* Rest of your form content */}
            <Text style={styles.title}>LOGIN / SIGN UP</Text>
            {/* <Text style={styles.subtitle}>Welcome back!</Text> */}

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#666"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.loginButtonText}>LOGIN</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signupButton}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signupButtonText}>
                New here? Sign Up
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, 
    padding: 0,

  },
  innerContainer: {
    flex: 1,
    position: 'relative',
  },
  formContainer: {
    flex: 1,
    // padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  circleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    zIndex: 2,
  },
  circle: {
    borderWidth: 20,
    borderRadius: 800,
    borderColor: '#F8931F',
    position: 'absolute',
    left: -200,
    bottom: -350, // Adjusted position
    width: '197%',
    height: 800,
    backgroundColor: '#E6E6E6',
    zIndex: 1,
  },
  formContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 20,
    color: 'black',
    fontFamily: 'golos',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#F8931F',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    // marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupButtonText: {
    color: '#F8931F',
    fontSize: 16,
  },
  testButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  egg: {
    width: 150,
    height: 150,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  breast: {
    width: 150,
    height: 200,
    position: 'absolute',
    top: -10,
    right: 0,
  },
  logo: {
    width: 400,
    height: 150,
    position: 'absolute',
    top: 200,
    right: 20,
  },
  boneless: {
    width: 100,
    height: 300,
    position: 'absolute',
    top: 250,
    left: 0,
    },
  leg: {
    width: 140,
    height: 300,
    position: 'absolute',
    top: 250,
    right: 0,
  },
});
