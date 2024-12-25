import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';

export default function CartScreen() {
  const { cartItems, updateQuantity, clearCart } = useCart();
  const navigation = useNavigation();
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>Rs.{item.price}/-</Text>
      </View>
      <View style={styles.quantityControls}>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, item.quantity - 1)}
        >
          <Ionicons name="remove-circle" size={24} color="#F8931F" />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity 
          onPress={() => updateQuantity(item.id, item.quantity + 1)}
        >
          <Ionicons name="add-circle" size={24} color="#F8931F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
      <Text style={styles.title}>My Cart</Text>
      <TouchableOpacity style={styles.clearButton} onPress={() => {
       Alert.alert('Clear Cart', 'Are you sure you want to clear the cart?', [
        {text:'Cancel',style:'cancel'},
        {text:'Clear',onPress:clearCart},
       ])
      }} >
      <Text style={styles.clearText}>Clear Cart</Text>
      </TouchableOpacity>
      </View>
        
      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total:</Text>
            <Text style={styles.totalAmount}>Rs.{totalAmount.toFixed(2)}/-</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantity: {
    fontSize: 16,
    fontWeight: '500',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8931F',
  },
  checkoutButton: {
    backgroundColor: '#F8931F',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  checkoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
  clearButton:{
    backgroundColor:'#de0303',
    padding:10,
    borderRadius:5,
  },
  clearText:{
    color:'white',
    fontSize:16,
    fontWeight:'600',
  },
});
