import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import React, { useState } from "react";
import { StyleSheet, Button, Pressable, Text } from "react-native";
import sendPushNotification, {capitalizeFirstLetter} from "@/components/Utilities";
import { useUserReceiver } from "@/contexts/UserReceiverContext";
import { TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

export default function HowMuchDoYouMissMe() {
  const { actualUser, otherPushToken } = useUserReceiver();
  const [text, setText] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="message.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sende deiner Maus einen Text :D</ThemedText>
      </ThemedView>
      <TextInput onChangeText={setText}></TextInput>
      <Pressable
        onPress={() => {
          // Direkt deaktivieren
          setButtonDisabled(false);

          // Nach 500ms wieder aktivieren
          setTimeout(() => {
            setButtonDisabled(true);
          }, 500);
          console.log("Sending push to:", otherPushToken);
          sendPushNotification(otherPushToken, {
            title: `${capitalizeFirstLetter(actualUser)} sent you a text`,
            body: text,
            data: { nix: "nix" },
          });
        }}
      >
        {!buttonDisabled && (
          <LinearGradient
            colors={["#dea7f3", "#ff99c0"]} // Innen -> Außen Farbverlauf
            start={{ x: 0.5, y: 0.5 }} // Zentrum des Gradients
            end={{ x: 1, y: 1 }} // Richtung nach außen
            style={styles.mausyouButton}
          >
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              🎉 Sent Text :D 🎉{" "}
            </Text>
          </LinearGradient>
        )}
        {buttonDisabled && (
          <LinearGradient
            colors={["#d1d1d1", "#c4c4c4"]} // Innen -> Außen Farbverlauf
            start={{ x: 0.5, y: 0.5 }} // Zentrum des Gradients
            end={{ x: 1, y: 1 }} // Richtung nach außen
            style={styles.mausyouButton}
          >
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Send Text! 🐁
            </Text>
          </LinearGradient>
        )}
      </Pressable>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mausyouButton: {
    height: 80,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#fc0cf0",
  },
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5e2a84",
  },
});
