import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import Toast from "react-native-easy-toast";
import { Button, Icon, Image } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useCallback, useRef } from "react";

import firebase from "firebase/app";
import { getFavorites, removeFavoriteRestaurant } from "../utils/action";
import Loading from "../components/Loading";

export default function Favorites({ navigation }) {
  const toastRef = useRef();
  const [restaurants, setRestaurants] = useState(null);
  const [userLoggued, setUserLoggued] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reloadData, setReloadData] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLoggued(user) : setUserLoggued(false);
  });

  useFocusEffect(
    useCallback(() => {
      if (userLoggued) {
        (async function getData() {
          setLoading(true);
          const response = await getFavorites();
          setRestaurants(response.favorites);
          setLoading(false);
        })();
      }
    }, [userLoggued, reloadData])
  );

  if (!userLoggued) {
    return <UserNoLoggued navigation={navigation} />;
  }

  if (!restaurants) {
    return <Loading isVisible={true} text="Cargando los restaurantes" />;
  } else if (restaurants?.length == 0) {
    return <NotFoundRestaurants />;
  }

  return (
    <View style={styles.viewBody}>
      {restaurants ? (
        <FlatList
          data={restaurants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={(restaurant) => (
            <Restaurant
              restaurant={restaurant}
              setLoading={setLoading}
              toastRef={toastRef}
              navigation={navigation}
              setReloadData={setReloadData}
            />
          )}
        />
      ) : (
        <View style={styles.loaderRestaurant}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Cargando restaurantes...</Text>
        </View>
      )}

      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Por favor, espere" />
    </View>
  );
}

function NotFoundRestaurants() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Aun no tienes restaurantes favoritos
      </Text>
    </View>
  );
}

function Restaurant({
  restaurant,
  setLoading,
  toastRef,
  navigation,
  setReloadData,
}) {
  const { id, name, images } = restaurant.item;

  const confirmRemoveFavorite = () => {
    Alert.alert(
      "Eliminar el restaurante de favoritos",
      "Esta seguro de que quiere eliminar el restaurante de favoritos?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Si",
          onPress: removeFavorite,
        },
      ],
      { cancelable: false }
    );
  };

  const removeFavorite = async () => {
    setLoading(true);
    const response = await removeFavoriteRestaurant(id);
    setLoading(false);
    if (response.statusResponse) {
      setReloadData(true);
      toastRef.current.show("restaurante eliminado de favoritos", 3000);
    } else {
      toastRef.current.show(
        "Error al eliminar el restaurante de favoritos",
        3000
      );
    }
  };

  return (
    <View style={styles.restaurant}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("restaurant", {
            screen: "restaurant-detail",
            params: { id, name },
          })
        }
      >
        <Image
          resizaMode="cover"
          style={styles.image}
          PlaceholderContent={<ActivityIndicator color="#fff" />}
          source={{ uri: images[0] }}
        ></Image>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Icon
            type="material-community"
            name="heart"
            color="#f00"
            containerStyle={styles.favorite}
            underlayColor="transparent"
            onPress={confirmRemoveFavorite}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

function UserNoLoggued({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Icon type="material-community" name="alert-outline" size={50} />
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Debes estar logueado para ver los favoritos
      </Text>
      <Button
        title="Ir al login"
        containerStyle={{ marginTop: 20, width: "80%" }}
        buttonStyle={{ backgroundColor: "#442484" }}
        onPress={() => {
          navigation.navigate("account", { screen: "login" });
          //No se puede directamente navegar a login?
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  loaderRestaurant: {
    marginVertical: 10,
  },
  restaurant: {
    margin: 10,
  },
  image: {
    width: "100%",
    height: 180,
  },
  info: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -30,
    backgroundColor: "#fff",
  },
  name: {
    fontWeight: "bold",
    fontSize: 20,
  },
  favorite: {
    marginTop: -35,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 100,
  },
});
