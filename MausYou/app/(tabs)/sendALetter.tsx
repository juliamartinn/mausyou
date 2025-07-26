import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React, { useState } from "react";
import { StyleSheet, Image } from "react-native";
import sendPushNotification, {capitalizeFirstLetter} from "@/components/Utilities";
import { useUserReceiver } from "@/contexts/UserReceiverContext";
import { TextInput } from "react-native-paper";
import MausButton from "@/components/MausButton";

export default function HowMuchDoYouMissMe() {
  const { actualUser, otherPushToken } = useUserReceiver();
  const [text, setText] = useState("");

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={
            actualUser=="maus" 
              ? require("@/assets/images/julia_find.jpg")
              : require("@/assets/images/mattes_find.jpg")
            }
          style={{
            width: "100%",   // etwas größer, sodass weniger Zoom-Effekt
            height: "100%",
          }}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sende deiner Maus einen Text :D</ThemedText>
      </ThemedView>
      <TextInput onChangeText={setText} value={text}></TextInput>
      
      <MausButton text="Send text 🐁" pressFunction={() => 
        {
          sendPushNotification(otherPushToken, {
            title: `${capitalizeFirstLetter(actualUser)} sent you a text`,
            body: text,
            data: { nix: "nix" },
          });
          setText("");}
        } />


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
