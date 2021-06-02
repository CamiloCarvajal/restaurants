import { isEmpty, map } from "lodash";
import firebase from "firebase/app";
import { Dimensions } from "react-native";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import CarouselImage from "../../components/CarouselImage";
import { ScrollView, Alert, StyleSheet, Text, View } from "react-native";
import React, { useState, useCallback, useRef, useEffect } from "react";

import {
  addDocumentWithoutId,
  getCurrentUser,
  getDocumentById,
  getIsFavorite,
  getUsersFavorite,
  removeFavoriteRestaurant,
  sendPushNotification,
  setNotificationMessage,
} from "../../utils/action";
import Loading from "../../components/Loading";
import {
  callNumber,
  formatPhone,
  sendEmail,
  sendWhatsApp,
} from "../../utils/helpers";
import { ListItem, Rating, Icon, Input, Button } from "react-native-elements";
import ListReviews from "../../components/restaurants/ListReviews";
import MapRestaurant from "../../components/restaurants/MapRestaurant";
import Modal from "../../components/Modal";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const toastRef = useRef();
  const { id, name } = route.params;

  const [activeSlide, setActiveSlide] = useState(0);
  const [restaurant, setRestaurant] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogged, setUserLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalNotification, setModalNotification] = useState(false);

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
      <RestaurantInfo
        name={restaurant.name}
        location={restaurant.location}
        address={restaurant.address}
        email={restaurant.email}
        phone={formatPhone(restaurant.callingCode, restaurant.phone)}
        currentUser={userLogged}
        callingCode={restaurant.callingCode}
        phoneRaw={restaurant.phone}
        setLoading={setLoading}
        setModalNotification={setModalNotification}
      />
      <ListReviews navigation={navigation} id={id} />
      <SendMessage
        setLoading={setLoading}
        restaurant={restaurant}
        modalNotification={modalNotification}
        setModalNotification={setModalNotification}
      />
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

function SendMessage({
  setLoading,
  restaurant,
  modalNotification,
  setModalNotification,
}) {
  const [title, setTitle] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const sendNotification = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);
    const userInfo = getCurrentUser();
    const userName = userInfo.displayName ? userInfo.displayName : "Anonimo";
    const theMessage = `"${message}", sobre el restaurante: ${restaurant.name}`;

    const usersFavorite = await getUsersFavorite(restaurant.id);
    if (!usersFavorite.statusResponse) {
      setLoading(false);
      Alert.alert("Error al enviar el mensaje");
      return;
    }

    await Promise.all(
      map(usersFavorite.users, async (user) => {
        const messageNotification = setNotificationMessage(
          user.token,
          `${userName}, dijo: ${title}`,
          theMessage,
          { data: theMessage }
        );
        await sendPushNotification(messageNotification);
      })
    );

    setTitle("");
    setMessage("");
    setLoading(false);
    setModalNotification(false);
  };

  const validForm = () => {
    let isValid = true;
    setErrorTitle("");
    setErrorMessage("");
    if (isEmpty(title)) {
      setErrorTitle("Debes ingresar el titulo del mensaje");
      isValid = false;
    }
    if (isEmpty(message)) {
      setErrorMessage("Debes ingresar un mensaje");
      isValid = false;
    }
    return isValid;
  };

  return (
    <Modal isVisible={modalNotification} setVisible={setModalNotification}>
      <View style={styles.modalContainer}>
        <Text style={styles.textModal}>
          Enviale un mesaje a los amantes de {restaurant.name}
        </Text>
        <Input
          value={title}
          placeholder="Titulo del mensaje"
          onChangeText={(text) => setTitle(text)}
          errorMessage={errorTitle}
        />
        <Input
          multiline
          value={message}
          inputStyle={styles.textArea}
          placeholder="Mensaje..."
          onChangeText={(text) => setMessage(text)}
          errorMessage={errorMessage}
        />
        <Button
          title="Enviar mensaje"
          buttonStyle={styles.btnSend}
          containerStyle={styles.btnSendContainer}
          onPress={sendNotification}
        />
      </View>
    </Modal>
  );
}

function RestaurantInfo({
  name,
  location,
  address,
  email,
  phone,
  currentUser,
  callingCode,
  phoneRaw,
  setModalNotification,
}) {
  const listInfo = [
    {
      text: address,
      type: "address",
      iconLeft: "map-marker",
      iconRight: "message-text-outline",
    },
    { text: phone, type: "phone", iconLeft: "phone", iconRight: "whatsapp" },
    { text: email, type: "email", iconLeft: "at" },
  ];

  const actionLeft = (type) => {
    if (type == "phone") {
      callNumber(phone);
    } else if (type == "email") {
      if (currentUser) {
        sendEmail(
          email,
          "Estoy interesado",
          `Soy ${currentUser.displayName}. Estoy interesado en sus servicios.\nEnviado desde Claudia Sanders Dinner House`
        );
      } else {
        sendEmail(
          email,
          "Estoy interesado",
          `Estoy interesado en sus servicios.`
        );
      }
    }
  };

  const actionRight = (type) => {
    if (type == "phone") {
      if (currentUser) {
        sendWhatsApp(
          callingCode + phoneRaw,
          `Soy ${currentUser.displayName}. Estoy interesado en sus servicios.`
        );
      } else {
        sendWhatsApp(
          callingCode + phoneRaw,
          `Estoy interesado en sus servicios.`
        );
      }
    } else if (type == "address") {
      setModalNotification(true);
    }
  };

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
            name={item.iconLeft}
            color="#442484"
            onPress={() => actionLeft(item.type)}
          />
          <ListItem.Content>
            <ListItem.Title>{item.text}</ListItem.Title>
          </ListItem.Content>
          {item.iconRight && (
            <Icon
              type="material-community"
              name={item.iconRight}
              color="#442484"
              onPress={() => actionRight(item.type)}
            />
          )}
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
  textArea: {
    height: 50,
    paddingHorizontal: 10,
  },
  btnSend: {
    backgroundColor: "#442848",
  },
  btnSendContainer: {
    width: "95%",
  },
  textModal: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
