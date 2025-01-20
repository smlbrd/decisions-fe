import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

type Props = {
  children: ReactNode;
};

type userDataProps = {
  _id: string | null;
  username: string | null;
  name: string | null;
  email: string | null;
  savedLists: Array<string> | null;
  avatarImg?: string | null;
};

type UserContextProps = {
  user: userDataProps;
  saveUser: (userData: userDataProps) => Promise<void>;
  loadUser: () => Promise<void>;
  removeUser: () => Promise<void>;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const isWeb = Platform.OS === "web";
  const nullUser = {
    _id: null,
    username: null,
    name: null,
    email: null,
    savedLists: null,
  };

  const [user, setUser] = useState<userDataProps>(nullUser);

  const saveUser = async (userData: userDataProps) => {
    setUser(userData);
    if (isWeb) localStorage.setItem("user", JSON.stringify(userData));
    else await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const loadUser = async () => {
    const storedUser = isWeb
      ? localStorage.getItem("user")
      : await AsyncStorage.getItem("user");

    const parsedStoredUser =
      storedUser && storedUser !== JSON.stringify(null)
        ? JSON.parse(storedUser)
        : nullUser;

    if (parsedStoredUser?.username) setUser(parsedStoredUser);
    else setUser(nullUser);
  };

  useEffect(() => {
    loadUser();
  }, []);

  const removeUser = async () => {
    setUser(nullUser);
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

export const useUser = (): UseUserReturn => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
