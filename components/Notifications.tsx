import { View, Text, StyleSheet, Platform } from "react-native";
import { MenuOption } from "./DropdownMenu";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api-client";
import { DecisionProps } from "@/utils/props";
import AsyncStorage from "@react-native-async-storage/async-storage";

type activityProps = {
  msg: string;
  key: string;
  decision_id?: string;
};

type Props = {
  setIsNotificationDropdownVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  activity: activityProps[];
  setIsBellRed: React.Dispatch<React.SetStateAction<boolean>>;
};

type ActivityLookupProps = {
  [key: string]: activityProps;
};

export default function Notifications({
  setIsNotificationDropdownVisible,
  activity,
  setIsBellRed,
}: Props) {
  const activityKeyLookup: ActivityLookupProps = {};
  activity.forEach((notification) => {
    if (!activityKeyLookup[notification.key])
      activityKeyLookup[notification.key] = notification;
  });
  const { user } = useUser();
  const [inProgress, setInProgress] = useState<DecisionProps[]>([]);
  const [notStarted, setNotStarted] = useState<DecisionProps[]>([]);
  const [isInProgressLoading, setIsInProgressLoading] = useState(false);
  const [isNotStartedLoading, setIsNotStartedLoading] = useState(false);
  const [uniqueNotificationKeys, setUniqueNotificationKeys] = useState<
    string[]
  >([]);
  const [clickedKeys, setClickedKeys] = useState<string[]>([]);
  const isWeb = Platform.OS === "web";
  const loadKeys = async () => {
    const uniqueNotifs = isWeb
      ? localStorage.getItem("uniqueNotificationKeys")
      : await AsyncStorage.getItem("uniqueNotificationKeys");
    setUniqueNotificationKeys(() => {
      if (uniqueNotifs && uniqueNotifs !== JSON.stringify(null))
        return JSON.parse(uniqueNotifs);
      else return [];
    });
    const clickedKeys = isWeb
      ? localStorage.getItem("clickedKeys")
      : await AsyncStorage.getItem("clickedKeys");
    setUniqueNotificationKeys(() => {
      if (clickedKeys && clickedKeys !== JSON.stringify(null))
        return JSON.parse(clickedKeys);
      else return [];
    });
  };
  useEffect(() => {
    loadKeys();
  }, []);

  useEffect(() => {
    setIsInProgressLoading(true);
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=in%20progress`)
      .then(({ data }) => {
        setInProgress(data);
        setIsInProgressLoading(false);
      })
      .catch((err) => {
        setIsInProgressLoading(false);
        console.log(err);
      });
  }, [user]);
  useEffect(() => {
    setIsNotStartedLoading(true);
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=not%20started`)
      .then(({ data }) => {
        setNotStarted(data);
        setIsNotStartedLoading(false);
      })
      .catch((err) => {
        setIsNotStartedLoading(false);
        console.log(err);
      });
  }, [user]);
  const youAreCurrentPlayer = inProgress.filter((decision: DecisionProps) => {
    if (user._id && decision?.saveData?.currentPlayer)
      return decision.saveData.currentPlayer === user._id;
    else return false;
  });
  const router = useRouter();
  return isInProgressLoading && isNotStartedLoading ? (
    <Text>loading...</Text>
  ) : (
    <View>
      <MenuOption onSelect={() => {}}>
        <Text style={styles.boldText}>
          You have {inProgress.length} decisions in progress,{" "}
          {youAreCurrentPlayer.length} of which it is your turn:
        </Text>
      </MenuOption>
      {youAreCurrentPlayer.map((decision) => {
        return (
          <MenuOption
            key={decision._id}
            onSelect={() => {
              setIsNotificationDropdownVisible(false);
              router.push({
                pathname: "/Decision",
                params: { decision_id: decision._id },
              });
            }}
          >
            <Text>
              It is your turn to make a decision with group{" "}
              {decision?.group?.name} on list {decision?.list?.title}
            </Text>
          </MenuOption>
        );
      })}
      <MenuOption onSelect={() => {}}>
        <Text style={styles.boldText}>
          You have {notStarted.length} decisions which have not started yet:
        </Text>
      </MenuOption>
      {notStarted.map((decision) => {
        return (
          <MenuOption
            key={decision._id}
            onSelect={() => {
              setIsNotificationDropdownVisible(false);
              router.push({
                pathname: "/Decision",
                params: { decision_id: decision._id },
              });
            }}
          >
            <Text>
              Click here to start the decision with group{" "}
              {decision?.group?.name} with list {decision?.list?.title}
            </Text>
          </MenuOption>
        );
      })}
      {activity.length ? (
        <MenuOption onSelect={() => {}}>
          <Text style={styles.boldText}>Activity:</Text>
        </MenuOption>
      ) : null}
      {Object.keys(activityKeyLookup).map((key, index) => {
        if (!clickedKeys.includes(key) && /^id/.test(key))
          return (
            <MenuOption
              key={index}
              onSelect={async () => {
                setIsNotificationDropdownVisible(false);
                setIsBellRed(false);
                if (isWeb)
                  localStorage.setItem(
                    "clickedKeys",
                    JSON.stringify([...clickedKeys, key])
                  );
                else
                  await AsyncStorage.setItem(
                    "clickedKeys",
                    JSON.stringify([...clickedKeys, key])
                  );
                setClickedKeys((clickedKeys) => {
                  return [...clickedKeys, key];
                });
                if (/created a new group/i.test(activityKeyLookup[key].msg)) {
                  router.push("/Groups");
                } else if (
                  /turn/i.test(activityKeyLookup[key].msg) ||
                  /decision/i.test(activityKeyLookup[key].msg)
                ) {
                  router.push({
                    pathname: "/Decision",
                    params: { decision_id: activityKeyLookup[key].decision_id },
                  });
                }
              }}
            >
              <Text style={{ color: "#FF2370" }}>
                {activityKeyLookup[key].msg}
              </Text>
            </MenuOption>
          );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  boldText: {
    fontWeight: "bold",
  },
});
