// import React, {useEffect, useState} from "react"
// import { Text, View, Button, Image } from "react-native";
// import UserInformation from '../components/UserInformation'
// import {apiClient} from '../utils/api-client'

// export default function User() {
//   const userId = "6784d64b844f23ac9810cf21"
//   const userIdInStorage = "6784d64b844f23ac9810cf21"

//   const [userData, setUserData] = useState<any>(null)
//   const [loading, setLoading] = useState<boolean>(true)
//   const [error, setError] = useState<string | null>(null)

//   useEffect(() => {
//     apiClient.get(`/users/${userId}`).then(({data}) => {
//       console.log(data)
//       setUserData(data)
//       setLoading(false)
//     }).catch((err) => { 
//       console.error("Error loading user data", err)
//       setError("Error loading user data")
//       setLoading(false)
//     })
//   }, [userId])

//   const isUsersOwnProfile = userId === userIdInStorage

//   const canSeeEmail = isUsersOwnProfile
//   const canEditLists = isUsersOwnProfile

//   // const hasPermission = userId === userIdInStorage
//   const handleLogout = () => {
//     console.log("Logging Out")
//   }

//   if (loading) {
//     return <Text>Loading ..</Text>
//   }

//   if (error) {
//     return <Text>{error}</Text>
//   }

//   return (
//     <View style={{padding: 10}}>
//     <Text style={{fontSize: 20, marginBottom: 20}}>My Profile</Text>

//     {userData && (
//       <UserInformation
//       userId={userData._id} username={userData.username} email={userData.email} canSeeEmail={canSeeEmail} canEditLists={canEditLists} /> )}
//     {/* userIdInStorage={userIdInStorage} /> */}

//     {isUsersOwnProfile && (<Button title="Log out" onPress={handleLogout} />)}
//   </View>
// );
// } 







import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import { userData } from '../dummy-data/users';
import {useRouter} from 'expo-router'

const User = ({loggedInUser}) => {
  const currentUser = userData[0];
  const router = useRouter() 
  
  const handleLogout = () => {
    console.log("Logging out...");

    router.push('/LoggedOut')
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/sparkly_unicorn.png')} style={styles.profilePic} />
      <Text style={styles.username}>{currentUser.username}</Text>
      <Text style={styles.name}>{currentUser.name}</Text>
      {/* displays email and logout button if in the logged in users profile */}
      {loggedInUser._id === currentUser._id && (
        <>
      <Text style={styles.email}>{currentUser.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
      </> )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 25,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  name: {
    fontSize: 30,
    marginVertical: 5,
  },
  email: {
    fontSize: 20,
    marginVertical: 10,
  },
});

export default User;




