import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import mockFoodItems from '../../../Backend/Products.json';

const FilteredItems = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();
  const { addToCart, cartItems, updateQuantity } = useCart();

  // Filter items based on category
  const filteredProducts = mockFoodItems.filter(
    (item) => item.category.toLowerCase() === category.toLowerCase()
  );

  const renderItem = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => navigation.navigate('ItemDisplay', { item })}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription}>{item.description}</Text>
          <View style={styles.priceAndCart}>
            <Text style={styles.productPrice}>Rs.{item.price}/-</Text>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => addToCart(item)}
            >
              {cartItem?.quantity ? (
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityText}>{cartItem.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}>
                    {/* <Ionicons name="add-circle" size={24} color="white" /> */}
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.cartButtonText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={{width: 24}} />
      </View>
      
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found in this category</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F8931F',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  productDetails: {
    flex: 1,
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  priceAndCart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#89C73A',
  },
  cartButton: {
    backgroundColor: '#F8931F',
    padding: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    marginLeft: 8,
  },
});

export default FilteredItems;
