import React, { useState, useRef } from "react";
import {
  View,
  Modal,
  Pressable,
  useColorScheme,
} from "react-native";
import { X, Mic, MicOff } from "lucide-react-native";
import { useConversation } from "@elevenlabs/react-native";
import type { ConversationStatus, Role } from "@elevenlabs/react-native";
import { Text } from "@/components/ui/text";
import LottieView from "lottie-react-native";
import Animated, { 
  FadeIn, 
  FadeOut, 
  SlideInDown, 
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VoiceModal = ({ visible, onClose }: VoiceModalProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  const colorScheme = useColorScheme();
  const { top, bottom } = useSafeAreaInsets();
  const lottieRef = useRef<LottieView>(null);

  const conversation = useConversation({
    onConnect: ({ conversationId }: { conversationId: string }) => {
      console.log("Connected to conversation", conversationId);
      setIsStarting(false);
    },
    onDisconnect: (details) => {
      console.log("Disconnected from conversation", details);
      setIsMicMuted(false);
    },
    onError: (message: string, context?: Record<string, unknown>) => {
      console.error("Conversation error:", message, context);
      setIsStarting(false);
    },
    onMessage: ({
      message,
      source,
    }: {
      message: string;
      source: Role;
    }) => {
      console.log(`Message from ${source}:`, message);
    },
    onModeChange: ({ mode }: { mode: "speaking" | "listening" }) => {
      console.log(`Mode: ${mode}`);
    },
    onStatusChange: ({ status }: { status: ConversationStatus }) => {
      console.log(`Status: ${status}`);
    },
    onCanSendFeedbackChange: ({
      canSendFeedback,
    }: {
      canSendFeedback: boolean;
    }) => {
      console.log(`Can send feedback: ${canSendFeedback}`);
    },
    onVadScore: ({ vadScore }: { vadScore: number }) => {
      const voiceActive = vadScore > 0.5;
      if (voiceActive !== isVoiceDetected) {
        setIsVoiceDetected(voiceActive);
        if (voiceActive) {
          console.log(`Voice detected! VAD Score: ${vadScore}`);
        }
      }
    },
    onDebug: (data) => {
      console.log("Debug:", data);
    },
  });

  const startConversation = async () => {
    if (conversation.status !== "disconnected" || isStarting) return;
    
    setIsStarting(true);
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        userId: "demo-user",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      alert(`Failed to start voice conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsStarting(false);
      onClose();
    }
  };

  const handleClose = async () => {
    try {
      if (conversation.status === "connected" || conversation.status === "connecting") {
        console.log("Ending conversation session...");
        await conversation.endSession();
      }
    } catch (error) {
      console.error("Error ending conversation:", error);
    } finally {
      setIsMicMuted(false);
      setIsStarting(false);
      onClose();
    }
  };

  const toggleMicMute = () => {
    const newMutedState = !isMicMuted;
    setIsMicMuted(newMutedState);
    conversation.setMicMuted(newMutedState);
  };

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent={false}
      onShow={startConversation}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <Animated.View 
        entering={SlideInDown.springify().damping(20).stiffness(90)}
        exiting={SlideOutDown.duration(200)}
        className="flex-1 bg-background"
        style={{ paddingTop: top }}
      >
        <View className="flex-row justify-end px-6 py-4 gap-4">
          <Pressable className="h-10 w-10 items-center justify-center">
            <Text className="text-muted-foreground text-lg">CC</Text>
          </Pressable>
          <Pressable className="h-10 w-10 items-center justify-center">
            <Text className="text-muted-foreground text-2xl">↑</Text>
          </Pressable>
          <Pressable className="h-10 w-10 items-center justify-center">
            <Text className="text-muted-foreground text-2xl">⚙</Text>
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center">
          {conversation.status === "connected" && (
            <>
              <Animated.View
                entering={FadeIn.duration(300)}
                exiting={FadeOut.duration(300)}
                style={{ width: 320, height: 320 }}
              >
                <LottieView
                  ref={lottieRef}
                  source={{
                    uri: "https://lottie.host/7c55a554-ea34-4a37-aac1-ca6759541f4f/9xtxucyk4B.lottie",
                  }}
                  autoPlay
                  loop
                  style={{ width: "100%", height: "100%" }}
                />
              </Animated.View>
              {/* Status Text */}
              <Text className="text-center text-lg mt-8 text-foreground">
                {conversation.isSpeaking
                  ? "AI is speaking..."
                  : isMicMuted 
                  ? "Microphone muted"
                  : "Listening for your voice..."}
              </Text>
              
              {/* Voice Detection Indicator */}
              {isVoiceDetected && !isMicMuted && (
                <Animated.View
                  entering={FadeIn.duration(150)}
                  exiting={FadeOut.duration(150)}
                  className="mt-4 bg-primary px-4 py-2 rounded-full"
                >
                  <Text className="text-primary-foreground font-semibold">🎤 Voice Detected!</Text>
                </Animated.View>
              )}
            </>
          )}

          {conversation.status === "connecting" && (
            <Animated.View
              entering={FadeIn.duration(300)}
              className="items-center justify-center"
            >
              <View className="w-[280px] h-[280px] items-center justify-center">
                <LottieView
                  source={{
                    uri: "https://lottie.host/7c55a554-ea34-4a37-aac1-ca6759541f4f/9xtxucyk4B.lottie",
                  }}
                  autoPlay
                  loop
                  style={{ width: 280, height: 280, opacity: 0.5 }}
                />
              </View>
              <Text className="text-center text-lg mt-6 text-muted-foreground">
                Connecting...
              </Text>
            </Animated.View>
          )}

          {conversation.status === "disconnected" && !isStarting && (
            <Animated.View
              entering={FadeIn.duration(300)}
              className="items-center justify-center"
            >
              <View className="w-[280px] h-[280px] items-center justify-center rounded-full bg-muted">
                <Mic size={80} color="#999" />
              </View>
              <Text className="text-center text-lg mt-6 text-muted-foreground">
                Disconnected
              </Text>
            </Animated.View>
          )}
        </View>

        {/* Bottom Controls */}
        <View 
          className="flex-row items-center justify-between px-8"
          style={{ paddingBottom: Math.max(bottom, 32) }}
        >
          {/* Microphone Button */}
          <Pressable
            onPress={toggleMicMute}
            className="h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
            disabled={conversation.status !== "connected"}
          >
            {isMicMuted ? (
              <MicOff size={28} color={colorScheme === "dark" ? "white" : "black"} />
            ) : (
              <Mic size={28} color={colorScheme === "dark" ? "white" : "black"} />
            )}
          </Pressable>

          {/* Close Button */}
          <Pressable
            onPress={handleClose}
            className="h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
          >
            <X size={28} color={colorScheme === "dark" ? "white" : "black"} />
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
};

