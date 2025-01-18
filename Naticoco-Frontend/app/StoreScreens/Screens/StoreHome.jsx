import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Text, Switch, Card } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

const StatCard = ({ title, value, icon, color }) => (
  <MotiView
    from={{ opacity: 0, translateY: 20 }}
    animate={{ opacity: 1, translateY: 0 }}
    transition={{ type: 'timing', duration: 1000 }}
  >
    <Card style={styles.statCard}>
      <View style={styles.statContent}>
        <Text style={styles.statTitle}>{title}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: scale(10),
          }}
        >
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Ionicons name={icon} size={30} color={color} />
        </View>
      </View>
    </Card>
  </MotiView>
);

export default function StoreHome({ navigation }) {
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [stats, setStats] = useState({
    pendingOrders: 5,
    todayOrders: 25,
    revenue: '₹12,500',
    stockAlerts: 3,
  });
  const [vendorDetails, setVendorDetails] = useState(null);

  // Fetch vendor details from AsyncStorage
  useEffect(() => {
    const fetchVendorDetails = async () => {
      try {
        const storedData = await AsyncStorage.getItem('vendorCredentials');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setVendorDetails(parsedData.vendorData);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
      }
    };

    fetchVendorDetails();
  }, []);

  const toggleStoreStatus = async () => {
    const newStatus = !isStoreOpen;
  
    try {
      const vendorCredentialsString = await AsyncStorage.getItem('vendorCredentials');
      if (!vendorCredentialsString) {
        console.error('No vendor credentials found');
        return;
      }
      const vendorCredentials = JSON.parse(vendorCredentialsString);
      const storeId = vendorCredentials?.vendorData?.storeId;
      console.log('Store ID:', storeId);
      if (!storeId) {
        console.error('Error: Vendor ID not found');
        return;
      }
  
      const response = await axios.put('http://192.168.29.165:3500/citystore/availability', {
        storeId,
        isOpen: newStatus,
      });
  
      if (response.status === 200 && response.data.success) {
        setIsStoreOpen(newStatus);
        console.log(response.data.message); // Display success message
      } else {
        console.error('Failed to update store status:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating store status:', error.message);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.storeName}>
            {vendorDetails?.name || 'Crispy Chicken Store'}
          </Text>
          <Text style={styles.location}>
            {vendorDetails?.email || 'Hyderabad'}
          </Text>
        </View>
        <View style={styles.storeStatus}>
          <Text style={styles.statusText}>
            {isStoreOpen ? 'Store Open' : 'Store Closed'}
          </Text>
          <Switch
            value={isStoreOpen}
            onValueChange={toggleStoreStatus}
            color="#0f1c57"
          />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon="time-outline"
          color="#F8931F"
        />
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon="cart-outline"
          color="#4CAF50"
        />
        <StatCard
          title="Today's Revenue"
          value={stats.revenue}
          icon="cash-outline"
          color="#2196F3"
        />
        <StatCard
          title="Stock Alerts"
          value={stats.stockAlerts}
          icon="alert-circle-outline"
          color="#F44336"
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('OrderManagement')}
        >
          <Ionicons name="list" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Manage Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('StockManagement')}
        >
          <Ionicons name="cube" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Manage Stock</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('StoreSettings')}
        >
          <Ionicons name="settings" size={24} color="#FFF" />
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(30),
  },
  storeName: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    color: '#0f1c57',
  },
  location: {
    fontSize: moderateScale(16),
    color: '#666',
  },
  storeStatus: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: moderateScale(14),
    marginBottom: verticalScale(5),
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(30),
  },
  statCard: {
    width: 180,
    marginBottom: verticalScale(15),
    borderRadius: scale(15),
    elevation: 2,
    padding: scale(8),
  },
  statContent: {
    padding: scale(15),
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statTitle: {
    fontSize: moderateScale(14),
    color: '#666',
    marginBottom: verticalScale(5),
  },
  statValue: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '31%',
    backgroundColor: '#0f1c57',
    padding: scale(15),
    borderRadius: scale(15),
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
});
