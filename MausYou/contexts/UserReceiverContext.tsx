// contexts/PhaseContext.tsx
import { registerForPushNotificationsAsync } from '@/components/Utilities';
import { STORAGE_KEY_OTHER_PUSHTOKEN, STORAGE_KEY_RECEIVER, STORAGE_KEY_USER } from '@/constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import * as Notifications from "expo-notifications";


type UserReceiverContextType = {
  actualUser: string;
  actualReceiver: string;
  yourPushToken: string;
  otherPushToken: string;
  setActualUser: (user: string) => void;
  setActualReceiver: (receiver: string) => void;
  setYourPushtoken: (receiver: string) => void;
  setOtherPushtoken: (receiver: string) => void;
};

const UserReceiverContext = createContext<UserReceiverContextType | undefined>(undefined);

export const UserReceiverProvider = ({ children }: { children: ReactNode }) => {
  const [actualUser, setActualUser] = useState("julia");
  const [actualReceiver, setActualReceiver] = useState("mattes");
  const [yourPushToken, setYourPushtoken] = useState("");
  const [otherPushToken, setOtherPushtoken] = useState("ExponentPushToken[zsa0JAHLAaLOsrVCR6Tf3W]");

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
      registerForPushNotificationsAsync()
        .then((token) => setYourPushtoken(token ?? ""))
        .catch((error: any) => setYourPushtoken(`${error}`));

      return () => {
      };
    }, []);

  useEffect(() => {
    const loadUserConfig = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);
        const storedReceiver = await AsyncStorage.getItem(STORAGE_KEY_RECEIVER);
        const storedOtherPushToken = await AsyncStorage.getItem(STORAGE_KEY_OTHER_PUSHTOKEN);
        if (storedUser) {
          setActualUser(storedUser);
        } else {
          // Falls noch nichts gespeichert: Defaultwert sichern
          await AsyncStorage.setItem(STORAGE_KEY_USER, actualUser);
        }
        if (storedReceiver) {
          setActualReceiver(storedReceiver);
        } else {
          // Falls noch nichts gespeichert: Defaultwert sichern
          await AsyncStorage.setItem(STORAGE_KEY_RECEIVER, actualUser);
        }
        if (storedOtherPushToken) {
          setOtherPushtoken(storedOtherPushToken);
        } else {
          // Falls noch nichts gespeichert: Defaultwert sichern
          await AsyncStorage.setItem(STORAGE_KEY_OTHER_PUSHTOKEN, otherPushToken);
        }
      } catch (err) {
        console.error('Fehler beim Laden der Benutzerconfig:', err);
      } 
    };
    
    loadUserConfig();
  }, []);

  return (
    <UserReceiverContext.Provider value={{ 
      actualUser, actualReceiver, yourPushToken, otherPushToken, 
      setActualUser, setActualReceiver, setYourPushtoken, setOtherPushtoken 
    }}>
      {children}
    </UserReceiverContext.Provider>
  );
};

export const useUserReceiver = () => {
  const context = useContext(UserReceiverContext);
  if (!context) {
    throw new Error('usePhase must be used within a PhaseProvider');
  }
  return context;
};
