import { Platform, StyleSheet, Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";

type List = {
  _id: string;
  title: string;
  description: string;
  options: Option[];
  owner: string;
  members: [];
  createdAt: string;
};

type Option = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  customFields: [];
  owner: string;
};

interface Member {
  _id: string;
  name: string;
  username: string;
  savedLists: [string];
  email: string;
}

interface Group {
  _id: string;
  name: string;
  description: string;
  members: Member[];
}

export default function Index() {
  const [selectedList, setSelectedList] = useState<number | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [listData, setListData] = useState<List[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>(
    undefined
  );

  const { colours } = useTheme();
  const { user } = useUser();
  const socket = useSocket();
  socket.emit("hi", "hi");

  useEffect(() => {
    setIsLoading(true);
    setErrMsg("");
    if (!user._id) {
      setErrMsg("not logged in");
      return undefined;
    }
    apiClient
      .get(`users/${user._id}/saved_lists`)
      .then(({ data }) => {
        setIsLoading(false);
        setListData(data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setErrMsg("there was an error loading users");
      });
  }, [user]);

  useEffect(() => {
    setIsLoading(true);
    setErrMsg("");
    if (!user._id) {
      setErrMsg("not logged in");
      return undefined;
    }
    apiClient
      .get(`users/${user._id}/groups`)
      .then(({ data }) => {
        setIsLoading(false);
        setGroupData(data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setErrMsg("there was an error loading groups");
      });
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colours.primary }]}>
      {isLoading ? (
        <Text>loading...</Text>
      ) : errMsg ? (
        <Text style={styles.errText}>{errMsg}</Text>
      ) : null}

      <Picker
        selectedValue={selectedList}
        onValueChange={(itemValue, itemIndex) => setSelectedList(itemValue)}
      >

        <Picker.Item
          label="Help me decide..."
          value={"Help me decide..."}
          enabled={false}
        />
        {listData?.map((list: List) => {
          return (
            <Picker.Item label={list.title} value={list.title} key={list._id} />
          );
        })}
      </Picker>
      <Picker
        selectedValue={selectedGroup}
        onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
      >
        <Picker.Item
          label="Wren & Abby's Group"
          value={"Wren & Abby's Group"}
          enabled={false}
        />
        {groupData?.map((group: Group) => {
          return (
            <Picker.Item
              label={group.name}
              value={group.name}
              key={group._id}
            />
          );
        })}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...(Platform.OS === "web" && {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }),
  },
  errText: {
    color: "#FE141D",
    fontWeight: "bold",
  },
});
