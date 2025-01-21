import apiClient from "@/utils/api-client";
import { useLocalSearchParams } from "expo-router";
import { DecisionProps } from "../utils/props";
import { useEffect, useState } from "react";
import ThisOrThat from "@/components/decision-processes/ThisOrThat";
import { Text } from "react-native";
import { useSocket } from "@/contexts/SocketContext";

export default function Decision() {
  const socket = useSocket();

  const [refreshKey, setRefreshKey] = useState(0);
  const [decisionMsg, setDecisionMsg] = useState("");

  const { decision_id } = useLocalSearchParams();
  useEffect(() => {
    socket.emit("decision", decision_id);
  }, [decision_id]);

  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const processIds: Record<string, string> = {
    ["6784d7a5844f23ac9810cf50"]: "ThisOrThat",
  };

  const [decisionData, setDecisionData] = useState<DecisionProps | undefined>(
    undefined
  );

  useEffect(() => {
    setErrMsg("");
    if (decision_id) {
      setIsLoading(true);
      apiClient
        .get(`/decisions/${decision_id}`)
        .then(({ data }) => {
          setDecisionData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setErrMsg("error loading decision");
          setIsLoading(false);
        });
    } else {
      setErrMsg("error loading decision");
    }
  }, [decision_id, refreshKey]);

  socket.on("refresh", (msg) => {
    setRefreshKey((key) => key + 1);
    setDecisionMsg(msg);
  });

  if (!decisionData) {
    return null;
  }

  return isLoading ? (
    <Text>"loading decision..."</Text>
  ) : errMsg ? (
    <Text>{errMsg}</Text>
  ) : processIds[decisionData.decisionsProcess_id] === "ThisOrThat" ? (
    <ThisOrThat
      decisionData={decisionData}
      setDecisionData={setDecisionData}
      decisionMsg={decisionMsg}
    />
  ) : (
    <Text>
      Decision process does not exist yet! Come back for future updates
    </Text>
  );
}
