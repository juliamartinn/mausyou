import { useWindowDimensions, StyleSheet, Image, Platform, Alert, Button} from 'react-native';

// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedInput } from '@/components/ThemedInput';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useState } from 'react';
import { useUserReceiver } from '@/contexts/UserReceiverContext';
import { backend_ips, developer_mode } from '@/constants/IPConfig';
import { capitalizeFirstLetter } from '@/components/Utilities';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY_OTHER_PUSHTOKEN, STORAGE_KEY_RECEIVER, STORAGE_KEY_USER } from '@/constants/Constants';
import MausButton from '@/components/MausButton';

export default function ConfigPage() {
  const { width } = useWindowDimensions();
  const {actualUser, actualReceiver, yourPushToken, setActualUser, setActualReceiver, setOtherPushtoken} = useUserReceiver();
  const [confUser, setConfUser] = useState("")
  const [confReceiver, setConfReceiver] = useState("")


  const handleSaveUser = async () => {
    if (!confUser) {
      Alert.alert('Fehler', 'Bitte dein Name eingeben');
      return;
    }

    try {
      // add your push token to library
      const response = await fetch(`http://${developer_mode ? backend_ips.develop : backend_ips.production}:3001/mausyou/user/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: confUser.trim().toLowerCase(),
          expoPushToken: yourPushToken
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP Fehler! Status: ${response.status}`);
      }

      setActualUser(confUser.trim().toLowerCase())
      await AsyncStorage.setItem(STORAGE_KEY_USER, confUser.trim().toLowerCase());
      setConfUser("")
      Alert.alert('Erfolg', `Wurde gespeichert!`);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      Alert.alert('Fehler', 'Daten konnten nicht gespeichert werden.');
    }
  };

  const handleSaveReceiver = async () => {
    if (!confReceiver) {
      Alert.alert('Fehler', 'Bitte den Namen deiner Maus eingeben');
      return;
    }

    try {
      const response = await fetch(`http://${developer_mode ? backend_ips.develop : backend_ips.production}:3001/mausyou/user/get`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: confReceiver.trim().toLowerCase(),
        })
      });

      if (!response.ok) {
        throw new Error(`User does not exist. Status: ${response.status}`);
      }

      const json = await response.json();
      setOtherPushtoken(json.token)
      setActualReceiver(confReceiver.trim().toLowerCase())
      await AsyncStorage.setItem(STORAGE_KEY_RECEIVER, confReceiver.trim().toLowerCase());
      await AsyncStorage.setItem(STORAGE_KEY_OTHER_PUSHTOKEN, json.token);
      setConfReceiver("")
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
        <Image
          source={
            actualUser=="maus" 
              // mattes
              ? require("@/assets/images/found_mattes.png")
              : actualUser=="bubu" 
                // julia
                ? require("@/assets/images/found_julia.jpg")
                // nothing configured
                : require("@/assets/images/still_looking.png") 
            }
          style={{ width: "100%", height: 300 }}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Gib dir einen Namen und finde deine Maus</ThemedText>
      </ThemedView>
      <ThemedText>Dein Name: {capitalizeFirstLetter(actualUser)}</ThemedText>
      <ThemedInput
          placeholder="Gib deinen Namen ein"
          type="rounded"       
          value={confUser}
          onChangeText={(name) => setConfUser(name)}
          />
      <MausButton text="Speichern" pressFunction={handleSaveUser} />

      <ThemedText>Deine Maus: {capitalizeFirstLetter(actualReceiver)}</ThemedText>
      <ThemedInput
          placeholder="Gib den Mausnamen ein"
          value={confReceiver}
          type="rounded"
          onChangeText={(name) => setConfReceiver(name)}
      />

    <MausButton text="Speichern" pressFunction={handleSaveReceiver} />
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
