import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  Animated,
  Easing,
  Dimensions,
  Platform,
  StatusBar,
  PixelRatio,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import mockFoodItems from '../../../Backend/Products.json';
import { useCart } from '../context/CartContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../../context/AuthContext"
import { MotiView } from 'moti';
import { Asset } from 'expo-asset';
import products from '../../../Backend/Products.json';
import LoadingScreen from '../Components/LoadingScreen';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import ScreenBackground from '../Components/ScreenBackground';
import Egg from '../../../assets/images/Egg.png';
const categories = [
 { 
  id: '1', 
  name: 'Chicken', 
  image: require('../../../assets/images/HomeCategories/Nati.png')
},

  { 
    id: '2', 
    name: 'Marinated', 
    image: require('../../../assets/images/HomeCategories/Marinate.png')
  },
  { 
    id: '3', 
    name: 'Heat & Eat', 
    image: require('../../../assets/images/HomeCategories/Chicken.png')
  },
  { 
   id: '4', 
   name: 'Eggs', 
   image: require('../../../assets/images/HomeCategories/Egg.png') 
 },

  { 
    id: '5', 
    name: 'Spices', 
    image: require('../../../assets/images/HomeCategories/Spice.png')
  },
  { 
    id: '6', 
    name: 'Pet Food', 
    image: require('../../../assets/images/HomeCategories/Petfood.png')
  },
  { 
   id: '7', 
   name: 'Mutton', 
   image: require('../../../assets/images/HomeCategories/Steak.png')
 },
  { 
    id: '8', 
    name: 'Post Order', 
    image: require('../../../assets/images/HomeCategories/FD.png')
  },
];

const bestSellers = mockFoodItems.filter((item) => item.bestSeller);

const newArrivals = mockFoodItems.filter((item) => item.newArrival)

// Get device dimensions and scaling factors
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const scale = SCREEN_WIDTH / 375; // Base width on iPhone 8
const statusBarHeight = StatusBar.currentHeight || 0;

// Normalize sizes for different screen densities
const normalize = (size) => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

const AnimatedHeader = ({ address, cartCount, navigation, userName = "Guest" }) => {
  const locationAnimation = useRef(new Animated.Value(0)).current;
  const cartBounce = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate location pin drop
    Animated.spring(locationAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    // Fade in welcome message
    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  // Animate cart badge when count changes
  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.spring(cartBounce, {
          toValue: 1.2,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(cartBounce, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  return (
    <LinearGradient
      colors={['#fff', '#fff5e6']}
      style={styles.headerGradient}
    >
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={() => navigation.navigate('MyAddresses')}
        >
          <Animated.View
            style={[
              styles.locationIcon,
              {
                transform: [
                  { translateY: locationAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0]
                  })},
                  { scale: locationAnimation }
                ]
              }
            ]}
          >
            <Ionicons name="location" size={24} color="#F8931F" />
          </Animated.View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliverToText}>Deliver to:</Text>
            <Text numberOfLines={1} style={styles.addressText}>
              {address}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.flexcont}>
        <View style={styles.welcomeSection}>
          <Animated.Text
            style={[
              styles.userName,
              { opacity: welcomeOpacity }
            ]}
          >
            Hi, {userName}
          </Animated.Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="cart-outline" size={24} color="#333" />
            {cartCount > 0 && (
              <Animated.View 
                style={[
                  styles.cartBadge,
                  { transform: [{ scale: cartBounce }] }
                ]}
              >
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </Animated.View>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <LinearGradient
              colors={['#F8931F', '#f4a543']}
              style={styles.profileGradient}
            >
              <Ionicons name="person" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const productImages = {
  'logoo.jpg': require('../../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
  'ChickenKebab.jpg': require('../../../assets/images/ChickenKebab.jpg'),
  'wob.jpg': require('../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
  'natiChicken.jpg': require('../../../assets/images/natiChicken.jpg'),
};

const CategoryButton = ({ name, image, isSelected, onSelect }) => (
  <TouchableOpacity
    onPress={() => onSelect(name)}
    style={[styles.categoryButton, isSelected && styles.selectedCategory]}
  >
      <Image
        source={image}
        style={[
          styles.categoryImage,
          isSelected && styles.selectedCategoryImage
        ]}
        resizeMode="contain"
      />
    <Text style={[
      styles.categoryText,
      isSelected && styles.selectedCategoryText
    ]}>
      {name}
    </Text>
  </TouchableOpacity>
);

const ProductCard = ({ item, onPress, isInCart, quantity, onAddToCart }) => {
  const getItemImage = (id) => {
    switch(id) {
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
        <View style={styles.card}>
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
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Loading...');
  const [errorMsg, setErrorMsg] = useState(null);
  const { addToCart, cartItems, cartCount,updateQuantity} = useCart();
  const [layout, setLayout] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  const {user} = useAuth();
  const isLoading = useLoadAssets(productImages);

  useEffect(() => {
    const onChange = ({ window }) => {
      setLayout({
        width: window.width,
        height: window.height,
      });
    };

    Dimensions.addEventListener('change', onChange);

    return () => {
      // Clean up
      if (typeof Dimensions.removeEventListener === 'function') {
        Dimensions.removeEventListener('change', onChange);
      }
    };
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setAddress('Location access denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
       
        let addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (addressResponse[0]) {
          const addressObj = addressResponse[0];
          const formattedAddress = `${addressObj.district || ''}`;
          setAddress(formattedAddress);
        }
      } catch (error) {
        setErrorMsg('Error getting location');
        setAddress('Location unavailable');
      }
    })();
  }, []);

  useEffect(() => {
    const loadAssets = async () => {
      try {
        await Asset.loadAsync(Object.values(productImages));
      } catch (error) {
        console.error('Error loading assets:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssets();
  }, []);

  const getNumColumns = () => {
    return layout.width > 600 ? 4 : 3; // More columns on larger screens
  };

  const getItemWidth = () => {
    const numColumns = getNumColumns();
    return (layout.width - normalize(60)) / numColumns;
  };

  const renderCategoryButton = ({ item, index }) => {
    const numColumns = getNumColumns();
    const buttonWidth = (layout.width - normalize(40)) / numColumns; // Subtract padding
   return (
   <TouchableOpacity 
     onPress={() => navigation.navigate('FilteredItems', { category: item.name })}
   >
     <LinearGradient
              colors={['#FFFEFD', '#F7A02F']}
              style={[styles.profileGradient,styles.categoryButton]}
            >
     <Image resizeMode='contain' source={item.image} style={[styles.categoryImage,{height : 50,width:50}]} />
     <Text style={styles.categoryName}>{item.name}</Text>
     </LinearGradient>
   </TouchableOpacity>
 );
}

  const renderProductCard = ({ item }) => {
    const cardWidth = layout.width > 600 
      ? layout.width * 0.4 
      : layout.width * 0.55;

    const cartItem = cartItems.find(i => i.id === item.id);
    
    const getItemImage = (imageName) => {
      return productImages[imageName] || productImages['logoo.jpg']; // Default to logo if image not found
    };

    return (
      <TouchableOpacity 
        style={[styles.productCard, { width: cardWidth }]}
        onPress={() => navigation.navigate('ItemDisplay', { item })}
      >
        <Image 
          source={getItemImage(item.image)}
          style={styles.productImage}
          resizeMode="cover"
        />
        <Text style={styles.productName}>{item.name}</Text>
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
                    <TouchableOpacity onPress={() => updateQuantity(item.id, cartItem.quantity + 1)}>
                      <Ionicons name="add-circle" size={24} color="white" />
                    </TouchableOpacity>
                  </View>
                ) : 'Add'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScreenBackground>
     <SafeAreaView style={{flex:1,backgroundColor:'transparent',marginBottom:60}} edges={['right', 'left']}>
      <AnimatedHeader 
        address={address}
        cartCount={cartCount}
        navigation={navigation}
        userName={user?.name?.split(" ")[0] || "Guest"}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        style={{backgroundColor:'transparent'}}
      >
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryButton}
            keyExtractor={item => item.id}
            numColumns={getNumColumns()}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: normalize(8),
            }}
          />
        </View>


        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>BEST SELLERS</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={bestSellers}
            renderItem={renderProductCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

 
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={newArrivals}
            renderItem={renderProductCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: 'transparent',
    marginBottom: 60
  },
  flexcont: {
   justifyContent : "space-between",
   alignItems: 'center',
   flexDirection:'row',
   padding:10
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderWidth: 2,
    borderColor: '#df8229',
    // backgroundColor: '#df8229',
    width: '90%',
    
    marginBottom: 20,
    alignSelf: 'center',
    borderRadius: 80,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
    flexWrap: 'wrap',
  },
  address: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
    maxWidth: '100%',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  profileButton: {
    marginLeft: 8,
  },
  sectionContainer: {
    padding: normalize(16),
    paddingBottom: Platform.OS === 'ios' ? normalize(16) : normalize(8),
    backgroundColor:'transparent'
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(16),
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    padding: normalize(15),
    margin: normalize(5),
    backgroundColor: '#fff',
    borderRadius: normalize(12),
    minWidth: (SCREEN_WIDTH - normalize(40)) / 3.3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height : 100
  },
  selectedCategory: {
    backgroundColor: '#fff5e6',
    borderWidth: 1,
    borderColor: '#F8931F',
  },
  categoryImageContainer: {
    width: normalize(60),
    height: normalize(80),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(10),
    borderRadius: normalize(25),
    backgroundColor: '#f5f5f5',
  },
  categoryImage: {
    width: 48,
    height: 42,
    margin:1
    
  },
  selectedCategoryImage: {
    tintColor: '#F8931F',
  },
  categoryText: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedCategoryText: {
    color: '#F8931F',
    fontWeight: '600',
  },
  horizontalList: {
    paddingRight: normalize(16),
    paddingVertical: normalize(10),
    backgroundColor:'transparent'
  },
  productCard: {
    width: SCREEN_WIDTH * 0.55, // 55% of screen width
    marginRight: normalize(16),
    backgroundColor: '#E6E6E6',
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.15, // 15% of screen height
    borderTopLeftRadius: normalize(12),
    borderTopRightRadius: normalize(12),
  },
  productName: {
    fontSize: normalize(14),
    fontWeight: '600',
    padding: normalize(8),
    marginBottom: normalize(10),
  },
  productPrice: {
    fontSize: normalize(14),
    fontWeight: '700',
    color: '#89C73A',
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(8),
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
  },
  quantityBadge: {
    backgroundColor: '#89C73A',
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cart: {
    backgroundColor: '#F8931F',
    padding: normalize(7),
    borderRadius: normalize(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: normalize(5),
  },
  addToCartText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cartButton: {
    position: 'relative',
    backgroundColor: 'white',
    padding: normalize(8),
    borderRadius: normalize(12),
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
  cartBadge: {
    position: 'absolute',
    top: -normalize(8),
    right: -normalize(8),
    backgroundColor: '#F8931F',
    borderRadius: normalize(10),
    minWidth: normalize(18),
    height: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
    paddingHorizontal: normalize(4),
  },
  headerGradient: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderBottomLeftRadius: normalize(40),
    borderBottomRightRadius: normalize(40),
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
  headerContent: {
    gap: normalize(12),
  },
  welcomeSection: {
    marginBottom: normalize(8),
    margin : 10
  },
  welcomeText: {
    fontSize: normalize(14),
    color: '#666',
  },
  userName: {
    fontSize: normalize(20),
    fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
    color: '#333',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: normalize(12),
    borderRadius: normalize(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS === 'ios' ? 2 : 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationIcon: {
    marginRight: 8,
  },
  locationTextContainer: {
    flex: 1,
  },
  deliverToText: {
    fontSize: 12,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: normalize(16),
  },
  cartButton: {
    position: 'relative',
    backgroundColor: 'white',
    padding: normalize(8),
    borderRadius: normalize(12),
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
  cartBadge: {
    position: 'absolute',
    top: -normalize(8),
    right: -normalize(8),
    backgroundColor: '#F8931F',
    borderRadius: normalize(10),
    minWidth: normalize(18),
    height: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: normalize(12),
    fontWeight: 'bold',
    paddingHorizontal: normalize(4),
  },
  profileButton: {
    overflow: 'hidden',
    borderRadius: normalize(12),
  },
  profileGradient: {
    padding: normalize(8),
    borderRadius: normalize(12),
  },
  scrollViewContent: {
    paddingBottom: normalize(60),
  },
});
