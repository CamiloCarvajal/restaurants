import React, { useState } from "react";
import { map } from "lodash";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";

import Modal from "../Modal";

export default function AccountOptions({ user, toastRef }) {
  const menuOptions = generateOptions();
  const [showModal, setshowModal] = useState(false);

  return (
    <View>
      {map(menuOptions, (menu, index) => (
        <ListItem key={index} style={styles.menuItem} onPress={menu.onPress}>
          <Icon
            type="material-community"
            name={menu.iconNameLeft}
            color={menu.iconColorLeft}
          ></Icon>
          <ListItem.Content>
            <ListItem.Title>{menu.title}</ListItem.Title>
          </ListItem.Content>
          <Icon
            type="material-community"
            name={menu.iconNameRight}
            color={menu.iconColorRight}
          ></Icon>
        </ListItem>
      ))}
      <Modal isVisible={showModal} setVisible={setshowModal}>
        <Text>Hola mundo</Text>
        <Text>Hola mundo</Text>
      </Modal>
    </View>
  );
}

const generateOptions = () => {
  return [
    {
      title: "Cambiar nombre",
      iconNameLeft: "account-circle",
      iconColorLeft: "#a7bfd3",
      iconNameRight: "chevron-right",
      iconColorRight: "#a7bfd3",
      onPress: () => selectedComponent("displayName"),
    },
    {
      title: "Cambiar Email",
      iconNameLeft: "at",
      iconColorLeft: "#a7bfd3",
      iconNameRight: "chevron-right",
      iconColorRight: "#a7bfd3",
      onPress: () => selectedComponent("email"),
    },
    {
      title: "Cambiar contrasena",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#a7bfd3",
      iconNameRight: "chevron-right",
      iconColorRight: "#a7bfd3",
      onPress: () => selectedComponent("password"),
    },
  ];
};

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#a7bfd3",
  },
});

const selectedComponent = (key) => {
  console.log(key);
};
