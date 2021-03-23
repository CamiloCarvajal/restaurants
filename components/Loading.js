import React from "react";
import { ActivityIndicator } from "react-native";
import { StyleSheet, Text, View } from "react-native";
import { Overlay } from "react-native-elements";

export default function Loading({ isVisible, text }) {
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor="rgba(0,0,4,2,5)"
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}
    >
      <View styles={styles.view}>
        <ActivityIndicator size="large" color="#be2f32" />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 100,
    width: 200,
    backgroundColor: "#FFFFFF",
    borderColor: "#ebac84",
    borderWidth: 2,
    borderRadius: 10,
  },
  view: {
    flex: 1,
    alignItems: "center", 
    justifyContent: "center",
  },
  text: {
    color: "#be2f32",
    marginTop: 10,
  },
});

// flex: 1, #Usar todo el ancho disponible
// alignItems: "center", #Centrar horizontalment
// justifyContent: "center", #Centrar verticalmente