import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

export default function RegisterForm() {
  return (
    <View style={styles.form}>
      <Input placeholder="Email" containerStyle={styles.input}></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={true}
      ></Input>
      <Input
        placeholder="Confirma tu contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={true}
      ></Input>
      <Button
        title="Registrarse"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
    padding: 20
  },
  input: {
    width: "100%",
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#7c645c",
  },
});
