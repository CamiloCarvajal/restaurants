import React, { useState } from "react";
import { isEmpty, size } from "lodash";
import { StyleSheet, View } from "react-native";
import { Button, Icon, Input } from "react-native-elements";

import { reAuthenticate, updatePassword } from "../../utils/action";


export default function ChangePassword({ setShowModal, toastRef }) {
  const [newPassword, setNewPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [errorNewPassword, setErrorNewPassword] = useState(null);
  const [errorCurrentPassword, setErrorCurrentPassword] = useState(null);
  const [errorConfirmPassword, setErrorConfirmPassword] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const resultReauthenticate = await reAuthenticate(currentPassword);

    if (!resultReauthenticate.statusResponse) {
      setLoading(false);
      setErrorCurrentPassword("Contraseña incorrecta");
      return;
    }

    const resultUpdatePassword = await updatePassword(newPassword);
    setLoading(false);

    if (!resultUpdatePassword.statusResponse) {
      setErrorNewPassword("Hubo un problema actualizando la contraseña. Intente mas tarde");
      return;
    }

    toastRef.current.show("Se ha actualizado la contraseña", 3000);
    setShowModal(false);
  };

  const validateForm = () => {
    setErrorNewPassword(null);
    setErrorCurrentPassword(null);
    setErrorConfirmPassword(null);
    let isValid = true;

    if (isEmpty(currentPassword)) {
      setErrorCurrentPassword("Debes ingresar la contraseña actual");
      isValid = false;
    }

    if (size(newPassword) < 6) {
      setErrorNewPassword(
        "Debes ingesar una contraseña de al menos 6 caracteres"
      );
      isValid = false;
    }

    if (size(confirmPassword) < 6) {
      setErrorConfirmPassword(
        "Debes ingesar una confirmación de contraseña de al menos 6 caracteres"
      );
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      setErrorConfirmPassword("Las contraseñas no coinciden");
      isValid = false;
    }

    if (newPassword === currentPassword) {
      setErrorNewPassword(
        "Debes ingresar una contraseña diferente a la actual"
      );
      isValid = false;
    }

    return isValid;
  };

  return (
    <View styles={styles.view}>
      <Input
        placeholder="Ingresa tu contraseña actual"
        containerStyle={styles.input}
        defaultValue={currentPassword}
        onChange={(e) => setCurrentPassword(e.nativeEvent.text)}
        errorMessage={errorCurrentPassword}
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
      <Input
        placeholder="Ingresa tu nueva contraseña"
        containerStyle={styles.input}
        defaultValue={newPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        errorMessage={errorNewPassword}
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
      <Input
        placeholder="Confirma la contraseña"
        containerStyle={styles.input}
        defaultValue={confirmPassword}
        onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
        errorMessage={errorConfirmPassword}
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
        title="Cambiar contraseña"
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
