import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Badge, Button } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import axios from 'axios';

// Helper function to get status color
const getStatusColor = (status) => {
  const normalizedStatus = status.toUpperCase();
  switch (normalizedStatus) {
    case 'PENDING': return '#F8931F';
    case 'PREPARING': return '#2196F3';
    case 'COMPLETED': return '#4CAF50';
    case 'REJECTED': return '#F44336';
    default: return '#666';
  }
};

const OrderCard = ({ order, onAccept, onReject, onPreparationComplete }) => (
  <MotiView
    from={{ opacity: 0, translateX: -50 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ type: 'spring', duration: 1000 }}
  >
    <Card style={styles.orderCard}>
      <Card.Content>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>{order.orderId}</Text>
            <Text style={styles.orderTime}>
              {new Date(order.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            {order.status}
          </Badge>
        </View>

        <View style={styles.itemsList}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.itemName}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>Total: ₹{order.amount}</Text>
          <View style={styles.actionButtons}>
            {order.status.toUpperCase() === 'PENDING' && (
              <>
                <Button 
                  mode="contained" 
                  onPress={() => onAccept(order._id)}
                  style={[styles.actionButton, styles.acceptButton]}
                >
                  Accept & Prepare
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => onReject(order._id)}
                  style={[styles.actionButton, styles.rejectButton]}
                >
                  Reject
                </Button>
              </>
            )}
            {order.status.toUpperCase() === 'PREPARING' && (
              <Button 
                mode="contained" 
                onPress={() => onPreparationComplete(order._id)}
                style={[styles.actionButton, styles.completeButton]}
              >
                Mark as Ready
              </Button>
            )}
          </View>
        </View>
      </Card.Content>
    </Card>
  </MotiView>
);

export default function OrderManagement({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('PENDING');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const vendorCredentialsString = await AsyncStorage.getItem('vendorCredentials');
      if (!vendorCredentialsString) {
        console.error('No vendor credentials found');
        return;
      }
   
      const vendorCredentials = JSON.parse(vendorCredentialsString);
      const storeId = vendorCredentials?.vendorData?.storeId;
  
      if (!storeId) {
        console.error('No storeId found in vendor credentials');
        return;
      }
  
      const response = await axios.get(`http://192.168.83.227:3500/citystore/orders/${storeId}`);
      
      console.log('Fetched orders:', response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const handleAcceptOrder = async (orderId) => {
    console.log(orderId);
    try {
      await axios.post('http://192.168.83.227:3500/citystore/updateorder', {
        orderId: orderId,  // Pass orderId in the body
        status: 'PREPARING' // Pass the new status in the body
      });
      
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: 'PREPARING' } : order
      ));
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };
  
  const handleRejectOrder = async (orderId) => {
    try {
      await axios.post('http://192.168.83.227:3500/citystore/updateorder', {
        orderId: orderId, // Pass orderId in the body
        status: 'REJECTED' // Pass the new status in the body
      });
  
      setOrders(orders.map(order =>
        order._id === orderId ? { ...order, status: 'REJECTED' } : order
      ));
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };
  
  const handlePreparationComplete = async (orderId) => {
    try {
      await axios.post('http://192.168.83.227:3500/citystore/updateorder', {
        orderId: orderId, // Pass orderId in the body
        status: 'COMPLETED' // Pass the new status in the body
      });
  
      const updatedOrder = orders.find(order => order._id === orderId);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: 'COMPLETED' } : order
      ));
  
      navigation.navigate('PickupManagement', { order: updatedOrder });
    } catch (error) {
      console.error('Error completing order:', error);
    }
  };
  
  

  // Normalize status for comparison
  const normalizeStatus = (status) => status.toUpperCase();

  const filteredOrders = orders.filter(order => 
    activeTab === 'ALL' || normalizeStatus(order.status) === activeTab
  );

  // Status tabs with consistent casing
  const statusTabs = ['PENDING', 'PREPARING', 'COMPLETED', 'REJECTED', 'ALL'];

  // Helper function to display status in proper case
  const displayStatus = (status) => {
    return status === 'ALL' ? 'All' : status.charAt(0) + status.slice(1).toLowerCase();
  };

  console.log('Current filtered orders:', filteredOrders);
  console.log('Active tab:', activeTab);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Management</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {statusTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {displayStatus(tab)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.ordersList}>
        {loading ? (
          <Text>Loading orders...</Text>
        ) : filteredOrders.length === 0 ? (
          <Text>No orders found</Text>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard
              key={order._id}
              order={{
                ...order,
                status: displayStatus(order.status)
              }}
              onAccept={() => handleAcceptOrder(order.orderId)}
              onReject={() => handleRejectOrder(order.orderId)}
              onPreparationComplete={() => handlePreparationComplete(order.orderId)}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(20),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
  },
  tabsContainer: {
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
  },
  tab: {
    paddingHorizontal: scale(20),
    marginRight: scale(10),
    borderRadius: scale(20),
    height: verticalScale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#0f1c57',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  ordersList: {
    flex: 1,
    padding: scale(20),
  },
  orderCard: {
    marginBottom: verticalScale(15),
    borderRadius: scale(15),
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  orderId: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  orderTime: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: scale(10),
  },
  itemsList: {
    marginVertical: verticalScale(10),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(5),
  },
  itemName: {
    flex: 2,
  },
  itemQuantity: {
    flex: 1,
    textAlign: 'center',
  },
  itemPrice: {
    flex: 1,
    textAlign: 'right',
  },
  orderFooter: {
    marginTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: verticalScale(10),
  },
  totalAmount: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: scale(10),
  },
  actionButton: {
    borderRadius: scale(8),
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
    borderWidth: 1,
  },
  completeButton: {
    backgroundColor: '#2196F3',
  },
});