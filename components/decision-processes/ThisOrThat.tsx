import { useState } from "react";
import { Platform, StyleSheet, Text, View, ScrollView } from "react-native";
import apiClient from "@/utils/api-client";
import getTwoRandomElements from "../../utils/getTwoRandomElements";
import { DecisionProps } from "@/utils/props";
import shuffleArray from "../../utils/shuffleArray";
import { StartDecisionButton } from "../StartDecisionButton";
import { ThisOrThatButton } from "../ThisOrThatButton";
import { useSocket } from "@/contexts/SocketContext";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { user } = useUser();
  const { colours } = useTheme();
  const socket = useSocket();

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
                decisionData.saveData.turnNumber %
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
    <Text style={{ color: colours.text.primary }}>Starting decision...</Text>
  ) : startDecisionErrMsg ? (
    <Text style={{ color: colours.text.error }}>{startDecisionErrMsg}</Text>
  ) : (
    <View style={styles.container}>
      {decisionData.votingStatus === "not started" ? (
        <View style={styles.startDecisionContainer}>
          <StartDecisionButton onPress={handleStartDecision} text="Start" />
        </View>
      ) : decisionData.votingStatus === "in progress" ? (
        <View style={[styles.decisionProcessContainer]}>
          <Text style={[styles.turnText, { color: colours.text.primary }]}>
            Turn {decisionData.saveData.turnNumber}
          </Text>
          {decisionData.saveData.playerOrder[
            (decisionData.saveData.turnNumber - 1) %
              decisionData.saveData.playerOrder.length
          ]._id === user._id ? (
            <Text style={[styles.statsText, { color: colours.text.primary }]}>
              It's your turn!
            </Text>
          ) : (
            <Text
              style={[styles.playerTurnText, { color: colours.text.primary }]}
            >
              It's{" "}
              {decisionData.saveData.playerOrder[
                (decisionData.saveData.turnNumber - 1) %
                  decisionData.saveData.playerOrder.length
              ].name + "'s turn"}
            </Text>
          )}

          <Text style={[styles.statsText, { color: colours.text.primary }]}>
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
          <Text style={[styles.statsText, { color: colours.text.primary }]}>
            {decisionMsg}
          </Text>
        </View>
      ) : decisionData.votingStatus === "completed" ? (
        <ScrollView>
          <View
            style={[
              styles.decisionProcessContainer,
              styles.scrollContainer,
              { backgroundColor: colours.background },
            ]}
          >
            <Text style={[styles.statsText, { color: colours.text.primary }]}>
              You decided...
            </Text>
            <Text style={[styles.outcomeText, { color: colours.text.primary }]}>
              {decisionData.outcome?.name}
            </Text>
            {decisionData.saveData.voteHistory.map((option, index) => {
              return (
                <View
                  key={index}
                  style={[
                    styles.decisionHistoryContainer,
                    { backgroundColor: colours.surface.primary },
                  ]}
                >
                  <Text
                    style={[styles.turnText, { color: colours.text.primary }]}
                  >
                    Turn {index + 1}:
                  </Text>
                  <Text
                    style={[styles.statsText, { color: colours.text.primary }]}
                  >
                    {option.name} was eliminated by{" "}
                    {
                      decisionData.saveData.playerOrder[
                        index % decisionData.saveData.playerOrder.length
                      ].name
                    }
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
  container: {
    flex: 1,
    marginVertical: "10%",
  },
  outcomeText: {
    fontSize: 50,
    marginBottom: 5,
    fontWeight: "bold",
    color: Platform.select({
      ios: "#ffffff",
      android: "#f0f0f0",
      default: "#ffffff",
    }),
  },
  decisionProcessContainer: {
    width: "100%",
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    ...Platform.select({
      ios: {
        paddingVertical: 0,
        marginTop: 0,
      },
    }),
  },
  decisionHistoryContainer: {
    width: "100%",
    marginTop: 10,
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  statsText: {
    fontSize: 16,
  },
  turnText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  playerTurnText: {
    fontSize: 30,
    fontWeight: "bold",
    paddingVertical: "5%",
  },
  startDecisionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
    paddingHorizontal: 15,
  },
});
