import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Linking, Alert, FlatList } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { GestureHandlerRootView, PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { 
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS
} from 'react-native-reanimated';
import { useCart } from '../context/CartContext';
import { useNavigation } from 'expo-router';
import BackButton from '../../components/BackButton';

const GOOGLE_MAPS_KEY = ''; 

export default function TrackScreen() {
  const navigation = useNavigation();
  const {cartItems,clearCart} = useCart();
  const [userLocation, setUserLocation] = useState({
    latitude: 13.043548569007172,
    longitude: 80.24167382461606,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [driverLocation, setDriverLocation] = useState({
    latitude: 13.065719811912784,   
    longitude: 80.2245106633112,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,  
  });

  const handleCancel = () => {
   Alert.alert(
     'Cancel Order',
     'Are you sure you want to cancel the order?',
     [
       {
         text: 'No',
         style: 'cancel',
       },
       {
         text: 'Yes',
         onPress: () => {
          navigation.navigate('StoreType');
          clearCart();
         },
         style: 'destructive',
       },
     ]
   );
 };

  
  const deliveryInfo = {
    driverName: "Partner Name",
    phoneNumber: "+1234567890",
    estimatedTime: "25 mins",
    orderStatus: "On the way"
  };

  const translateY = useSharedValue(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startY + event.translationY;
      translateY.value = Math.min(0, Math.max(newValue, -300)); // Limit translation
    },
    onEnd: (event) => {
      if (event.velocityY < -500 || translateY.value < -150) {
        translateY.value = withSpring(-300);
        runOnJS(setIsExpanded)(true);
      } else {
        translateY.value = withSpring(0);
        runOnJS(setIsExpanded)(false);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const handleCall = () => {
    Linking.openURL(`tel:${deliveryInfo.phoneNumber}`);
  };

  if (!userLocation) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BackButton color="white" />
      <View style={styles.container}>
        <MapView
          style={[styles.map, isExpanded && { height: '40%' }]}
          initialRegion={{
            ...userLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={userLocation}
            title="Delivery Location"
            description="Your location"
          >
            <View style={styles.driverMarker}>
              <Ionicons name="location" size={24} color="white" />
            </View>
          </Marker>
          
          <Marker
            coordinate={driverLocation}
            title="Driver Location"
            description="Your delivery partner"
          >
            <View style={styles.driverMarker}>
              <Ionicons name="bicycle" size={24} color="white" />
            </View>
          </Marker>

          <MapViewDirections
            origin={driverLocation}
            destination={userLocation}
            apikey={GOOGLE_MAPS_KEY}
            strokeWidth={5}
            strokeColor="#F8931F"
            optimizeWaypoints={true}
          />
        </MapView>

        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.deliveryCard, animatedStyle]}>
            <View style={styles.pullBar} />
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>{deliveryInfo.orderStatus}</Text>
              <Text style={styles.timeText}>ETA: {deliveryInfo.estimatedTime}</Text>
            </View>

            <View style={styles.driverInfo}>
              <View style={styles.driverDetails}>
                <Ionicons name="person-circle-outline" size={40} color="#666" />
                <View style={styles.driverTextContainer}>
                  <Text style={styles.driverName}>{deliveryInfo.driverName}</Text>
                  <Text style={styles.driverRole}>Delivery Partner</Text>
                </View>
              </View>

              <TouchableOpacity onPress={handleCall} style={styles.callButton}>
                <Ionicons name="call" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <Ionicons name="checkmark-circle" size={24} color="#89C73A" />
                <Text style={styles.timelineText}>Order Confirmed</Text>
              </View>
              <View style={styles.timelineItem}>
                <Ionicons name="checkmark-circle" size={24} color="#89C73A" />
                <Text style={styles.timelineText}>Order Picked Up</Text>
              </View>
              <View style={styles.timelineItem}>
                <Ionicons name="time" size={24} color="#F8931F" />
                <Text style={styles.timelineText}>On the Way</Text>
              </View>
            </View>

            {isExpanded && (
              <View style={styles.expandedContent}>
                <Text style={styles.sectionTitle}>Order Details</Text>
                <View style={styles.orderDetails}>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Order ID</Text>
                    <Text style={styles.detailValue}>#123456</Text>
                  </View>
                  <View style={styles.cart}>
                    <Text style={styles.detailLabel}>Items</Text>
                    <FlatList 
                     style={{ flexWrap: 'wrap' }}
                     data={cartItems}
                     keyExtractor={(item, index) => item.id || index.toString()}
                     renderItem={({ item }) => (
                       <Text style={styles.detailValueItem}>
                         {item.name} x {item.quantity}
                       </Text>
                     )}
                   />
                  </View>
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>Total Amount</Text>
                    <Text style={styles.detailValue}>₹{cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}</Text>
                  </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center',marginTop:20}}>
                  <TouchableOpacity style={styles.cancel} onPress={handleCancel}>
                    <Text style={styles.buttonText} >Cancel Order</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Help for Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  button:{
    backgroundColor:'#89C73A',
    padding:15,
    borderRadius:10,
    width:'40%',
  },
  buttonText:{
    color:'white',
    fontWeight:'600',
    fontSize:16,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  driverMarker: {
    backgroundColor: '#F8931F',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  deliveryCard: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '70%',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F8931F',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  driverInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  driverDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverTextContainer: {
    marginLeft: 12,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
  },
  driverRole: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#89C73A',
    padding: 12,
    borderRadius: 25,
  },
  timeline: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timelineText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  pullBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 15,
  },
  expandedContent: {
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: '#eee',
    borderBottomColor: '#eee',
    paddingTop: 20,
    paddingBottom:20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  orderDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cart:{
    justifyContent: 'space-between',
    alignItems: 'start',
    flexWrap:'wrap',
    gap:10,
  },
  cancel:{
   backgroundColor:'#de0303',
   padding:15,
   borderRadius:10,
   alignItems:'center',
   justifyContent:'center',
   width:'40%',
 },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  detailValueItem:{
    fontSize: 14,
    fontWeight: '600',
    padding:5,
    borderRadius:5,
  }
});
