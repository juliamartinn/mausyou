import { Image, StyleSheet, Platform, Button, Alert } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';

// push notifications
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';


export default function HomeScreen() {
  const [mausname, setMausname] = React.useState('');

  const sendMissRequest = async () => {
    try {
      const response = await fetch("http://185.250.249.46:3000/mausyou/add_mausyou", {
        method: 'POST',  
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requesterId: "2",
          requestedId: "1",
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const json = await response.json();
      setMausname(json.name);
      Alert.alert('Erfolgreich!', `MausYou Nachricht gesendet an ${json.name}`);
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Fehler!', 'Die Nachricht konnte nicht gesendet werden.');
      setMausname("Network request failed");
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/mausis.png')}
          style={{ width: 500, height: 300 }}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sende eine MausYou Nachricht!</ThemedText>
        <HelloWave />
        <ThemedText>{mausname ? `Gesendet an: ${mausname}` : ''}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Button title="MausYou" onPress={sendMissRequest} />
      </ThemedView>
    </ParallaxScrollView>
  );
}


const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
