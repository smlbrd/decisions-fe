import { DecisionProps } from "@/utils/props";
import { StyleSheet, Text, View } from "react-native";
import { StartDecisionButton } from "../StartDecisionButton";
import apiClient from "@/utils/api-client";
import { useState } from "react";
import shuffleArray from "../../utils/shuffleArray";
import getTwoRandomElements from "../../utils/getTwoRandomElements";

type Props = {
  decisionData: DecisionProps;
  setDecisionData: React.Dispatch<
    React.SetStateAction<DecisionProps | undefined>
  >;
};

export default function ThisOrThat({ decisionData, setDecisionData }: Props) {
  const [isStartingDecision, setIsStartingDecision] = useState(false);
  const [startDecisionErrMsg, setStartDecisionErrMsg] = useState("");
  const handleStartDecision = () => {
    setIsStartingDecision(true);
    setStartDecisionErrMsg("");
    const remainingOptions =
      decisionData.list === null ? null : decisionData.list.options;
    const playerOrder =
      decisionData.group === null
        ? null
        : shuffleArray(decisionData.group.members);
    const currentOptions = getTwoRandomElements(remainingOptions);
    apiClient
      .put(`decisions/${decisionData._id}`, {
        votingStatus: "in progress",
        saveData: {
          turnNumber: 1,
          playerOrder,
          remainingOptions,
          currentOptions,
          voteHistory: [],
        },
      })
      .then(({ data }) => {
        setIsStartingDecision(false);
        setDecisionData((decisionData) => {
          if (decisionData) return data;
        });
      })
      .catch((err) => {
        setStartDecisionErrMsg("there was an error starting the decision");
        setIsStartingDecision(false);
        console.log(err);
      });
  };
  return isStartingDecision ? (
    <Text>starting decision...</Text>
  ) : startDecisionErrMsg ? (
    <Text>{startDecisionErrMsg}</Text>
  ) : (
    <View style={styles.container}>
      {decisionData.votingStatus === "not started" ? (
        <View style={styles.startDecisionContainer}>
          <StartDecisionButton
            onPress={handleStartDecision}
            text="start decision"
          />
        </View>
      ) : decisionData.votingStatus === "in progress" ? (
        <View style={styles.decisionProcessContainer}>
          <Text>you started the decision!</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  startDecisionContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  decisionProcessContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
});
