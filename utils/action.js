import { firebaseApp } from "./firebase";
import * as firebase from "firebase";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export const isUserLoggued = () => {
  let isLoggued = false;
  firebase.auth().onAuthStateChanged((user) => {
    user != null && (isLoggued = true);
  });

  return isLoggued;
};


export const getCurrentUser = () => {
    return firebase.auth().currentUser
}
