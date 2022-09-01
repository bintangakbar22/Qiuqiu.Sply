import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  Splash,
  Auth,
  EditAccount,
  EditPassword,
  Preview,
  Detail,
  EditProduct,
  InfoPenawar,
  Wishlist,
  History,
  Cart,
  OrderPending,
  Checkout,
} from '../Screens';
import MainApp from './MainApp';

const Router = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="Auth" component={Auth} />
      <Stack.Screen name="MainApp" component={MainApp} />
      <Stack.Screen name="EditAccount" component={EditAccount} />
      <Stack.Screen name="EditPassword" component={EditPassword} />
      <Stack.Screen name="Detail" component={Detail} />
      <Stack.Screen name="Preview" component={Preview} />
      <Stack.Screen name="EditProduct" component={EditProduct} />
      <Stack.Screen name="InfoPenawar" component={InfoPenawar} />
      <Stack.Screen name="Wishlist" component={Wishlist} />
      <Stack.Screen name="History" component={History} />
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="OrderPending" component={OrderPending} />
      <Stack.Screen name="Checkout" component={Checkout} />

    </Stack.Navigator>
  );
};

export default Router;
