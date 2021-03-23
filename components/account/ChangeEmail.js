import React, { useState } from "react";
import { isEmpty } from "lodash";
import { StyleSheet, Text, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";

import { reAuthenticate, updateEmail } from "../../utils/action";
import { validateEmail } from "../../utils/helpers";

export default function ChangeEmail({
  email,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newEmail, setNewEmail] = useState(email);
  const [password, setPassword] = useState(null);
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const resultReauthenticate = await reAuthenticate(password);

    if (!resultReauthenticate.statusResponse) {
      setLoading(false);
      setErrorPassword("Contraseña incorrecta");
      return;
    }

    const resultUpdateEmai = await updateEmail(newEmail);
    setLoading(false);

    if (!resultUpdateEmai.statusResponse) {
      setErrorEmail("No se puede actualizar, el correo ya esta en uso.");
      return;
    }

    setReloadUser(true);
    toastRef.current.show("Se ha actualizado el email", 3000);
    setShowModal(false);
  };

  const validateForm = () => {
    setErrorEmail(null);
    setErrorPassword(null);
    let isValid = true;

    if (!validateEmail(newEmail)) {
      setErrorEmail("Debes ingresar un email válido.");
      isValid = false;
    }

    if (email === newEmail) {
      setErrorEmail("Debes ingresar un email diferente al actual.");
      isValid = false;
    }

    if (isEmpty(password)) {
      setErrorPassword("Debes ingresar tu contraseña.");
      isValid = false;
    }

    return isValid;
  };

  return (
    <View styles={styles.view}>
      <Input
        placeholder="Ingresa el nuevo correo"
        containerStyle={styles.input}
        defaultValue={email}
        onChange={(e) => setNewEmail(e.nativeEvent.text)}
        errorMessage={errorEmail}
        keyboardType="email-address"
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#a7bfd3",
        }}
      ></Input>
      <Input
        placeholder="Ingresa tu contraseña"
        containerStyle={styles.input}
        defaultValue={password}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        errorMessage={errorPassword}
        password={true}
        secureTextEntry={!showPassword}
        rightIcon={
          <Icon
            type="material-community"
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            iconStyle={{ color: "#a7bfd3" }}
            onPress={() => setShowPassword(!showPassword)}
          ></Icon>
        }
      ></Input>
      <Button
        title="Cambiar email"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={onSubmit}
        loading={loading}
      ></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainer: {
    width: "95%",
  },
  btn: {
    backgroundColor: "#442484",
  },
});
