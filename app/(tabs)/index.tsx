import { Platform, StyleSheet, Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import { FlatList } from "react-native-gesture-handler";
import { TouchableOpacity } from "react-native";

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

const decisionProcesses = [
  {
    id: "1",
    name: "This or That",
    description: "Choose your favourite, winner stays on!",
  },
  {
    id: "2",
    name: "Ranked Elimination",
    description: "The least popular option is removed in each round.",
  },
  {
    id: "3",
    name: "Random Selection",
    description: "Just pick a random option for me!",
  },
];

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [listData, setListData] = useState<List[]>([]);
  const [groupData, setGroupData] = useState<Group[]>([]);
  const [selectedList, setSelectedList] = useState<number | undefined>(
    undefined
  );
  const [selectedGroup, setSelectedGroup] = useState<number | undefined>(
    undefined
  );
  const [isDecisionProcessModalVisible, setIsDecisionProcessModalVisible] =
    useState(false);

  const { colours } = useTheme();
  const { user } = useUser();
  const socket = useSocket();
  socket.emit("hi", "hi");

  const handleDecisionProcessModalClose = () => {
    setIsDecisionProcessModalVisible(false);
  };

  const handleDecisionProcessSelect = () => {
    setIsDecisionProcessModalVisible(false);
    // POST decision
  };

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

      <Overlay
        isVisible={isDecisionProcessModalVisible}
        onClose={handleDecisionProcessModalClose}
        scrollable={false}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colours.background },
          ]}
        >
          <FlatList
            data={decisionProcesses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleDecisionProcessSelect()}>
                <Text style={{ color: colours.text.primary }}>{item.name}</Text>
                <Text style={{ color: colours.text.primary }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Overlay>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedList}
          onValueChange={(itemValue) => setSelectedList(itemValue)}
        >
          <Picker.Item
            label="Help me decide..."
            value={"Help me decide..."}
            enabled={false}
          />
          {listData?.map((list: List) => {
            return (
              <Picker.Item
                label={list.title}
                value={list.title}
                key={list._id}
              />
            );
          })}
        </Picker>
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedGroup}
          onValueChange={(itemValue, itemIndex) => setSelectedGroup(itemValue)}
        >
          <Picker.Item
            label="Choose with..."
            value={"Choose with..."}
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
      <View>
        <CreateNewButton
          text="Get Started"
          onPress={() => setIsDecisionProcessModalVisible(true)}
        />
      </View>
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
  pickerContainer: {
    ...(Platform.OS === "web" && {
      flex: 1,
      justifyContent: "space-around",
      alignItems: "center",
    }),
  },
  modalContainer: {
    ...(Platform.OS === "web" && {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    }),
  },
  errText: {
    color: "#FE141D",
    fontWeight: "bold",
  },
});
