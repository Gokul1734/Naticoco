import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles  from '../styles';

const AnimatedHeader = ({ address, cartCount, navigation}) => {
  const locationAnimation = useRef(new Animated.Value(0)).current;
  const cartBounce = useRef(new Animated.Value(1)).current;
  const welcomeOpacity = useRef(new Animated.Value(0)).current;
  const [name, setName] = useState('');

  useEffect(() => {
    Animated.spring(locationAnimation, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    Animated.timing(welcomeOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (cartCount > 0) {
      Animated.sequence([
        Animated.spring(cartBounce, {
          toValue: 1.2,
          friction: 2,
          useNativeDriver: true,
        }),
        Animated.spring(cartBounce, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [cartCount]);

  const fetchName = async () => {
    try {
      const loginData = await AsyncStorage.getItem('logincre');
      if (loginData) {
        const parsedData = JSON.parse(loginData);
        const name = parsedData.token.name;
        setName(name);
      }
    } catch (error) {
      console.error('Error fetching login data:', error);
    }
  };

  fetchName();

  return (
    <LinearGradient colors={['#fff', '#fff5e6']} style={styles.headerGradient}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.locationButton}
          onPress={() => navigation.navigate('MyAddresses')}
        >
          <Animated.View
            style={[
              styles.locationIcon,
              {
                transform: [
                  { translateY: locationAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0]
                  })},
                  { scale: locationAnimation }
                ]
              }
            ]}
          >
            <Ionicons name="location" size={24} color="#F8931F" />
          </Animated.View>
          <View style={styles.locationTextContainer}>
            <Text style={styles.deliverToText}>Deliver to:</Text>
            <Text numberOfLines={1} style={styles.addressText}>
              {address}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        
        <View style={styles.flexcont}>
          <View style={styles.welcomeSection}>
            <Animated.Text style={[styles.userName, { opacity: welcomeOpacity }]}>
              Hi, {name?.split(' ')[0]?.length > 10 ? (
                <Text numberOfLines={1} ellipsizeMode="marquee" style={{width: 100}}>
                  {name?.split(' ')[0]}
                </Text>
              ) : name?.split(' ')[0]}
            </Animated.Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color="#333" />
              {cartCount > 0 && (
                <Animated.View 
                  style={[styles.cartBadge, { transform: [{ scale: cartBounce }] }]}
                >
                  <Text style={styles.cartBadgeText}>{cartCount}</Text>
                </Animated.View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <LinearGradient
                colors={['#F8931F', '#f4a543']}
                style={styles.profileGradient}
              >
                <Ionicons name="person" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default AnimatedHeader;