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
import MyOrders from "./CustomerScreens/Screens/MyOrders"
import Profile from "./CustomerScreens/Screens/Profile"
import MyAddresses from './CustomerScreens/Screens/MyAddresses';
import FilteredItems from './CustomerScreens/Components/FilteredItems'
import Welcome from './CustomerScreens/Screens/Welcome';
import Location from './CustomerScreens/Screens/Location';
import StoreType from './CustomerScreens/Screens/StoreType';
import CrispyHome from './CustomerScreens/Screens/CrispyHome';
import { Dimensions } from 'react-native';
import { useGlobalAssets } from './hooks/useGlobalAssets';
import LoadingScreen from './CustomerScreens/Components/LoadingScreen';
import ScreenBackground from './CustomerScreens/Components/ScreenBackground';
import DeliveryTab from './DeliveryScreens/DeliveryTab';
import StoreStack from './StoreScreens/StoreStack';
import { useAuth } from './Authcontext';
//Admin Screens
import ManageStore from './AdminScreens/ManageStore';
import AdminHome from './AdminScreens/AdminHome';
import UserManagement from './AdminScreens/ManageUser';
import OrderAnalytics from './AdminScreens/OrderAnalytics';
import DeliveryPartner from './AdminScreens/DeliveryPartner';
import AddStore from './AdminScreens/AddStore';

//Delivery Screens
import DeliveryHome from './DeliveryScreens/DeliveryHome';
import ActiveDeliveries from './DeliveryScreens/ActiveDeliveries';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, location } = useAuth();
  const isLoadingGlobal = useGlobalAssets();

  if (isLoadingGlobal) {
    return <LoadingScreen />;
  }

  const getInitialRoute = () => {
    if (!user) return 'Login';
    if (!location) return 'Location'; // Redirect to Location if not set
    if (user.token?.role === 'admin') return 'AdminHome';
    if (user.token?.role === 'delivery') return 'DeliveryTab';
    if (user.token?.role === 'store') return 'StoreStack';
    return 'Welcome';
  };

  return (
    <ScreenBackground>
      <Stack.Navigator 
        initialRouteName={getInitialRoute()}
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'transparent',
            flex: 1,
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            padding: 0,
            margin: 0,
          }
        }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : user.token?.role === 'admin' ? (
          <>
            <Stack.Screen name="AdminHome" component={AdminHome} />
            <Stack.Screen name="ManageStore" component={ManageStore} />
            <Stack.Screen name="UserManagement" component={UserManagement} />
            <Stack.Screen name="OrderAnalytics" component={OrderAnalytics} />
            <Stack.Screen name="DeliveryPartners" component={DeliveryPartner} />
            <Stack.Screen name="AddStore" component={AddStore} />
          </>
        ) : user.token?.role === 'delivery' ? (
          <Stack.Screen name="DeliveryTab" component={DeliveryTab} />
        ) : user.token?.role === 'store' ? (
          <Stack.Screen name="StoreStack" component={StoreStack} />
        ) : (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Location" component={Location} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="Success" component={SuccessSplash} />
            <Stack.Screen name="Track" component={TrackScreen} />
            <Stack.Screen name="ItemDisplay" component={ItemDisplay} />
            <Stack.Screen name="MyOrders" component={MyOrders} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="MyAddresses" component={MyAddresses} />
            <Stack.Screen name="FilteredItems" component={FilteredItems} />
            <Stack.Screen name="StoreType" component={StoreType} />
            <Stack.Screen name="CrispyHome" component={CrispyHome} />
          </>
        )}
      </Stack.Navigator>
    </ScreenBackground>
  );
}
