import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

const { width, height } = Dimensions.get('window');

export default function CustomSplashScreen({ onFinish }) {
  const fadeAnim = new Animated.Value(1); // Start fully visible
  const scaleAnim = new Animated.Value(1);

  useEffect(() => {
    const animate = async () => {
      // Wait for a moment with the splash visible
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Animate out
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        await SplashScreen.hideAsync();
        onFinish();
      });
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <Image
          source={require('../assets/images/splash_icon.jpg')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.7, // 70% of screen width
    height: height * 0.3, // 30% of screen height
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
}); 