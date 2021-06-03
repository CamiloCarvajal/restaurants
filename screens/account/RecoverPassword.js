import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { Button, Icon, Input } from "react-native-elements";

import Loading from "../../components/Loading";
import { validateEmail } from "../../utils/helpers";
import { sendEmailResetPassword } from "../../utils/action";

export default function RecoverPassword({ navigation }) {
  const [email, setEmail] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateData()) {
      return;
    }
    setLoading(true);
    const result = await sendEmailResetPassword(email);
    setLoading(false);

    if (!result.statusResponse) {
      Alert.alert("Este correo no esta relacionado a ningún usuario");
      return;
    }
    Alert.alert("Se le ha enviado un email para que cambies tu contraseña.");
    navigation.navigate("account", { screen: "login" });
  };

  const validateData = () => {
    setErrorEmail("");
    let isValid = true;

    if (!validateEmail(email)) {
      setErrorEmail("Debes ingresar un email valido");
      isValid = false;
    }
    return isValid;
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Ingresa tu email"
        containerStyle={styles.inputForm}
        onChange={(e) => setEmail(e.nativeEvent.text)}
        defaultValue={email}
        errorMessage={errorEmail}
        keyboardType="email-address"
        rightIcon={
          <Icon type="material-community" name="at" iconStyle={styles.icon} />
        }
      />
      <Button
        title="Recuperar contraseña"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btnRecover}
        onPress={onSubmit}
      />
      <Loading isVisible={loading} text="Recuperando contraseña" />
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "90%",
  },
  bntContainer: {
    marginTop: 20,
    width: "85%",
    alignSelf: "center",
  },
  btnRecover: {
    backgroundColor: "#442484",
  },
  icon: {
    color: "#c1c1c1",
  },
});
