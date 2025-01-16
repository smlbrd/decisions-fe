import React, { createContext, ReactNode, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  children: ReactNode;
};

type userDataProps = {
  _id: string | null;
  username: Array<string> | null;
  name: string | null;
  email: string | null;
  savedLists: Array<string> | null;
};

type UserContextProps = {
  user: userDataProps;
  saveUser: (userData: userDataProps) => Promise<void>;
  loadUser: () => Promise<void>;
  removeUser: () => Promise<void>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<userDataProps>({
    _id: null,
    username: null,
    name: null,
    email: null,
    savedLists: null,
  });

  const saveUser = async (userData: userDataProps) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const loadUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  };

  const removeUser = async () => {
    setUser({
      _id: null,
      username: null,
      name: null,
      email: null,
      savedLists: null,
    });
    await AsyncStorage.setItem("user", JSON.stringify(null));
  };

  return (
    <UserContext.Provider value={{ user, saveUser, loadUser, removeUser }}>
      {children}
    </UserContext.Provider>
  );
};

interface UseUserReturn {
  saveUser: (userData: userDataProps) => Promise<void>;
  loadUser: () => Promise<void>;
  removeUser: () => Promise<void>;
  user: userDataProps;
}

// Corrected useUser implementation
export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
