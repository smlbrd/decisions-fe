import { DecisionProps } from "@/utils/props";
import { StyleSheet, Text, View } from "react-native";
import { StartDecisionButton } from "../StartDecisionButton";
import apiClient from "@/utils/api-client";
import { useState } from "react";
import shuffleArray from "../../utils/shuffleArray";
import getTwoRandomElements from "../../utils/getTwoRandomElements";
import { ThisOrThatButton } from "../ThisOrThatButton";

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

  const handleChoice = (thisOrThat: number) => {
    const flip = thisOrThat === 1 ? 0 : 1;
    const newRemainingOptions = decisionData.saveData.remainingOptions.filter(
      (remainingOption) => {
        return (
          remainingOption._id !== decisionData.saveData.currentOptions[flip]._id
        );
      }
    );
    const newVoteHistory = [
      ...decisionData.saveData.voteHistory,
      decisionData.saveData.currentOptions[thisOrThat],
    ];
    const newTurnNumber = decisionData.saveData.turnNumber + 1;
    if (newRemainingOptions.length === 1)
      apiClient
        .put(`decisions/${decisionData._id}`, {
          votingStatus: "completed",
          saveData: {
            turnNumber: null,
            playerOrder: null,
            remainingOptions: newRemainingOptions,
            currentOptions: null,
            voteHistory: newVoteHistory,
          },
          outcome: newRemainingOptions[0],
        })
        .then(({ data }) => {
          console.log(data);
          setDecisionData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    else {
      const newCurrentOptions = getTwoRandomElements(newRemainingOptions);
      apiClient
        .put(`decisions/${decisionData._id}`, {
          saveData: {
            turnNumber: newTurnNumber,
            remainingOptions: newRemainingOptions,
            currentOptions: newCurrentOptions,
            voteHistory: newVoteHistory,
          },
        })
        .then(({ data }) => {
          setDecisionData(data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          <Text>CHOOOOOSE</Text>
          <ThisOrThatButton
            onPress={handleChoice}
            thisOrThat={0}
            text={decisionData.saveData.currentOptions[0].name}
            image_url={decisionData.saveData.currentOptions[0].image_url}
          />
          <ThisOrThatButton
            onPress={handleChoice}
            thisOrThat={1}
            text={decisionData.saveData.currentOptions[1].name}
            image_url={decisionData.saveData.currentOptions[1].image_url}
          />
        </View>
      ) : decisionData.votingStatus === "completed" ? (
        <View>
          <Text>AND YOUR DECISION IS.........</Text>
          <Text>{decisionData.saveData.remainingOptions[0].name}</Text>
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
