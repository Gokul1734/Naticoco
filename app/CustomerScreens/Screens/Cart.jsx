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
  Modal,
  KeyboardAvoidingView,
  SafeAreaView
} from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LoadingScreen from '../Components/LoadingScreen';
import ScreenBackground from '../Components/ScreenBackground';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe } from '@stripe/stripe-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const productImages = {
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
  'natiChicken.jpg': require('../../../assets/images/natiChicken.jpg'),
};

const getItemImage = (imageName) => {
  return productImages[imageName] || productImages['logoo.jpg'];
};

function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const slideAnim = useRef(new Array(cartItems.length).fill(0).map(() => new Animated.Value(0))).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true
      })
    ]).start();
  };

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
    const loadUser = async () => {
      try {
        const userStr = await AsyncStorage.getItem('logincre');
        const userDetails = userStr ? JSON.parse(userStr) : null;
        setUser(userDetails);
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();

    slideAnim.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
        delay: index * 100,
      }).start();
    });
  }, [cartItems]);

  const handleOnlinePayment = async () => {
    if (!user?.token) {
      setError('Please login to continue');
      startShake();
      return;
    }

    setIsLoading(true);
    try {
      // Create payment intent on your backend
      const response = await axios.post('http://192.168.32.227:3500/payment/create-payment-intent', {
        amount: totalAmount * 100, // Convert to cents
        currency: 'inr'
      });

      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: response.data.clientSecret,
        merchantDisplayName: 'Nati Coco',
        style: 'automatic',
        googlePay: true,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      // Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      // Payment successful
      Alert.alert('Success', 'Payment completed successfully!');
      clearCart();
      navigation.navigate('OrderConfirmation', {
        paymentMethod: 'online',
        orderId: response.data.paymentIntentId
      });

    } catch (error) {
      console.error('Payment Error:', error);
      setError(error?.message || 'Unable to process payment');
      startShake();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCOD = () => {
    if (!user?.token) {
      setError('Please login to continue');
      startShake();
      return;
    }

    Alert.alert(
      'Confirm Order',
      'Do you want to place this order with Cash on Delivery?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Confirm',
          onPress: () => {
            clearCart();
            navigation.navigate('OrderConfirmation', {
              paymentMethod: 'cod',
              orderId: `COD${Date.now()}`
            });
          },
        },
      ]
    );
  };

  const renderItem = ({ item, index }) => {
    const translateX = slideAnim[index]?.interpolate({
      inputRange: [0, 1],
      outputRange: [-SCREEN_WIDTH, 0],
    }) || new Animated.Value(0);

    return (
      <Animated.View style={[styles.cartItem, { transform: [{ translateX }] }]} key={item.id}>
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

  if (isLoading) {
    return <LoadingScreen />;
  }

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
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8931F', '#f4a543']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.content}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
          </View>

          {error ? (
            <Animated.View
              style={[
                styles.errorContainer,
                {transform: [{translateX: shakeAnimation}]}
              ]}
            >
              <Text style={styles.error}>{error}</Text>
            </Animated.View>
          ) : null}

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
                onPress={() => {
                  if (!user?.token) {
                    setError('Please login to continue');
                    startShake();
                    return;
                  }
                  setShowPaymentModal(true);
                }}
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

          <Modal
            animationType="slide"
            transparent={true}
            visible={showPaymentModal}
            onRequestClose={() => setShowPaymentModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Payment Method</Text>
                
                <TouchableOpacity
                  style={[styles.paymentButton, styles.onlinePaymentButton]}
                  onPress={handleOnlinePayment}
                >
                  <Ionicons name="card-outline" size={24} color="#fff" />
                  <Text style={styles.paymentButtonText}>Pay Online</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.paymentButton, styles.codButton]}
                  onPress={handleCOD}
                >
                  <Ionicons name="cash-outline" size={24} color="#fff" />
                  <Text style={styles.paymentButtonText}>Cash on Delivery</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPaymentModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  error: {
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: '600',
  },
  closeWebView: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  onlinePaymentButton: {
    backgroundColor: '#F8931F',
  },
  codButton: {
    backgroundColor: '#4CAF50',
  },
  paymentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default CartScreen;