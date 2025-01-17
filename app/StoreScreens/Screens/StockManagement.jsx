import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Image, Switch, Alert } from 'react-native';
import { Text, Card, TextInput, Button, IconButton } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StockItem = ({ item, onUpdateStock, onUpdatePrice }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [stockValue, setStockValue] = useState(item.stock.toString());
  const [priceValue, setPriceValue] = useState(item.price.toString());

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', duration: 1000 }}
    >
      <Card style={styles.stockCard}>
        <Card.Content>
          <View style={styles.stockHeader}>
            <View>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.category}>{item.category}</Text>
            </View>
            <IconButton
              icon={isEditing ? "check" : "pencil"}
              size={20}
              onPress={() => {
                if (isEditing) {
                  onUpdateStock(item._id || item.id, parseInt(stockValue));
                  onUpdatePrice(item._id || item.id, parseFloat(priceValue));
                }
                setIsEditing(!isEditing);
              }}
            />
          </View>

          <View style={styles.stockDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Stock:</Text>
              {isEditing ? (
                <TextInput
                  value={stockValue}
                  onChangeText={setStockValue}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  dense
                />
              ) : (
                <Text style={[
                  styles.value,
                  item.stock < 10 && styles.lowStock
                ]}>
                  {item.stock} pcs
                </Text>
              )}
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.label}>Price:</Text>
              {isEditing ? (
                <TextInput
                  value={priceValue}
                  onChangeText={setPriceValue}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                  dense
                  left={<TextInput.Affix text="₹" />}
                />
              ) : (
                <Text style={styles.value}>₹{item.price}</Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>
    </MotiView>
  );
};

export default function StockManagement({ navigation }) {
  const [stockItems, setStockItems] = useState([
    {
      id: '1',
      name: 'Crispy Chicken',
      category: 'Main Course',
      stock: 50,
      price: 299,
    },
    {
      id: '2',
      name: 'French Fries',
      category: 'Sides',
      stock: 8,
      price: 99,
    },
    // Add more items
  ]);

  const [activeCategory, setActiveCategory] = useState('ALL');
  const categories = ['ALL', 'Main Course', 'Sides', 'Beverages'];

  const handleUpdateStock = (itemId, newStock) => {
    setStockItems(items =>
      items.map(item =>
        item._id || item.id === itemId ? { ...item, stock: newStock } : item
      )
    );
  };

  const handleUpdatePrice = (itemId, newPrice) => {
    setStockItems(items =>
      items.map(item =>
        item._id || item.id === itemId ? { ...item, price: newPrice } : item
      )
    );
  };

  const filteredItems = stockItems.filter(item =>
    activeCategory === 'ALL' || item.category === activeCategory
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    storeId: '',
    itemName: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    image: null,
    availability: true,
    bestSeller: false,
    newArrival: false
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setNewItem(prev => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleAddItem = async () => {
    try {
      const vendorCredentialsString = await AsyncStorage.getItem('vendorCredentials');
      if (!vendorCredentialsString) {
        Alert.alert('Error', 'No vendor credentials found');
        return;
      }
  
      const vendorCredentials = JSON.parse(vendorCredentialsString);
      const storeId = vendorCredentials?.vendorData?.storeId;
  
      if (!storeId) {
        Alert.alert('Error', 'No store ID found');
        return;
      }

      // Validate required fields
      if (!newItem.itemName || !newItem.price || !newItem.category || !newItem.image) {
        Alert.alert('Error', 'Please fill all required fields and add an image');
        return;
      }

      const formData = new FormData();
      formData.append('storeId', storeId);
      formData.append('itemName', newItem.itemName);
      formData.append('description', newItem.description);
      formData.append('price', newItem.price);
      formData.append('category', newItem.category);
      formData.append('subCategory', newItem.subCategory);
      formData.append('availability', newItem.availability);
      formData.append('bestSeller', newItem.bestSeller);
      formData.append('newArrival', newItem.newArrival);
      
      // Handle image upload
      if (newItem.image) {
        const imageUri = newItem.image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image';
        
        formData.append('image', {
          uri: imageUri,
          name: filename,
          type
        });
      }

      const response = await axios.post('http://192.168.0.104:3500/citystore/Addmenu', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setModalVisible(false);
        Alert.alert('Success', 'Item added successfully');
        // Reset form
        setNewItem({
          storeId: '',
          itemName: '',
          description: '',
          price: '',
          category: '',
          subCategory: '',
          image: null,
          availability: true,
          bestSeller: false,
          newArrival: false
        });
        // TODO: Refresh items list
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to add item');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Management</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryTab,
              activeCategory === category && styles.activeCategoryTab
            ]}
            onPress={() => setActiveCategory(category)}
          >
            <Text style={[
              styles.categoryText,
              activeCategory === category && styles.activeCategoryText
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.stockList}>
        {filteredItems.map((item) => (
          <StockItem
            key={item._id || item.id}
            item={item}
            onUpdateStock={handleUpdateStock}
            onUpdatePrice={handleUpdatePrice}
          />
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Item</Text>
            
            <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
              {newItem.image ? (
                <Image source={{ uri: newItem.image }} style={styles.previewImage} />
              ) : (
                <Ionicons name="camera" size={40} color="#666" />
              )}
            </TouchableOpacity>

            <TextInput
              label="Item Name *"
              value={newItem.itemName}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, itemName: text }))}
              style={styles.modalInput}
              mode="outlined"
            />

            <TextInput
              label="Category *"
              value={newItem.category}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, category: text }))}
              style={styles.modalInput}
              mode="outlined"
            />

            <TextInput
              label="Sub Category"
              value={newItem.subCategory}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, subCategory: text }))}
              style={styles.modalInput}
              mode="outlined"
            />

            <TextInput
              label="Description"
              value={newItem.description}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, description: text }))}
              style={styles.modalInput}
              mode="outlined"
              multiline
            />

            <TextInput
              label="Price *"
              value={newItem.price}
              onChangeText={(text) => setNewItem(prev => ({ ...prev, price: text }))}
              style={styles.modalInput}
              mode="outlined"
              keyboardType="numeric"
              left={<TextInput.Affix text="₹" />}
            />

            <View style={styles.togglesContainer}>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Available</Text>
                <Switch
                  value={newItem.availability}
                  onValueChange={(value) => 
                    setNewItem(prev => ({ ...prev, availability: value }))
                  }
                  color="#F8931F"
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>Best Seller</Text>
                <Switch
                  value={newItem.bestSeller}
                  onValueChange={(value) => 
                    setNewItem(prev => ({ ...prev, bestSeller: value }))
                  }
                  color="#F8931F"
                />
              </View>
              <View style={styles.toggleRow}>
                <Text style={styles.toggleLabel}>New Arrival</Text>
                <Switch
                  value={newItem.newArrival}
                  onValueChange={(value) => 
                    setNewItem(prev => ({ ...prev, newArrival: value }))
                  }
                  color="#F8931F"
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Button 
                mode="outlined" 
                onPress={() => setModalVisible(false)}
                style={styles.modalButton}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddItem}
                style={styles.modalButton}
              >
                Add Item
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: scale(20),
  },
  headerTitle: {
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    color: '#333',
  },
  categoriesContainer: {
    paddingHorizontal: scale(20),
    marginBottom: verticalScale(15),
  },
  categoryTab: {
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    marginRight: scale(10),
    borderRadius: scale(20),
    backgroundColor: '#0f1c57',
    color: 'white',
    height: verticalScale(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeCategoryTab: {
    backgroundColor: '#F8931F',
  },
  categoryText: {
    color: 'white',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: 'white',
  },
  stockList: {
    // flex: 1,
    padding: scale(20),
  },
  stockCard: {
    marginBottom: verticalScale(15),
    borderRadius: scale(15),
    elevation: 2,
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  itemName: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  category: {
    fontSize: moderateScale(14),
    color: '#666',
  },
  stockDetails: {
    marginTop: verticalScale(10),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  label: {
    width: '30%',
    fontSize: moderateScale(14),
    color: '#666',
  },
  value: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  lowStock: {
    color: '#F44336',
  },
  input: {
    flex: 1,
    height: verticalScale(40),
    backgroundColor: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: scale(20),
    borderRadius: scale(10),
    width: '90%',
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    marginBottom: verticalScale(15),
    textAlign: 'center',
  },
  modalInput: {
    marginBottom: verticalScale(10),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: verticalScale(15),
  },
  modalButton: {
    width: '45%',
  },
  imagePickerButton: {
    height: verticalScale(150),
    backgroundColor: '#f0f0f0',
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: scale(10),
  },
  togglesContainer: {
    marginVertical: verticalScale(15),
    backgroundColor: '#f5f5f5',
    borderRadius: scale(8),
    padding: scale(10),
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleLabel: {
    fontSize: moderateScale(14),
    color: '#333',
    fontWeight: '500',
  },
}); 