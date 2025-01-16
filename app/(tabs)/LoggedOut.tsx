import React from 'react'
import {View, Text, Button, StyleSheet} from 'react-native'
import {useRouter} from 'expo-router'

const LoggedOut = () => {
    const router = useRouter()

    const handleGoToHomePage = () => {
        router.push('/')
    }

    return (
    <View style={styles.container}>
        <Text style={styles.message}>You have successfully logged out</Text>
        <Button title='Go to Home Page' onPress={handleGoToHomePage}/>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    message: {
        fontSize: 30,
        marginVertical: 20,
    },
})
export default LoggedOut