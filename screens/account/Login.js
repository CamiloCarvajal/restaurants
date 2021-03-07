import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function Login() {

  return (
    <ScrollView>
      <Image
        source={require("../../assets/dinnerhouselogo.png")}
        resizeMode="center"
        style={styles.image}
      ></Image>
      <View style={styles.container}>
        <Text>Formulario de registro</Text>
        <CreateAccount />
      </View>
      <Divider style={styles.divider} />
    </ScrollView>
  );
}

function CreateAccount(props) {
  const navigation = useNavigation();

  return (
    <Text
      style={styles.register}
      onPress={() => navigation.navigate("register")}
    >
      Aun no tienes una cuenta?{" "}
      <Text style={styles.btnRegister}>Registrate</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: "100%",
    marginBottom: 20,
  },
  container: {
    marginHorizontal: 40,
  },
  divider: {
    backgroundColor: "#be2f32",
    margin: 40,
  },
  register: {
    marginTop: 5,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  btnRegister: {
    color: "#be2f32",
    fontWeight: "bold",
  },
});
