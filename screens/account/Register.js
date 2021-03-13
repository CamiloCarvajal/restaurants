import React from "react";
import { StyleSheet, Image, View } from "react-native";
import RegisterForm from "../../components/account/RegisterForm";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
  return (
    <KeyboardAwareScrollView style={styles.container}>
      <Image
        source={require("../../assets/dinnerhouselogo.png")}
        resizeMode="center"
        style={styles.image}
      ></Image>
      <RegisterForm />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    height: 150,
    width: "100%",
    marginBottom: 20,
  },
  container:{
      flex:1,
      marginTop:30
  }
});
