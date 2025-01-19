import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';

export default function PostOrderScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState('More Than 2KG');
  const [selectedCategory, setSelectedCategory] = useState('');

  const formatDate = (date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    return `${dateNum}, ${day}, ${month}`;
  };

  const formatTime = (time) => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const timeString = `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    return `${timeString}, afternoon`;
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#F8931F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Order</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Bulk Order Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeText}>
            "Please order before 2 days for <Text style={styles.orangeText}>Bulk Orders</Text>"
          </Text>
        </View>

        {/* Date & Quantity Selection */}
        <View style={styles.selectionRow}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.buttonText}>{formatDate(selectedDate)}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dateButton, { flex: 0.8 }]}
            onPress={() => setSelectedQuantity(selectedQuantity === 'More Than 2KG' ? 'Less Than 2KG' : 'More Than 2KG')}
          >
            <Text style={styles.buttonText}>{selectedQuantity}</Text>
          </TouchableOpacity>
        </View>

        {/* Time Selection */}
        <TouchableOpacity
          style={[styles.timeButton]}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.buttonText}>{formatTime(selectedTime)}</Text>
        </TouchableOpacity>

        {/* Category Selection */}
        <TouchableOpacity style={styles.categoryButton}>
          <Text style={[styles.buttonText, { color: '#666' }]}>Select Category</Text>
        </TouchableOpacity>

        {/* Product Cards */}
        <View style={styles.productContainer}>
          {/* Chicken Malai Tikka Card */}
          <View style={styles.productCard}>
            <Image
              source={require('../../../assets/images/Chicken65.jpg')} // Make sure to add your image
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>Chicken Malai Tikka{'\n'}(Marinated)</Text>
              <View style={styles.productDetails}>
                <View>
                  <Text style={styles.price}>Rs. 149/-</Text>
                  <Text style={styles.quantity}>2-3 pieces</Text>
                </View>
                <TouchableOpacity style={styles.addButton}>
                  <LinearGradient
                    colors={['#F8931F', '#f4a543']}
                    style={styles.addButtonGradient}
                  >
                    <Text style={styles.addButtonText}>ADD</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={styles.weightBadge}>
                <Text style={styles.weightText}>500 grams</Text>
              </View>
              <View style={styles.bestsellerBadge}>
                <Text style={styles.bestsellerText}>BESTSELLER</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  noticeContainer: {
    padding: 16,
  },
  noticeText: {
    fontSize: 14,
    color: '#333',
  },
  orangeText: {
    color: '#F8931F',
  },
  selectionRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#F8931F',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  timeButton: {
    backgroundColor: '#F8931F',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
  },
  categoryButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  productContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
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
  productImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  productInfo: {
    padding: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8931F',
  },
  quantity: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    overflow: 'hidden',
    borderRadius: 6,
  },
  addButtonGradient: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  weightBadge: {
    position: 'absolute',
    top: -25,
    right: 16,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  weightText: {
    fontSize: 12,
    color: '#666',
  },
  bestsellerBadge: {
    position: 'absolute',
    top: -180,
    left: 0,
    backgroundColor: '#F8931F',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  bestsellerText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});