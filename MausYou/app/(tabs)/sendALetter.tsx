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
import MausButton from "@/components/MausButton";

export default function HowMuchDoYouMissMe() {
  const { actualUser, otherPushToken } = useUserReceiver();
  const [text, setText] = useState("");

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
      <TextInput onChangeText={setText} value={text}></TextInput>
      
      <MausButton text="Send text 🐁" pressFunction={() => 
        sendPushNotification(otherPushToken, {
            title: `${capitalizeFirstLetter(actualUser)} sent you a text`,
            body: text,
            data: { nix: "nix" },
        })} />


    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
