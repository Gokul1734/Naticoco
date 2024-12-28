import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import ScreenBackground from '../Components/ScreenBackground';


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
  // const { email } = route.params;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(10);
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

    if (value && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (value && index === 3) {
      if (newOtp.every(digit => digit !== '')) {
        setTimeout(() => {
          navigation.replace('StoreType');
        }, 300);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenBackground style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        Enter the verification code sent to mobile number{'\n'}
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

      <View style={{flex: 1, flexDirection: 'row'}}>
        <Text style={{color: 'black', fontSize: 16, fontWeight: '600', fontFamily: 'golos'}}>Have'nt received the code?</Text>
        <TouchableOpacity 
        style={[styles.resendButton, timer > 0 && styles.resendButtonDisabled]}
        disabled={timer > 0}
        onPress={() => setTimer(4)}
      >
        <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
          {timer > 0 ? `Resend code in ${formatTime(timer)}` : 'Resend Code'}
        </Text>
      </TouchableOpacity>
      </View>
    </ScreenBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'transparent',
  },
  title: {
   fontSize: 28,
   fontWeight: 'bold',
   marginBottom: 20,
   color: 'black',
   fontFamily: 'golos',
 },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  otpInput: {
    width: 70,
    height: 60,
    borderWidth: 1,
    borderRadius: 10,
    margin: 4,
    textAlign: 'center',
    fontSize: 20,
    borderColor: '#ccc',
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  resendButton: {
    marginTop: 3,
    // padding: 10,
    marginLeft: 10,
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