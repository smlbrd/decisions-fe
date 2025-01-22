import React, {useEffect, useState} from "react"
import { Text, View, Button, Image } from "react-native";
import UserInformation from "../components/UserInformation"
import {TouchableOpacity} from 'react-native' 
import {ActivityIndicator} from "react-native"
import {useRouter} from "expo-router"
import { useUser } from "@/contexts/UserContext";
import EditProfileForm from "../components/EditProfileForm"
import SelectAvatar from "@/components/SelectAvatar";

const stockAvatars = [
  "https://images.pexels.com/photos/2078478/pexels-photo-2078478.jpeg?",
  "https://images.pexels.com/photos/802112/pexels-photo-802112.jpeg",
  "https://images.pexels.com/photos/2610309/pexels-photo-2610309.jpeg?",
  "https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg",
  "https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg",
  "https://images.pexels.com/photos/53977/eagle-owl-raptor-falconry-owl-53977.jpeg",
  "https://images.pexels.com/photos/598966/pexels-photo-598966.jpeg",

]
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

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(user.avatarImg || null)
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
  
      const updatedUser = {
        ...user,
        ...editableUser,
        avatarImg: selectedAvatar || user.avatarImg,
      }

      await saveUser(updatedUser)

      setEditUser(false)
    }
  

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar)
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

    {selectedAvatar ? (
      <Image source={selectedAvatar ? {uri: selectedAvatar} : require("../assets/images/default_avatar.png")}
    style={{width: 100, height: 100, borderRadius: 50}} />
    ) : (
      <Image source={require("../assets/images/default_avatar.png")}
      style={{width: 100, height: 100, borderRadius: 50}} />
    )}


    {!isEditUser ? (
      <View>
        <Text style={{fontSize: 20, fontWeight: "bold"}}>{user.username}</Text>
        <Text>@{user.username}</Text>
        {user.email && <Text>Email: {user.email}</Text>}
        </View>
    ) : (
      <EditProfileForm
      user={editableUser}
      onChange={handleEditChange}
      onSave={handleSaveChanges}
      />
    )}
    
    {isEditUser && (
      <SelectAvatar selectedAvatar={selectedAvatar} onAvatarClick={handleAvatarSelect} avatarOptions={stockAvatars}/>
    )}

      <TouchableOpacity
      onPress={() => setEditUser(!isEditUser)}
      style={{backgroundColor: "#a9a9a9", padding: 10, borderRadius: 5, marginTop: 20}}
      >
        <Text style={{color: "#E4E4E4", textAlign: "center"}}>
          { isEditUser ? "Cancel" : "Edit Profile"} </Text>
        </TouchableOpacity>


      <TouchableOpacity onPress={handleLogout}
      style={{backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius:5,
        marginTop: 20,
      }} 
      > 
      <Text style={{color: "#fff", textAlign: "center"}}>Log Out</Text>
      </TouchableOpacity>

  </View>
    )
  }
