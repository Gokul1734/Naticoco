import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Platform } from 'react-native';
import ScreenBackground from './Components/DScreenBackground';

export default function ActiveDeliveries() {
  const [activeDelivery, setActiveDelivery] = useState({
    id: 'DEL123',
    customerName: 'Alice Smith',
    address: '123 Main St, City',
    items: [
      { name: 'Crispy Chicken', quantity: 2 },
      { name: 'Garden Salad', quantity: 1 }
    ],
    status: 'PICKING_UP',
    location: {
      latitude: 37.78825,
      longitude: -122.4324,
    }
  });

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: activeDelivery.location.latitude,
          longitude: activeDelivery.location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={activeDelivery.location}
          title={activeDelivery.customerName}
          description={activeDelivery.address}
        />
      </MapView>

      <Card style={styles.deliveryCard}>
        <Card.Content>
          <Text style={styles.orderId}>Order #{activeDelivery.id}</Text>
          <Text style={styles.customerName}>{activeDelivery.customerName}</Text>
          <Text style={styles.address}>{activeDelivery.address}</Text>
          
          <View style={styles.itemsContainer}>
            {activeDelivery.items.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                {item.quantity}x {item.name}
              </Text>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <Button 
              mode="contained" 
              onPress={() => {}}
              style={[styles.button, styles.primaryButton]}
            >
              Navigate
            </Button>
            <Button 
              mode="outlined" 
              onPress={() => {}}
              style={styles.button}
            >
              Contact Customer
            </Button>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  deliveryCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 20,
    borderRadius: 15,
  },
  orderId: {
    fontSize: 16,
    color: '#666',
  },
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  address: {
    color: '#666',
    marginBottom: 10,
  },
  itemsContainer: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
  },
  itemText: {
    fontSize: 16,
    marginVertical: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: '#F8931F',
  },
}); 