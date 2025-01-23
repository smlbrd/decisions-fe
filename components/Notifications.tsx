import { View, Text, StyleSheet } from "react-native";
import { MenuOption } from "./DropdownMenu";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { useEffect, useState } from "react";
import apiClient from "@/utils/api-client";
import { DecisionProps } from "@/utils/props";

type activityProps = {
  msg: string;
  decision_id?: string;
};

type Props = {
  setIsNotificationDropdownVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  activity: activityProps[];
  setIsBellRed: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Notifications({
  setIsNotificationDropdownVisible,
  activity,
  setIsBellRed,
}: Props) {
  const { user } = useUser();
  const [inProgress, setInProgress] = useState<DecisionProps[]>([]);
  const [notStarted, setNotStarted] = useState<DecisionProps[]>([]);
  const [isInProgressLoading, setIsInProgressLoading] = useState(false);
  const [isNotStartedLoading, setIsNotStartedLoading] = useState(false);

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
      {activity.map((notification, index) => {
        if (index % 2 === 0)
          return (
            <MenuOption
              key={index}
              onSelect={() => {
                setIsNotificationDropdownVisible(false);
                setIsBellRed(false);
                if (/created a new group/i.test(notification.msg)) {
                  router.push("/Groups");
                } else if (
                  /turn/i.test(notification.msg) ||
                  /decision/i.test(notification.msg)
                ) {
                  router.push({
                    pathname: "/Decision",
                    params: { decision_id: notification.decision_id },
                  });
                }
              }}
            >
              <Text style={{ color: "#FF2370" }}>{notification.msg}</Text>
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
