import { firebaseApp } from "./firebase";
import * as firebase from "firebase";
import "firebase/firestore";
import { includes } from "lodash";

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