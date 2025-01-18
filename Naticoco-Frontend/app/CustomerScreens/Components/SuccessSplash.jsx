// SplashScreen.js
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import SplashScreen from "react-native-splash-screen";
import LottieView from "lottie-react-native";

const SplashScreenComponent = ({ navigation }) => {
  
  useEffect(() => {
    // Hide the splash screen after 2 seconds
    setTimeout(() => {
      // SplashScreen.hide();  // Hide splash screen
      navigation.replace("Track");  // Navigate to Home screen after splash
    }, 1000); // Adjust the delay to your preference
  }, []);
  

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
      <Ionicons name="checkmark-done-circle" size={220} color="#89C73A" />
      
      <Text style={styles.text}>Payment Successful</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Splash screen background color
  },
  text: {
    fontSize: 24,
    color: "#333", // Splash screen text color
  },
});

export default SplashScreenComponent;
