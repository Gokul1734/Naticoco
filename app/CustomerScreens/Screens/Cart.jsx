import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LoadingScreen from '../Components/LoadingScreen';
import ScreenBackground from '../Components/ScreenBackground';
import axios from 'axios';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const productImages = {
  'logoo.jpg': require('../../../assets/images/logoo.jpg'),
  'cp3.jpg': require('../../../assets/images/cp3.jpg'),
  'cp2.jpg': require('../../../assets/images/cp2.jpg'),
  'cp.jpg': require('../../../assets/images/cp.jpg'),
  'salad.jpg': require('../../../assets/images/salad.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
  'classic nati eggs(pack of 6.jpg': require('../../../assets/images/classic nati eggs(pack of 6.jpg'),
  'classsic white eggs(pack of 6).jpg': require('../../../assets/images/classsic white eggs(pack of 6).jpg'),
  'logoo.jpg': require('../../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
  'natiChicken.jpg': require('../../../assets/images/natiChicken.jpg'),
};

const getItemImage = (imageName) => {
  return productImages[imageName] || productImages['logoo.jpg']; // Default to logo if image not found
};

export default function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const slideAnim = useRef(cartItems.map(() => new Animated.Value(0))).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const loadCartData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCartData();
  }, []);

  useEffect(() => {
    cartItems.forEach((_, index) => {
      Animated.spring(slideAnim[index], {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
  }, [cartItems, slideAnim]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const renderItem = ({ item, index }) => {
    const translateX = slideAnim[index].interpolate({
      inputRange: [0, 1],
      outputRange: [-SCREEN_WIDTH, 0],
    });

    return (
      <Animated.View
        style={[styles.cartItem, { transform: [{ translateX }] }]}
      >
        <Image 
          source={getItemImage(item.image)} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (item.quantity > 1) {
                  updateQuantity(item.id, item.quantity - 1);
                }
              }}
            >
              <Ionicons name="remove" size={20} color="#F8931F" />
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                updateQuantity(item.id, item.quantity + 1);
              }}
            >
              <Ionicons name="add" size={20} color="#F8931F" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            removeFromCart(item.id);
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#FF4444" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const handleCheckout = async () => {
    try {
      // Create order
      const orderResponse = await axios.post('http://192.168.137.1:3500/payment/orders', {
        amount: totalAmount * 100, // Convert to paise
      });
      console.log(amount);

      const options = {
        description: 'Payment for your order',
        image: 'your_logo_url',
        currency: 'INR',
        key: process.env.KEY_ID,
        amount: totalAmount * 100,
        name: 'Nati Coco',
        order_id: orderResponse.data.data.id,
        prefill: {
          email: 'user@example.com',
          contact: '9999999999',
          name: 'John Doe'
        },
        theme: { color: '#F8931F' }
      };

      RazorpayCheckout.open(options).then((data) => {
        // Verify payment
        return axios.post('http://192.168.137.1:3500/payment/verify', {
          razorpay_order_id: data.razorpay_order_id,
          razorpay_payment_id: data.razorpay_payment_id,
          razorpay_signature: data.razorpay_signature
        });
      }).then(() => {
        Alert.alert('Success', 'Payment successful!');
        navigation.navigate('OrderConfirmation');
      }).catch((error) => {
        Alert.alert('Error', 'Payment failed. Please try again.');
        console.error(error);
      });

    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error(error);
    }
  };

  if (cartItems.length === 0) {
    return (
      <ScreenBackground>
       <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#ddd" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
      </ScreenBackground>
    );
  }

  return (
      <ScreenBackground style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
        </View>

        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.footer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>₹{totalAmount}</Text>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <LinearGradient
                colors={['#F8931F', '#f4a543']}
                style={styles.gradientButton}
              >
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScreenBackground>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
  },
  listContainer: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8931F',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F8931F',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  removeButton: {
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    marginBottom: 60,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8931F',
  },
  checkoutButton: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  checkoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  shopButton: {
    marginTop: 24,
    backgroundColor: '#F8931F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});