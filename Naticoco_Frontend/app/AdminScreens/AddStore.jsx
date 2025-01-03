import { View, ScrollView, StyleSheet, Dimensions, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storeData from '../../Backend/Store.json';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function AddStore({ navigation }) {
  const [store, setStore] = useState({
    id: storeData.length + 1,
    address: '',
    phone: '',
    Area: '',
    City: '',
    location: [],
    stocks: [],
    rating: 0,
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setStore(prev => ({
        ...prev,
        location: [location.coords.latitude.toString(), location.coords.longitude.toString()]
      }));
    } catch (error) {
      alert('Error getting location');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!store.address || !store.phone || !store.Area || !store.City || !store.email || !store.password) {
      alert('Please fill all required fields');
      return;
    }
  
    try {
      const response = await axios.post('http://192.168.29.165:3500/Admin/addcitystore', {
        name: store.Area,
        email: store.email,
        password: store.password,
        mobileno: store.phone,
        locations: {
          latitude: store.location[0],
          longitude: store.location[1]
        },
        cityName: store.City
      });
  
      if (response.status === 201) {
        Alert.alert('Success', 'Store added successfully');
        navigation.navigate('ManageStore', { newStore: store });
      }
    } catch (error) {
      console.error('Error saving store:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Error saving store'
      );
    }
  };

    return (
    <LinearGradient
      colors={['#fff', '#fff']}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 50 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
        >
          <LinearGradient
            colors={['#20348f', '#20348f']}
            style={styles.header}
          >
            <IconButton
              icon="arrow-left"
              iconColor="white"
              size={24}
              onPress={() => navigation.goBack()}
            />
            <Text variant="headlineSmall" style={styles.headerText}>
              Add New Store
            </Text>
          </LinearGradient>
        </MotiView>

        <View style={styles.formContainer}>
          {[
            { label: 'Area', value: 'Area', icon: 'location' },
            { label: 'City', value: 'City', icon: 'business' },
            { label: 'Full Address', value: 'address', icon: 'home' },
            { label: 'Phone Number', value: 'phone', icon: 'call' },
            { label: 'Email', value: 'email', icon: 'mail' },
            { label: 'Password', value: 'password', icon: 'password' },
          ].map((field, index) => (
            <MotiView
              key={field.value}
              from={{ opacity: 0, translateX: -100 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{
                type: 'spring',
                delay: index * 100,
                damping: 15,
              }}
            >
              <View style={styles.inputContainer}>
                <Ionicons 
                  name={field.icon} 
                  size={24} 
                  color="#20348f" 
                  style={styles.inputIcon}
                />
                <TextInput
                  label={field.label}
                  value={store[field.value]}
                  onChangeText={(text) => setStore(prev => ({ ...prev, [field.value]: text }))}
                  textColor='#20348f'
                  style={styles.input}
                  mode="outlined"
                  outlineColor="#20348f"
                  activeOutlineColor="#20348f"
                  multiline={field.value === 'address'}
                  secureTextEntry={field.value === 'password'}
                />
              </View>
            </MotiView>
          ))}

          <MotiView
            from={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              delay: 400,
              damping: 15,
            }}
          >
            <Button
              mode="contained"
              onPress={getLocation}
              style={[styles.button, { marginBottom: 12 }]}
              loading={loading}
              labelStyle={styles.buttonLabel}
            >
              Get Current Location
            </Button>

            {store.location.length > 0 && (
              <Text style={styles.locationText}>
                Location: {store.location[0]}, {store.location[1]}
              </Text>
            )}

            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Add Store
            </Button>
          </MotiView>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  formContainer: {
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    backgroundColor: 'white',
  },
  inputText: {
    color:'white'
  },
  button: {
    backgroundColor: '#20348f',
    paddingVertical: 8,
    color:'white'
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
    color:'white'
  },
  locationText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#20348f',
    fontWeight: 'bold',
  },
});
