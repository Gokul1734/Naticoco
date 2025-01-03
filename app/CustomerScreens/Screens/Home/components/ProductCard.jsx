import React from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import styles from '../styles';

const ProductCard = ({ item, onPress, cartItem, addToCart, updateQuantity, getItemImage, cardWidth }) => {
  // Construct the image URL using the server ImageStore path
  const imageUrl = `http://192.168.29.242:3500/ImageStore/1735838844695-Chicken.png`;
  console.log(imageUrl);
  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <TouchableOpacity 
        style={[styles.productCard, { width: cardWidth }]}
        onPress={onPress}
      >
        <Image 
          // source={{ uri: imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
          source={require('../../../../../assets/images/Chicken65.jpg')} // Fallback image
        />
        <Text style={styles.productName}>{item.itemName}</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingHorizontal:10 ,marginBottom:10}}>
          <Text style={styles.productPrice}>Rs.{item.price}/-</Text>
          <View style={styles.cartActions}>
            <TouchableOpacity 
              style={styles.cart}
              onPress={() => addToCart(item)}
            >
              <Text style={styles.addToCartText}>
                {cartItem?.quantity ? (
                  <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
                    <Text style={{fontSize:12,fontWeight:'600',color:'white'}}>{cartItem.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item._id || item.id, cartItem.quantity + 1)}>
                      <Ionicons name="add-circle" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default ProductCard;
