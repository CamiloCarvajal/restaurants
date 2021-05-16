import { map } from "lodash";
import firebase from "firebase/app";
import { Dimensions } from "react-native";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import CarouselImage from "../../components/CarouselImage";
import { ScrollView, Alert, StyleSheet, Text, View } from "react-native";
import React, { useState, useCallback, useRef, useEffect } from "react";

import {
  addDocumentWithoutId,
  getDocumentById,
  getIsFavorite,
  removeFavoriteRestaurant,
} from "../../utils/action";
import Loading from "../../components/Loading";
import { formatPhone } from "../../utils/helpers";
import { ListItem, Rating, Icon } from "react-native-elements";
import ListReviews from "../../components/restaurants/ListReviews";
import MapRestaurant from "../../components/restaurants/MapRestaurant";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const toastRef = useRef();
  const { id, name } = route.params;

  const [activeSlide, setActiveSlide] = useState(0);
  const [restaurant, setRestaurant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(user) : setUserLogged(false);
  });

  navigation.setOptions({ title: name });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getDocumentById("restaurants", id);
        if (response.statusResponse) {
          setRestaurant(response.document);
        } else {
          setRestaurant({});
          Alert.alert(
            "Ocurrio un problema cargando el restaurante. Intente mas tarde."
          );
        }
      })();
    }, [])
  );

  useEffect(() => {
    (async () => {
      if (userLogged && restaurant) {
        const response = await getIsFavorite(restaurant.id);
        response.statusResponse && setIsFavorite(response.isFavorite);
      }
    })();
  }, [userLogged, restaurant]);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando" />;
  }

  const addFavorite = async () => {
    if (!userLogged) {
      toastRef.current.show(
        "Para agregar el restaurante a favorito, debe estar logueado",
        3000
      );
      return;
    }

    setLoading(true);
    const response = await addDocumentWithoutId("favorites", {
      userId: userLogged.uid,
      idRestaurant: restaurant.id,
    });
    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(true);
      toastRef.current.show("Restaurante agregado a favoritos", 3000);
    } else {
      toastRef.current.show(
        "No se pudo adicionar el restaurante a favoritos, intentalo mas tarde..",
        3000
      );
    }
  };

  const removeFavorite = async () => {
    setLoading(true);
    const response = await removeFavoriteRestaurant(restaurant.id);
    setLoading(false);

    if (response.statusResponse) {
      setIsFavorite(false);
      toastRef.current.show("Restaurante eliminado de favoritos", 3000);
    } else {
      toastRef.current.show("No se puedo eliminar de favoritos", 3000);
    }
  };

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImage
        images={restaurant.images}
        width={widthScreen}
        height={250}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
      <View style={styles.viewFavorite}>
        <Icon
          size={35}
          color="#442484"
          type="material-community"
          underlayColor="transparent"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
        />
      </View>
      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        rating={restaurant.rating}
      />
      <RestauranInfo
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.phone)}
      />
      <ListReviews navigation={navigation} id={id} />
      <Toast ref={toastRef} position="center" opacity={0.9}></Toast>
      <Loading isVisible={loading} text="Por favor, espere..."></Loading>
    </ScrollView>
  );
}

function TitleRestaurant({ name, description, rating }) {
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={styles.viewRestaurantContainer}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          startingValue={parseFloat(rating)}
          readonly
        />
      </View>
      <Text style={styles.descriptionRestaurant}>{description}</Text>
    </View>
  );
}

function RestauranInfo({ name, location, address, email, phone }) {
  const listInfo = [
    { text: address, iconName: "map-marker" },
    { text: phone, iconName: "phone" },
    { text: email, iconName: "at" },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restaurantInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <MapRestaurant location={location} name={name} height={150} />
      {map(listInfo, (item, index) => (
        <ListItem key={index} style={styles.containerListItem}>
          <Icon
            type="material-community"
            name={item.iconName}
            color="#442484"
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewFavorite: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#fff9",
    borderBottomLeftRadius: 50,
    padding: 5,
    paddingLeft: 15,
  },
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  viewRestaurantContainer: {
    flexDirection: "row",
  },
  nameRestaurant: {
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 8,
    color: "gray",
    textAlign: "justify",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restaurantInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerListItem: {
    borderBottomColor: "#a375c2",
    borderBottomWidth: 1,
  },
});
