import { useTheme } from "@/contexts/ThemeContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Option = {
  _id: string;
  name: string;
  description?: string;
  image_url?: string;
  customFields: string[];
};

type List = {
  _id: string;
  title: string;
  description?: string;
};

type Group = {
  _id: string;
  name: string;
  description: string;
};

type DecisionCardProps = {
  id: string;
  list: List;
  group: Group;
  votingStatus: "not started" | "in progress" | "completed";
  createdAt: string;
  outcome?: Option;
  onPress: () => void;
};

const DecisionCard = ({
  list,
  group,
  votingStatus,
  createdAt,
  outcome,
  onPress,
}: DecisionCardProps) => {
  const { colours } = useTheme();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!list) {
    return (
      <View style={styles.container}>
        <Text>Unable to locate List...</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, { backgroundColor: colours.surface.primary }]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text
            style={[styles.title, { color: colours.text.primary }]}
            numberOfLines={1}
          >
            {list.title}
          </Text>
          <View
            style={
              votingStatus === "completed"
                ? [styles.statusBadge, { backgroundColor: "#4CAF50" }]
                : votingStatus === "in progress"
                ? [styles.statusBadge, { backgroundColor: "#FF8630" }]
                : [styles.statusBadge, { backgroundColor: "#FF1D1F" }]
            }
          >
            <Text
              style={
                votingStatus === "completed"
                  ? styles.statusCompletedText
                  : votingStatus === "in progress"
                  ? styles.statusInProgressText
                  : styles.statusNotStartedText
              }
            >
              {votingStatus}
            </Text>
          </View>
        </View>

        <Text style={[styles.groupName, { color: colours.text.primary }]}>
          Group: {group.name}
        </Text>

        {outcome && (
          <View style={styles.outcomeContainer}>
            <Text style={[styles.outcomeText, { color: colours.text.primary }]}>
              Decision: {outcome.name}
            </Text>
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colours.text.primary}
            />
            <Text style={[styles.dateText, { color: colours.text.primary }]}>
              {formatDate(createdAt)}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward-outline"
            size={20}
            color={colours.text.primary}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 8,
  },
  groupName: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompletedText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
  statusInProgressText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
  statusNotStartedText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },
  outcomeContainer: {
    marginVertical: 8,
  },
  outcomeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
  },
});

export default DecisionCard;
