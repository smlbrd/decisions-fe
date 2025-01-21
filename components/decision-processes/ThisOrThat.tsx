import { DecisionProps } from "@/utils/props";
import { StyleSheet, Text, View } from "react-native";
import { StartDecisionButton } from "../StartDecisionButton";
import apiClient from "@/utils/api-client";
import { useState } from "react";
import shuffleArray from "../../utils/shuffleArray";
import getTwoRandomElements from "../../utils/getTwoRandomElements";
import { ThisOrThatButton } from "../ThisOrThatButton";
import { useUser } from "@/contexts/UserContext";
import { useSocket } from "@/contexts/SocketContext";

type Props = {
  decisionData: DecisionProps;
  setDecisionData: React.Dispatch<
    React.SetStateAction<DecisionProps | undefined>
  >;
  decisionMsg: string;
};

export default function ThisOrThat({
  decisionData,
  setDecisionData,
  decisionMsg,
}: Props) {
  const socket = useSocket();
  const [isStartingDecision, setIsStartingDecision] = useState(false);
  const [startDecisionErrMsg, setStartDecisionErrMsg] = useState("");
  const { user } = useUser();
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
          currentPlayer: playerOrder[0]._id,
          turnNumber: 1,
          playerOrder,
          remainingOptions,
          currentOptions,
          voteHistory: [],
        },
      })
      .then(({ data }) => {
        setIsStartingDecision(false);
        socket.emit("refresh", {
          room: decisionData._id,
          msg: `${user.name} started the decision`,
        });
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
      decisionData.saveData.currentOptions[flip],
    ];
    const newTurnNumber = decisionData.saveData.turnNumber + 1;
    if (newRemainingOptions.length === 1)
      apiClient
        .put(`decisions/${decisionData._id}`, {
          votingStatus: "completed",
          saveData: {
            ...decisionData.saveData,
            turnNumber: null,
            remainingOptions: null,
            currentOptions: null,
            voteHistory: newVoteHistory,
          },
          outcome: newRemainingOptions[0]._id,
        })
        .then(({ data }) => {
          console.log(data);
          // Emit to the server with the room ID and message
          socket.emit("refresh", {
            room: decisionData._id,
            msg: `${user.name} made the final decision`,
          });
          setDecisionData({ ...data, outcome: newRemainingOptions[0] });
        })
        .catch((err) => {
          console.log(err);
        });
    else {
      const newCurrentOptions = getTwoRandomElements(newRemainingOptions);
      apiClient
        .put(`decisions/${decisionData._id}`, {
          saveData: {
            ...decisionData.saveData,
            currentPlayer:
              decisionData.saveData.playerOrder[
                (decisionData.saveData.turnNumber - 1) %
                  decisionData.saveData.playerOrder.length
              ]._id,
            turnNumber: newTurnNumber,
            remainingOptions: newRemainingOptions,
            currentOptions: newCurrentOptions,
            voteHistory: newVoteHistory,
          },
        })
        .then(({ data }) => {
          socket.emit("refresh", {
            room: decisionData._id,
            msg: `${user.name} made a decision`,
          });
          setDecisionData({ ...data });
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
          {decisionData.saveData.playerOrder[
            (decisionData.saveData.turnNumber - 1) %
              decisionData.saveData.playerOrder.length
          ]._id === user._id ? (
            <Text>Your turn</Text>
          ) : (
            <Text>
              {decisionData.saveData.playerOrder[
                (decisionData.saveData.turnNumber - 1) %
                  decisionData.saveData.playerOrder.length
              ].name + "'s turn"}
            </Text>
          )}
          <Text>Turn number: {decisionData.saveData.turnNumber}</Text>
          <Text>
            Remaining options: {decisionData.saveData.remainingOptions.length}
          </Text>
          {decisionData.saveData.playerOrder[
            (decisionData.saveData.turnNumber - 1) %
              decisionData.saveData.playerOrder.length
          ]._id === user._id ? (
            <View>
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
          ) : (
            <View>
              <ThisOrThatButton
                onPress={() => {}}
                thisOrThat={0}
                text={decisionData.saveData.currentOptions[0].name}
                image_url={decisionData.saveData.currentOptions[0].image_url}
              />
              <ThisOrThatButton
                onPress={() => {}}
                thisOrThat={1}
                text={decisionData.saveData.currentOptions[1].name}
                image_url={decisionData.saveData.currentOptions[1].image_url}
              />
            </View>
          )}
          <Text>{decisionMsg}</Text>
          {console.log(decisionData.saveData)}
        </View>
      ) : decisionData.votingStatus === "completed" ? (
        <View>
          <Text>AND THE DECISION WAS.........</Text>
          <Text>{decisionData.outcome?.name}</Text>
          {decisionData.saveData.voteHistory.map((option, index) => {
            return (
              <Text key={index}>
                turn {index + 1}: {option.name} was eliminated by{" "}
                {
                  decisionData.saveData.playerOrder[
                    index % decisionData.saveData.playerOrder.length
                  ].name
                }
              </Text>
            );
          })}
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
