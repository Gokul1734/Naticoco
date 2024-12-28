import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodItem from '../Components/FoodItem';
import mockFoodItems from '../../../Backend/Products.json';
import { LinearGradient } from 'expo-linear-gradient';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import LoadingScreen from '../Components/LoadingScreen';
import ScreenBackground from '../Components/ScreenBackground';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const productImages = {
  'logoo.jpg': require('../../../assets/images/logoo.jpg'),
  'ChickenKebab.jpg': require('../../../assets/images/ChickenKebab.jpg'),
  'tandoori.jpg': require('../../../assets/images/tandoori.jpg'),
  'wob.jpg': require('../../../assets/images/wob.jpeg'),
  'thighs.jpg': require('../../../assets/images/thighs.jpeg'),
  'ggp.jpg': require('../../../assets/images/ggp.jpg'),
  'heat and eat.jpeg': require('../../../assets/images/heat and eat.jpeg'),
  'classic chicken momos.jpg': require('../../../assets/images/classic chicken momos.jpg'),
  'natiChicken.jpg': require('../../../assets/images/natiChicken.jpg'),
};

export default function SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(mockFoodItems);
  const isLoadingAssets = useLoadAssets(productImages);
  
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    // Animate search bar and results on mount
    Animated.parallel([
      Animated.spring(searchBarAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = mockFoodItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  if (isLoadingAssets) {
    return <LoadingScreen />;
  }

  return (
    <ScreenBackground style={styles.safeArea}>
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            transform: [
              { scale: searchBarAnim },
              { translateY: searchBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              })},
            ],
          },
        ]}
      >
        
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for Nati Products..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => handleSearch('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#F8931F" />
      ) : (
        <Animated.View
          style={{
            flex: 1,
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <FlatList
            data={results}
            renderItem={({ item, index }) => (
              <FoodItem
                item={item}
                onPress={() => navigation.navigate('ItemDisplay', { item })}
              />
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#ccc" />
                <Text style={styles.noResults}>No items found</Text>
                <Text style={styles.subText}>
                  Try searching with different keywords
                </Text>
              </View>
            }
          />
        </Animated.View>
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:60,
    padding: 0,
    margin: 0,
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
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
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  loader: {
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  noResults: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});