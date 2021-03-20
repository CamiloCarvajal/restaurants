import * as Persmissions from "expo-permissions";
import * as ImgPicker from "expo-image-picker";
import { Alert } from "react-native";

export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const loadImageFromGallery = async (array) => {
  const response = { status: false, image: null };
  const resultPermissions = await Persmissions.askAsync(Persmissions.CAMERA);

  if (resultPermissions.status === "denied") {
    Alert.alert("Debes otorgar permiso para acceder a la galeria de imagenes");
    return response;
  }
  const result = await ImgPicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: array,
  });

  if (result.cancelled) {
    return response;
  }

  response.status = true;
  response.image = result.uri;
  return response;
};
