import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet } from 'react-native';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {const [storedUser, storedLocation] = await Promise.all([
        AsyncStorage.getItem('logincre'),
        AsyncStorage.getItem('userLocation'),
      ]);

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedLocation) setLocation(JSON.parse(storedLocation));
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  initializeAuth();
}, []);

const login = async (userData) => {
  try {
    await AsyncStorage.setItem('logincre', JSON.stringify(userData));
    setUser(userData);
  } catch (error) {
    console.error('Error storing credentials:', error);
    throw error;
  }
};

const logout = async () => {
  try {
    await AsyncStorage.multiRemove(['logincre', 'userLocation']);
    setUser(null);
    setLocation(null);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

const saveLocation = async (locationData) => {
  try {
    await AsyncStorage.setItem('userLocation', JSON.stringify(locationData));
    setLocation(locationData);
  } catch (error) {
    console.error('Error saving location:', error);
    throw error;
  }
};

if (loading) {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

return (
  <AuthContext.Provider value={{ user, location, login, logout, saveLocation }}>
    {children}
  </AuthContext.Provider>
);
};

export const useAuth = () => {
const context = useContext(AuthContext);
if (!context) {
  throw new Error('useAuth must be used within an AuthProvider');
}
return context;
};

const styles = StyleSheet.create({
loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
},
loadingText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#333',
},
});

export default useAuth;