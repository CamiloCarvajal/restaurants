import React from "react";
import { StyleSheet, Text, Image, ScrollView } from "react-native";
import { Button } from "react-native-elements";

export default function UserGuest() {
  return (
    <ScrollView centerContent="true" style={styles.viewBody} >
      <Image
        source={require("../../assets/dinnerhouselogo.png")}
        resizeMode="contain"
        style={styles.image}
      ></Image>
      <Text style={styles.title}>Consulta tu perfil en restaurants</Text>
      <Text style={styles.description}>
        ¿Cómo describiría su mejor restaurante? Busca y visualiza los mejores
        restaurantes de forma sencilla, vota cuál te ha gustado más y comenta
        cómo ha sido tu experiencia.
      </Text>
      <Button title="Ver tu perfil" buttonStyle={styles.button} onPress={() => console.log("Hola!!!")}></Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    marginHorizontal: 30,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginVertical: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "justify",
    marginBottom: 20,
    color: "#783833",
  },
  button: {
    backgroundColor: "#7c645c",
  },
});
