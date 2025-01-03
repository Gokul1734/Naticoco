import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Badge, Button } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import StoreBackground from '../../CustomerScreens/Components/ScreenBackground';

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
            <Text style={styles.orderId}>Order #{order.id}</Text>
            <Text style={styles.orderTime}>{order.time}</Text>
          </View>
          <Badge style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            {order.status}
          </Badge>
        </View>

        <View style={styles.itemsList}>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalAmount}>Total: ₹{order.total}</Text>
          <View style={styles.actionButtons}>
            {order.status === 'PENDING' && (
              <>
                <Button 
                  mode="contained" 
                  onPress={() => onAccept(order.id)}
                  style={[styles.actionButton, styles.acceptButton]}
                >
                  Accept & Prepare
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={() => onReject(order.id)}
                  style={[styles.actionButton, styles.rejectButton]}
                >
                  Reject
                </Button>
              </>
            )}
            {order.status === 'PREPARING' && (
              <Button 
                mode="contained" 
                onPress={() => onPreparationComplete(order.id)}
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

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return '#F8931F';
    case 'PREPARING': return '#2196F3';
    case 'ACCEPTED': return '#4CAF50';
    case 'REJECTED': return '#F44336';
    default: return '#666';
  }
};

export default function OrderManagement({ navigation }) {
  const [orders, setOrders] = useState([
    {
      id: '001',
      time: '10:30 AM',
      status: 'PENDING',
      items: [
        { name: 'Crispy Chicken', quantity: 2, price: 299 },
        { name: 'French Fries', quantity: 1, price: 99 }
      ],
      total: 697
    },
    {
     id: '002',
     time: '10:30 AM',
     status: 'PENDING',
     items: [
       { name: 'Crispy Chicken', quantity: 2, price: 299 },
       { name: 'French Fries', quantity: 1, price: 99 }
     ],
     total: 697
   },
   {
    id: '003',
    time: '10:30 AM',
    status: 'PENDING',
    items: [
      { name: 'Crispy Chicken', quantity: 2, price: 299 },
      { name: 'French Fries', quantity: 1, price: 99 }
    ],
    total: 697
  },
    // Add more sample orders
  ]);

  const [activeTab, setActiveTab] = useState('PENDING');

  const handleAcceptOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'PREPARING' } : order
    ));
  };

  const handleRejectOrder = (orderId) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'REJECTED' } : order
    ));
  };

  const handlePreparationComplete = (orderId) => {
    const updatedOrder = orders.find(order => order.id === orderId);
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: 'ACCEPTED' } : order
    ));
    navigation.navigate('PickupManagement', { order: updatedOrder });
  };

  const filteredOrders = orders.filter(order => 
    activeTab === 'ALL' || order.status === activeTab
  );

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
          {['PENDING', 'PREPARING', 'ACCEPTED', 'REJECTED', 'ALL'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView style={styles.ordersList}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onAccept={handleAcceptOrder}
              onReject={handleRejectOrder}
              onPreparationComplete={handlePreparationComplete}
            />
          ))}
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
    // marginBottom: verticalScale(15),
    marginTop: verticalScale(10),
    // height: verticalScale(80),
  },
  tab: {
    paddingHorizontal: scale(20),
    // paddingVertical: verticalScale(8),
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
    // flex: 1,
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