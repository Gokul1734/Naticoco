import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './Tab';
import LoginScreen from './Login';
import SignUpScreen from './CustomerScreens/Screens/SignUp';
import { SafeAreaView } from 'react-native';
import CartScreen from './CustomerScreens/Screens/Cart';
import CheckoutScreen from './CustomerScreens/Screens/Checkout';
import SuccessSplash from './CustomerScreens/Components/SuccessSplash';
import TrackScreen from './CustomerScreens/Screens/Track';
import ItemDisplay from './CustomerScreens/Components/ItemDisplay';
import OTP from './CustomerScreens/Screens/OTP';
import MyOrders from "./CustomerScreens/Screens/MyOrders"
import Address from "./CustomerScreens/Screens/MyAddresses"
import MyAddresses from './CustomerScreens/Screens/MyAddresses';
import FilteredItems from './CustomerScreens/Components/FilteredItems'

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName='MainTabs'
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'white',
        },
        animation: 'fade',
      }}
    >
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Success" 
        component={SuccessSplash}
        options={{ headerShown: false,
          animation:'fade'
        }}
      />
      <Stack.Screen 
        name="Track" 
        component={TrackScreen}
        options={{ headerShown: false,animation:'fade' }}
      />
      <Stack.Screen 
        name="ItemDisplay" 
        component={ItemDisplay}
        options={{ headerShown: false,animation:'fade' }}
      />
      <Stack.Screen 
        name="OTP" 
        component={OTP}
        options={{ headerShown: false }}
      />

      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
       name='MyOrders'
       component={MyOrders}
       options={{ headerShown: false }}
      />
      <Stack.Screen 
       name='MyAddresses'
       component={MyAddresses}
       options={{ headerShown: false }}
      />
      <Stack.Screen 
       name='FilteredItems'
       component={FilteredItems}
       options={{ headerShown: false }}
      />
      
    </Stack.Navigator>
  );
} 