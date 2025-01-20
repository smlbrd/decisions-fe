import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { getGroupsByUserId, getListsByUserId } from "@/api/api";

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

interface Group {
  _id: string;
  name: string;
  description: string;
  members: Member[];
}

interface Member {
  _id: string;
  name: string;
  username: string;
  savedLists: [string];
  email: string;
}

export default function Index() {
  const [selectedList, setSelectedList] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [listData, setListData] = useState<List[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState();

  const { colours } = useTheme();
  const { user } = useUser();
  const socket = useSocket();
  socket.emit("hi", "hi");

  apiClient
    .get("/")
    .then(({ data }) => console.log(data))
    .catch(() => console.log("Server not online!"));

  useEffect(() => {
    const fetchLists = async () => {
      if (!user._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const lists = await getListsByUserId(user._id);
        setListData(lists);

        const groups = await getGroupsByUserId(user._id);
        setGroupData(groups);
      } catch (err) {
        setError(`Error getting lists: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchLists();
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colours.primary }]}>
      <Picker
        selectedValue={selectedList}
        onValueChange={(itemValue, itemIndex) => setSelectedList(itemValue)}
      >
        <Picker.Item label="Help me decide..." value={null} enabled={false} />
        {listData.map((list: List) => {
          return (
            <Picker.Item label={list.title} value={list.title} key={list._id} />
          );
        })}
      </Picker>
      <Picker
        selectedValue={selectedGroup}
        onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
      >
        <Picker.Item label="Wren & Abby's Group" value={null} enabled={false} />
        {groupData.map((group: Group) => {
          return (
            <Picker.Item
              label={group.name}
              value={group.name}
              key={group._id}
            />
          );
        })}
      </Picker>

      <Text>
        <Link href="/User">This is a link to the User Info</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
