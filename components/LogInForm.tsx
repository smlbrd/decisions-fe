import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { AxiosError } from "axios";
import apiClient from "@/utils/api-client";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { TouchableOpacity } from "react-native-gesture-handler";

const LogInForm = () => {
  const { colours } = useTheme();
  const { saveUser } = useUser();
  const router = useRouter();

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
      {loginSuccess ? (
        <Text style={{ color: colours.text.primary }}>Success! Logged In</Text>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={inputText}
            onChangeText={setInputText}
          />
          {errMsg ? (
            <View>
              <Text>{errMsg}</Text>
              <Button title="Log In" onPress={handleLogin} />
            </View>
          ) : isLoading ? (
            <Text style={{ color: colours.text.primary }}>Logging in...</Text>
          ) : (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colours.button.primary },
              ]}
              onPress={handleLogin}
            >
              <Text
                style={[styles.buttonText, { color: colours.text.primary }]}
              >
                Log in
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
  button: {
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
});

export default LogInForm;
