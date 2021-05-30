import { map, size } from "lodash";
import firebase from "firebase/app";
import React, { useState, useCallback } from "react";
import { getRestaurantReviews } from "../../utils/action";
import moment from "moment/min/moment-with-locales";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar, Button, Rating } from "react-native-elements";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";

moment.locale("es");

export default function ListReviews({ navigation, id }) {
  const [userLogued, setUserLogued] = useState(null);
  const [reviews, setReviews] = useState([]);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogued(true) : setUserLogued(false);
  });

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const response = await getRestaurantReviews(id);
        if (response.statusResponse) {
          setReviews(response.reviews);
        }
      })();
    }, [])
  );

  return (
    <View>
      {userLogued ? (
        <Button
          title="Escribe una opinion"
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleReview}
          onPress={() => {
            navigation.navigate("add-review-restaurant", { idRestaurant: id });
          }}
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "#a376c7",
          }}
        />
      ) : (
        <Text
          style={styles.mustLoginText}
          onPress={() => navigation.navigate("login")}
        >
          Para escribir una opinion es necesario estar logueado.{" "}
          <Text style={styles.loginText}>Pulsa AQUI para iniciar sesion</Text>
        </Text>
      )}
      {size(reviews) > 0 &&
        map(reviews, (reviewDocument, index) => (
          <Review key={index} reviewDocument={reviewDocument} />
        ))}
    </View>
  );
}

function Review({ key, reviewDocument }) {
  const { title, createAt, review, avatarUser, rating } = reviewDocument;
  const createReview = new Date(createAt.seconds * 1000);

  return (
    <View style={styles.viewReview}>
      <View style={styles.imageAvatar}>
        <Avatar
          rounded
          size="large"
          containerStyle={styles.imageAvatar}
          renderPlaceholderContent={<ActivityIndicator color="#fff" />}
          source={
            avatarUser
              ? { uri: avatarUser }
              : require("../../assets/Blank-profile.png")
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewReview}>{review}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {moment(createReview).format("LLL")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleReview: {
    color: "#a376c7",
  },
  mustLoginText: {
    textAlign: "center",
    color: "#a376c7",
    padding: 7,
  },
  loginText: {
    fontWeight: "bold",
  },
  viewReview: {
    flexDirection: "row",
    padding: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  imageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "gray",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
