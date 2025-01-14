import React, {useEffect, useState} from "react"
import { Text, View, Button, Image } from "react-native";
import UserInformation from '../components/UserInformation'
import {apiClient} from '../utils/api-client'

export default function User() {
  const userId = 1 
  const userIdInStorage = 1

  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    apiClient.get(`/users/${userId}`).then(({data}) => {
      setUserData(data)
      setLoading(false)
    }).catch((err) => {
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
  }

  if (loading) {
    return <Text>Loading ..</Text>
  }

  if (error) {
    return <Text>{error}</Text>
  }

  return (
    <View style={{padding: 10}}>
    <Text style={{fontSize: 20, marginBottom: 20}}>My Profile</Text>

    {userData && (
      <UserInformation
      userId={userData._id} username={userData.username} email={userData.email} canSeeEmail={canSeeEmail} canEditLists={canEditLists} /> )}
    {/* userIdInStorage={userIdInStorage} /> */}

    {isUsersOwnProfile && (<Button title="Log out" onPress={handleLogout} />)}
  </View>
);
} 





