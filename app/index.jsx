import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import StackNavigator from './Stack';
import CustomSplashScreen from './components/SplashScreen';
import { CartProvider } from './CustomerScreens/context/CartContext';
import * as Font from 'expo-font';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make API calls, etc
        await Font.loadAsync({
          // Add any custom fonts here
        });

        // Artificially delay for demonstration
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onSplashComplete = useCallback(() => {
    setIsReady(true);
  }, []);

  if (!appIsReady || !isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <CustomSplashScreen onFinish={onSplashComplete} />
      </View>
    );
  }

  return (
      <CartProvider>
        <StackNavigator />
      </CartProvider>
  );
}
