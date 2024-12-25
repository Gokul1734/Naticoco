import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';


const handleAxiosError = (error, operation) => {
  console.error(`${operation} error:`, error);
  
  if (error.response) {
    // Server responded with error
    console.error('Server error:', error.response.data);
    Alert.alert('Error', error.response.data.message || `${operation} failed`);
  } else if (error.code === 'ECONNABORTED') {
    // Request timed out
    Alert.alert('Error', 'Request timed out. Please try again.');
  } else if (error.request) {
    // Request made but no response
    console.error('Network error:', error.request);
    Alert.alert('Error', `Network error. Please check your connection to ${API_URL}`);
  } else {
    // Other errors
    console.error('Other error:', error.message);
    Alert.alert('Error', 'An unexpected error occurred');
  }
};

const OTP = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);



  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid verification code');
      return;
    }

    try {
      const response = await axios.post(`http://192.168.29.165:3500/auth/verify-otp`, {
        email: email,
        otp: enteredOtp
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });

      console.log('Verify response:', response.data);
      if (response.data.success) {
        navigation.replace('Login');
      } else {
        Alert.alert('Error', response.data.message || 'Invalid verification code');
      }
    } catch (error) {
      handleAxiosError(error, 'OTP verification');
    }
  };

  const handleResendCode = async () => {
    if (timer > 0) return;

    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, {
        email: "kgokulpriyan@gmail.com",
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000
      });
      
      setTimer(300);
      Alert.alert('Success', 'New verification code has been sent to your email');
    } catch (error) {
      handleAxiosError(error, 'Resend OTP');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Enter the verification code sent to{'\n'}{email}
      </Text>
      
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="numeric"
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
          />
        ))}
      </View>

      <TouchableOpacity 
        style={styles.Button}
        onPress={handleVerify}
      >
        <Text style={styles.ButtonText}>Verify</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]}
        onPress={handleResendCode}
        disabled={timer > 0}
      >
        <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
          {timer > 0 ? `Resend code in ${formatTime(timer)}` : 'Resend Code'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
   fontSize: 28,
   fontWeight: 'bold',
   marginBottom: 20,
   color: '#F8931F',
 },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderRadius: 10,
    margin: 4,
    textAlign: 'center',
    fontSize: 18,
    borderColor: '#ccc',
  },
  Button: {
   backgroundColor: '#F8931F',
   padding: 15,
   borderRadius: 8,
   alignItems: 'center',
   marginTop: 20,
 },
 ButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '600',
 },
  verifyButton: {
    width: '80%',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  resendButton: {
    marginTop: 20,
    padding: 10,
  },
  resendButtonDisabled: {
    opacity: 0.6,
  },
  resendText: {
    color: '#F8931F',
    fontSize: 14,
    fontWeight: '600',
  },
  resendTextDisabled: {
    color: '#666',
  },
});

export default OTP;