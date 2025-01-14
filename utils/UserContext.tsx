import React, { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  children: ReactNode;
};

type userDataProps = { user_id: string | null };

type UserContextProps = {
  user: userDataProps;
  saveUser: (userData: userDataProps) => Promise<void>;
  loadUser: () => Promise<void>;
  removeUser: () => Promise<void>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<userDataProps>({ user_id: null });

  const saveUser = async (userData: userDataProps) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const removeUser = async () => {
    setUser({ user_id: null });
    await AsyncStorage.setItem("user", JSON.stringify({ user_id: null }));
  };

  return (
    <UserContext.Provider value={{ user, saveUser, loadUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
