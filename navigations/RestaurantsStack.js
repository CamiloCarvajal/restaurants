import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Restaurants from '../screens/Restaurants/Restaurants'
import AddRestaurant from '../screens/Restaurants/AddRestaurant'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurant"
                component={Restaurants}
                options={{title:"Restaurantes"}}
            ></Stack.Screen>
            <Stack.Screen
                name="add-restaurant"
                component={AddRestaurant}
                options={{title:"Crear restaurante"}}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}
