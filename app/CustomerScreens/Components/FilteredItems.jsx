import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import mockFoodItems from '../../../Backend/Products.json';
import { Asset } from 'expo-asset';
import LoadingScreen from './LoadingScreen';
import ScreenBackground from './ScreenBackground';

// Add productImages mapping
const productImages = {
  'logoo.jpg': require('../../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
};

const FilteredItems = ({ route }) => {
  const { category } = route.params;
  const navigation = useNavigation();
  const { addToCart, cartItems, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState(null);
  
  // Combined type filters
  const categoryFilters = {
    Chicken: [
      { id: 'Nati', label: 'Nati Chicken', icon: require('../../../assets/images/NatiChik.png') },
      { id: 'Broiler', label: 'Broiler Chicken', icon: require('../../../assets/images/FarmChik.png') },
      { id: 'Country', label: 'Country Chicken', icon: require('../../../assets/images/TeetarChik.png') },
    ],
    Eggs: [
      { id: 'Farm', label: 'Farm Eggs', icon: require('../../../assets/images/FarmEggs.png') },
      { id: 'Nati', label: 'Nati Eggs', icon: require('../../../assets/images/NatiEggs.png') },
      { id: 'Brown', label: 'Brown Eggs', icon: require('../../../assets/images/BrownEggs.png') },
      { id: 'Duck', label: 'Duck Eggs', icon: require('../../../assets/images/DuckEggs.png') },
    ]
  };

  // Add asset loading
  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Asset.loadAsync(Object.values(productImages));
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const getFilteredProducts = () => {
    let filtered = mockFoodItems.filter(item => item.category === category);
    
    // Apply filter based on category
    if (selectedType) {
      if (category === 'Chicken') {
        filtered = filtered.filter(item => item.chickenType === selectedType.id);
      } else if (category === 'Eggs') {
        filtered = filtered.filter(item => item.eggType === selectedType.id);
      }
    }
    
    return filtered;
  };

  const getItemImage = (imageName) => {
    return productImages[imageName] || productImages['logoo.jpg'];
  };

  const renderItem = ({ item }) => {
    const cartItem = cartItems.find(i => i.id === item.id);
    
    return (
      <TouchableOpacity 
        style={styles.productCard}
        onPress={() => navigation.navigate('ItemDisplay', { item })}
      >
        <Image 
          source={getItemImage(item.image)} 
          style={styles.productImage}
          resizeMode="cover"
        />
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
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}
                    style={styles.addButton}
                  >
                    <Ionicons name="add-circle" size={24} color="white" />
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

  const renderFilters = () => {
    if (!categoryFilters[category]) return null;

    return (
      <View style={styles.filterContainer}>
        <View style={styles.filterScroll}>
          {categoryFilters[category].map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.filterButton,
                selectedType?.id === type.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedType(
                selectedType?.id === type.id ? null : type
              )}
            >
              <Image source={type.icon} style={styles.filterIcon} />
              <Text style={[
                styles.filterText,
                selectedType?.id === type.id && styles.filterTextActive
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (

      <ScreenBackground style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{category}</Text>
          <View style={{width: 24}} />
        </View>

        {renderFilters()}
        
        {getFilteredProducts().length > 0 ? (
          <FlatList
            data={getFilteredProducts()}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            {
              category == 'Mutton' ? (
                <Image source={require('../../../assets/images/comingSoon.jpg')} style={styles.comingSoon}/>
              ) : (
                <Text style={styles.emptyText}>No products found in this category</Text>
              )
            }
          </View>
        )}
      </ScreenBackground>
  )
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
    backgroundColor: '#f5f5f5',
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
    gap: 8,
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
    marginLeft: 4,
  },
  comingSoon: {
    width: 300,
    height: 300,
    marginBottom:150,
  },
  filterContainer: {
    paddingVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    marginVertical: 30,
    gap: 10,
    alignItems: 'start',
    justifyContent: 'start',
  },
  filterIcon: {
    width: 50,
    height: 50,
  },
  filterButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F8931F',
    height: 100,
    width: '31.5%',
    marginBottom: 10,
    gap: 10,
  },
  filterButtonActive: {
    backgroundColor: '#ff5500',
  },
  filterText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
    alignSelf: 'center',
  },
  filterTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FilteredItems;
