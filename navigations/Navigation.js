import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";

import RestaurantsStack from "./RestaurantsStack";
import AccountStack from "./AccountStack";
import SearchStack from "./SearchStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import FavoriteStack from "./FavoriteStack";


const Tab = createBottomTabNavigator();

export default function Navigation() {

  const screenOptions = (route, color) =>{
		let iconName
		switch (route.name) {
      case "restaurant":
        iconName = "compass-outline";
        break;
      case "favorites":
        iconName = "heart-outline";
        break;
      case "top-restaurants":
        iconName = "star-outline";
        break;
      case "search":
        iconName = "magnify";
        break;
      case "account":
        iconName = "home-outline";
        break;
    }

		return (
			<Icon
				type="material-community"
				name={iconName}
				size={22}
				color={color}
			></Icon>
		)

	}

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="restaurant"
				tabBarOptions={{inactiveTintColor:"#acac9c", activeTintColor:"#be2f32"}}
				screenOptions={({route})=>({
					tabBarIcon:({color}) => screenOptions(route, color)
				})}
			>
        <Tab.Screen
          name="restaurant"
          component={RestaurantsStack}
          options={{ title: "Restaurants" }}
        ></Tab.Screen>
        <Tab.Screen
          name="favorites"
          component={FavoriteStack}
          options={{ title: "Favoritos" }}
        ></Tab.Screen>
        <Tab.Screen
          name="top-restaurants"
          component={TopRestaurantsStack}
          options={{ title: "Top 5" }}
        ></Tab.Screen>
        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Buscar" }}
        ></Tab.Screen>
        <Tab.Screen
          name="account"
          component={AccountStack}
          options={{ title: "Cuenta" }}
        ></Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
