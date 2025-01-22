import React from "react"
import {View, Text, TouchableOpacity, TextInput, StyleSheet} from "react-native"

type EditProfileFormProps = {
    user: {
        name: string | null;
        username: string | null;
        email: string | null;
    }
    onChange: (field: string, value: string) => void
    onSave: () => void
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({user, onChange, onSave}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Edit Profile</Text>

            <TextInput
            style={styles.input}
            value={user.username || ""}
                onChangeText={(text) => onChange("username", text)}
                placeholder="Username"
                />
                <TextInput
                style={styles.input}
                value={user.name || ""}
                    onChangeText={(text) => onChange("name", text)}
                    placeholder="Name"
                    placeholderTextColor="#888"
                    />
                    <TextInput
                    style={styles.input}
                    value={user.email || ""}
                        onChangeText={(text) => onChange("email", text)}
                        placeholder="Email"
                        placeholderTextColor={"#888"}
                        />
            <TouchableOpacity
            onPress={onSave}
            style={{
                backgroundColor: "#8fbc8f",
                padding: 10,
                borderRadius: 5,
                marginTop: 15 
            }}
            >
            <Text style={{color: "#000000", textAlign: "center"}}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    heading: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 30,
        color: "#333"
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        paddingLeft: 15,
        marginBottom: 15,
        fontSize: 15,
        borderColor: "#ddd",
        borderWidth: 1,
    },
})



export default EditProfileForm