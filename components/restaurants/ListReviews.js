import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import firebase from "firebase/app";
import { Button } from "react-native-elements";

export default function ListReviews({ navigation, id }) {
  const [userLogued, setUserLogued] = useState(null);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogued(true) : setUserLogued(false);
  });

  return (
    <View>
      {userLogued ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleReview}
          onPress={() => {
            navigation.navigate("add-review-restaurant", { idRestaurant: id });
          }}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#a376c7",
          }}
        />
      ) : (
        <Text
          style={styles.mustLoginText}
          onPress={() => navigation.navigate("login")}
        >
          Para escribir una opinion es necesario estar logueado.{" "}
          <Text style={styles.loginText}>Pulsa AQUI para iniciar sesion</Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleReview: {
    color: "#a376c7",
  },
  mustLoginText: {
    textAlign: "center",
    color: "#a376c7",
    padding: 7,
  },
  loginText: {
    fontWeight: "bold",
  },
});
