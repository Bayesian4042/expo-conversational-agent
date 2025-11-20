import React, { useState } from "react";
import {
  View,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { ElevenLabsProvider, useConversation } from "@elevenlabs/react-native";
import type { ConversationStatus, Role } from "@elevenlabs/react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ConversationScreen = () => {
  const [isStarting, setIsStarting] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  const conversation = useConversation({
    onConnect: ({ conversationId }: { conversationId: string }) => {
      console.log("Connected to conversation", conversationId);
      setCurrentConversationId(conversationId);
    },
    onDisconnect: (details) => {
      console.log("Disconnected from conversation", details);
      setCurrentConversationId(null);
    },
    onError: (message: string, context?: Record<string, unknown>) => {
      console.error("Conversation error:", message, context);
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
      console.log(`VAD Score: ${vadScore}`);
    },
    onInterruption: (event) => {
      console.log("Interruption detected:", event);
    },
    onAudio: (base64Audio: string) => {
      console.log(`Audio chunk received: ${base64Audio.length} bytes`);
    },
    onMCPToolCall: (event) => {
      console.log("MCP Tool Call:", event);
    },
    onMCPConnectionStatus: (event) => {
      console.log("MCP Connection Status:", event);
    },
    onAgentToolResponse: (event) => {
      console.log("Agent Tool Response:", event);
    },
    onConversationMetadata: (metadata) => {
      console.log("Conversation Metadata:", metadata);
    },
    onAsrInitiationMetadata: (metadata) => {
      console.log("ASR Metadata:", metadata);
    },
    onAgentChatResponsePart: (part) => {
      console.log("Agent Response Part:", part);
    },
    onUnhandledClientToolCall: (toolCall) => {
      console.warn("Unhandled Client Tool Call:", toolCall);
    },
    onDebug: (data) => {
      console.log("Debug:", data);
    },
  });

  const handleSubmitText = () => {
    if (textInput.trim()) {
      conversation.sendUserMessage(textInput.trim());
      setTextInput("");
      Keyboard.dismiss();
    }
  };

  const startConversation = async () => {
    if (isStarting) return;

    setIsStarting(true);
    try {
      await conversation.startSession({
        agentId: process.env.EXPO_PUBLIC_AGENT_ID,
        userId: "demo-user",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
    } finally {
      setIsStarting(false);
    }
  };

  const endConversation = async () => {
    try {
      await conversation.endSession();
    } catch (error) {
      console.error("Failed to end conversation:", error);
    }
  };

  const toggleMicMute = () => {
    const newMutedState = !isMicMuted;
    setIsMicMuted(newMutedState);
    conversation.setMicMuted(newMutedState);
  };

  const getStatusColor = (status: ConversationStatus): string => {
    switch (status) {
      case "connected":
        return "#10B981";
      case "connecting":
        return "#F59E0B";
      case "disconnected":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  const getStatusText = (status: ConversationStatus): string => {
    return status[0].toUpperCase() + status.slice(1);
  };

  const canStart = conversation.status === "disconnected" && !isStarting;
  const canEnd = conversation.status === "connected";

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View className="flex-1 justify-center items-center bg-background p-5">
        <Text variant="h1" className="mb-2">
          ElevenLabs Voice Agent
        </Text>
        <Text variant="muted" className="mb-8">
          Remember to set the agentId in the code
        </Text>

        <View className="flex-row items-center mb-6">
          <View
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: getStatusColor(conversation.status) }}
          />
          <Text className="text-base font-medium">
            {getStatusText(conversation.status)}
          </Text>
        </View>

        {/* Conversation ID Display */}
        {conversation.status === "connected" && (
          <Card className="mb-4 w-full">
            <CardHeader>
              <CardTitle className="text-xs">Conversation ID</CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="code" className="text-xs">
                {conversation.getId() || currentConversationId || "N/A"}
              </Text>
            </CardContent>
          </Card>
        )}

        {/* Speaking Indicator */}
        {conversation.status === "connected" && (
          <View className="flex-row items-center mb-6">
            <View
              className="w-3 h-3 rounded-full mr-2"
              style={{
                backgroundColor: conversation.isSpeaking ? "#8B5CF6" : "#D1D5DB",
              }}
            />
            <Text
              variant="small"
              style={{
                color: conversation.isSpeaking ? "#8B5CF6" : "#9CA3AF",
              }}
            >
              {conversation.isSpeaking ? "AI Speaking" : "AI Listening"}
            </Text>
          </View>
        )}

        <View className="w-full gap-4">
          <Button
            variant="default"
            size="lg"
            className={!canStart ? "opacity-50" : ""}
            onPress={startConversation}
            disabled={!canStart}
          >
            <Text>
              {isStarting ? "Starting..." : "Start Conversation"}
            </Text>
          </Button>

          <Button
            variant="destructive"
            size="lg"
            className={!canEnd ? "opacity-50" : ""}
            onPress={endConversation}
            disabled={!canEnd}
          >
            <Text>End Conversation</Text>
          </Button>
        </View>

        {/* Microphone Controls */}
        {conversation.status === "connected" && (
          <View className="mt-6 items-center w-full">
            <Button
              variant={isMicMuted ? "destructive" : "default"}
              size="lg"
              onPress={toggleMicMute}
              className="w-full"
            >
              <Text>{isMicMuted ? "Unmute Microphone" : "Mute Microphone"}</Text>
            </Button>
          </View>
        )}

        {/* Feedback Buttons */}
        {conversation.status === "connected" &&
          conversation.canSendFeedback && (
            <Card className="mt-6 w-full">
              <CardHeader>
                <CardTitle className="text-center">How was that response?</CardTitle>
              </CardHeader>
              <CardContent>
                <View className="flex-row gap-4">
                  <Button
                    variant="default"
                    size="lg"
                    className="flex-1"
                    onPress={() => conversation.sendFeedback(true)}
                  >
                    <Text>Like</Text>
                  </Button>
                  <Button
                    variant="destructive"
                    size="lg"
                    className="flex-1"
                    onPress={() => conversation.sendFeedback(false)}
                  >
                    <Text>Dislike</Text>
                  </Button>
                </View>
              </CardContent>
            </Card>
          )}

        {/* Text Input and Messaging */}
        {conversation.status === "connected" && (
          <Card className="mt-6 w-full">
            <CardHeader>
              <CardTitle>Send Text Message</CardTitle>
            </CardHeader>
            <CardContent className="gap-4">
              <Input
                className="min-h-[100px]"
                value={textInput}
                onChangeText={text => {
                  setTextInput(text);
                  // Prevent agent from interrupting while user is typing
                  if (text.length > 0) {
                    conversation.sendUserActivity();
                  }
                }}
                placeholder="Type your message or context..."
                multiline
                onSubmitEditing={handleSubmitText}
                returnKeyType="send"
                blurOnSubmit={true}
              />
              <View className="flex-row gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="flex-1"
                  onPress={handleSubmitText}
                  disabled={!textInput.trim()}
                >
                  <Text>Send Message</Text>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex-1"
                  onPress={() => {
                    if (textInput.trim()) {
                      conversation.sendContextualUpdate(textInput.trim());
                      setTextInput("");
                      Keyboard.dismiss();
                    }
                  }}
                  disabled={!textInput.trim()}
                >
                  <Text>Send Context</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default function App() {
  return (
    <ElevenLabsProvider>
      <ConversationScreen />
    </ElevenLabsProvider>
  );
}