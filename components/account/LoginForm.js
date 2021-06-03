import { isEmpty } from "lodash";
import * as firebase from "firebase";
import React, { useState } from "react";
import * as GoogleSignIn from "expo-google-sign-in";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Icon } from "react-native-elements";
import { StyleSheet, Platform, Alert, View } from "react-native";

import Loading from "../Loading";
import { validateEmail } from "../../utils/helpers";
import { loginWithEmailAndPassword } from "../../utils/action";

export default function LoginForm() {
  const [showPasword, setshowPasword] = useState(false);
  const [formData, setformData] = useState(defaultFormValues());
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [errorConfirm, setErrorConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const onChange = (e, type) => {
    setformData({ ...formData, [type]: e.nativeEvent.text });
  };

async function googleSignInAsync() {
  try {
    await GoogleSignIn.initAsync();
    if (Platform.OS === "android") {
      await GoogleSignIn.askForPlayServicesAsync();
    }
    const { type, user } = await GoogleSignIn.signInAsync();
    if (type === "success") {
      onSignIn(user);
      setLoading(false);
      return true;
    } else {
      setLoading(false);
      Alert.alert(JSON.stringify(result));
      return { cancelled: true };
    }
  } catch (error) {
    setLoading(false);
    Alert.alert(error.message);
    return { error: true };
  }
}

function onSignIn(googleUser) {
  const unsubscribe = firebase
    .auth()
    .onAuthStateChanged(function (firebaseUser) {
      unsubscribe();
      if (!isUserEqual(googleUser, firebaseUser)) {
        const credential = firebase.auth.GoogleAuthProvider.credential(
          googleUser.auth.idToken,
          googleUser.auth.accessToken
        );
        setLoading(true);
        firebase
          .auth()
          .signInWithCredential(credential)
          .then(() => {
            setLoading(false);
          })
          .catch(function (error) {
            setLoading(false);
            Alert.alert(error.message);
          });
      } else {
        Alert.alert("Usuario ya está logueado");
      }
    });
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    let providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.getBasicProfile().getId()
      ) {
        return true;
      }
    }
  }
  return false;
}

  const doLogin = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await loginWithEmailAndPassword(
      formData.email,
      formData.password
    );
    setLoading(false);

    if (!result.statusResponse) {
      setErrorEmail(result.error);
      setErrorPass(result.error);
      return;
    }

    navigation.navigate("account");
  };

  const validateData = () => {
    setErrorEmail("");
    let isValid = true;

    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes ingresar un email valido");
      isValid = false;
    }

    if (isEmpty(formData.password)) {
      setErrorPass("Debes ingresar una contraseña");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={styles.container}>
      <Input
        placeholder="Email"
        containerStyle={styles.input}
        onChange={(e) => onChange(e, "email")}
        keyboardType="email-address"
        defaultValue={formData.email}
        errorMessage={errorEmail}
      ></Input>
      <Input
        placeholder="Contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPasword}
        onChange={(e) => onChange(e, "password")}
        defaultValue={formData.password}
        errorMessage={errorPass}
        rightIcon={
          <Icon
            type="material-community"
            name={showPasword ? "eye-off-outline" : "eye-outline"}
            iconStyle={styles.icon}
            onPress={() => setshowPasword(!showPasword)}
          />
        }
      ></Input>
      <Button
        title="Iniciar sesión"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => doLogin()}
      ></Button>
      <Button
        title="Iniciar sesión con google"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnGoogle}
        onPress={googleSignInAsync}
        icon={
          <Icon
            size={10}
            color="#ffff"
            marginRight={10}
            name="google"
            type="material-community"
          />
        }
      ></Button>
      <Loading isVisible={loading} text="Iniciando sesión"></Loading>
    </View>
  );
}

const defaultFormValues = () => {
  return { email: "", password: "" };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  input: {
    width: "100%",
  },
  icon: {
    color: "#947d6c",
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
    alignSelf: "center",
  },
  btn: {
    backgroundColor: "#7c645c",
  },
  btnGoogle: {
    backgroundColor: "#EA4335",
  },
});
