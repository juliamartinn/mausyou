import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import Slider from "@react-native-community/slider";
import sendPushNotification, { capitalizeFirstLetter } from '@/components/Utilities';
import { ExpoPushMessage } from '@/components/Models';
import { useUserReceiver } from '@/contexts/UserReceiverContext';
import { LinearGradient } from 'expo-linear-gradient';
import MausButton from '@/components/MausButton';

export default function HowMuchDoYouMissMe() {
  const [value, setValue] = useState(0.5);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const {actualUser, otherPushToken} = useUserReceiver();

  const getEmoji = () => {
    if (value < 0.33) return "😀";
    if (value < 0.66) return "😐";
    return "😭";
  };

  const getMoodText = () => {
    if (value < 0.33) return "Its okay";
    if (value < 0.66) return "Ich vermiss Maus";
    return "Ich vermisse Maus seeehr :(";
  };

  const getSentMoodText = () => {
    if (value < 0.33) return "Aber ist okay...";
    if (value < 0.66) return "sehr :(";
    return "Ich vermisse dich sooooo ahhhhhhhhh :(";
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080" 
          name="umbrella.fill"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Wie sehr vermisst du deine Maus gerade?</ThemedText>
      </ThemedView>
      {/* Emoji-Anzeige */}
      <Text style={styles.emoji}>{getEmoji()}</Text>
      <Text style={styles.moodText}>{getMoodText()}</Text>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        step={0.01}
        minimumTrackTintColor="#9b59b6" // Lila
        maximumTrackTintColor="#e0d4f7"
        value={value}
        onValueChange={setValue}
      />

      <MausButton text="Send miss 🐁" pressFunction={() => {
        const message: ExpoPushMessage = {
          title: `${capitalizeFirstLetter(actualUser)} vermisst dich :/`,
          body: getSentMoodText(),
          data: { exactMissValue: value },
        };
        sendPushNotification(
          otherPushToken,
          message
        );
      }}/>

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
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#5e2a84",
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  moodText: {
    fontSize: 20,
    marginBottom: 30,
    color: "#5e2a84",
  },
  slider: {
    width: "90%",
    height: 40,
    borderRadius: 20,
  },
  thumb: {
    position: "absolute",
    bottom: 45,
    transform: [{ translateX: -15 }], // damit es mittig ist
  },
});
