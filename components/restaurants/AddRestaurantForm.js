import React, { useState, useEffect } from "react";
import { map, size, filter, isEmpty } from "lodash";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import CountryPicker from "react-native-country-picker-modal";
import {
  ScrollView,
  StyleSheet,
  Alert,
  View,
  Dimensions,
  Text,
} from "react-native";
import { Avatar, Button, Icon, Input, Image } from "react-native-elements";

import {
  getCurrentLocation,
  loadImageFromGallery,
  validateEmail,
} from "../../utils/helpers";
import Modal from "../../components/Modal.js";
import {
  addDocumentWithoutId,
  getCurrentUser,
  uploadImage,
} from "../../utils/action";

const widthScreen = Dimensions.get("window").width;

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
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const responseUploadImages = await uploadImages();
    const restaurant = {
      name: formData.name,
      address: formData.direction,
      description: formData.description,
      callingCode: formData.calingCode,
      phone: formData.phone,
      email: formData.email,
      location: locationRestaurant,
      images: responseUploadImages,
      createAt: new Date(),
      createdBy: getCurrentUser().uid,
      rating: 0,
      ratingTotal: 0,
      quantityVoting: 0,
    };
    const responseAddDocument = await addDocumentWithoutId(
      "restaurants",
      restaurant
    );
    setLoading(false);

    if (!responseAddDocument.statusResponse) {
      toastRef.current.show(
        "Error al grabar el restaurante, por favor intentelo más tarde",
        3000
      );
      return;
    }

    navigation.navigate("restaurant");
  };

  const validateForm = () => {
    clearErrors();
    let isValid = true;
    if (isEmpty(formData.name)) {
      setErrorName("Debes ingresar el nombre del restaurante");
      isValid = false;
    }
    if (isEmpty(formData.direction)) {
      setErrorAddress("Debes ingresar la dirección del restaurante");
      isValid = false;
    }
    if (!validateEmail(formData.email)) {
      setErrorEmail("Debes ingresar el email del restaurante");
      isValid = false;
    }
    if (isEmpty(formData.phone) || size(formData.phone) < 7) {
      setErrorPhone("Debes ingresar una direccion de teléfono válida");
      isValid = false;
    }
    if (isEmpty(formData.description)) {
      setErrorDescription("Debes ingresar una descripción para el restaurante");
      isValid = false;
    }

    if (!locationRestaurant) {
      toastRef.current.show(
        "Debes de localizar el restaurante en el mapa",
        3000
      );
      isValid = false;
    } else if (size(imageSelected) === 0) {
      toastRef.current.show(
        "Debes de agregar al menos una imagen del restaurante",
        3000
      );
      isValid = false;
    }
    return isValid;
  };

  const uploadImages = async () => {
    const imagesUrl = [];
    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await uploadImage(image, "restaurants", uuid());
        if (response.statusResponse) {
          imagesUrl.push(response.url);
        }
      })
    );
    return imagesUrl;
  };

  const clearErrors = () => {
    setErrorName("");
    setErrorEmail("");
    setErrorPhone("");
    setErrorAddress("");
    setErrorDescription("");
  };

  return (
    <ScrollView style={styles.viewContainer}>
      <ImageRestaurants imageRestaurant={imageSelected[0]} />
      <FormAdd
        formData={formData}
        setFormData={setFormData}
        errorName={errorName}
        errorEmail={errorEmail}
        errorPhone={errorPhone}
        errorAddress={errorAddress}
        errorDescription={errorDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
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
      <MapRestaurant
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ImageRestaurants({ imageRestaurant }) {
  return (
    <View style={styles.viewPhoto}>
      <Image
        style={{ width: widthScreen, height: 200 }}
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../assets/no-image.png")
        }
      ></Image>
    </View>
  );
}

function MapRestaurant({
  isVisibleMap,
  setIsVisibleMap,
  setLocationRestaurant,
  toastRef,
}) {
  const [newRegion, setNewRegion] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await getCurrentLocation();
      if (response.status) {
        setNewRegion(response.location);
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(newRegion);
    toastRef.current.show("Localizacion guardada correctamente", 3000);
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setVisible={setIsVisibleMap}>
      <View>
        {newRegion && (
          <MapView
            style={styles.mapStyle}
            initialRegion={newRegion}
            showsUserLocation
            onRegionChange={(region) => setNewRegion(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: newRegion.latitude,
                longitude: newRegion.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Guardar ubicacion"
            containerStyle={styles.viewMapContainerSave}
            buttonStyle={styles.viewMapButtonSave}
            onPress={confirmLocation}
          ></Button>
          <Button
            title="Cancelar"
            containerStyle={styles.viewMapContainerCancel}
            buttonStyle={styles.viewMapButtonCancel}
            onPress={() => setIsVisibleMap(false)}
          ></Button>
        </View>
      </View>
    </Modal>
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
        },
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
  setIsVisibleMap,
  locationRestaurant,
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
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#442484" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
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
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
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
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  viewMapContainerCancel: {
    paddingLeft: 5,
  },
  viewMapContainerSave: {
    paddingRight: 2,
  },
  viewMapButtonCancel: {
    backgroundColor: "#a65273",
  },
  viewMapButtonSave: {
    backgroundColor: "#442484",
  },
});
