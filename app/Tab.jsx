import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Animated, TouchableOpacity, Dimensions, Platform } from 'react-native';
import SearchScreen from './CustomerScreens/Screens/Search';
import HomeScreen from './CustomerScreens/Screens/Home';
import ProfileScreen from './CustomerScreens/Screens/Profile';
import MyOrders from './CustomerScreens/Screens/MyOrders';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { useMemo } from 'react';
import * as Haptics from 'expo-haptics';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

function CustomTabBar({ state, descriptors, navigation }) {
  const animatedValues = useMemo(
    () => state.routes.map(() => new Animated.Value(0)),
    []
  );

  const animate = (index) => {
    // Reset all animations
    animatedValues.forEach((value, i) => {
      if (i !== index) {
        Animated.spring(value, {
          toValue: 0,
          useNativeDriver: true,
          tension: 40,
        }).start();
      }
    });

    // Animate selected tab
    Animated.sequence([
      Animated.spring(animatedValues[index], {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
      }),
      Animated.spring(animatedValues[index], {
        toValue: 0.8,
        useNativeDriver: true,
        tension: 40,
      }),
    ]).start();
  };

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const scale = animatedValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        });

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            animate(index);
            navigation.navigate(route.name);
          }
        };

        const getIcon = () => {
          switch (route.name) {
            case 'Home':
              return 'home';
            case 'Search':
              return 'search';
            case 'Profile':
              return 'user';
            case 'Orders':
              return 'receipt-outline';
            default:
              return 'home';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.tabItemContainer,
                isFocused && styles.tabItemContainerActive,
                { transform: [{ scale }] },
              ]}
            >
              {route.name === 'Profile' ? (
                <AntDesign
                  name={getIcon()}
                  size={24}
                  color={isFocused ? '#ffff' : '#F8931F'}
                />
              ) : (
                <Ionicons
                  name={getIcon()}
                  size={24}
                  color={isFocused ? '#ffff' : '#F8931F'}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
      initialRouteName='Home'
    > 
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Orders" component={MyOrders} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    height: 90,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 50,
    paddingBottom: 20,
    position: 'absolute',
    bottom: 45,
    paddingHorizontal: 10,
    alignSelf: 'center',
    // marginBottom: -8,
    width: '100%',
    backgroundColor: '#e6e6e6',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabItemContainer: {
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemContainerActive: {
    backgroundColor: '#F8931F',
  },
});