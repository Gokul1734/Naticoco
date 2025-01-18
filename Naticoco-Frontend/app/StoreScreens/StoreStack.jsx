import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StoreHome from './Screens/StoreHome';
import OrderManagement from './Screens/OrderManagement';
import StockManagement from './Screens/StockManagement';
import PickupManagement from './Screens/PickupManagement';

const Stack = createNativeStackNavigator();

export default function StoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="StoreHome" component={StoreHome} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} />
      <Stack.Screen name="StockManagement" component={StockManagement} />
      <Stack.Screen name="PickupManagement" component={PickupManagement} />
    </Stack.Navigator>
  );
} 