import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { Text, Searchbar, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Asset } from 'expo-asset';
import crispyProducts from '../../../Backend/CrispyProducts.json';
import { useCart } from '../context/CartContext';
import LoadingScreen from '../Components/LoadingScreen';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import ScreenBackground from '../Components/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const crispyItems = crispyProducts;

const categories = [
  { name: 'Crispy', icon: require('../../../assets/images/Crispy.png') },
  { name: 'Salads', icon: require('../../../assets/images/Salads.png') }
];

const productImages = {
  cp3: require('../../../assets/images/cp3.jpg'),
  cp2: require('../../../assets/images/cp2.jpg'),
  cp: require('../../../assets/images/cp.jpg'),
  salad: require('../../../assets/images/salad.jpg'),
  natiChicken: require('../../../assets/images/logoo.jpg'),
  kebab: require('../../../assets/images/heat and eat.jpeg'),
  tikka: require('../../../assets/images/heat and eat.jpeg'),
  curryCut: require('../../../assets/images/logoo.jpg'),
  curryCutLegs: require('../../../assets/images/logoo.jpg'),
  gingerGarlic: require('../../../assets/images/logoo.jpg'),
};

const CategoryButton = ({ name, icon, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(name)}
    style={[styles.categoryButton, isSelected && styles.selectedCategory]}
  >
    <LinearGradient
      colors={[(isSelected)?'#fcc381':"#F8931F","#f4a543"]}
      style={[{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},styles.categoryButton]}
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
    />
    <Image 
      source={icon} 
      style={styles.categoryIcon}
      resizeMode="contain"
    />
    <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
      {name}
    </Text>
  </TouchableOpacity>
);

const ProductCard = ({ item, onPress, isInCart, quantity, onAddToCart }) => {
  const getItemImage = (id) => {
    switch(id) {
      case "7": return productImages.cp3;
      case "8": return productImages.cp2;
      case "9": return productImages.cp;
      case "10": return productImages.salad;
      case "1": return productImages.natiChicken;
      case "2": return productImages.kebab;
      case "3": return productImages.tikka;
      case "4": return productImages.curryCut;
      case "5": return productImages.curryCutLegs;
      case "6": return productImages.gingerGarlic;
      default: return productImages.natiChicken;
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
    >
      <TouchableOpacity onPress={onPress}>
        <Card style={styles.card}>
          <Image 
            source={getItemImage(item.id)}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={styles.cardContent}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDescription}>{item.description}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{item.price}</Text>
              <View style={styles.quantityContainer}>
                {quantity > 0 && (
                  <Text style={styles.quantityText}>×{quantity}</Text>
                )}
                <TouchableOpacity 
                  style={[styles.addButton, isInCart && styles.addedButton]}
                  onPress={onAddToCart}
                >
                  <Ionicons 
                    name={isInCart ? "add" : "add"} 
                    size={24} 
                    color="white" 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </MotiView>
  );
};

export default function CrispyHome() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Crispy');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart, cartItems } = useCart();
  const isLoading = useLoadAssets(productImages);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const filteredItems = crispyItems.filter(item => {
    const matchesCategory = 
      (selectedCategory === 'Crispy' && item.category !== 'Salads') ||
      (selectedCategory === 'Salads' && item.category === 'Salads');
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#fff', '#fff5e6']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Crispy Chicken Store</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color="#F8931F" />
              {cartItems.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={24} color="#F8931F" />
            </TouchableOpacity>
          </View>
        </View>
        <Searchbar
          placeholder="Search crispy items..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={{color: '#F8931F'}}
          placeholderTextColor="black"
        />
      </LinearGradient>

      <ScreenBackground>
      <View
        style={styles.categoryContainer}
        // style={styles.categoryContainer}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.name}
            name={category.name}
            icon={category.icon}
            isSelected={selectedCategory === category.name}
            onSelect={setSelectedCategory}
          />
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {filteredItems.map((item) => {
          const isInCart = cartItems.find(cartItem => cartItem.id === item.id);
          const quantity = isInCart ? isInCart.quantity : 0;
          
          return (
            <ProductCard
              key={item.id}
              item={item}
              isInCart={!!isInCart}
              quantity={quantity}
              onPress={() => navigation.navigate('ItemDisplay', { item })}
              onAddToCart={() => addToCart(item)}
            />
          );
        })}
      </ScrollView>
      </ScreenBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  searchBar: {
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 4,
    marginTop: 8,
    borderColor: '#F8931F',
    borderWidth: 1,
  },
  categoryContainer: {
    paddingHorizontal: 20,
    marginVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryButton: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    elevation: 3,
    width: SCREEN_WIDTH * 0.43,
    height: 150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    justifyContent: 'center',
  },
  selectedCategory: {
    backgroundColor: '#fff5e6',
    
  },
  categoryText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffff',
  },
  selectedCategoryText: {
    color: '#e6e6e6',
    fontWeight: 'bold',
  },
  productsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  productImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
  },
  cardContent: {
    padding: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productDescription: {
    color: '#666',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  addButton: {
    backgroundColor: '#F8931F',
    padding: 8,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addedButton: {
    backgroundColor: '#4CAF50',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  profileButton: {
    padding: 8,
    backgroundColor: '#fff5e6',
    borderRadius: 20,
  },
});
