import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import apiClient from "@/utils/api-client";
import { MenuOption } from "./DropdownMenu";
import { DecisionProps } from "@/utils/props";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";

type Props = {
  setIsNotificationDropdownVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
};

export default function Notifications({
  setIsNotificationDropdownVisible,
}: Props) {
  const { user } = useUser();
  const { colours } = useTheme();
  const router = useRouter();
  const [inProgress, setInProgress] = useState<DecisionProps[]>([]);
  const [notStarted, setNotStarted] = useState<DecisionProps[]>([]);

  useEffect(() => {
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=in%20progress`)
      .then(({ data }) => {
        setInProgress(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  useEffect(() => {
    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=not%20started`)
      .then(({ data }) => {
        setNotStarted(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [user]);

  const youAreCurrentPlayer = inProgress.filter((decision: DecisionProps) => {
    if (user._id && decision?.saveData?.currentPlayer)
      return decision.saveData.currentPlayer === user._id;
    else return false;
  });

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.notificationItem}>
        {inProgress.length === 0 && notStarted.length === 0 ? (
          <Text>No new messages!</Text>
        ) : null}
      </View>

      <Text style={[styles.notificationHeader, styles.notificationItem]}>
        {youAreCurrentPlayer.length > 0 ? (
          <Text>
            {youAreCurrentPlayer.length} decision
            {inProgress.length > 1 ? "s" : ""} waiting for you:
          </Text>
        ) : null}
      </Text>

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
              - Your turn to decide {decision?.list?.title} with{" "}
              {decision?.group?.name}!
            </Text>
          </MenuOption>
        );
      })}

      <Text style={[styles.notificationHeader, styles.notificationItem]}>
        {notStarted.length > 0 ? (
          <Text>{notStarted.length} decisions waiting to start:</Text>
        ) : null}
      </Text>

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
              - {decision?.group?.name} invited you to decide{" "}
              {decision?.list?.title}
            </Text>
          </MenuOption>
        );
      })}
      {/* I think this next bit is omitted until we can redirect it to a view of ongoing decisions? */}
      {/* <Text style={[styles.notificationItem, { color: colours.text.primary }]}>
        {inProgress.length > 0 ? (
          <Text>
            {inProgress.length} ongoing decision
            {inProgress.length > 1 ? "s" : ""}.
          </Text>
        ) : null}
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  notificationContainer: {
    paddingTop: 0,
    paddingBottom: 10,
  },
  notificationHeader: {
    fontSize: 16,
    fontWeight: "bold",
  },
  notificationItem: {
    margin: 3,
  },
});
