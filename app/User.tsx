import React, {useEffect, useState} from "react"
import { Text, View, Button, Image } from "react-native";
import UserInformation from "../components/UserInformation"
import {TouchableOpacity} from 'react-native' //instead of button for logging out
import {ActivityIndicator} from 'react-native' // instead of text, spinner to show its loading
import {useRouter} from 'expo-router'
import { useUser } from "@/contexts/UserContext";
import EditProfileForm from "../components/EditProfileForm"


export default function User() {
    const {user, saveUser} = useUser()
    console.log(user)
    const [isLoading, setLoading] = useState<boolean>(true)
    const [isEditUser, setEditUser] = useState<boolean>(false)
    const [editableUser, setEditableUser] = useState({
      name: user.name || "",
      username: user.username || "",
      email: user.email || ""
    })
  
    
//   const [error, setError] = useState<string | null>(null)
    const router = useRouter()

  useEffect(() => {
     if (user._id) {
      setLoading(false)
     }
    }, [user])

    const handleLogout = () => {
    console.log("Logging Out")
    router.push("/")
  }

  const handleEditChange = (field: string, value: string) => {
    setEditableUser({...editableUser, [field]: value})
  }

  const handleSaveChanges = async () => {
    await saveUser({
      ...user, ...editableUser
    })
    setEditUser(false)
  }

  if (isLoading || !user._id) {
    return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
    <ActivityIndicator size="large" color="#0000ff"/>
    </View>
    )
  }

  return (
    <View style={{padding: 10}}>
    <Text style={{fontSize: 30, marginBottom: 20}}>My Profile</Text>

    {!isEditUser ? (
      <UserInformation
      user={user}
      />
    ) : (
      <EditProfileForm
      user={editableUser}
      onChange={handleEditChange}
      onSave={handleSaveChanges}
      />
    )}

      <TouchableOpacity
      onPress={() => setEditUser(!isEditUser)}
      style={{backgroundColor: '#a9a9a9', padding: 10, borderRadius: 5, marginTop: 20}}
      >
        <Text style={{color: '#E4E4E4', textAlign: 'center'}}>
          { isEditUser ? "Cancel" : "Edit Profile"} </Text>
        </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout}
      style={{backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius:5,
        marginTop: 20,
      }} 
      > 
      <Text style={{color: '#fff', textAlign: 'center'}}>Log Out</Text>
      </TouchableOpacity>
    {/* //  (<Button title="Log out" onPress={handleLogout} />) */}

  </View>
    )
  }
