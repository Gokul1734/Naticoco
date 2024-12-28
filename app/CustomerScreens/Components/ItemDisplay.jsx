import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { useLoadAssets } from '../../hooks/useLoadAssets';
import LoadingScreen from './LoadingScreen';

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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={{ justifyContent: 'start', alignItems: 'center', padding: 10, backgroundColor: 'white' }}>
        <Image 
          source={getItemImage(item.image)} 
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>• {item.category}</Text>
        <Text style={styles.category}>• {item.quantity}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
      <View style={styles.bar}>
        <Text style={styles.price}>₹{item.price}</Text>
        <View style={styles.cartActions}>
          <TouchableOpacity
            style={cartItem?.quantity ? {
              backgroundColor: '#89C73A',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 15,
            } : styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={{ backgroundColor: '#F8931F', padding: 20, borderRadius: 50, color: 'white' }}>
              {cartItem?.quantity ?
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text style={{ color: 'white' }}>{cartItem.quantity}</Text>
                  <TouchableOpacity onPress={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>
                    <Ionicons name="add-circle" size={24} color="white" />
                  </TouchableOpacity>
                </View>
                : 'Add'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    image:{
        width: "100%",
        height: 300,
        resizeMode: 'cover',
        borderRadius:10,

    },
    name:{
        fontSize:40,
        fontWeight:'bold',
        marginVertical:20,
        color:'#F8931F'
    },
    description:{
        fontSize:20,
        marginVertical:20,
        color:'#807676',
        textAlign:'justify',
        width:'90%'
    },
    price:{
        fontSize:30,
        marginVertical:20,
        color:'white'
    },
    category:{
        fontSize:15,
        color:'#807676',
        textAlign:'justify',
        width:'90%'
    },
    bar:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:'90%',
        top:700,
        backgroundColor:'#89C73A',
        paddingHorizontal:20,
        paddingVertical:10,
        borderRadius:50,
        alignSelf:'center',
        position:'absolute',
    }
})


