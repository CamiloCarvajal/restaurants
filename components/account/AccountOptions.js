import React, { useState } from "react";
import { map } from "lodash";
import { StyleSheet, Text, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";

import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmail from "./ChangeEmail";
import ChangePassword from "./ChangePassword";

export default function AccountOptions({ user, toastRef, setReloadUser }) {
  const [showModal, setShowModal] = useState(false);
  const [renderComponent, setrenderComponent] = useState(null);

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

  const selectedComponent = (key) => {
    switch (key) {
      case "displayName":
        setrenderComponent(
          <ChangeDisplayNameForm
            displayName={user.displayName}
            setShowModal={setShowModal}
            setReloadUser={setReloadUser}
            toastRef={toastRef}
          />
        );
        break;
      case "email":
        setrenderComponent(
          <ChangeEmail
            email={user.email}
            setShowModal={setShowModal}
            setReloadUser={setReloadUser}
            toastRef={toastRef}
          />
        );
        break;
      case "password":
        setrenderComponent(
          <ChangePassword
            setShowModal={setShowModal}
            setReloadUser={setReloadUser}
            toastRef={toastRef}
          />
        );
        break;
    }
    setShowModal(true);
  };
  const menuOptions = generateOptions();

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
      <Modal isVisible={showModal} setVisible={setShowModal}>
        {renderComponent ? renderComponent : <Text>Cargando...</Text>}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#a7bfd3",
  },
});
