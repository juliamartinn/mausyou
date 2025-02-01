import { useWindowDimensions, StyleSheet, Image, Platform, Alert } from 'react-native';

// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';

export default function TabTwoScreen() {
  const { width } = useWindowDimensions();
  const [userName, setUsername] = React.useState("Niemand")
  const [mausName, setMausname] = React.useState("Niemand")

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080" 
          name="person.crop.circle.badge.xmark"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Gather your gang</ThemedText>
      </ThemedView>
      <ThemedText>{mausName} ist deine Maus (Stern Platzhalter)</ThemedText>
      <ThemedInput
          placeholder="Gib den Namen deiner Maus ein"
          type="rounded"
          onSubmitEditing={async () => {
            try {
              // real world
              // const response = await fetch("http://185.250.249.46:3000/checkUser");
              // development
              const response = await fetch("http://localhost:3000/mausyou/user_test");
              const json = await response.json();
              setMausname(json.name);
            } catch (error) {
              console.error('Network error:', error);  // Detaillierte Fehlerausgabe in der Konsole
              setMausname("Network request failed");
            }
          }}          
      />

      <ThemedText>Dein Name (Stern Platzhalter)</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Namen ein"
          type="rounded"
      />
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
});
