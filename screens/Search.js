import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { isEmpty, size } from "lodash";
import React, { useState, useEffect } from "react";
import { SearchBar, ListItem, Icon, Image } from "react-native-elements";

import { searchRestaurants } from "../utils/action";

export default function Search({ navigation }) {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    if (isEmpty(search)) {
      return;
    }
    (async function () {
      const response = await searchRestaurants(search);
      if (response.statusResponse) {
        setRestaurants(response.restaurants);
      }
    })();
  }, [search]);

  return (
    <View>
      <SearchBar
        value={search}
        containerStyle={styles.searchBar}
        onChangeText={(e) => setSearch(e)}
        placeholder="Ingrese el nombre del restaurante"
      />
      {size(restaurants) > 0 ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(restaurant) => (
            <Restaurant restaurant={restaurant} navigation={navigation} />
          )}
        />
      ) : isEmpty(search) ? (
        <Text style={styles.notFound}>Haga una busqueda por palabras</Text>
      ) : (
        <Text style={styles.notFound}>
          No hay restaurantes que coincidan con el criterio de busqueda
        </Text>
      )}
    </View>
  );
}

function Restaurant({ restaurant, navigation }) {
  const { id, name, images } = restaurant.item;

  return (
    <ListItem
      style={styles.menuItem}
      onPress={() =>
        navigation.navigate("restaurant", {
          screen: "restaurant-detail",
          params: { id, name },
        })
      }
    >
      <Image
        resizeMode="cover"
        source={{ uri: images[0] }}
        style={styles.imageRestaurant}
        PlaceholderContent={<ActivityIndicator color="#FFF" />}
      />
      <ListItem.Content>
        <ListItem.Title>{name}</ListItem.Title>
      </ListItem.Content>
      <Icon name="chevron-right" type="material-community" />
    </ListItem>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  imageRestaurant: {
    width: 90,
    height: 90,
  },
  noFound: {
    alignSelf: "center",
    width: "90%",
  },
  menuItem: {
    margin: 10,
  },
});
