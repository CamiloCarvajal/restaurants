import { firebaseApp } from "./firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { includes } from "lodash";

import { fileToBlob } from "./helpers";

const db = firebase.firestore(firebaseApp);

export const isUserLoggued = () => {
  let isLoggued = false;
  firebase.auth().onAuthStateChanged((user) => {
    user != null && (isLoggued = true);
  });

  return isLoggued;
};

export const getCurrentUser = () => {
  return firebase.auth().currentUser;
};

export const registerUser = async (email, password) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "El usuario ya existe";
  }
  return result;
};

export const closeSession = () => {
  return firebase.auth().signOut();
};

export const loginWithEmailAndPassword = async (email, password) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    result.statusResponse = false;
    result.error = "Usuario o contraseña no validos";
  }
  return result;
};

export const uploadImage = async (image, path, name) => {
  const result = { statusResponse: false, error: "", url: null };
  const reference = firebase.storage().ref(path).child(name);
  const blob = await fileToBlob(image);

  try {
    await reference.put(blob);
    const url = await firebase
      .storage()
      .ref(`${path}/${name}`)
      .getDownloadURL();
    result.statusResponse = true;
    result.url = url;
  } catch (error) {
    result.error = error;
  }

  return result;
};

export const updateProfile = async (data) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().currentUser.updateProfile(data);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const reAuthenticate = async (password) => {
  const result = { statusResponse: true, error: null };
  const user = getCurrentUser();
  try {
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password);
    await user.reauthenticateWithCredential(credentials);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const updateEmail = async (email) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().currentUser.updateEmail(email);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const updatePassword = async (password) => {
  const result = { statusResponse: true, error: null };
  try {
    await firebase.auth().currentUser.updatePassword(password);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};
