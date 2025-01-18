import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import getImage from './GetImage';

const ToBuy = ({
  item,
  index,
  slideAnim,
  SCREEN_WIDTH,
  updateQuantity,
  removeFromCart,
}) => {
  const translateX = slideAnim[index].interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, 0],
  });

  return (
    <Animated.View style={[styles.cartItem, { transform: [{ translateX }] }]}>
      <Image
        source={{uri:getImage(item.image)}}
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

export default ToBuy;

const styles = StyleSheet.create({
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
}
});
