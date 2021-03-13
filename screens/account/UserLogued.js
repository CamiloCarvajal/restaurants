import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

import { closeSession } from '../../utils/action'

export default function UserLogued() {
    const navigation = useNavigation()

    return (
        <View>
            <Text>User Logued...</Text>
            <Button
                title = "Cerrar sesion"
                onPress = {() => {
                    closeSession()
                    navigation.navigate("restaurant");
                }}
            ></Button>
        </View>
    )
}

const styles = StyleSheet.create({})
