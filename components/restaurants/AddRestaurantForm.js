import React, { useState } from "react";
import { map, size, filter } from "lodash";
import CountryPicker from "react-native-country-picker-modal";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import { Avatar, Button, Icon, Input } from "react-native-elements";

import { loadImageFromGallery } from "../../utils/helpers";

export default function AddRestaurantForm({
  toastRef,
  setLoading,
  navigation,
}) {
  const [formData, setFormData] = useState(defaultFormValues());
  const [errorName, setErrorName] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [errorAddress, setErrorAddress] = useState("");
  const [errorDescription, setErrorDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);

  const addRestaurant = () => {
    console.log(formData);
    console.log("fuck yeah");
  };

  return (
    <View style={styles.viewContainer}>
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorEmail={errorEmail}
        errorPhone={errorPhone}
        errorAddress={errorAddress}
        errorDescription={errorDescription}
      />
      <UploadImage
        toastRef={toastRef}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
      />
      <Button
        title="Crear restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      ></Button>
    </View>
  );
}

function UploadImage({ toastRef, imageSelected, setImageSelected }) {
  const imageSelect = async () => {
    const response = await loadImageFromGallery([4, 3]);

    if (!response.status) {
      toastRef.current.show("No se ha seleccionado una imagen", 3000);
      return;
    }

    setImageSelected([...imageSelected, response.image]);
  };

  const removeImage = (image) => {
    Alert.alert(
      "Eliminar imagen",
      "Estas seguro que deseas eliminar la imagen?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Si",
          onPress: () => {
            setImageSelected(
              filter(imageSelected, (imageUrl) => imageUrl != image)
            );
          },
        }
      ],
      { cancelable: true }
    );
  };

  return (
    <ScrollView horizontal style={styles.viewImages}>
      {size(imageSelected) < 10 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        ></Icon>
      )}
      {map(imageSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        ></Avatar>
      ))}
    </ScrollView>
  );
}

function FormAdd({
  formData,
  setFormData,
  errorName,
  errorEmail,
  errorPhone,
  errorAddress,
  errorDescription,
}) {
  const [country, setCountry] = useState("CO");
  const [callingCode, setCallingCode] = useState("+57");
  const [phone, setPhone] = useState("");
  // const [state, setstate] = useState(initialState)
  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        defaultValue={formData.name}
        onChange={(e) => onChange(e, "name")}
        errorMessage={errorName}
      ></Input>
      <Input
        placeholder="Direccion del restaurante"
        defaultValue={formData.direction}
        onChange={(e) => onChange(e, "direction")}
        errorMessage={errorAddress}
      ></Input>
      <Input
        placeholder="Email del restaurante"
        keyboardType="email-address"
        defaultValue={formData.email}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errorEmail}
      ></Input>
      <View style={styles.phoneView}>
        <CountryPicker
          withFlag
          withCallingCode
          withFilter
          withCallingCodeButton
          containerStyle={styles.countryPicker}
          countryCode={country}
          onSelect={(country) => {
            setFormData({
              ...formData,
              country: country.cca2,
              calingCode: country.callingCode[0],
            });
          }}
        ></CountryPicker>
        <Input
          placeholder="WhatsApp del restaurante"
          keyboardType="phone-pad"
          containerStyle={styles.inputPhone}
          defaultValue={formData.phone}
          onChange={(e) => onChange(e, "phone")}
          errorMessage={errorPhone}
        ></Input>
      </View>
      <Input
        placeholder="Descripcion del restaurante"
        multiline
        containerStyle={styles.textArea}
        defaultValue={formData.description}
        onChange={(e) => onChange(e, "description")}
        errorMessage={errorDescription}
      ></Input>
    </View>
  );
}

const defaultFormValues = () => {
  return {
    name: "",
    description: "",
    phone: "",
    email: "",
    direction: "",
    country: "Colombia",
    calingCode: "57",
  };
};

const styles = StyleSheet.create({
  viewContainer: {
    height: "100%",
  },
  viewForm: {
    marginHorizontal: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
  },
  phoneView: {
    width: "80%",
    flexDirection: "row",
  },
  inputPhone: {
    width: "80%",
  },
  btnAddRestaurant: {
    margin: 20,
    backgroundColor: "#442484",
  },
  viewImages: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 75,
    width: 75,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
});
