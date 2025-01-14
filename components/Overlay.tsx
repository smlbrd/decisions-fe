import React, { ReactNode } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Overlay = ({ isVisible, onClose, children }: Props) => {
  const isWeb = Platform.OS === "web";
  // a modal essentially brings up an overlay or dialogue on top of the current screen
  // the on request close attribrute stems from the android back button - usually just set this to not visible when pressed
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* The touchable without feedback below is the background which is blurred with expo-blur */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlayContainer}>
          {isWeb ? (
            <View style={styles.webFallbackBackground} />
          ) : (
            <BlurView intensity={50} style={styles.blurBackground} />
          )}
          {/* The touchable without feedback below is the content which is styled by the content container */}
          {/* It is in the centre of the content */}
          <TouchableWithoutFeedback>
            <View style={styles.contentContainer}>{children}</View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  webFallbackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Overlay;
