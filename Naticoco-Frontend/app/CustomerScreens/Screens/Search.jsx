import React, { useEffect, useState, useRef } from "react";
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
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import FoodItem from "../Components/FoodItem";
import mockFoodItems from "../../../Backend/Products.json";
import { LinearGradient } from "expo-linear-gradient";
import { useLoadAssets } from "../../hooks/useLoadAssets";
import LoadingScreen from "../Components/LoadingScreen";
import ScreenBackground from "../Components/ScreenBackground";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FloatingCartHandler from "../Components/CartHandler";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const productImages = {
  "logoo.jpg": require("../../../assets/images/logoo.jpg"),
  "ChickenKebab.jpg": require("../../../assets/images/ChickenKebab.jpg"),
  "tandoori.jpg": require("../../../assets/images/tandoori.jpg"),
  "wob.jpg": require("../../../assets/images/wob.jpeg"),
  "thighs.jpg": require("../../../assets/images/thighs.jpeg"),
  "ggp.jpg": require("../../../assets/images/ggp.jpg"),
  "heat and eat.jpeg": require("../../../assets/images/heat and eat.jpeg"),
  "classic chicken momos.jpg": require("../../../assets/images/classic chicken momos.jpg"),
  "natiChicken.jpg": require("../../../assets/images/natiChicken.jpg"),
};

// Add carousel data
const carouselData = [
  {
    id: "1",
    image: require("../../../assets/images/ad1.png"),
    title: "Fresh & Organic",
    subtitle: "Chicken",
    description:
      "Every time you try fresh meat, you're making meals tastier & better",
    buttonText: "Order Now",
  },
  {
    id: "2",
    image: require("../../../assets/images/ad1.png"),
    title: "Fresh & Organic",
    subtitle: "Chicken",
    description:
      "Every time you try fresh meat, you're making meals tastier & better",
    buttonText: "Order Now",
  },
  // Add more banner items as needed
];

export default  function  SearchScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingAssets = useLoadAssets(productImages);
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const [storeMenu, setStoreMenu] = useState([]);
  const [results, setResults] = useState(storeMenu);

  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef(null);

  // Auto scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (activeSlide < carouselData.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: activeSlide + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [activeSlide]);

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

  useEffect(() => {
    const fetchStoreMenu = async () => {
      const menu = await AsyncStorage.getItem("storeMenu");
      setStoreMenu(JSON.parse(menu));
      setResults(JSON.parse(menu));
    };
    fetchStoreMenu();
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const filtered = storeMenu.filter(
        (item) =>
          item.itemName.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  const renderCarouselItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image
        source={item.image}
        style={styles.bannerImage}
        resizeMode="contain"
      />
    </View>
  );

  const renderCard = ({ item }) => {
    return (
      <FoodItem
        item={item}
        onPress={() => navigation.navigate("ItemDisplay", {item:item})}
      />
    );
  };

  if (isLoadingAssets) {
    return <LoadingScreen />;
  }

  return (
    <ScreenBackground style={styles.safeArea}>
      {/* Add Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={carouselData}
          key={carouselData.id}
          renderItem={renderCarouselItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const slideIndex = Math.floor(
              event.nativeEvent.contentOffset.x /
                event.nativeEvent.layoutMeasurement.width
            );
            setActiveSlide(slideIndex);
          }}
          keyExtractor={(item) => item._id || item.id}
        />
        {/* Pagination dots */}
        <View style={styles.paginationContainer}>
          {carouselData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeSlide && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      <Animated.View
        style={[
          styles.searchContainer,
          {
            transform: [
              { scale: searchBarAnim },
              {
                translateY: searchBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
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
              onPress={() => handleSearch("")}
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
            marginBottom: 100,
          }}
        >
          <FlatList
            data={results}
            renderItem={renderCard}
            keyExtractor={(item) => item._id || item.id}
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
      <FloatingCartHandler navigation={navigation} bottom={true} />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 100,
    padding: 0,
    margin: 0,
  },
  safeArea: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    // marginBottom: 120,
    paddingBottom: 80,
  },
  loader: {
    marginTop: 20,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  noResults: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    fontWeight: "500",
  },
  subText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  carouselContainer: {
    height: 200,
    marginBottom: 16,
    alignSelf: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH - 50,
  },
  carouselItem: {
    width: SCREEN_WIDTH - 50,
    height: 250,
    position: "relative",
  },
  bannerImage: {
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  bannerContent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0f1c57",
    marginBottom: 8,
  },
  bannerDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    width: "60%",
  },
  bannerButton: {
    backgroundColor: "#F8931F",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  paginationContainer: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#F8931F",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
