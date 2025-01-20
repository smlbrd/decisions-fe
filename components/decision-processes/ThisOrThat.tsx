import { DecisionProps } from "@/utils/props";
import { StyleSheet, Text, View } from "react-native";
import { StartDecisionButton } from "../StartDecisionButton";
import apiClient from "@/utils/api-client";

type Props = {
  decisionData: DecisionProps;
  setDecisionData: React.Dispatch<
    React.SetStateAction<DecisionProps | undefined>
  >;
};

export default function ThisOrThat({ decisionData, setDecisionData }: Props) {
  const handleStartDecision = () => {
    apiClient
      .put(`decisions/${decisionData._id}`, {
        votingStatus: "in progress",
      })
      .then(({ data }) => {
        setDecisionData((decisionData) => {
          if (decisionData)
            return { ...decisionData, votingStatus: "in progress" };
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
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
