import React, { useState } from "react";
import { isEmpty } from "lodash";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "react-native-elements";

import { updateProfile } from "../../utils/action";

export default function ChangeDisplayNameForm({
  displayName,
  setShowModal,
  toastRef,
  setReloadUser,
}) {
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await updateProfile({ displayName: newDisplayName });
    setLoading(false);

    if (!result.statusResponse) {
      setError("Error al actualizar el nombre. Intentalo mas tarde");
      return;
    }
    
    setReloadUser(true);
    toastRef.current.show("Se ha actualizado el nombre", 3000);
    setShowModal(false);
  };

  const validateForm = () => {
    setError(null);
    if (isEmpty(newDisplayName)) {
      setError("Debes ingresar un nombre.");
      return false;
    }

    if (displayName === newDisplayName) {
      setError("Debes ingresar un nombre diferente al actual");
      return false;
    }
    return true;
  };

  return (
    <View styles={styles.view}>
      <Input
        placeholder="Ingresa nombres y apellidos"
        containerStyle={styles.input}
        defaultValue={displayName}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        errorMessage={error}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#a7bfd3",
        }}
      ></Input>
      <Button
        title="Cambiar nombres y apellidos"
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
