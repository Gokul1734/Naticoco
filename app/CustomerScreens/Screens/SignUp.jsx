import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import Modal from 'react-native-modal';
import BackButton from '../../components/BackButton';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState(['', '', '', '', '', '']);
  const otpRefs = useRef([]);

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
         // Alert.alert('Success', res.data.message);
          setOtpModalVisible(true);
        } else {
          Alert.alert('Error', res.data.message || 'Failed to send OTP');
        }
      } catch (error) {
        console.error('Full error:', error);
        handleAxiosError(error, 'OTP generation');
      }
    };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otpInput];
    newOtp[index] = value;
    setOtpInput(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }

    const isComplete = newOtp.every(digit => digit !== '');
    if (isComplete) {
      setTimeout(() => {
        verifyOTP(newOtp);
      }, 300);
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otpInput];
      
      // Clear current input if it has value
      if (newOtp[index] !== '') {
        newOtp[index] = '';
        setOtpInput(newOtp);
        return;
      }
      
      // Move to previous input if current is empty
      if (index > 0) {
        newOtp[index - 1] = '';
        setOtpInput(newOtp);
        otpRefs.current[index - 1].focus();
      }
    }
  };

  const verifyOTP = async (otp) => {
    console.log('Verifying OTP:',otp.join(''),email);
    const url = 'http://192.168.29.165:3500/auth/verify-otp';

    const data = {
      email: email,
      otp: otp.join(''),
    };

    try {
      const response = await axios.post(url, data, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });
      console.log('OTP verification response:', response.data);
      if (response.data.success) {
        setOtpModalVisible(false);
        navigation.replace('Welcome');
      } else {
        Alert.alert('Error', response.data.message || 'OTP verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
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
      if (response.status == 200) {
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
      <BackButton />
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
          // onPress={() => {
          //  handlePostData();
           
          // }}
          onPress={() => navigation.navigate('OTP')}

        >
         <Text style={styles.signupButtonText} >GET OTP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.loginButton}
          // onPress={() => navigation.navigate('Login')}
          onPress={() => navigation.navigate('Welcome')}
        >
          <Text style={styles.loginButtonText}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={otpModalVisible}
        onBackdropPress={() => setOtpModalVisible(false)}
        onBackButtonPress={() => setOtpModalVisible(false)}
        style={styles.modal}
        avoidKeyboard
        propagateSwipe
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Verification Code</Text>
          <Text style={styles.modalSubtitle}>
            Please enter the 6-digit verification code sent to your email
          </Text>

          <View style={styles.otpContainer}>
            {otpInput.map((digit, index) => (
              <TextInput
                key={index}
                ref={ref => otpRefs.current[index] = ref}
                style={styles.otpInput}
                maxLength={1}
                keyboardType="numeric"
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                returnKeyType={index === 5 ? "done" : "next"}
                onSubmitEditing={() => {
                  if (index < 5) {
                    otpRefs.current[index + 1].focus();
                  } else {
                    Keyboard.dismiss();
                  }
                }}
                selection={{
                  start: 0,
                  end: 0
                }}
              />
            ))}
          </View>

          <TouchableOpacity 
            style={styles.resendButton}
            onPress={generateOTP}
          >
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#F8931F',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    gap: 5,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    margin: 2,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  resendButton: {
    padding: 10,
  },
  resendText: {
    color: '#F8931F',
    fontSize: 14,
    fontWeight: '600',
  },
});