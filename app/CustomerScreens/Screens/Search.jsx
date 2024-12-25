import React, { useEffect, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FoodItem from '../Components/FoodItem';
import mockFoodItems from '../../../Backend/Products.json';



export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(mockFoodItems);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);

 
    setTimeout(() => {
      const filtered = mockFoodItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleItemPress = (item) => {
    console.log('Selected item:', item.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={24} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for Nati Products..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#ff4444" />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <FoodItem
              item={item}
              onPress={() => handleItemPress(item)}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.noResults}>No food items found</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
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
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  listContainer: {
    paddingVertical: 8,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#666',
  },
});