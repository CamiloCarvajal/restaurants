import { isEmpty } from "lodash";
import Toast from "react-native-easy-toast";
import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Loading from "../../components/Loading";
import {
  addDocumentWithoutId,
  getCurrentUser,
  getDocumentById,
  updateDocument,
} from "../../utils/action";

export default function AddReviewRestaurant({ navigation, route }) {
  const toastRef = useRef();
  const { idRestaurant } = route.params;
  const [title, setTitle] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorReview, setErrorReview] = useState(null);

  const addReview = async () => {
    if (!validForm()) {
      return;
    }

    setLoading(true);
    const user = getCurrentUser();
    const data = {
      idUser: user.uid,
      avatarUser: user.photoURL,
      idRestaurant,
      title,
      rating,
      createAt: new Date(),
    };

    const responseAddReview = await addDocumentWithoutId("reviews", data);
    if (!responseAddReview.statusResponse) {
      setLoading(false);
      toastRef.current.show(
        "Error al enviar el comentario. Por favor, intenta mas tarde",
        3000
      );
      return;
    }

    const responseGetRestaurant = await getDocumentById(
      "restaurants",
      idRestaurant
    );
    if (!responseGetRestaurant.statusResponse) {
      setLoading(false);
      toastRef.current.show(
        "Error al obtener el restaurante. Por favor, intenta mas tarde",
        3000
      );
      return;
    }
    const restaurant = responseGetRestaurant.document;
    console.log(restaurant);
    const raitingTotal = restaurant.raitingTotal + rating;
    console.log(">>>");
    console.log(restaurant.raitingTotal);
    const quantityVoting = restaurant.quantityVoting + 1;
    const ratingResult = raitingTotal / quantityVoting;
    const responseUpdateRestaurant = await updateDocument(
      "restaurants",
      idRestaurant,
      {
        raitingTotal,
        quantityVoting,
        rating: ratingResult,
      }
    );
    setLoading(false);

    if (!responseUpdateRestaurant.statusResponse) {
      setLoading(false);
      toastRef.current.show(
        "Error actualizando el restaurante. Por favor, intenta mas tarde",
        3000
      );
      return;
    }

    navigation.goBack();
  };

  const validForm = () => {
    setErrorTitle("");
    setErrorReview("");
    let isValid = true;

    if (!rating) {
      toastRef.current.show("Debes dar una puntuacion al restaurante...", 3000);
      isValid = false;
    }

    if (isEmpty(title)) {
      setErrorTitle("Debes ingresar un titulo al comentario");
      isValid = false;
    }

    if (isEmpty(review)) {
      setErrorReview("Debes ingresar un comentario");
      isValid = false;
    }
    return isValid;
  };

  return (
    <KeyboardAwareScrollView style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Malo", "Regular", "Normal", "Bueno", "Excelente"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Titulo..."
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
          errorMessage={errorTitle}
        ></Input>
        <Input
          placeholder="Comentario..."
          containerStyle={styles.textArea}
          onChange={(e) => setReview(e.nativeEvent.text)}
          errorMessage={errorReview}
          multiline
        ></Input>
        <Button
          title="Enviar comentario"
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
          onPress={addReview}
        />
      </View>
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <Loading isVisible={loading} text="Enviando comentario" />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    flex: 1,
    margin: 10,
    marginTop: 40,
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 10,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "#442484",
  },
});
