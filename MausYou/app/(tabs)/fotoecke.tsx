import MausButton from '@/components/MausButton';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useUserReceiver } from '@/contexts/UserReceiverContext';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useCallback, useRef, useState } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Brightness from 'expo-brightness';
import { useFocusEffect } from 'expo-router';

export default function Fotoecke() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  
  const { actualUser } = useUserReceiver();

  const DIM = 0.2;
  const [redOpacity, setRedOpacity] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let originalBrightness: number;
      let originalMode: number;
      
      const adjustBrightness = async () => {
        originalMode = await Brightness.getSystemBrightnessModeAsync()
        const { status } = await Brightness.requestPermissionsAsync();
        if (status === "granted") {
          originalBrightness = await Brightness.getSystemBrightnessAsync();
          await smoothDim(originalBrightness, originalBrightness!-DIM, 500);
        }
      };
      
      adjustBrightness();
      
      return () => {
        if (originalBrightness !== undefined) {
            smoothDim(originalBrightness!-DIM, originalBrightness, 500);
          }
        Brightness.setSystemBrightnessModeAsync(originalMode)
      };
    }, [])
  );

  const smoothDim = async (from: number, to: number, durationMs: number) => {
    const steps = 50; // Anzahl der Zwischenschritte
    const stepTime = durationMs / steps;
    const stepSize = (from - to) / steps;
    const opacityStep = 0.6 / steps;

    for (let i = 0; i <= steps; i++) {
      const value = from - stepSize * i;
      const newOpacity = opacityStep * i;
      await Brightness.setBrightnessAsync(Math.max(0, value));
      setRedOpacity(newOpacity);
      await new Promise((resolve) => setTimeout(resolve, stepTime));
    }
  };
  
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

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
        <ThemedText type="title">Fototime</ThemedText>
      </ThemedView>

      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      <MausButton text="📸" pressFunction={takePicture} />
      

       {photoUri && (
        <Image
          source={{ uri: photoUri }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
      <View style={{width:50}}/>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  redFilter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'red',
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  cameraContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  camera: {
    width: '100%',       // z. B. 90% der Bildschirmbreite
    aspectRatio: 1,     // Quadrat
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 10,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
