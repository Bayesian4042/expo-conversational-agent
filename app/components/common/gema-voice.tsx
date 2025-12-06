import React, { useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

interface GemaVoiceProps {
  width?: number;
  height?: number;
}

const GemaVoice = ({ width = 300, height = 300 }: GemaVoiceProps) => {
  const lottieRef = useRef<LottieView>(null);

  return (
    <View style={{ width, height }}>
      <LottieView
        ref={lottieRef}
        source={{
          uri: "https://lottie.host/7c55a554-ea34-4a37-aac1-ca6759541f4f/9xtxucyk4B.lottie",
        }}
        autoPlay
        loop
        style={{ width: "100%", height: "100%" }}
      />
    </View>
  );
};

export default GemaVoice;


