import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Favorites from '../screens/Favorites'

const Stack = createStackNavigator()

export default function FavoriteStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="favorite"
                component={Favorites}
                options={{title:"Favoritos"}}
            ></Stack.Screen>
        </Stack.Navigator>
    )
}
