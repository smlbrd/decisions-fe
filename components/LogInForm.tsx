import apiClient from "@/utils/api-client";
import { useUser } from "@/utils/UserContext";
import { AxiosError } from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

const LogInForm = () => {
  const router = useRouter();
  const { saveUser, user } = useUser();
  const [inputText, setInputText] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const handleLogin = async () => {
    if (!inputText) {
      setErrMsg("Input a username");
      return null;
    }
    try {
      setLoginSuccess(false);
      setErrMsg("");
      setIsLoading(true);
      const userData = await apiClient.get(`/users?username=${inputText}`);
      await saveUser(userData.data);
      setIsLoading(false);
      setLoginSuccess(true);
      setInputText("");
      router.push("/");
    } catch (err) {
      if ((err as AxiosError).response?.status === 404) {
        setErrMsg("Username not found");
      } else {
        setErrMsg("There was an error logging in");
      }
    }
  };
  return (
    <View>
      <Text>Enter your username:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text"
        value={inputText}
        onChangeText={setInputText}
      />
      {errMsg ? (
        <View>
          <Text>{errMsg}</Text>
          <Button title="Log In" onPress={handleLogin} />
        </View>
      ) : loginSuccess ? (
        <Text>Success! Logged in</Text>
      ) : isLoading ? (
        <Text>logging in...</Text>
      ) : (
        <Button title="Log In" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LogInForm;
