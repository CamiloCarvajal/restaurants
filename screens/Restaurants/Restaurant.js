import { Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView, Alert, StyleSheet, Text, View } from "react-native";
import CarouselImage from "../../components/CarouselImage";

import Loading from "../../components/Loading";
import { getDocumentById } from "../../utils/action";

const widthScreen = Dimensions.get("window").width;

export default function Restaurant({ navigation, route }) {
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  navigation.setOptions({ title: name });

  useEffect(() => {
    (async () => {
      const response = await getDocumentById("restaurants", id);
      if (response.statusResponse) {
        setRestaurant(response.document);
      } else {
        setRestaurant({});
        Alert.alert(
          "Ocurrio un problema cargando el restaurante. Intente mas tarde."
        );
      }
    })();
  }, []);

  if (!restaurant) {
    return <Loading isVisible={true} text="Cargando" />;
  }

  return (
    <ScrollView style={styles.viewBody}>
      <CarouselImage
        images={restaurant.images}
        width={widthScreen}
        height={250}
        activeSlide={activeSlide}
        setActiveSlide={setActiveSlide}
      />
      <Text>{restaurant.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({ viewBody: { flex: 1 } });
