import React from "react";
import { Image } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { size } from "lodash";

export default function CarouselImage({
  images,
  height,
  width,
  activeSlide,
  setActiveSlide,
}) {
  const renderItem = ({ item }) => {
    return (
      <Image
        style={{ width, height }}
        PlaceholderContent={<ActivityIndicator color="#fff" />}
        source={{ uri: item }}
      />
    );
  };

  return (
    <View>
      <Carousel
        layout="default"
        data={images}
        itemWidth={width}
        sliderWidth={width}
        itemHeight={height}
        renderItem={renderItem}
        onSnapToItem={(index) => setActiveSlide(index)}
      />
      <MyPagination data={images} activeSlide={activeSlide} />
    </View>
  );
}

function MyPagination({ data, activeSlide }) {
  return (
    <Pagination
      dotsLength={size(data)}
      activeDotIndex={activeSlide}
      containerStyle={styles.containerPagination}
      dotStyle={styles.dotActive}
      inactiveDotStyle={styles.dotInactive}
      inactiveDotOpacity={0.6}
      inactiveDotScale={0.6}
    />
  );
}

const styles = StyleSheet.create({
  containerPagination: {
    backgroundColor: "transparent",
    zIndex: 1,
    position: "absolute",
    bottom: 0,
    alignSelf: "center",
  },
  dotActive: {
    width: 20,
    height: 20,
    borderRadius: 10, //Cuando el borderRadius es la mital del alto queda perfectamente redondo
    marginHorizontal: 2,
    backgroundColor: "#442484",
  },
  dotInactive: {
    width: 18,
    height: 18,
    borderRadius: 9, //Cuando el borderRadius es la mital del alto queda perfectamente redondo
    marginHorizontal: 2,
    backgroundColor: "#fff",
  },
});
