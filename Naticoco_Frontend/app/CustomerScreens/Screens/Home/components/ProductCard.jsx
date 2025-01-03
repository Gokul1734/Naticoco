import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import styles from '../styles';
import axios from 'axios';
import { Buffer } from 'buffer';

const ProductCard = ({ item, onPress, cartItem, addToCart, updateQuantity, getItemImage, cardWidth }) => {
  const image = item.image.replace('/ImageStore/', '');
  // console.log(image);
  const [images, setImage] = useState(null);
  useEffect(() => {
    axios.get(`http://192.168.29.165:3500/images/${image}`, {
      responseType:'arraybuffer'
    })
      .then(response => {
       const base64Image = `data:image/jpeg;base64,${Buffer.from(response.data, 'binary').toString('base64')}`;
       setImage(base64Image);
      })
      .catch(error => console.error(error));
  }, []);

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
          source={{uri : images}}
          style={styles.productImage}
          resizeMode="cover"
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
