import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import getImage from './GetImage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ItemDisplay({ route }) {
  const { item } = route.params;
  console.log(item);
  const navigation = useNavigation();
  const [cartItems, setCartItems] = React.useState([]);
  const [menuItems,setMenuItems] = useState([]);
  // const item = {
  //   id: 1,
  //   name: "Chicken Liver",
  //   price: 100,
  //   image: require('../../../assets/images/ChickenLiver.jpg'),
  //   quantity: 1,
  //   description: "Chicken Liver is a popular dish in India. It is made with chicken, spices, and vegetables. It is a very tasty dish and is loved by many people.",
  //   category: "Chicken",
  //   chickenType: "Meat"
  // }
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === product.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  // Mock related products - replace with your data source
  const relatedProducts = [
    { id: 2, name: "Chicken Breast", price: 299, image: require('../../../assets/images/ChickenBreast.jpg') },
    { id: 3, name: "Chicken Curry Cut", price: 399, image: require('../../../assets/images/ChickenCurryCut.png') },
    { id: 4, name: "Chicken Wings", price: 499, image: require('../../../assets/images/ChickenWings.jpg') }
  ];

  useEffect(() => {
   const relatedProduct = async () => {
    const items = await AsyncStorage.getItem('storeMenu');
    setMenuItems(items);
   }
   relatedProduct();
  })

  // console.log(menuItems);
  const relpro = menuItems.filter(item => item.category == "Chicken");
  console.log(relpro);
  return (
    <View style={styles.mainContainer}>
      {/* Back Button */}
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButtonCircle}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#F8931F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: getImage(item.image) }}
            style={styles.image}
            resizeMode="cover"
          />
          {item.BestSeller && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Best Seller</Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.itemName}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>

          {/* Product Info */}
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={20} color="#666" />
              <Text style={styles.detailText}>20</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{item.Category}</Text>
            </View>
            {item.chickenType && (
              <View style={styles.detailItem}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{item.subCategory} Type</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {/* Related Products */}
          <View style={styles.relatedContainer}>
            <Text style={styles.relatedTitle}>You might also like</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedScroll}
            >
              {relatedProducts.map((product) => (
                <TouchableOpacity 
                  key={product.id}
                  style={styles.relatedCard}
                  onPress={() => navigation.push('ItemDisplay', { item: product })}
                >
                  <Image 
                    source={product.image}
                    style={styles.relatedImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.relatedName}>{product.name}</Text>
                  <Text style={styles.relatedPrice}>₹{product.price}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* Add to Cart Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>
            {cartItems.find(i => i.id === item._id || item.id)?.quantity ? (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>
                  {cartItems.find(i => i.id === item._id || item.id).quantity} in cart
                </Text>
                <Ionicons name="add-circle" size={24} color="white" />
              </View>
            ) : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#89C73A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#F8931F',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#89C73A',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  relatedContainer: {
    marginBottom: 80,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  relatedScroll: {
    paddingRight: 20,
  },
  relatedCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 100,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8931F',
    padding: 10,
    paddingTop: 0,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 64 : 24,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 100,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});