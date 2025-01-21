import { useEffect, useState } from "react";
import {
  Button,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import { Link, useRouter } from "expo-router";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { BigButton } from "@/components/BigButton";
import Overlay from "@/components/Overlay";

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

type Member = {
  _id: string;
  name: string;
  username: string;
  savedLists: [string];
  email: string;
};

type Group = {
  _id: string;
  name: string;
  description: string;
  members: Member[];
};

const decisionProcesses = [
  {
    id: "6784d7a5844f23ac9810cf50",
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

  const [selectedList, setSelectedList] = useState<string | undefined>(
    "List Select"
  );
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    "Group Select"
  );
  const [selectedDecisionProcess, setSelectedDecisionProcess] = useState<
    string | undefined
  >(undefined);

  const [isDecisionProcessModalVisible, setIsDecisionProcessModalVisible] =
    useState(false);

  const { colours } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const socket = useSocket();
  socket.emit("hi", "hi");

  useEffect(() => {
    apiClient
      .get("/")
      .then(({ data }) => console.log(data))
      .catch(() => {
        router.push("/NotConnectedToServer");
      });
  }, []);

  const handleDecisionProcessModalClose = () => {
    setIsDecisionProcessModalVisible(false);
  };

  const handleDecisionProcessSelect = (decisionProcessId: string) => {
    setSelectedDecisionProcess(decisionProcessId);
  };

  const postNewDecision = () => {
    if (!selectedList || !selectedDecisionProcess) {
      setErrMsg(
        "Please select a list, and choose your decision-making process!"
      );
      return;
    }

    const newDecisionBody = {
      list: selectedList,
      group: selectedGroup,
      votingStatus: "in progress",
      decisionsProcess_id: selectedDecisionProcess,
      saveData: {},
      completedAt: null,
      outcome: null,
    };

    setIsLoading(true);
    apiClient
      .post("/decisions", newDecisionBody)
      .then(({ data }) => {
        setIsLoading(false);
        const newDecisionId = data._id;
        router.push({
          pathname: "/Decision",
          params: { decision_id: newDecisionId },
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setErrMsg("there was an error loading users");
      });
  };

  const handleStartDeciding = () => {
    setIsDecisionProcessModalVisible(false);
    postNewDecision();
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
              <TouchableOpacity
                onPress={() => handleDecisionProcessSelect(item.id)}
                style={[
                  styles.itemContainer,
                  selectedDecisionProcess === item.id && styles.selectedItem,
                  { borderColor: colours.primary },
                ]}
              >
                <Text
                  style={[styles.modalTitle, { color: colours.text.primary }]}
                >
                  {item.name}
                </Text>
                <Text style={{ color: colours.text.primary }}>
                  {item.description}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colours.button.primary }]}
            onPress={handleStartDeciding}
          >
            <Text style={[styles.buttonText, { color: colours.text.primary }]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </Overlay>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedList}
          onValueChange={(itemValue) => setSelectedList(itemValue)}
        >
          <Picker.Item
            label="Help me decide..."
            value="List Select"
            enabled={false}
          />
          {listData?.map((list: List) => {
            return (
              <Picker.Item label={list.title} value={list._id} key={list._id} />
            );
          })}
        </Picker>
      </View>
      <View
        style={[styles.pickerContainer, { backgroundColor: colours.primary }]}
      >
        <Picker
          selectedValue={selectedGroup}
          onValueChange={(itemValue) => setSelectedGroup(itemValue)}
        >
          <Picker.Item
            label="Choose with..."
            value={"Choose with..."}
            enabled={false}
          />
          <Picker.Item label="...myself!" value="Group Select" />
          {groupData?.map((group: Group) => {
            return (
              <Picker.Item
                label={group.name}
                value={group._id}
                key={group._id}
              />
            );
          })}
        </Picker>
      </View>
      <View style={styles.buttonContainer}>
        <BigButton
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
      maxWidth: "80%",
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
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 6,
  },
  itemContainer: {
    flexDirection: "column",
    padding: 20,
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  button: {
    alignItems: "center",
    marginTop: 10,
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  selectedItem: {
    shadowRadius: 5,
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 5 },
  },
  errText: {
    fontWeight: "bold",
  },
});
