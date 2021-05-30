import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Restaurant from '../screens/Restaurants/Restaurant'
import Restaurants from '../screens/Restaurants/Restaurants'
import AddRestaurant from '../screens/Restaurants/AddRestaurant'
import AddReviewRestaurant from '../screens/Restaurants/AddReviewRestaurant'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="restaurant"
          component={Restaurants}
          options={{ title: "Restaurantes" }}
        ></Stack.Screen>
        <Stack.Screen
          name="add-restaurant"
          component={AddRestaurant}
          options={{ title: "Crear restaurante" }}
        ></Stack.Screen>
        <Stack.Screen
          name="restaurant-detail"
          component={Restaurant}
        ></Stack.Screen>
        <Stack.Screen
          name="add-review-restaurant"
          component={AddReviewRestaurant}
          options={{ title: "Nuevo comentario" }}
        ></Stack.Screen>
      </Stack.Navigator>
    );
}
