import apiClient from "@/utils/api-client";
import { useLocalSearchParams } from "expo-router";
import { DecisionProps } from "../utils/props";
import { useEffect, useState } from "react";
import ThisOrThat from "@/components/decision-processes/ThisOrThat";
import { Text } from "react-native";

export default function Decision() {
  const processIds: Record<string, string> = {
    ["6784d7a5844f23ac9810cf50"]: "ThisOrThat",
  };
  const { decision_id } = useLocalSearchParams();

  const [decisionData, setDecisionData] = useState<DecisionProps | undefined>(
    undefined
  );

  useEffect(() => {
    if (decision_id) {
      apiClient
        .get(`/decisions/${decision_id}`)
        .then(({ data }) => {
          setDecisionData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [decision_id]);

  if (!decisionData) {
    return null;
  }

  return processIds[decisionData.decisionsProcess_id] === "ThisOrThat" ? (
    <ThisOrThat />
  ) : (
    <Text>
      Decision process does not exist yet! Come back for future updates
    </Text>
  );
}
