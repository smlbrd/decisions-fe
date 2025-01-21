import React, { ReactNode } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/contexts/ThemeContext";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  isKeyboardAvoiding?: boolean;
  scrollable?: boolean;
};

const Overlay = ({
  isVisible,
  onClose,
  children,
  isKeyboardAvoiding,
  scrollable = false,
}: Props) => {
  const isWeb = Platform.OS === "web";
  const styles = createStyles(useTheme().colours);
  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          if (!isWeb) {
            Keyboard.dismiss();
          }
          onClose();
        }}
      >
        <View style={styles.overlayContainer}>
          {isWeb ? (
            <View style={styles.webFallbackBackground} />
          ) : (
            <BlurView intensity={50} style={styles.blurBackground} />
          )}
          <KeyboardAvoidingView
            style={styles.avoidingView}
            behavior={
              Platform.OS === "ios" && isKeyboardAvoiding
                ? "padding"
                : undefined
            }
          >
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              {scrollable ? (
                <ScrollView
                  contentContainerStyle={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.contentContainer}>{children}</View>
                </ScrollView>
              ) : (
                <View style={styles.contentContainer}>{children}</View>
              )}
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const createStyles = (colours: { primary: string }) =>
  StyleSheet.create({
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
    avoidingView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    contentContainer: {
      width: "80%",
      maxWidth: 400,
      padding: 20,
      backgroundColor: colours.primary,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
  });

export default Overlay;
