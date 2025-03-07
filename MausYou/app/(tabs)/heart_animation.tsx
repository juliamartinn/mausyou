import React from "react";
import { Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");
const IMAGE_SRC_1 = require("@/assets/images/purple_heart1.png");
const IMAGE_SRC_2 = require("@/assets/images/purple_heart2.png");
const IMAGE_SRC_3 = require("@/assets/images/purple_heart3.png");

export const FlyingImage = ({ x, y }: { x: number; y: number; }) => {
  const translateX = useSharedValue(x);
  const translateY = useSharedValue(y);
  const scale = useSharedValue(Math.random() * 1.5 + 0.5);

  const finalX = Math.random() * width;
  const finalY = Math.random() * height ;

  const IMAGE_SRC = [IMAGE_SRC_1, IMAGE_SRC_2, IMAGE_SRC_3][Math.floor(Math.random() * 3)];

  const flyingDuration = Math.random() * 1000 + 3000;

  // Start the flying animation
  translateX.value = withTiming(finalX, { duration: flyingDuration, easing: Easing.out(Easing.quad) });
  translateY.value = withTiming(finalY, { duration: flyingDuration, easing: Easing.out(Easing.quad) }, () => {
    // Start the shrinking animation after the flying animation completes
    scale.value = withTiming(0, { duration: 500 }, () => {});
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: 0.8,
  }));

  return <Animated.Image source={IMAGE_SRC} style={[{ width: 50, height: 50, position: "absolute" }, animatedStyle]} />;
};
