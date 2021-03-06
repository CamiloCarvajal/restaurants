import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Loading from "../../components/Loading";
import { getCurrentUser, isUserLoggued } from "../../utils/action";

import UserGuest from "./UserGuest";
import UserLogued from "./UserLogued";

export default function Account() {
  const [login, setLogin] = useState(null);

  //   useEffect(() => {
  //     setLogin(isUserLoggued());
  //   }, []);

  useEffect(() => {
      const user = getCurrentUser();
      user ? setLogin(true) : setLogin(false)
  }, [])
  
  if (login == null) {
    return <Loading isVisible={true} text="Cargando..."></Loading>
  }

  return login ? <UserLogued /> : <UserGuest />;
}

const styles = StyleSheet.create({});
