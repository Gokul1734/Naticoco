import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import DeliveryHome from './DeliveryHome';
import DeliverySearch from './DeliverySearch';
import DeliveryLocations from './DeliveryLocations';
import DeliveryProfile from './DeliveryProfile';
import DeliverySavings from './DeliverySavings';
const Tab = createBottomTabNavigator();
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const TabIcon = ({ focused, icon }) => (
  <MotiView
    from={{ scale: 0.5, opacity: 0 }}
    animate={{ 
      scale: focused ? 1 : 0.8, 
      opacity: 1 
    }}
    transition={{ 
      type: 'spring',
      duration: 500
    }}
    style={[
      styles.iconContainer,
      focused && styles.focusedIconContainer
    ]}
  >
    <Ionicons
      name={icon}
      size={30}
      color={focused ? '#F8931F' : '#666'}
      style={styles.icon}
    />
  </MotiView>
);

export default function DeliveryTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Search':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Locations':
              iconName = focused ? 'location' : 'location-outline';
              break;
            case 'Savings':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }

          return <TabIcon focused={focused} icon={iconName} />;
        },
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={DeliveryHome} />
      <Tab.Screen name="Search" component={DeliverySearch} />
      <Tab.Screen name="Locations" component={DeliveryLocations} />
      <Tab.Screen name="Savings" component={DeliverySavings} />
      <Tab.Screen name="Profile" component={DeliveryProfile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 50 : 16,
    left: 20,
    right: 20,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 35,
    paddingHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderTopWidth: 0,
  },
  iconContainer: {
    marginTop:30,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  focusedIconContainer: {
    backgroundColor: '#FFF5E6',
    transform: [{ scale: 1.1 }],
  },
  icon: {
    marginTop: Platform.OS === 'ios' ? 0 : -2,
  }
});
