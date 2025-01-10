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
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import LoadingScreen from '../Components/LoadingScreen';
import ScreenBackground from '../Components/ScreenBackground';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getImage from '../Components/GetImage';


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

// const getItemImage = (imageName) => {
//   return productImages[imageName] || productImages['logoo.jpg'];
// };



function CartScreen({ navigation }) {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const slideAnim = useRef(cartItems.map(() => new Animated.Value(0))).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [userId, setUserId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  
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

    const user = async () => {
     const user = await AsyncStorage.getItem('logincre');
     setUserId(user);
    }
    user();

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

  const handleOnlinePayment = async () => {
    try {
      // Create order on your backend
      const orderResponse = await axios.post('http://192.168.29.165:3500/payment/orders', {
        amount: totalAmount * 100,
      });

      if (!orderResponse.data || !orderResponse.data.data || !orderResponse.data.data.id) {
        throw new Error('Invalid order response from server');
      }

      // Prepare payment data
      const options = {
        description: 'Payment for your order',
        image: 'your_logo_url',
        currency: 'INR',
        key: 'rzp_test_epPmzNozAIcJcC',
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

      setPaymentData(options);
      setShowWebView(true);
      setShowPaymentModal(false);

    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert(
        'Payment Failed',
        error?.message || 'Unable to process payment. Please try again later.'
      );
    }
  };

  const handlePaymentResponse = async (response) => {
    try {
      if (response.error) {
        throw new Error(response.error.description);
      }

      // Verify payment on your backend
      await axios.post('http://192.168.29.165:3500/payment/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });

      // Handle success
      Alert.alert('Success', 'Payment successful!');
      // clearCart();
      navigation.navigate('Success', {
        paymentMethod: 'online',
        orderId: response.razorpay_order_id
      });

    } catch (error) {
      Alert.alert('Error', error?.message || 'Payment verification failed');
    } finally {
      setShowWebView(false);
      setIsLoading(false);
    }
  };

  const handleCOD = () => {
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
            navigation.navigate('Success', {
              paymentMethod: 'cod',
              orderId: `COD${Date.now()}`
            });
          },
        },
      ]
    );
  };

  const placeOrder = async () => {
    await axios.post('http://192.168.29.165:3500/payment/placeorder', {
      userId: userId,
      orderId: orderId,
      totalAmount: totalAmount,
      paymentMethod: paymentMethod,
    });
  };

  const renderItem = ({ item, index }) => {
   const translateX = slideAnim[index].interpolate({
     inputRange: [0, 1],
     outputRange: [-SCREEN_WIDTH, 0],
   });
   console.log(item.image);
   return (
     <Animated.View style={[styles.cartItem, { transform: [{ translateX }] }]}>
       <Image 
         source={require('../../../assets/images/Chicken65.jpg')} 
         style={styles.itemImage} 
         resizeMode="cover"
       />
       <View style={styles.itemDetails}>
         <Text style={styles.itemName}>{item.itemName}</Text>
         <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>
         
         <View style={styles.quantityContainer}>
           <TouchableOpacity 
             style={styles.quantityButton}
             onPress={() => {
               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
               if (item.quantity > 1) {
                 updateQuantity(item._id || item.id, item.quantity - 1);
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
               updateQuantity(item._id || item.id, item.quantity + 1);
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
           removeFromCart(item._id || item.id);
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
    <ScreenBackground style={styles.container}>
      <View style={[styles.header,{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
        </View>
         <TouchableOpacity onPress={() => clearCart()}>
          <Text style={{color: 'white', fontSize: 16, fontWeight: '600',backgroundColor: 'red', padding: 10, borderRadius: 10}}>Clear Cart</Text>
         </TouchableOpacity>
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={item => item._id || item.id}
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
            onPress={() => setShowPaymentModal(true)}
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
{showWebView && paymentData && (
  <Modal
    animationType="slide"
    transparent={false}
    visible={showWebView}
    onRequestClose={() => {
      setShowWebView(false);
      setIsLoading(false);
    }}
  >
    <View style={{ flex: 1 }}>
      <WebView
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { margin: 10; padding: 20px; font-family: Arial, sans-serif; }
                  .loading { text-align: center; margin-top: 20px; }
                </style>
              </head>
              <body>
                <div id="payment_div">
                  <p class="loading">Initializing payment...</p>
                </div>
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <script>
                  const options = ${JSON.stringify(paymentData)};
                  options.handler = function(response) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature
                    }));
                  };
                  
                  options.modal = {
                    ondismiss: function() {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        error: { description: 'Payment cancelled by user' }
                      }));
                    }
                  };
                  
                  const rzp = new Razorpay(options);
                  
                  rzp.on('payment.failed', function(response) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      error: response.error
                    }));
                  });
                  
                  // Start payment automatically
                  setTimeout(function() {
                    rzp.open();
                  }, 1000);
                </script>
              </body>
            </html>
          `
        }}
        onMessage={(event) => {
          const response = JSON.parse(event.nativeEvent.data);
          handlePaymentResponse(response);
        }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
          Alert.alert('Error', 'Something went wrong with the payment. Please try again.');
          setShowWebView(false);
          setIsLoading(false);
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView HTTP error: ', nativeEvent);
          Alert.alert('Error', 'Network error. Please check your connection and try again.');
          setShowWebView(false);
          setIsLoading(false);
        }}
        style={{ flex: 1 }}
      />
      <TouchableOpacity
        style={[styles.closeWebView, { position: 'absolute', top: 40, right: 20 }]}
        onPress={() => {
          setShowWebView(false);
          setIsLoading(false);
        }}
      >
        <Ionicons name="close" size={24} color="#000" />
      </TouchableOpacity>
    </View>
  </Modal>
)}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    fontWeight: '600',},
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















// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   FlatList,
//   Image,
//   Animated,
//   Dimensions,
//   Platform,
//   Alert,
//   Modal,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import { useCart } from "../context/CartContext";
// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import * as Haptics from "expo-haptics";
// import LoadingScreen from "../Components/LoadingScreen";
// import ScreenBackground from "../Components/ScreenBackground";
// import axios from "axios";
// // import RazorpayCheckout from "react-native-razorpay";

// const { width: SCREEN_WIDTH } = Dimensions.get("window");

// const productImages = {
//   "cp3.jpg": require("../../../assets/images/cp3.jpg"),
//   "cp2.jpg": require("../../../assets/images/cp2.jpg"),
//   "cp.jpg": require("../../../assets/images/cp.jpg"),
//   "salad.jpg": require("../../../assets/images/salad.jpg"),
//   "heat and eat.jpeg": require("../../../assets/images/heat and eat.jpeg"),
//   "classic chicken momos.jpg": require("../../../assets/images/classic chicken momos.jpg"),
//   "classic nati eggs(pack of 6.jpg": require("../../../assets/images/classic nati eggs(pack of 6.jpg"),
//   "classsic white eggs(pack of 6).jpg": require("../../../assets/images/classsic white eggs(pack of 6).jpg"),
//   "logoo.jpg": require("../../../assets/images/logoo.jpg"),
//   "ChickenKebab.jpg": require("../../../assets/images/ChickenKebab.jpg"),
//   "tandoori.jpg": require("../../../assets/images/tandoori.jpg"),
//   "wob.jpg": require("../../../assets/images/wob.jpeg"),
//   "thighs.jpg": require("../../../assets/images/thighs.jpeg"),
//   "ggp.jpg": require("../../../assets/images/ggp.jpg"),
//   "natiChicken.jpg": require("../../../assets/images/natiChicken.jpg"),
// };

// const getItemImage = (imageName) => {
//   return productImages[imageName] || productImages["logoo.jpg"];
// };

// function CartScreen({ navigation }) {
//   const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
//   const [isLoading, setIsLoading] = useState(true);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [showWebView, setShowWebView] = useState(false);
//   const [paymentData, setPaymentData] = useState(null);
//   const slideAnim = useRef(cartItems.map(() => new Animated.Value(0))).current;
//   const scaleAnim = useRef(new Animated.Value(1)).current;

//   const totalAmount = cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   useEffect(() => {
//     const loadCartData = async () => {
//       try {
//         await new Promise((resolve) => setTimeout(resolve, 800));
//       } catch (error) {
//         console.error("Error loading cart:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadCartData();
//   }, []);

//   useEffect(() => {
//     cartItems.forEach((_, index) => {
//       Animated.spring(slideAnim[index], {
//         toValue: 1,
//         tension: 50,
//         friction: 7,
//         useNativeDriver: true,
//         delay: index * 100,
//       }).start();
//     });
//   }, [cartItems, slideAnim]);

//   // const handleOnlinePayment = async () => {
//   //   try {
//   //     // Create order on your backend
//   //     const orderResponse = await axios.post(
//   //       "http://192.168.29.165:3500/payment/orders",
//   //       {
//   //         amount: totalAmount * 100,
//   //       }
//   //     );

//   //     if (
//   //       !orderResponse.data ||
//   //       !orderResponse.data.data ||
//   //       !orderResponse.data.data.id
//   //     ) {
//   //       throw new Error("Invalid order response from server");
//   //     }

//   //     // Prepare payment data
//   //     const options = {
//   //       description: "Payment for your order",
//   //       image: "your_logo_url",
//   //       currency: "INR",
//   //       key: "rzp_test_epPmzNozAIcJcC",
//   //       amount: totalAmount * 100,
//   //       name: "Nati Coco",
//   //       order_id: orderResponse.data.data.id,
//   //       prefill: {
//   //         email: "user@example.com",
//   //         contact: "9999999999",
//   //         name: "John Doe",
//   //       },
//   //       theme: { color: "#F8931F" },
//   //     };

//   //     setPaymentData(options);
//   //     setShowWebView(true);
//   //     setShowPaymentModal(false);
//   //   } catch (error) {
//   //     console.error("Payment Error:", error);
//   //     Alert.alert(
//   //       "Payment Failed",
//   //       error?.message || "Unable to process payment. Please try again later."
//   //     );
//   //   }
//   // };

//   // const handlePaymentResponse = async (response) => {
//   //   try {
//   //     if (response.error) {
//   //       throw new Error(response.error.description);
//   //     }

//   //     // Verify payment on your backend
//   //     await axios.post("http://192.168.29.165:3500/payment/verify", {
//   //       razorpay_order_id: response.razorpay_order_id,
//   //       razorpay_payment_id: response.razorpay_payment_id,
//   //       razorpay_signature: response.razorpay_signature,
//   //     });

//   //     // Handle success
//   //     Alert.alert("Success", "Payment successful!");
//   //     clearCart();
//   //     navigation.navigate("OrderConfirmation", {
//   //       paymentMethod: "online",
//   //       orderId: response.razorpay_order_id,
//   //     });
//   //   } catch (error) {
//   //     Alert.alert("Error", error?.message || "Payment verification failed");
//   //   } finally {
//   //     setShowWebView(false);
//   //     setIsLoading(false);
//   //   }
//   // };

//   const handlePayment = () => {
//     const options = {
//       description: "Test Transaction",
//       image: "https://your-logo-url.com/logo.png", // optional logo
//       currency: "INR",
//       key: "rzp_test_epPmzNozAIcJcC", // Replace with your Razorpay Key ID
//       amount: "50000", // Amount in paise (50000 paise = ₹500)
//       name: "Naticoco",
//       prefill: {
//         email: "test@example.com",
//         contact: "9876543210",
//         name: "Test User",
//       },
//       theme: { color: "#F37254" },
//     };

//     RazorpayCheckout.open(options)
//       .then((data) => {
//         // Handle successful payment
//         Alert.alert(
//           "Payment Success",
//           `Payment ID: ${data.razorpay_payment_id}`
//         );
//       })
//       .catch((error) => {
//         // Handle payment failure
//         Alert.alert("Payment Failed", error.description);
//       });
//   };

//   const handleCOD = () => {
//     Alert.alert(
//       "Confirm Order",
//       "Do you want to place this order with Cash on Delivery?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Confirm",
//           onPress: () => {
//             clearCart();
//             navigation.navigate("OrderConfirmation", {
//               paymentMethod: "cod",
//               orderId: `COD${Date.now()}`,
//             });
//           },
//         },
//       ]
//     );
//   };

//   const renderItem = ({ item, index }) => {
//     const translateX = slideAnim[index].interpolate({
//       inputRange: [0, 1],
//       outputRange: [-SCREEN_WIDTH, 0],
//     });

//     return (
//       <Animated.View style={[styles.cartItem, { transform: [{ translateX }] }]}>
//         <Image
//           source={getItemImage(item.image)}
//           style={styles.itemImage}
//           resizeMode="cover"
//         />
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemPrice}>₹{item.price * item.quantity}</Text>

//           <View style={styles.quantityContainer}>
//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => {
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 if (item.quantity > 1) {
//                   updateQuantity(item._id || item.id, item.quantity - 1);
//                 }
//               }}
//             >
//               <Ionicons name="remove" size={20} color="#F8931F" />
//             </TouchableOpacity>

//             <Text style={styles.quantityText}>{item.quantity}</Text>

//             <TouchableOpacity
//               style={styles.quantityButton}
//               onPress={() => {
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                 updateQuantity(item._id || item.id, item.quantity + 1);
//               }}
//             >
//               <Ionicons name="add" size={20} color="#F8931F" />
//             </TouchableOpacity>
//           </View>
//         </View>

//         <TouchableOpacity
//           style={styles.removeButton}
//           onPress={() => {
//             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//             removeFromCart(item._id || item.id);
//           }}
//         >
//           <Ionicons name="trash-outline" size={24} color="#FF4444" />
//         </TouchableOpacity>
//       </Animated.View>
//     );
//   };

//   if (isLoading) {
//     return <LoadingScreen />;
//   }

//   if (cartItems.length === 0) {
//     return (
//       <ScreenBackground>
//         <View style={styles.emptyContainer}>
//           <Ionicons name="cart-outline" size={64} color="#ddd" />
//           <Text style={styles.emptyText}>Your cart is empty</Text>
//           <TouchableOpacity
//             style={styles.shopButton}
//             onPress={() => navigation.goBack()}
//           >
//             <Text style={styles.shopButtonText}>Start Shopping</Text>
//           </TouchableOpacity>
//         </View>
//       </ScreenBackground>
//     );
//   }

//   return (
//     <ScreenBackground style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           onPress={() => navigation.goBack()}
//           style={styles.backButton}
//         >
//           <Ionicons name="arrow-back" size={24} color="#333" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>My Cart</Text>
//       </View>

//       <FlatList
//         data={cartItems}
//         renderItem={renderItem}
//         keyExtractor={(item) => item._id || item.id}
//         contentContainerStyle={styles.listContainer}
//         showsVerticalScrollIndicator={false}
//       />

//       <View style={styles.footer}>
//         <View style={styles.totalContainer}>
//           <Text style={styles.totalLabel}>Total Amount</Text>
//           <Text style={styles.totalAmount}>₹{totalAmount}</Text>
//         </View>

//         <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
//           <TouchableOpacity
//             style={styles.checkoutButton}
//             onPress={() => setShowPaymentModal(true)}
//           >
//             <LinearGradient
//               colors={["#F8931F", "#f4a543"]}
//               style={styles.gradientButton}
//             >
//               <Text style={styles.checkoutText}>Proceed to Checkout</Text>
//               <Ionicons name="arrow-forward" size={20} color="#fff" />
//             </LinearGradient>
//           </TouchableOpacity>
//         </Animated.View>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={showPaymentModal}
//         onRequestClose={() => setShowPaymentModal(false)}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Select Payment Method</Text>

//             <TouchableOpacity
//               style={[styles.paymentButton, styles.onlinePaymentButton]}
//               onPress={handlePayment}
//             >
//               <Ionicons name="card-outline" size={24} color="#fff" />
//               <Text style={styles.paymentButtonText}>Pay Online</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.paymentButton, styles.codButton]}
//               onPress={handleCOD}
//             >
//               <Ionicons name="cash-outline" size={24} color="#fff" />
//               <Text style={styles.paymentButtonText}>Cash on Delivery</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.cancelButton}
//               onPress={() => setShowPaymentModal(false)}
//             >
//               <Text style={styles.cancelButtonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//       {showWebView && paymentData && (
//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={showWebView}
//           onRequestClose={() => {
//             setShowWebView(false);
//             setIsLoading(false);
//           }}
//         >
//           <View style={{ flex: 1 }}>
//             <WebView
//               source={{
//                 html: `
//             <!DOCTYPE html>
//             <html>
//               <head>
//                 <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                 <style>
//                   body { margin: 0; padding: 16px; font-family: Arial, sans-serif; }
//                   .loading { text-align: center; margin-top: 20px; }
//                 </style>
//               </head>
//               <body>
//                 <div id="payment_div">
//                   <p class="loading">Initializing payment...</p>
//                 </div>
//                 <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
//                 <script>
//                   const options = ${JSON.stringify(paymentData)};
//                   options.handler = function(response) {
//                     window.ReactNativeWebView.postMessage(JSON.stringify({
//                       razorpay_payment_id: response.razorpay_payment_id,
//                       razorpay_order_id: response.razorpay_order_id,
//                       razorpay_signature: response.razorpay_signature
//                     }));
//                   };
                  
//                   options.modal = {
//                     ondismiss: function() {
//                       window.ReactNativeWebView.postMessage(JSON.stringify({
//                         error: { description: 'Payment cancelled by user' }
//                       }));
//                     }
//                   };
                  
//                   const rzp = new Razorpay(options);
                  
//                   rzp.on('payment.failed', function(response) {
//                     window.ReactNativeWebView.postMessage(JSON.stringify({
//                       error: response.error
//                     }));
//                   });
                  
//                   // Start payment automatically
//                   setTimeout(function() {
//                     rzp.open();
//                   }, 1000);
//                 </script>
//               </body>
//             </html>
//           `,
//               }}
//               onMessage={(event) => {
//                 const response = JSON.parse(event.nativeEvent.data);
//                 handlePaymentResponse(response);
//               }}
//               onError={(syntheticEvent) => {
//                 const { nativeEvent } = syntheticEvent;
//                 console.warn("WebView error: ", nativeEvent);
//                 Alert.alert(
//                   "Error",
//                   "Something went wrong with the payment. Please try again."
//                 );
//                 setShowWebView(false);
//                 setIsLoading(false);
//               }}
//               onHttpError={(syntheticEvent) => {
//                 const { nativeEvent } = syntheticEvent;
//                 console.warn("WebView HTTP error: ", nativeEvent);
//                 Alert.alert(
//                   "Error",
//                   "Network error. Please check your connection and try again."
//                 );
//                 setShowWebView(false);
//                 setIsLoading(false);
//               }}
//               style={{ flex: 1 }}
//             />
//             <TouchableOpacity
//               style={[
//                 styles.closeWebView,
//                 { position: "absolute", top: 40, right: 20 },
//               ]}
//               onPress={() => {
//                 setShowWebView(false);
//                 setIsLoading(false);
//               }}
//             >
//               <Ionicons name="close" size={24} color="#000" />
//             </TouchableOpacity>
//           </View>
//         </Modal>
//       )}
//     </ScreenBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   closeWebView: {
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     padding: 8,
//     elevation: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     marginLeft: 16,
//   },
//   listContainer: {
//     padding: 16,
//   },
//   cartItem: {
//     flexDirection: "row",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 16,
//     ...Platform.select({
//       ios: {
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   itemImage: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//     backgroundColor: "#f5f5f5",
//   },
//   itemDetails: {
//     flex: 1,
//     marginLeft: 12,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#F8931F",
//     marginBottom: 8,
//   },
//   quantityContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   quantityButton: {
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     padding: 8,
//     borderWidth: 1,
//     borderColor: "#F8931F",
//   },
//   quantityText: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginHorizontal: 16,
//   },
//   removeButton: {
//     padding: 8,
//   },
//   footer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: "#eee",
//     backgroundColor: "#fff",
//     marginBottom: 60,
//   },
//   totalContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },
//   totalLabel: {
//     fontSize: 16,
//     color: "#666",
//   },
//   totalAmount: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: "#F8931F",
//   },
//   checkoutButton: {
//     overflow: "hidden",
//     borderRadius: 12,
//   },
//   gradientButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//   },
//   checkoutText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginRight: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   emptyText: {
//     fontSize: 18,
//     color: "#666",
//     marginTop: 16,
//   },
//   shopButton: {
//     marginTop: 24,
//     backgroundColor: "#F8931F",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   shopButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     padding: 20,
//     minHeight: 300,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "600",
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   paymentButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   onlinePaymentButton: {
//     backgroundColor: "#F8931F",
//   },
//   codButton: {
//     backgroundColor: "#4CAF50",
//   },
//   paymentButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//     marginLeft: 8,
//   },
//   cancelButton: {
//     padding: 16,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     color: "#666",
//     fontSize: 16,
//   },
// });

// export default CartScreen;
