import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useCart } from '../context/CartContext';
import { SCREEN_HEIGHT,SCREEN_WIDTH } from '../Screens/Home/constants';

// const SCREEN_HEIGHT = window.screen.height;

const FloatingCartHandler = ({ navigation,bottom }) => {
  const { cartCount, cartItems } = useCart();
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const totalAmount = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );

  useEffect(() => {
    if (cartCount > 0) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [cartCount]);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start(() => navigation.navigate('Cart'));
  };

  if (cartCount === 0) return null;

  return (
    <Animated.View 
      style={[
        bottom ? styles.floatingCart : styles.cart,
        {
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ],
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.cartContent}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={styles.cartInfo}>
          <Animated.View 
            style={[
              styles.cartCountContainer,
              {
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Text style={styles.cartCount}>{cartCount} {cartCount === 1 ? 'item' : 'items'}</Text>
          </Animated.View>
          <Text style={styles.cartAmount}>₹{totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.viewCartContainer}>
          <Text style={styles.viewCartText}>View Cart</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingCart: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? SCREEN_HEIGHT/6 : SCREEN_HEIGHT/10,
    left: 20,
    right: 20,
    backgroundColor: '#F8931F',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cart : {
   position: 'absolute',
    bottom: Platform.OS === 'ios' ? SCREEN_HEIGHT/12 : SCREEN_HEIGHT/20,
    left: 20,
    right: 20,
    backgroundColor: '#F8931F',
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  cartInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartCountContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  cartCount: {
    color: 'white',
    fontWeight: '600',
  },
  cartAmount: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  viewCartContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewCartText: {
    color: '#F8931F',
    fontWeight: '600',
  },
});

export default FloatingCartHandler;