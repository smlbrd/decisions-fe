import React from "react"
import {Text, View, Image, TouchableOpacity, StyleSheet } from "react-native"

type SelectAvatarProps = {
    selectedAvatar: string | null
    onAvatarClick: (avatar: string) => void
    avatarOptions: string[]
}

const defaultAvatar = require("../assets/images/default_avatar.png")

const SelectAvatar: React.FC<SelectAvatarProps> = ({selectedAvatar, onAvatarClick, avatarOptions}) => {
    return (
        <View>
            <Text>Select Avatar:</Text>
        <View style={styles.avatarContainer}>
        {avatarOptions.map((avatar, index) => (
            <TouchableOpacity key={index} onPress={() => onAvatarClick(avatar)}>
                <Image source={{uri: avatar}} style={[
                    styles.avatar,
                    selectedAvatar === avatar ? styles.selectedAvatar :null,
                ]}
                />
            </TouchableOpacity>
        ))}
        </View>

        <Image source={selectedAvatar ? {uri: selectedAvatar} : require("../assets/images/default_avatar.png")} 
        style={{width: 100, height: 100, borderRadius: 50}}
        />
        </View>
    )
}

const styles = StyleSheet.create({
    avatarContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginBottom: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        margin: 5,
        borderWidth: 2,
        borderColor: "transparent",
    },

    selectedAvatar: {
        borderColor: "#4CAF50"
    },
})

export default SelectAvatar
