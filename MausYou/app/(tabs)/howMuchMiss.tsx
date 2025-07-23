import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Slider from "@react-native-community/slider";
import sendPushNotification from '@/components/utilities';
import { ExpoPushMessage } from '@/components/Models';

export default function HowMuchDoYouMissMe() {
  const [value, setValue] = useState(0.5);

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
        // thumbTintColor="transparent" // Wir wollen nur das Emoji zeigen
        value={value}
        onValueChange={setValue}
      />

      <Button title='send' onPress={() => {
        const message: ExpoPushMessage = {
          title: 'Hallo!',
          body: getMoodText(),
          data: { exactMissValue: value },
        };
        sendPushNotification(
          'ExponentPushToken[vC7RjHAj1jIJOcNul9I9tz]',
          message
        );
      }}/>

      {/* Emoji als Thumb */}
      {/* <View style={[styles.thumb, { left: `${value * 100}%` }]}>
        <Text style={{ fontSize: 30 }}>{getEmoji()}</Text>
      </View> */}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
