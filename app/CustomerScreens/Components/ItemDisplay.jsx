import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import LoadingScreen from './LoadingScreen';
import { useNavigation } from '@react-navigation/native';
import mockFoodItems from '../../../Backend/Products.json';
import BackButton from '../../components/BackButton';

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

const getItemImage = (imageName) => {
  return productImages[imageName] || productImages['logoo.jpg'];
};

export default function ItemDisplay({ route }) {
  const { item } = route.params;
  const { addToCart, cartItems, updateQuantity } = useCart();
  const cartItem = cartItems.find(i => i.id === item.id);
  const isLoading = useLoadAssets(productImages);
  const navigation = useNavigation();

  // Get related products from same category
  const relatedProducts = mockFoodItems
    .filter(product => 
      product.category === item.category && 
      product.id !== item.id
    )
    .slice(0, 4);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity 
          style={styles.backButtonCircle}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#F8931F" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image 
            source={getItemImage(item.image)} 
            style={styles.image}
            resizeMode="cover"
          />
          {item.bestSeller && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Best Seller</Text>
            </View>
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>₹{item.price}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="cube-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{item.quantity}</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{item.category}</Text>
            </View>
            {item.chickenType && (
              <View style={styles.detailItem}>
                <Ionicons name="information-circle-outline" size={20} color="#666" />
                <Text style={styles.detailText}>{item.chickenType} Type</Text>
              </View>
            )}
          </View>

          <Text style={styles.description}>{item.description}</Text>

          {relatedProducts.length > 0 ? (
            <View style={styles.relatedContainer}>
              <Text style={styles.relatedTitle}>You might also like</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedScroll}
              >
                {relatedProducts.map((product) => (
                  <TouchableOpacity 
                    key={product.id}
                    style={styles.relatedCard}
                    onPress={() => navigation.push('ItemDisplay', { item: product })}
                  >
                    <Image 
                      source={getItemImage(product.image)}
                      style={styles.relatedImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.relatedName}>{product.name}</Text>
                    <Text style={styles.relatedPrice}>₹{product.price}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : (
            <View style={{ height: 100 }} />
          )}
        </View>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => addToCart(item)}
        >
          <Text style={styles.addButtonText}>
            {cartItem?.quantity ? (
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>{cartItem.quantity} in cart</Text>
                <Ionicons name="add-circle" size={24} color="white" />
              </View>
            ) : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#89C73A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    color: '#F8931F',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#89C73A',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailText: {
    color: '#666',
    fontSize: 14,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  relatedContainer: {
    marginBottom: 80,
  },
  relatedTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  relatedScroll: {
    paddingRight: 20,
  },
  relatedCard: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
  },
  relatedImage: {
    width: '100%',
    height: 100,
  },
  relatedName: {
    fontSize: 14,
    fontWeight: '600',
    padding: 10,
  },
  relatedPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F8931F',
    padding: 10,
    paddingTop: 0,
  },
  buttonContainer: {
    position: 'fixed',
    bottom: 70,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addButton: {
    backgroundColor: '#F8931F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  quantityText: {
    color: 'white',
    fontSize: 16,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 100,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});


