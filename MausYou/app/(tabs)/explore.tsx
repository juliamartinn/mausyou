import { useWindowDimensions, StyleSheet, Image, Platform, Alert, Button} from 'react-native';

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
  const [userName, setUsername] = React.useState('')
  const [mausName, setMausname] = React.useState('')


  const handleSaveUser = async () => {
    if (!userName || !mausName) {
      Alert.alert('Fehler', 'Bitte beide Felder ausfüllen!');
      return;
    }

    try {
      const response = await fetch("http://185.250.249.46:3000/mausyou/user_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: userName,
          mausname: mausName
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Fehler! Status: ${response.status}`);
      }

      const json = await response.json();
      Alert.alert('Erfolg', `Benutzer ${json.name} wurde gespeichert!`);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Daten konnten nicht gespeichert werden.');
    }
  };
  
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
        <ThemedText type="title">Ein mausiges Wilkommen! Wir haben dich vermaust!</ThemedText>
      </ThemedView>
      <ThemedText>Hallo {userName}</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Namen ein"
          type="rounded"       
          onChangeText={setUsername}
      />

      <ThemedText>Dein Benutzername</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Benutzernamen ein"
          type="rounded"
          onChangeText={setMausname}
      />

    <Button title="Speichern" onPress={handleSaveUser} />
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
