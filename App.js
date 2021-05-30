import { LogBox } from "react-native";
import React, { useEffect, useRef } from "react";
import Navigation from "./navigations/Navigation";
import { startNotifications } from "./utils/action";

LogBox.ignoreAllLogs();

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    startNotifications(notificationListener, responseListener);
  }, []);

  return <Navigation />;
}
