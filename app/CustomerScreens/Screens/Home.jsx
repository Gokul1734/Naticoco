import React, { useState, useEffect } from 'react';
import { View, FlatList, ScrollView, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useCart } from '../context/CartContext';
import { useAuth } from "../../context/AuthContext";
import { Asset } from 'expo-asset';
import LoadingScreen from '../Components/LoadingScreen';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import ScreenBackground from '../Components/ScreenBackground';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Import components
import AnimatedHeader from './Home/components/AnimatedHeader';
import CategoryButton from './Home/components/CategoryButton';
import ProductCard from './Home/components/ProductCard';

// Import constants and styles
import { categories, productImages } from './Home/constants';
import styles from './Home/styles'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Loading...');
  const [errorMsg, setErrorMsg] = useState(null);
  const { addToCart, cartItems, cartCount, updateQuantity } = useCart();
  const [layout, setLayout] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  const { user } = useAuth();
  const isLoading = useLoadAssets(productImages);
  const [menuItems, setMenuItems] = useState([]);
  const [nearestStoreId, setNearestStoreId] = useState(null);
  const [bestSellers, setBestSellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch menu items from the nearest store
  const fetchNearestStoreMenu = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const loginData = await AsyncStorage.getItem('logincre');
      const parsedLoginData = loginData ? JSON.parse(loginData) : null;
      const authToken = parsedLoginData?.token?.token || token;
  
      const response = await axios.get("http://192.168.32.227:3500/api/user/nearest", {
        params: { latitude, longitude },
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
  
      // console.log('Store API Response:', response.data); // Add this for debugging
  
      if (response.data && response.data.menu) {
        const menu = response.data.menu;
        setMenuItems(menu);
        setBestSellers(menu.filter(item => item.BestSeller === true));
        setNewArrivals(menu.filter(item => item.newArrival === true));
        setIsDataLoading(false);
        // Cache the store data
        await AsyncStorage.setItem('storeMenu', JSON.stringify(response.data.menu));
        // setMenuItems(JSON.stringify(response.data.menu));
      }
    } catch (error) {
      console.error('Error fetching store data:', error.response?.data || error.message);
      // Rest of the error handling remains the same
    }
  };

  // Initialize location and fetch store data
  useEffect(() => {
    const initializeData = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setAddress('Location access denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
        
        // Save location to AsyncStorage
        await AsyncStorage.setItem('userLocation', JSON.stringify({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }));
        
        // Get address from coordinates
        const addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        if (addressResponse[0]) {
          const addressObj = addressResponse[0];
          const formattedAddress = addressObj.district || '';
          setAddress(formattedAddress);
        }

        // Fetch store data using location
        await fetchNearestStoreMenu(location.coords.latitude, location.coords.longitude);
      } catch (error) {
        console.error('Error initializing data:', error);
        setErrorMsg('Error getting location');
        setAddress('Location unavailable');
        
        // Try to load cached location and store data
        try {
          const cachedLocation = await AsyncStorage.getItem('userLocation');
          if (cachedLocation) {
            const { latitude, longitude } = JSON.parse(cachedLocation);
            await fetchNearestStoreMenu(latitude, longitude);
          }
        } catch (cacheError) {
          console.error('Error loading cached location:', cacheError);
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    initializeData();
  }, []);

  const getNumColumns = () => layout.width > 600 ? 4 : 3;

  const renderCategoryButton = ({ item }) => (
    <CategoryButton
      name={item.name}
      image={item.image}
      navigation={navigation}
    />
  );

  const renderProductCard = ({ item }) => {
    const cardWidth = layout.width > 600 ? layout.width * 0.4 : layout.width * 0.55;
    const cartItem = cartItems.find(i => i._id === item._id || i.id === item.id);
    
    return (
      <ProductCard
        item={item}
        onPress={() => navigation.navigate('ItemDisplay', { item })}
        cartItem={cartItem}
        addToCart={addToCart}
        updateQuantity={updateQuantity}
        getItemImage={(item) => ({ uri: item.image })}
        cardWidth={cardWidth}
      />
    );
  };

  if (isLoading || isDataLoading) {
    return <LoadingScreen />;
  }

  return (
    <ScreenBackground>
      <SafeAreaView style={styles.container} edges={['right', 'left']}>
        <AnimatedHeader 
          address={address}
          cartCount={cartCount}
          navigation={navigation}
          userName={user?.name?.split(" ")[0] || "Guest"}
        />
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
        >
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>SHOP BY CATEGORY</Text>
            <FlatList
              data={categories}
              renderItem={renderCategoryButton}
              keyExtractor={item => item.id}
              numColumns={getNumColumns()}
              scrollEnabled={false}
              contentContainerStyle={styles.categoryList}
            />
          </View>

          {bestSellers.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>BEST SELLERS</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={bestSellers}
                renderItem={renderProductCard}
                keyExtractor={item => item._id || item.id}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}

          {newArrivals.length > 0 && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>NEW ARRIVALS</Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={newArrivals}
                renderItem={renderProductCard}
                keyExtractor={item => item._id || item.id}
                contentContainerStyle={styles.horizontalList}
              />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 0,
//     backgroundColor: 'transparent',
//     marginBottom: 60
//   },
//   flexcont: {
//    justifyContent : "space-between",
//    alignItems: 'center',
//    flexDirection:'row',
//    padding:10
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderWidth: 2,
//     borderColor: '#df8229',
//     // backgroundColor: '#df8229',
//     width: '90%',
    
//     marginBottom: 20,
//     alignSelf: 'center',
//     borderRadius: 80,
//   },
//   locationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   locationText: {
//     fontSize: 12,
//     color: '#666',
//     marginLeft: 8,
//     flexWrap: 'wrap',
//   },
//   address: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 10,
//     color: '#333',
//     maxWidth: '100%',
//   },
//   headerButtons: {
//     flexDirection: 'row',
//     gap: 16,
//   },
//   profileButton: {
//     marginLeft: 8,
//   },
//   sectionContainer: {
//     padding: normalize(16),
//     paddingBottom: Platform.OS === 'ios' ? normalize(16) : normalize(8),
//     backgroundColor:'transparent'
//   },
//   sectionTitle: {
//     fontSize: normalize(18),
//     fontWeight: '600',
//     marginBottom: normalize(16),
//   },
//   categoryButton: {
//     flex: 1,
//     alignItems: 'center',
//     padding: normalize(15),
//     margin: normalize(5),
//     backgroundColor: '#fff',
//     borderRadius: normalize(12),
//     minWidth: (SCREEN_WIDTH - normalize(60)) / 3.3,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     height : 100
//   },
//   selectedCategory: {
//     backgroundColor: '#fff5e6',
//     borderWidth: 1,
//     borderColor: '#F8931F',
//   },
//   categoryImageContainer: {
//     width: normalize(60),
//     height: normalize(80),
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: normalize(10),
//     borderRadius: normalize(25),
//     backgroundColor: '#f5f5f5',
//   },
//   categoryImage: {
//     width: 48,
//     height: 42,
//     margin:1
    
//   },
//   selectedCategoryImage: {
//     tintColor: '#F8931F',
//   },
//   categoryText: {
//     fontSize: normalize(12),
//     fontWeight: '500',
//     color: '#666',
//     textAlign: 'center',
//   },
//   selectedCategoryText: {
//     color: '#F8931F',
//     fontWeight: '600',
//   },
//   horizontalList: {
//     paddingRight: normalize(16),
//     paddingVertical: normalize(10),
//     backgroundColor:'transparent'
//   },
//   productCard: {
//     width: SCREEN_WIDTH * 0.55, // 55% of screen width
//     marginRight: normalize(16),
//     backgroundColor: '#E6E6E6',
//     borderRadius: normalize(12),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: Platform.OS === 'ios' ? 2 : 1,
//     },
//     shadowOpacity: 0.4,
//     shadowRadius: 3,
//     elevation: 6,
//   },
//   productImage: {
//     width: '100%',
//     height: SCREEN_HEIGHT * 0.15, // 15% of screen height
//     borderTopLeftRadius: normalize(12),
//     borderTopRightRadius: normalize(12),
//   },
//   productName: {
//     fontSize: normalize(14),
//     fontWeight: '600',
//     padding: normalize(8),
//     marginBottom: normalize(10),
//   },
//   productPrice: {
//     fontSize: normalize(14),
//     fontWeight: '700',
//     color: '#89C73A',
//     paddingHorizontal: normalize(8),
//     paddingBottom: normalize(8),
//   },
//   cartActions: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: normalize(8),
//   },
//   quantityBadge: {
//     backgroundColor: '#89C73A',
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   cart: {
//     backgroundColor: '#F8931F',
//     padding: normalize(7),
//     borderRadius: normalize(5),
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: normalize(5),
//   },
//   addToCartText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   cartButton: {
//     position: 'relative',
//     backgroundColor: 'white',
//     padding: normalize(8),
//     borderRadius: normalize(12),
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: -normalize(8),
//     right: -normalize(8),
//     backgroundColor: '#F8931F',
//     borderRadius: normalize(10),
//     minWidth: normalize(18),
//     height: normalize(18),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: normalize(12),
//     fontWeight: 'bold',
//     paddingHorizontal: normalize(4),
//   },
//   headerGradient: {
//     paddingVertical: normalize(8),
//     paddingHorizontal: normalize(16),
//     borderBottomLeftRadius: normalize(40),
//     borderBottomRightRadius: normalize(40),
//     ...Platform.select({
//      ios: {
//        shadowColor: '#000',
//        shadowOffset: { width: 0, height: 2 },
//        shadowOpacity: 0.1,
//        shadowRadius: 4,
//      },
//      android: {
//        elevation: 3,
//      },
//    }),
//   },
//   headerContent: {
//     gap: normalize(12),
//   },
//   welcomeSection: {
//     marginBottom: normalize(8),
//     margin : 10
//   },
//   welcomeText: {
//     fontSize: normalize(14),
//     color: '#666',
//   },
//   userName: {
//     fontSize: normalize(20),
//     fontWeight: Platform.OS === 'ios' ? '600' : 'bold',
//     color: '#333',
//   },
//   locationButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'white',
//     padding: normalize(12),
//     borderRadius: normalize(12),
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: Platform.OS === 'ios' ? 2 : 1,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   locationIcon: {
//     marginRight: 8,
//   },
//   locationTextContainer: {
//     flex: 1,
//   },
//   deliverToText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   addressText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//   },
//   headerActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     gap: normalize(16),
//   },
//   cartButton: {
//     position: 'relative',
//     backgroundColor: 'white',
//     padding: normalize(8),
//     borderRadius: normalize(12),
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   cartBadge: {
//     position: 'absolute',
//     top: -normalize(8),
//     right: -normalize(8),
//     backgroundColor: '#F8931F',
//     borderRadius: normalize(10),
//     minWidth: normalize(18),
//     height: normalize(18),
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cartBadgeText: {
//     color: 'white',
//     fontSize: normalize(12),
//     fontWeight: 'bold',
//     paddingHorizontal: normalize(4),
//   },
//   profileButton: {
//     overflow: 'hidden',
//     borderRadius: normalize(12),
//   },
//   profileGradient: {
//     padding: normalize(8),
//     borderRadius: normalize(12),
//   },
//   scrollViewContent: {
//     paddingBottom: normalize(60),
//   },
// });
