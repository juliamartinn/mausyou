import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  Button,
  Platform,
  TouchableHighlight,
  Pressable,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Image, StyleSheet, Alert } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { FlyingImage } from "../../components/heart_animation";

interface ImageData {
  id: number;
  x: number;
  y: number;
}

interface TapEvent {
  nativeEvent: {
    x: number;
    y: number;
  };
}

Notifications.setNotificationHandler({
  handleNotification: async () => (
    console.log("Notification received"),
    {
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
  }
  ),
  handleSuccess: async () => {
    console.log("Success");
  },
  handleError: async () => {
    console.log("Error");
  },
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: "token", // Julias token
    sound: "default",
    title: "Bescheid geben wenn du das siehst",
    body: "Falls du das siehst, funktioniert senden von app zu app!",
    data: { someData: "goes here" },
    channelId: "default",
  };

  // await fetch('https://exp.host/--/api/v2/push/send', {
  //   method: 'POST',
  //   headers: {
  //     Accept: 'application/json',
  //     'Accept-encoding': 'gzip, deflate',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(message),
  // });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("myChannel", {
      name: "myChannel",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [images, setImages] = useState<{ id: number; x: number; y: number }[]>(
    []
  );
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const viewPos = useRef<View>(null)
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();
  const [viewPosition, setViewPosition] = useState({ x: 0, y: 0 });

  const handleLayout = (event: any) => {
    const { x, y } = event.nativeEvent.layout;
    setViewPosition({ x, y });
  };

  const handleTap = (event: TapEvent): void => {
    const { x, y } = event.nativeEvent;
  
    const newImages = Array.from({ length: 30 }, (_, i) => ({ id: i, x, y }));
    setImages(newImages);
    setIsButtonDisabled(true);
  
    setTimeout(() => {
      setIsButtonDisabled(false);
    }, 6000);
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("notification" + notification);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("response" + response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        width: "100%",
      }}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/mausis.png")}
            style={{ width: 500, height: 300 }}
          />
        }
      >
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Ahoi Bubu!</ThemedText>
          <HelloWave />
        </ThemedView>
      </ParallaxScrollView>
      <Pressable
        ref={viewPos}
        onLayout={handleLayout}
        onPress={async (event) => {
          if (!isButtonDisabled) {
            const pos: TapEvent = {
              nativeEvent: {
                x: event.nativeEvent.locationX + viewPosition.x,
                y: event.nativeEvent.locationY + viewPosition.y,
              },
            };
            handleTap(pos);
            await sendPushNotification(expoPushToken);
          }
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? "rgb(210, 230, 255)" : "white",
          },
          styles.mausyouButtonContainer,
        ]}
      >
        {isButtonDisabled && (
          <LinearGradient
            colors={["#dea7f3", "#ff99c0"]} // Innen -> Außen Farbverlauf
            start={{ x: 0.5, y: 0.5 }} // Zentrum des Gradients
            end={{ x: 1, y: 1 }} // Richtung nach außen
            style={styles.mausyouButton}
          >
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              🎉 Happy Birthday 🎉{" "}
            </Text>
          </LinearGradient>
        )}
        {!isButtonDisabled && (
          <LinearGradient
            colors={["#d1d1d1", "#c4c4c4"]} // Innen -> Außen Farbverlauf
            start={{ x: 0.5, y: 0.5 }} // Zentrum des Gradients
            end={{ x: 1, y: 1 }} // Richtung nach außen
            style={styles.mausyouButton}
          >
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Press for love! 🐁
            </Text>
          </LinearGradient>
        )}
      </Pressable>
      {isButtonDisabled && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {images.map(({ id, x, y }) => (
            <FlyingImage 
              key={id} 
              x={x} 
              y={y} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    position: "absolute",
  },
  mausyouButton: {
    height: 80,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#fc0cf0",
  },
  mausyouButtonContainer: {
    borderRadius: 10,
    overflow: "hidden",
    width: "80%",
    height: 80,
    marginBottom: "50%",
  },
});

// export default function HomeScreen() {
//   // const [mausname, setMausname] = useState('');

//   // const sendMissRequest = async () => {
//   //   try {
//   //     const response = await fetch("http://185.250.249.46:3000/mausyou/add_mausyou", {
//   //       method: 'POST',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify({
//   //         requesterId: "2",
//   //         requestedId: "1",
//   //       }),
//   //     });

//   //     if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//   //     const json = await response.json();
//   //     setMausname(json.name);
//   //     Alert.alert('Erfolgreich!', `MausYou Nachricht gesendet an ${json.name}`);
//   //   } catch (error) {
//   //     console.error('Network error:', error);
//   //     Alert.alert('Fehler!', 'Die Nachricht konnte nicht gesendet werden.');
//   //     setMausname("Network request failed");
//   //   }
//   // };
//
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/mausis.png')}
//           style={{ width: 500, height: 300 }}
//         />
//       }>
//       {/* <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Sende eine MausYou Nachricht!</ThemedText>
//         <HelloWave />
//         <ThemedText>{mausname ? `Gesendet an: ${mausname}` : ''}</ThemedText>
//       </ThemedView>

//       <ThemedView style={styles.stepContainer}>
//         <Button title="MausYou" onPress={sendMissRequest} />
//       </ThemedView> */}
//       <Text>Your Expo push token: {expoPushToken}</Text>
//       <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//         <Text>Title: {notification && notification.request.content.title} </Text>
//         <Text>Body: {notification && notification.request.content.body}</Text>
//         <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//       </View>
//     </ParallaxScrollView>
//   );
// }
