import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OrderCard = ({ order }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('Track', { orderId: order._id })}
    >
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>Order #{order.orderId}</Text>
          <Text style={styles.orderDate}>{order.orderDate}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: order.status === 'Delivered' ? '#89C73A' : '#F8931F' }
        ]}>
          <Text style={styles.statusText}>{order.status}</Text>
        </View>
      </View>

      <View style={styles.itemsList}>
        {order.items && order.items.map((item, index) => {
         // console.log(item.itemName);
         return  (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.name} x {item.quantity}</Text>
            {typeof item === 'object' && (
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            )}
          </View>
        )
        })}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total Amount:</Text>
        <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
      </View>

      <View style={styles.actionRow}>
      {(order.status == 'Pending' || 'PENDING') && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('Track', { orderId: order._id })}
        >
          <Ionicons name="location-outline" size={20} color="#F8931F" />
          <Text style={styles.actionButtonText}>Track Order</Text>
        </TouchableOpacity>
      )}
        {(order.status === 'COMPLETED') && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat-outline" size={20} color="#F8931F" />
            <Text style={styles.actionButtonText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function MyOrders() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const credentials = await AsyncStorage.getItem('logincre');
        const parsedCredentials = credentials ? JSON.parse(credentials) : null;
        const userId = parsedCredentials?.token?.userId;
        // console.log(userId);
        const response = await axios.get(`http://192.168.29.165:3500/api/orders/myorders/${userId}`);
        setOrders(response.data.orders);
        // console.log(orders[1].items);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
  // console.log(orders);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.ordersList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: Platform.OS === 'ios' ? -40 : 0,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8931F',
  },
  ordersList: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsList: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#333',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#89C73A',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginLeft: 8,
    color: '#F8931F',
    fontSize: 14,
    fontWeight: '600',
  },
});