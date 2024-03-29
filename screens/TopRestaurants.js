import React, { useState, useCallback } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import Loading from "../components/Loading";
import { getTopRestaurants } from "../utils/action";
import ListTopRestaurants from "../components/ranking/ListTopRestaurants";

export default function TopRestaurants({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [restaurants, setRestaurants] = useState(null);

  useFocusEffect(
    useCallback(() => {
      (async function () {
        setLoading(true);
        const response = await getTopRestaurants(10);
        if (response.statusResponse) {
          setRestaurants(response.restaurants);
        }
        setLoading(false);
      })();
    }, [])
  );

  return (
    <View>
      <ListTopRestaurants restaurants={restaurants} navigation={navigation} />
      <Loading isVisible={loading} text="Por favor, espere..." />
    </View>
  );
}

const styles = StyleSheet.create({});
