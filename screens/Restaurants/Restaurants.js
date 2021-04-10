import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Icon } from "react-native-elements";
import firebase from "firebase/app";

import Loading from "../../components/Loading";
import { getCurrentUser, isUserLoggued } from "../../utils/action";

export default function Restaurants({navigation}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      userInfo ? setUser(true) : setUser(false);
    });
  }, []);

  if (user == null) {
    return <Loading isVisible={true} text="Loading"></Loading>;
  }

  return (
    <View style={styles.viewBody}>
      <Text>Restaurant</Text>
      {user && (
        <Icon
          type="material-community"
          name="plus"
          color="#442484"
          reverse
          containerStyle={styles.btnContainer}
          onPress={() => navigation.navigate("add-restaurant")}
        ></Icon>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
  },
  viewBody: {
    flex: 1,
  },
});
