import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Restaurants from '../screens/Restaurants'

const Stack = createStackNavigator()

export default function RestaurantsStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="restaurant"
                component={Restaurants}
                options={{title:"Restaurantes"}}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}
