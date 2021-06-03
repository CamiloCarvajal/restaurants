import { size } from "lodash";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input, Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

import Loading from "../Loading";
import { validateEmail } from "../../utils/helpers";
import {
  addDocumentWithId,
  getCurrentUser,
  getToken,
  registerUser,
} from "../../utils/action";

export default function RegisterForm() {
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

  const doRegisterUser = async () => {
    if (!validateData()) {
      return;
    }

    setLoading(true);
    const result = await registerUser(formData.email, formData.password);
    if (!result.statusResponse) {
      setErrorEmail(result.error);
      return;
    }

    const token = await getToken();
    const resultUser = await addDocumentWithId(
      "users",
      { token },
      getCurrentUser().uid
    );
    if (!resultUser.statusResponse) {
      setLoading(false);
      setErrorEmail(resultUser.error);
      return;
    }
    setLoading(false);
    navigation.navigate("account");
  };

  const validateData = () => {
    setErrorEmail("");
    setErrorPass("");
    setErrorConfirm("");
    let isValid = true;

    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes ingresar un email valido");
      isValid = false;
    }

    if (size(formData.password) < 6) {
      setErrorPass("Debes ingresar una contraseña de al menos 6 caracteres");
      isValid = false;
    }

    if (size(formData.confirm) < 6) {
      setErrorConfirm(
        "Debes ingresar una contraseña de contraseña de al menos 6 caracteres"
      );
      isValid = false;
    }

    if (formData.password != formData.confirm) {
      setErrorPass("Las contraseña no son iguales");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View style={styles.form}>
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
      <Input
        placeholder="Confirma tu contraseña"
        containerStyle={styles.input}
        password={true}
        secureTextEntry={!showPasword}
        onChange={(e) => onChange(e, "confirm")}
        defaultValue={formData.confirm}
        errorMessage={errorConfirm}
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
        title="Registrarse"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={() => doRegisterUser()}
      ></Button>
      <Loading isVisible={loading} text="Creando cuenta"></Loading>
    </View>
  );
}

const defaultFormValues = () => {
  return { email: "", password: "", confirm: "" };
};

const styles = StyleSheet.create({
  form: {
    marginTop: 30,
    padding: 20,
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
  icon: {
    color: "#947d6c",
  },
});
