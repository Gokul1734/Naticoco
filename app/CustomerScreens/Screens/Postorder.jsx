import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";

const Postorder = () => {
  const [selectedDate, setSelectedDate] = useState("29, Monday, Dec");
  const [selectedTime, setSelectedTime] = useState("12:45 pm, afternoon");
  const [quantity, setQuantity] = useState("More Than 2KG");
  const [category, setCategory] = useState("Select Category");
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const items = [
    {
      id: 1,
      name: "Chicken Malai Tikka (Marinated)",
      price: 149,
      weight: "500 grams",
      image: "https://via.placeholder.com/150", // Replace with actual image URL
      bestseller: false,
    },
    {
      id: 2,
      name: "Chicken Tandoori (Marinated)",
      price: 199,
      weight: "500 grams",
      image: "https://via.placeholder.com/150", // Replace with actual image URL
      bestseller: true,
    },
  ];

  const handleAddToCart = (item) => {
    Alert.alert("Item Added", `${item.name} has been added to your cart.`);
  };

  return (
    <LinearGradient colors={["#FFEEE0", "#FFFFFF"]} style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post Order</Text>
      </View>

      {/* Information */}
      <Text style={styles.infoText}>
        “Please order before 2 days for{" "}
        <Text style={styles.bold}>Bulk Orders</Text>”
      </Text>

      {/* Selectors */}
      <View style={styles.selectors}>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>{selectedDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>{quantity}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.selectors}>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>{selectedTime}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.selectorText}>{category}</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Animated.View
            entering={SlideInRight.duration(500)}
            exiting={SlideOutLeft.duration(500)}
            style={styles.itemContainer}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemWeight}>{item.weight}</Text>
              <Text style={styles.itemPrice}>Rs. {item.price}/-</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.addButtonText}>ADD</Text>
            </TouchableOpacity>
            {item.bestseller && (
              <Text style={styles.bestsellerTag}>BESTSELLER</Text>
            )}
          </Animated.View>
        )}
      />

      {/* Category Modal */}
      <Modal
        isVisible={showCategoryModal}
        onBackdropPress={() => setShowCategoryModal(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => {
              setCategory("Category 1");
              setShowCategoryModal(false);
            }}
          >
            <Text style={styles.modalItem}>Category 1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setCategory("Category 2");
              setShowCategoryModal(false);
            }}
          >
            <Text style={styles.modalItem}>Category 2</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    fontSize: 18,
    color: "#FF8C00",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 10,
  },
  bold: {
    fontWeight: "bold",
    color: "#FF8C00",
  },
  selectors: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  selector: {
    backgroundColor: "#FF8C00",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  selectorText: {
    color: "#fff",
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginHorizontal: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemWeight: {
    fontSize: 14,
    color: "#888",
  },
  itemPrice: {
    fontSize: 14,
    color: "#FF8C00",
  },
  addButton: {
    backgroundColor: "#FF8C00",
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bestsellerTag: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "#FF8C00",
    color: "#fff",
    padding: 5,
    borderRadius: 5,
    fontSize: 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalItem: {
    fontSize: 16,
    marginVertical: 10,
    color: "#FF8C00",
    textAlign: "center",
  },
});

export default Postorder;
