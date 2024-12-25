import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  
  const generateOTP = async () => {
     console.log('Connecting to:', `http://192.168.29.165:3500/auth/generate-otp`);
      try {
        const res = await axios.post(`http://192.168.29.165:3500/auth/generate-otp`, {
          email: email
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 5000
        });

        console.log('Server response:', res.data);
        if (res.data.success) {
          navigation.navigate('OTP', { email });
        } else {
          Alert.alert('Error', res.data.message || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Full error:', error);
        handleAxiosError(error, 'OTP generation');
      }
    };


  const handlePostData = async () => {
    const url = 'http://192.168.29.165:3500/auth/Register';
    
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
      mobileno: parseInt(mobileNumber),
    };

    try {
      console.log('Attempting connection to:', url);
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
        validateStatus: function (status) {
          return status >= 200 && status < 500;
        },
      });
      console.log('Response received:', response.data);
      if (response.data) {
        Alert.alert('Success', 'Verification code sent to your email');
        generateOTP();
      } else {
        Alert.alert('Error', response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.log('Error message:', error.message);
    }

    
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor= "#666"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor= "#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor= "#666"
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

        <View style={styles.inputContainer}>
          <Ionicons name="phone-portrait-outline" size={20} color="#666" />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            placeholderTextColor="#666"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <TouchableOpacity 
          style={styles.signupButton}
          onPress={() => {
           handlePostData();
           
          }}
          // onPress={() => navigation.navigate('OTP')}

        >
         <Text style={styles.signupButtonText} >Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F8931F',
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
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#F8931F',
    fontSize: 16,
  },
});