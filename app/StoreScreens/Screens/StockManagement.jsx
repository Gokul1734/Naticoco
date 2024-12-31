import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, TextInput, Button, IconButton } from 'react-native-paper';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
// import StoreBackground from '../../CustomerScreens/Components/ScreenBackground';

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
                  onUpdateStock(item.id, parseInt(stockValue));
                  onUpdatePrice(item.id, parseFloat(priceValue));
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
        item.id === itemId ? { ...item, stock: newStock } : item
      )
    );
  };

  const handleUpdatePrice = (itemId, newPrice) => {
    setStockItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, price: newPrice } : item
      )
    );
  };

  const filteredItems = stockItems.filter(item =>
    activeCategory === 'ALL' || item.category === activeCategory
  );

  return (

      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Stock Management</Text>
          <TouchableOpacity onPress={() => {/* Add new item */}}>
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
              key={item.id}
              item={item}
              onUpdateStock={handleUpdateStock}
              onUpdatePrice={handleUpdatePrice}
            />
          ))}
        </ScrollView>
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
}); 