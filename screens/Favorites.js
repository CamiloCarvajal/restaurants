import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { getFavorites } from "../utils/action";

export default function Favorites() {
  useFocusEffect(
    useCallback(() => {
      (async function getData() {
        const response = await getFavorites();
        console.log(response);
      })()
    }, [])
  );

  return (
    <View>
      <Text>Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
