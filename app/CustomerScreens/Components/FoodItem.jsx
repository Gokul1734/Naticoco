import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { SCREEN_WIDTH } from "../Screens/Home/constants";
import getImage from "./GetImage";
import { AnimatePresence, MotiView } from "moti";
import * as Haptics from 'expo-haptics';
// import {updateQuantity}  from '../context/CartContext';

// Add image mapping
// const productImages = {
//   "logoo.jpg": require("../../../assets/images/logoo.jpg"),
//   "ChickenKebab.jpg": require("../../../assets/images/ChickenKebab.jpg"),
//   "tandoori.jpg": require("../../../assets/images/tandoori.jpg"),
//   "wob.jpg": require("../../../assets/images/wob.jpeg"),
//   "thighs.jpg": require("../../../assets/images/thighs.jpeg"),
//   "ggp.jpg": require("../../../assets/images/ggp.jpg"),
//   "heat and eat.jpeg": require("../../../assets/images/heat and eat.jpeg"),
//   "classic chicken momos.jpg": require("../../../assets/images/classic chicken momos.jpg"),
//   "natiChicken.jpg": require("../../../assets/images/natiChicken.jpg"),
// };

// const getItemImage = (imageName) => {
//   return productImages[imageName] || productImages["logoo.jpg"];
// };

export default function FoodItem({ item, onPress }) {
  // console.log(item);
  const { addToCart, cartItems, cartCount, updateQuantity } = useCart();
  const cartItem = cartItems.find(i => i._id === item._id || i.id === item._id || item.id);
  // console.log(cartItem);
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
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{uri:getImage(item.image)}}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.itemName}</Text>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs.{item.price}/-</Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
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
    fontWeight: "600",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  quantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2e2e2e",
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
});
