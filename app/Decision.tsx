import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import apiClient from "@/utils/api-client";
import { DecisionProps } from "../utils/props";
import ThisOrThat from "@/components/decision-processes/ThisOrThat";
import Header from "@/components/Header";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";

export default function Decision() {
  const socket = useSocket();
  const { colours } = useTheme();

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
    <Text style={{ color: colours.text.primary }}>Loading decision...</Text>
  ) : errMsg ? (
    <Text style={{ color: colours.text.error }}>{errMsg}</Text>
  ) : processIds[decisionData.decisionsProcess_id] === "ThisOrThat" ? (
    <View style={[styles.container, { backgroundColor: colours.primary }]}>
      <Header />
      <View style={styles.content}>
        <ThisOrThat
          decisionData={decisionData}
          setDecisionData={setDecisionData}
          decisionMsg={decisionMsg}
        />
      </View>
    </View>
  ) : (
    <Text style={{ color: colours.text.primary }}>
      Decision process does not exist yet! Come back for future updates
    </Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    ...(Platform.OS === "web" && {
      maxWidth: "100%",
    }),
  },
});
