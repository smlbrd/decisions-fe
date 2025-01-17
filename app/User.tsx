import React, {useEffect, useState} from "react"
import { Text, View, Button, Image } from "react-native";
import UserInformation from '../components/UserInformation'
import {apiClient} from '../utils/api-client'
import {TouchableOpacity} from 'react-native' //instead of button for logging out
import {ActivityIndicator} from 'react-native' // instead of text, spinner to show its loading
import {useRouter} from 'expo-router'


export default function User() {
  //hardcoded for now, but this may change if doing user authentification 
  const userId = "6784d64b844f23ac9810cf21"
  const userIdInStorage = "6784d64b844f23ac9810cf21"

  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  useEffect(() => {
    apiClient.get(`/users/${userId}`).then(({data}) => {
      console.log(data)
      setUserData(data)
      setLoading(false)
    }).catch((err) => { 
      console.error("Error loading user data", err)
      setError("Error loading user data")
      setLoading(false)
    })
  }, [userId])

  const isUsersOwnProfile = userId === userIdInStorage

  const canSeeEmail = isUsersOwnProfile
  const canEditLists = isUsersOwnProfile

  // const hasPermission = userId === userIdInStorage
  const handleLogout = () => {
    console.log("Logging Out")
    router.push("/")
  }
 

  if (isLoading) {
    return ( <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="#0000ff" /> </View>
    )
  }

  if (error) {
    return <Text>{error}</Text>
  }

  return (
    <View style={{padding: 10}}>
    <Text style={{fontSize: 30, marginBottom: 20}}>My Profile</Text>

    {userData && (
      <UserInformation
      userId={userData._id} username={userData.username} email={userData.email} canSeeEmail={canSeeEmail} canEditLists={canEditLists} /> )}
    {/* userIdInStorage={userIdInStorage} /> */}

    {isUsersOwnProfile && (
      <TouchableOpacity onPress={handleLogout}
      style={{backgroundColor: '#ff4d4d',
        padding: 10,
        borderRadius:5,
        marginTop: 20,
      }} > 
      <Text style={{color: '#fff', textAlign: 'center'}}>Log Out</Text>
      </TouchableOpacity>
    )
    //  (<Button title="Log out" onPress={handleLogout} />)
     }
  </View>
);
} 