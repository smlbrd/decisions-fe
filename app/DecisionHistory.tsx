import DecisionCard from "@/components/DecisionCard";
import Header from "@/components/Header";
import Overlay from "@/components/Overlay";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import apiClient from "@/utils/api-client";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

type Decision = {
  _id: string;
  list: List;
  group: Group;
  votingStatus: "not started" | "in progress" | "completed";
  decisionsProcess_id: string;
  outcome?: Option;
  createdAt: string;
  completedAt?: string;
};

export default function DecisionHistory() {
  const router = useRouter();
  const { user } = useUser();
  const { colours } = useTheme();

  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailErrMsg, setDetailErrMsg] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(
    null
  );
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setErrMsg("");

    if (!user._id) {
      setErrMsg("Please log in to view your decision history");
      setIsLoading(false);
      return;
    }

    apiClient
      .get(`/users/${user._id}/decisions?votingStatus=completed`)
      .then(({ data }) => {
        setDecisions(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setErrMsg("Error loading decisions");
        setIsLoading(false);
      });
  }, [user]);

  // const handleDecisionPress = (decisionId: string) => {
  //   setDetailErrMsg("");
  //   setIsLoadingDetail(true);
  //   setIsDetailModalVisible(true);

  //   apiClient
  //     .get(`/decisions/${decisionId}`)
  //     .then(({ data }) => {
  //       setSelectedDecision(data);
  //       setIsLoadingDetail(false);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setDetailErrMsg("Error loading decision details");
  //       setIsLoadingDetail(false);
  //     });
  // };

  const handleDecisionPress = (decisionId: string) => {
    router.push({
      pathname: "/Decision",
      params: { decision_id: decisionId },
    });
  };

  const handleDetailModalClose = () => {
    setIsDetailModalVisible(false);
    setSelectedDecision(null);
  };

  const renderDecisions = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colours.text.primary} />;
    }

    if (errMsg) {
      return <Text style={styles.errorText}>{errMsg}</Text>;
    }

    if (!decisions.length) {
      return (
        <Text style={[styles.noDecisionsText, { color: colours.text.primary }]}>
          No completed decisions found
        </Text>
      );
    }

    return decisions.map((decision) => (
      <DecisionCard
        key={decision._id}
        id={decision._id}
        list={decision.list}
        group={decision.group}
        votingStatus={decision.votingStatus}
        createdAt={decision.createdAt}
        outcome={decision.outcome}
        onPress={() => handleDecisionPress(decision._id)}
      />
    ));
  };
  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Header />
      {/* <Overlay
        isVisible={isDetailModalVisible}
        onClose={handleDetailModalClose}
        scrollable={true}
      >
        <View>
          {isLoadingDetail ? (
            <ActivityIndicator size="large" color={colours.text.primary} />
          ) : detailErrMsg ? (
            <Text style={styles.errorText}>{detailErrMsg}</Text>
          ) : selectedDecision ? (
            <View>
              <Text
                style={[styles.modalTitle, { color: colours.text.primary }]}
              >
                {selectedDecision.list.title}
              </Text>
              <Text
                style={[styles.modalField, { color: colours.text.primary }]}
              >
                Group: {selectedDecision.group.name}
              </Text>
              {selectedDecision.outcome && (
                <View style={styles.outcomeContainer}>
                  <Text
                    style={[
                      styles.modalSubtitle,
                      { color: colours.text.primary },
                    ]}
                  >
                    Final Decision
                  </Text>
                  <Text
                    style={[styles.modalField, { color: colours.text.primary }]}
                  >
                    {selectedDecision.outcome.name}
                  </Text>
                  {selectedDecision.outcome.description && (
                    <Text
                      style={[
                        styles.modalField,
                        { color: colours.text.primary },
                      ]}
                    >
                      {selectedDecision.outcome.description}
                    </Text>
                  )}
                  {selectedDecision.outcome.image_url && (
                    <Image
                      source={{ uri: selectedDecision.outcome.image_url }}
                      style={styles.image}
                    />
                  )}
                </View>
              )}
              <View style={styles.footer}>
                <View style={styles.dateContainer}>
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={colours.text.primary}
                  />
                  <Text
                    style={[styles.dateText, { color: colours.text.primary }]}
                  >
                    {new Date(
                      selectedDecision.createdAt || ""
                    ).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Overlay> */}

      <ScrollView>
        <View style={styles.decisionsContainer}>
          <Text style={[styles.headerText, { color: colours.text.primary }]}>
            Decision History
          </Text>
          {renderDecisions()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  decisionsContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 15,
  },
  errorText: {
    color: "#FE141D",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  noDecisionsText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    marginHorizontal: 30,
  },
  modalSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  modalField: {
    marginVertical: 10,
  },
  outcomeContainer: {
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
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
});
