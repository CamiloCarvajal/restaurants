import "firebase/firestore";
import { map } from "lodash";
import { FireSQL } from "firesql";
import * as firebase from "firebase";
import { firebaseApp } from "./firebase";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import { fileToBlob } from "./helpers";
import { Alert } from "react-native";
import { Platform } from "react-native";

const db = firebase.firestore(firebaseApp);
const fireSQL = new FireSQL(firebase.firestore(), { include: "id" });

export const isUserLoggued = () => {
  //Revisar: Este metodo no sirve, onAuthStateChanged no deja retonar ni modificar variables del scope
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
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );
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

export const addDocumentWithoutId = async (collection, data) => {
  const result = { statusResponse: true, error: null };
  try {
    await db.collection(collection).add(data);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const addDocumentWithId = async (collection, data, doc) => {
  const result = { statusResponse: true, error: null };
  try {
    await db.collection(collection).doc(doc).set(data);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const getRestaurants = async (limitRestaurants) => {
  const result = {
    statusResponse: true,
    error: null,
    restaurants: [],
    startRestaurant: null,
  };
  try {
    const response = await db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .limit(limitRestaurants)
      .get();
    if (response.docs.length > 0) {
      result.startRestaurant = response.docs[response.docs.length - 1];
    }
    response.forEach((doc) => {
      const restaurant = doc.data();
      restaurant.id = doc.id;
      result.restaurants.push(restaurant);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getMoreRestaurants = async (limitRestaurants, startRestaurant) => {
  const result = {
    statusResponse: true,
    error: null,
    restaurants: [],
    startRestaurant: null,
  };
  try {
    const response = await db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurant.data().createAt)
      .limit(limitRestaurants)
      .get();
    if (response.docs.length > 0) {
      result.startRestaurant = response.docs[response.docs.length - 1];
    }
    response.forEach((doc) => {
      const restaurant = doc.data();
      restaurant.id = doc.id;
      result.restaurants.push(restaurant);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getDocumentById = async (collection, id) => {
  const result = { statusResponse: true, error: null, document: null };
  try {
    const response = await db.collection(collection).doc(id).get();
    result.document = response.data();
    result.document.id = response.id;
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const updateDocument = async (collection, id, data) => {
  const result = { statusResponse: true, error: null, document: null };
  try {
    await db.collection(collection).doc(id).update(data);
  } catch (error) {
    result.error = error;
    result.statusResponse = false;
  }
  return result;
};

export const getRestaurantReviews = async (id) => {
  const result = {
    statusResponse: true,
    error: null,
    reviews: [],
  };
  try {
    const response = await db
      .collection("reviews")
      // .orderBy("createAt", "desc")
      .where("idRestaurant", "==", id)
      .get();
    response.forEach((doc) => {
      const review = doc.data();
      review.id = doc.id;
      result.reviews.push(review);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getIsFavorite = async (idRestaurant) => {
  const result = { statusResponse: true, error: null, isFavorite: false };

  try {
    const response = await db
      .collection("favorites")
      .where("userId", "==", getCurrentUser().uid)
      .where("idRestaurant", "==", idRestaurant)
      .get();
    result.isFavorite = response.docs.length > 0;
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const removeFavoriteRestaurant = async (idRestaurant) => {
  const result = { statusResponse: true, error: null, isFavorite: false };

  try {
    const response = await db
      .collection("favorites")
      .where("userId", "==", getCurrentUser().uid)
      .where("idRestaurant", "==", idRestaurant)
      .get();

    response.forEach(async (doc) => {
      await db.collection("favorites").doc(doc.id).delete();
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getFavorites = async () => {
  const result = { statusResponse: true, error: null, favorites: [] };

  try {
    const response = await db
      .collection("favorites")
      .where("userId", "==", getCurrentUser().uid)
      .get();

    await Promise.all(
      map(response.docs, async (favorite) => {
        const responseGetRest = await getDocumentById(
          "restaurants",
          favorite.data().idRestaurant
        );

        if (responseGetRest.statusResponse) {
          result.favorites.push(responseGetRest.document);
        }
      })
    );
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getTopRestaurants = async (limit) => {
  const result = { statusResponse: true, error: null, restaurants: [] };

  try {
    const response = await db
      .collection("restaurants")
      .orderBy("rating", "desc")
      .limit(limit)
      .get();
    response.forEach((doc) => {
      const restaurant = doc.data();
      restaurant.id = doc.id;
      result.restaurants.push(restaurant);
    });
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const searchRestaurants = async (criteria) => {
  const result = { statusResponse: true, error: null, restaurants: [] };

  try {
    result.restaurants = await fireSQL.query(
      `SELECT * FROM restaurants WHERE name LIKE '${criteria}%'`
    );
  } catch (error) {
    result.statusResponse = false;
    result.error = error;
  }
  return result;
};

export const getToken = async () => {
  if (!Constants.isDevice) {
    Alert.alert(
      "Debes de utilizar un dispositivo fisico para utilizar las notificaciones"
    );
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Debes dar permiso para acceder a las notificaciones", 3000);
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  if (Platform.OS == "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const startNotifications = (notificationListener, responseListener) => {
  notificationListener.current = Notifications.addNotificationReceivedListener(
    (notification) => {
      console.log(notification);
    }
  );

  responseListener.current =
    Notifications.addNotificationResponseReceivedListener((notification) => {
      console.log(notification);
    });

  return () => {
    Notifications.removeNotificationSubscription(notificationListener);
    Notifications.removeNotificationSubscription(responseListener);
  };
};

export const sendPushNotification = async (message) => {
  let response = false;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  }).then(() => (response = true));
  return response;
};

export const setNotificationMessage = (token, title, body, data) => {
  const message = {
    to: token,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

  return message;
};
