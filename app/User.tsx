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
     setLoading(!user._id)
    }, [user])

    const handleLogout = () => {
    console.log("Logging Out")
    router.push("/")
  }

  const handleEditChange = (field: string, value: string) => {
    setEditableUser({...editableUser, [field]: value})
  }

  const handleSaveChanges = async () => {
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
      <EditProfileForm
      user={editableUser}
      onChange={handleEditChange}
      onSave={handleSaveChanges}
      />
    ):(

    <UserInformation user={user}/>
    )}

    {isEditUser ? (
      <TouchableOpacity
      onPress={() => setEditUser(false)}
      style={{backgroundColor: '#FFFFFF', padding: 10, borderRadius: 5, marginTop: 20}}
      >
        <Text style={{color: '#E4E4E4', textAlign: 'center'}}>Cancel</Text>
        </TouchableOpacity>
    ) : (
      <TouchableOpacity
      onPress={() => setEditUser(true)}
      style={{backgroundColor: '#dcdcdc', padding: 10, borderRadius: 5, marginTop: 20}}
      >
        <Text style={{ color: '#000000', textAlign: 'center'}}>Edit Profile</Text>
      </TouchableOpacity>
    )}

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
