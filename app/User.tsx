import React, {useEffect, useState} from "react"
import { Text, View, Button, Image } from "react-native";
import UserInformation from '../components/UserInformation'
import {apiClient} from '../utils/api-client'
import {TouchableOpacity} from 'react-native' //instead of button for logging out
import {ActivityIndicator} from 'react-native' // instead of text, spinner to show its loading

export default function User() {
  //hardcoded for now, but this may change if doing user authentification 
  const userId = "6784d64b844f23ac9810cf21"
  const userIdInStorage = "6784d64b844f23ac9810cf21"

  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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






//This is connected to the LoggedOut.tsx file
// import React from 'react';
// import { View, Text, Image, Button, StyleSheet } from 'react-native';
// import { userData } from '../dummy-data/users';
// import {useRouter} from 'expo-router'

// const User = ({loggedInUser}) => {
//   const currentUser = userData[0];
//   const router = useRouter() 
  
//   const handleLogout = () => {
//     console.log("Logging out...");

//     router.push('/LoggedOut')
//   };

//   return (
//     <View style={styles.container}>
//       <Image source={require('../assets/images/sparkly_unicorn.png')} style={styles.profilePic} />
//       <Text style={styles.username}>{currentUser.username}</Text>
//       <Text style={styles.name}>{currentUser.name}</Text>
//       {/* displays email and logout button if in the logged in users profile */}
//       {loggedInUser._id === currentUser._id && (
//         <>
      
//       <Text style={styles.email}>{currentUser.email}</Text>
//       <Button title="Logout" onPress={handleLogout} />
//       </> )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   profilePic: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   username: {
//     fontSize: 25,
//     fontWeight: 'bold',
//     marginVertical: 10,
//   },
//   name: {
//     fontSize: 30,
//     marginVertical: 5,
//   },
//   email: {
//     fontSize: 20,
//     marginVertical: 10,
//   },
// });

// export default User;




