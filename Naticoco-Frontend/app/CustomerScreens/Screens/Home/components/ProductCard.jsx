import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, Dimensions } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import getImage from '../../../Components/GetImage';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ProductCard = ({ item, onPress, cartItem, addToCart, updateQuantity, getItemImage, cardWidth }) => {
  const [loading, setLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleAddToCart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    addToCart(item);
  };

  const handleQuantityChange = (newQuantity) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (newQuantity === 0) {
      updateQuantity(item._id, 0);
    } else {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ 
        type: 'spring',
        damping: 15,
        duration: 700
      }}
    >
      <TouchableOpacity 
        style={[styles.productCard, { width: cardWidth }]} 
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.95}
      >
        <MotiView
          animate={{ scale: isPressed ? 0.98 : 1 }}
          transition={{ type: 'timing', duration: 150 }}
        >

          <Image source={{ uri: getImage(item.image) }} style={styles.productImage} resizeMode="cover" />

          <View style={styles.contentContainer}>
            <View style={styles.textContainer}>
              <Text style={styles.productName}>{(item.itemName).length > 16 ? (item.itemName).substring(0, 16) + '...' : item.itemName}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>
              {(item.description).length > 20 ? (item.description).substring(0, 20) + '...' : item.description}
              </Text>
            </View>

            <View style={styles.bottomContainer}>
              <Text style={styles.productPrice}>₹{item.price}</Text>

              <AnimatePresence>
                {cartItem?.quantity ? (
                  <MotiView
                    from={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    style={styles.quantityContainer}
                  >
                    <TouchableOpacity 
                      onPress={() => handleQuantityChange(cartItem.quantity - 1)}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="remove" size={20} color="white" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{cartItem.quantity}</Text>

                    <TouchableOpacity 
                      onPress={() => handleQuantityChange(cartItem.quantity + 1)}
                      style={styles.quantityButton}
                    >
                      <Ionicons name="add" size={20} color="white" />
                    </TouchableOpacity>
                  </MotiView>
                ) : (
                  <MotiView
                    from={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <TouchableOpacity 
                      style={styles.addButton}
                      onPress={handleAddToCart}
                    >
                      <Ionicons name="add" size={24} color="white" />
                      <Text style={styles.addButtonText}>ADD</Text>
                    </TouchableOpacity>
                  </MotiView>
                )}
              </AnimatePresence>
            </View>
          </View>
        </MotiView>
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = {
  productCard: {
    backgroundColor: '#e6e6e6',
    borderRadius: 16,
    marginHorizontal: 8,
    marginVertical: 10,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '100%',
    height: 180,
  },
  contentContainer: {
    padding: 12,
  },
  textContainer: {
    marginBottom: 8,
  },
  productName: {
    fontSize: SCREEN_WIDTH * 0.04,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8931F',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8931F',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8931F',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
};

export default ProductCard;