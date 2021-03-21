import React from "react";
import Navigation from "./navigations/Navigation";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function App() {
  return <Navigation/>;
}

/*
  return (
    <View style={styles.container}>
      <Text>Hello world!!!</Text>
      <StatusBar style="auto" />
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
*/
