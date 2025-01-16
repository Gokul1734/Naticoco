import { useNavigation } from "@react-navigation/native";
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  Platform,
  Image,
} from "react-native";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native";
import { ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { TouchableWithoutFeedback } from "react-native";
import axios, { all } from "axios";
import { useAuth } from "./context/AuthContext";
import { Animated } from "react-native";
import { Dimensions } from "react-native";
import golos from "../assets/fonts/gt.ttf";
import { useLoadAssets } from "./hooks/useLoadAssets";
import LoadingScreen from "./CustomerScreens/Components/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Scale factors based on design width (assuming design was for 375px width)
const scale = SCREEN_WIDTH / 375;

// Normalize font size for different screen densities
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

// Add image mapping
const loginImages = {
  eggs: require("../assets/images/eggsLogin.png"),
  breast: require("../assets/images/breastLogin.png"),
  boneless: require("../assets/images/bonelessLogin.png"),
  logo: require("../assets/images/natiCocoIcon.png"),
  leg: require("../assets/images/legLogin.png"),
};

export default function LoginScreen() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const circleAnimation = new Animated.Value(0);
  const isLoading = useLoadAssets(loginImages);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener("keyboardWillShow", () => {
      Animated.timing(circleAnimation, {
        toValue: -110,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    const keyboardWillHide = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(circleAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    if (phoneNumber === "12345") {
      navigation.navigate("AdminHome");
    } else if (phoneNumber === "0") {
      navigation.navigate("DeliveryTab");
    } else if (phoneNumber === "1") {
      navigation.navigate("StoreStack");
    }
    try {
      const response = await axios.post(
        "http://192.168.0.104:3500/auth/login",
        {
          mobileno: `+91${phoneNumber}`,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Save credentials in AsyncStorage
        await AsyncStorage.setItem(
          "logincre",
          JSON.stringify({
            phoneNumber,
            token: response.data?.user,
          })
        );

        console.log(
          "Stored user credentials:",
          await AsyncStorage.getItem("logincre")
        );

        navigation.navigate("Welcome");
        // Navigation logic
        if (phoneNumber === "12345") {
          navigation.navigate("AdminHome");
        } else if (phoneNumber === "0") {
          navigation.navigate("DeliveryTab");
        } else if (phoneNumber === "1") {
          navigation.navigate("StoreStack");
        } else {
          navigation.navigate("Welcome");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Login Failed",
        error.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVendorLogin = async () => {
    if (!phoneNumber || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    setLoading(true);
    try {
      const vendorResponse = await axios.post(
        "http://192.168.0.104:3500/citystore/Login",
        {
          mobileno: phoneNumber,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (vendorResponse.status === 200) {
        // Store vendor credentials
        await AsyncStorage.setItem(
          "vendorCredentials",
          JSON.stringify({
            phoneNumber,
            token: vendorResponse.data?.accessToken,
            type: "vendor",
            vendorData: {
              storeId: vendorResponse.data?.user?.userId,
              name: vendorResponse.data?.user?.name,
              phone: vendorResponse.data?.user?.mobileno,
              email: vendorResponse.data?.user?.email,
            },
          })
        );
        console.log("Stored vendor credentials:", await AsyncStorage.getItem("vendorCredentials"));
  
        // Navigate to vendor dashboard
        navigation.navigate("StoreStack");
      }
    } catch (error) {
      console.error("Vendor login error:", error);
      
      let errorMessage = "Vendor login failed.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (!error.response) {
        errorMessage = "Network error. Please check your connection.";
      } else if (error.response?.status === 401) {
        errorMessage = "Invalid vendor credentials";
      } else if (error.response?.status === 404) {
        errorMessage = "Vendor account not found";
      }
  
      Alert.alert("Login Failed", errorMessage);
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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? -64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <View style={styles.formContainer}>
            <Image source={loginImages.eggs} style={styles.egg} />
            <Image source={loginImages.breast} style={styles.breast} />
            <Image
              source={loginImages.boneless}
              style={styles.boneless}
              resizeMode="contain"
            />
            <Image source={loginImages.logo} style={styles.logo} />
            <Image
              source={loginImages.leg}
              style={styles.leg}
              resizeMode="contain"
            />
          </View>

          {/* Circle container with animation */}
          <Animated.View
            style={[
              styles.circleContainer,
              {
                transform: [{ translateY: circleAnimation }],
              },
            ]}
          >
            <View style={styles.circle} />
          </Animated.View>

          <Animated.View
            style={[
              styles.formContent,
              { transform: [{ translateY: circleAnimation }] },
            ]}
          >
            {/* Rest of your form content */}
            <Text style={styles.title}>LOGIN / SIGN UP</Text>
            {/* <Text style={styles.subtitle}>Welcome back!</Text> */}

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#666" />
              
              {/* Country Code Prefix */}
              <Text style={styles.countryCode}>+91</Text>

              <TextInput
                style={[styles.input, { marginLeft: 5 }]}
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

            <View style={styles.buttonsContainer}>
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

              <View style={styles.altLoginContainer}>
                <TouchableOpacity
                  style={styles.vendorButton}
                  onPress={handleVendorLogin}
                >
                  <Ionicons name="restaurant-outline" size={24} color="white" />
                  <Text style={styles.altButtonText}>Vendor Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deliveryButton}
                  onPress={() => navigation.navigate("DeliveryTab")}
                >
                  <Ionicons name="bicycle-outline" size={24} color="white" />
                  <Text style={styles.altButtonText}>Delivery Login</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signupButton}
                onPress={() => navigation.navigate("SignUp")}
              >
                <Text style={styles.signupButtonText}>New here? Sign Up</Text>
              </TouchableOpacity>
            </View>
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
   position: "relative",
 },
 formContainer: {
   flex: 1,
   justifyContent: "center",
   zIndex: 2,
 },
 circleContainer: {
   position: "absolute",
   width: "100%",
   height: "100%",
   overflow: "hidden",
   zIndex: 2,
 },
 circle: {
   borderWidth: Platform.OS === 'ios' ? 20 : 15,
   borderRadius: 800,
   borderColor: "#F8931F",
   position: "absolute",
   left: -200,
   bottom: Platform.OS === 'ios' ? -300 : -380,
   width: "197%",
   height: 800,
   backgroundColor: "#E6E6E6",
   zIndex: 1,
 },
 formContent: {
   flex: 1,
   padding: SCREEN_WIDTH * 0.05, // 5% of screen width
   justifyContent: "center",
   zIndex: 2,
 },
 title: {
   fontSize: normalize(25),
   fontWeight: Platform.OS === 'ios' ? "600" : "700",
   marginBottom: SCREEN_HEIGHT * 0.02,
   color: "black",
   fontFamily: "golos",
   includeFontPadding: false, // Android specific
   textAlignVertical: 'center', // Android specific
 },
 subtitle: {
   fontSize: normalize(16),
   color: "#666",
   marginBottom: SCREEN_HEIGHT * 0.03,
   includeFontPadding: false,
 },
 countryCode: {
   fontSize: normalize(16),
   color: "#666",
   marginHorizontal: 10,
   includeFontPadding: false,
 },
 inputContainer: {
   flexDirection: "row",
   alignItems: "center",
   borderWidth: 1,
   borderColor: "#ddd",
   borderRadius: 8,
   paddingHorizontal: 15,
   marginBottom: SCREEN_HEIGHT * 0.015,
   height: Platform.OS === 'ios' ? 50 : 55,
   backgroundColor: "white",
   ...Platform.select({
     ios: {
       shadowColor: "black",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
     },
     android: {
       elevation: 5,
     },
   }),
 },
 input: {
   flex: 1,
   marginLeft: 10,
   fontSize: normalize(16),
   includeFontPadding: false,
   textAlignVertical: 'center',
   paddingVertical: Platform.OS === 'android' ? 0 : 5,
 },
 forgotPassword: {
   alignSelf: "flex-end",
   marginBottom: SCREEN_HEIGHT * 0.02,
   padding: 5, // Better touch target
 },
 forgotPasswordText: {
   color: "#F8931F",
   fontSize: normalize(14),
   includeFontPadding: false,
 },
 buttonsContainer: {
   gap: 15,
   marginTop: SCREEN_HEIGHT * 0.02,
 },
 loginButton: {
   backgroundColor: "#F8931F",
   padding: Platform.OS === 'ios' ? 15 : 12,
   borderRadius: 8,
   alignItems: "center",
   ...Platform.select({
     ios: {
       shadowColor: "#F8931F",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
     },
     android: {
       elevation: 3,
     },
   }),
 },
 loginButtonText: {
   color: "white",
   fontSize: normalize(16),
   fontWeight: "600",
   includeFontPadding: false,
 },
 altLoginContainer: {
   flexDirection: "row",
   gap: SCREEN_WIDTH * 0.025,
   justifyContent: "space-between",
 },
 vendorButton: {
   flex: 1,
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "center",
   backgroundColor: "#4CAF50",
   padding: Platform.OS === 'ios' ? 12 : 10,
   borderRadius: 8,
   gap: 8,
   ...Platform.select({
     ios: {
       shadowColor: "#4CAF50",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
     },
     android: {
       elevation: 3,
     },
   }),
 },
 deliveryButton: {
   flex: 1,
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "center",
   backgroundColor: "#2196F3",
   padding: Platform.OS === 'ios' ? 12 : 10,
   borderRadius: 8,
   gap: 8,
   ...Platform.select({
     ios: {
       shadowColor: "#2196F3",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.25,
       shadowRadius: 3.84,
     },
     android: {
       elevation: 3,
     },
   }),
 },
 altButtonText: {
   color: "white",
   fontSize: normalize(14),
   fontWeight: "600",
   includeFontPadding: false,
 },
 signupButton: {
   alignItems: "center",
   paddingVertical: 10,
   minHeight: 44, // Minimum touch target size
 },
 signupButtonText: {
   color: "#F8931F",
   fontSize: normalize(16),
   includeFontPadding: false,
 },
 // Image styles with responsive dimensions
 egg: {
   width: SCREEN_WIDTH * 0.3,
   height: SCREEN_WIDTH * 0.3,
   position: "absolute",
   top: 0,
   left: 0,
 },
 breast: {
   width: SCREEN_WIDTH * 0.3,
   height: SCREEN_WIDTH * 0.375,
   position: "absolute",
   top: -10,
   right: 0,
 },
 logo: {
   width: SCREEN_WIDTH * 0.9,
   height: SCREEN_HEIGHT * 0.3,
   position: "absolute",
   top: SCREEN_HEIGHT * 0.08,
   right: 20,
   resizeMode: 'contain',
 },
 boneless: {
   width: SCREEN_WIDTH * 0.25,
   height: SCREEN_HEIGHT * 0.3,
   position: "absolute",
   top: SCREEN_HEIGHT * 0.2,
   left: 0,
 },
 leg: {
   width: SCREEN_WIDTH * 0.35,
   height: SCREEN_HEIGHT * 0.3,
   position: "absolute",
   top: SCREEN_HEIGHT * 0.22,
   right: 0,
 },
});
