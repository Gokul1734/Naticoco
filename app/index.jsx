import React, { useState, useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import StackNavigator from './Stack';
import CustomSplashScreen from './SplashScreen';
import { CartProvider } from './CustomerScreens/context/CartContext';
import * as Font from 'expo-font';
import { AuthProvider } from './Authcontext';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          'golos': require('../assets/fonts/gt.ttf'),
        });
        
        // Check for stored credentials
        const storedCreds = await AsyncStorage.getItem('logincre');
        if (storedCreds) {
          setInitialRoute('Welcome');
        }
        
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

      <GestureHandlerRootView style={{ flex: 1 }}>
        <PaperProvider>
        <AuthProvider>
          <CartProvider>
            <StackNavigator initialRoute={initialRoute} />
          </CartProvider>
          </AuthProvider>
        </PaperProvider>
      </GestureHandlerRootView>

  );
}