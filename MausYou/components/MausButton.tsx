import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, StyleSheet } from "react-native";
import { useState } from "react";


type Props = {
  pressFunction: () => void;  // klarer Typ: Funktion ohne Rückgabewert
  text: string;
};

export default function MausButton (parameters : Props) {
    const [buttonDisabled, setButtonDisabled] = useState(true);
    
    
    return <Pressable
        onPress={() => {
          // Direkt deaktivieren
          setButtonDisabled(false);

          // Nach 500ms wieder aktivieren
          setTimeout(() => {
            setButtonDisabled(true);
          }, 500);
          parameters.pressFunction();
        }}
      >
        {!buttonDisabled && (
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
              {parameters.text}
            </Text>
          </LinearGradient>
        )}
        {buttonDisabled && (
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
              {parameters.text}
            </Text>
          </LinearGradient>
        )}
      </Pressable>}


const styles = StyleSheet.create({
    mausyouButton: {
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#fc0cf0",
  },
})