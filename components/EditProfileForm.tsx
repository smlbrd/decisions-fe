import React from "react"
import {View, Text, TouchableOpacity, TextInput} from "react-native"

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
        <View style={{padding: 10}}>
            <Text style={{fontSize: 30, marginBottom: 20}}>Edit Profile</Text>

            <TextInput
            style={{borderBottomWidth: 1, marginBottom: 10}}
            value={user.username || ""}
                onChangeText={(text) => onChange("username", text)}
                placeholder="Username"
                />
                <TextInput
                style={{borderBottomWidth: 1, marginBottom: 10}}
                value={user.name || ""}
                    onChangeText={(text) => onChange("name", text)}
                    placeholder="Name"
                    />
                    <TextInput
                    style={{borderBottomWidth: 1, marginBottom: 10}}
                    value={user.email || ""}
                        onChangeText={(text) => onChange("email", text)}
                        placeholder="Email"
                        />
            <TouchableOpacity
            onPress={onSave}
            style={{
                backgroundColor: '#8fbc8f',
                padding: 10,
                borderRadius: 5,
                marginTop: 15 
            }}
            >
            <Text style={{color: '#000000', textAlign: 'center'}}>Save Changes</Text>
            </TouchableOpacity>
        </View>
    )
}



export default EditProfileForm