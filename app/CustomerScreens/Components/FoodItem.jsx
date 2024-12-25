import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
// import {updateQuantity}  from '../context/CartContext';

export default function FoodItem({ item, onPress }) {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find(i => i.id === item.id);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs.{item.price}/-</Text>
          <View style={styles.cartActions}>
            <TouchableOpacity 
              style={cartItem?.quantity ? {backgroundColor : '#89C73A',paddingHorizontal: 12,
               paddingVertical: 6,
               borderRadius: 15,} : styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addButtonText}>
                {cartItem?.quantity ? 
                <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                <Text >{cartItem.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>
                      <Ionicons name="add-circle" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    marginLeft: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2e2e2e',
  },
  addButton: {
    backgroundColor: '#F8931F',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 14,
    color: '#666',
  },
}); 