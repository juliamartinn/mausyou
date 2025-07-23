import { useWindowDimensions, StyleSheet, Image, Platform, Alert, Button} from 'react-native';

// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';
import { useUserReceiver } from '@/contexts/UserReceiverContext';
import { backend_ips, developer_mode } from '@/constants/IPConfig';
import { capitalizeFirstLetter } from '@/components/Utilities';

export default function ConfigPage() {
  const { width } = useWindowDimensions();
  const {actualUser, actualReceiver, yourPushToken, setActualUser, setActualReceiver, setOtherPushtoken} = useUserReceiver();


  const handleSaveUser = async () => {
    if (!actualUser || !actualReceiver) {
      Alert.alert('Fehler', 'Bitte beide Felder ausfüllen!');
      return;
    }

    try {
      // add your push token to library
      const response = await fetch(`http://${developer_mode ? backend_ips.develop : backend_ips.production}:3000/mausyou/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: actualUser,
          expoPushToken: yourPushToken
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Fehler! Status: ${response.status}`);
      }

      const json = await response.json();
      Alert.alert('Erfolg', `Wurde gespeichert!`);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Daten konnten nicht gespeichert werden.');
    }
  };

  const handleSaveReceiver = async () => {
    if (!actualUser || !actualReceiver) {
      Alert.alert('Fehler', 'Bitte beide Felder ausfüllen!');
      return;
    }

    try {
      const response = await fetch(`http://${developer_mode ? backend_ips.develop : backend_ips.production}:3000/mausyou/user/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: actualReceiver,
        })
      });

      if (!response.ok) {
        throw new Error(`User does not exist. Status: ${response.status}`);
      }

      const json = await response.json();
      setOtherPushtoken(json.token)
      Alert.alert('Erfolg', `Maus wurde gespeichert!`);
    } catch (error) {
      Alert.alert('Fehler', 'Benutzer existiert nicht');
      setActualReceiver("")
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
      <ThemedText>Dein Name: {capitalizeFirstLetter(actualUser)}</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Namen ein"
          type="rounded"       
          onChangeText={(name) => setActualUser(name.toLowerCase())}
      />
      <Button title="Speichern" onPress={handleSaveUser} />

      <ThemedText>Deine Maus: {capitalizeFirstLetter(actualReceiver)}</ThemedText>
      <ThemedInput
          placeholder="Gib den Mausnamen ein"
          type="rounded"
          onChangeText={(name) => setActualReceiver(name.toLowerCase())}
      />

    <Button title="Speichern" onPress={handleSaveReceiver} />
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
