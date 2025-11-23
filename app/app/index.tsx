import { useRef, useState, useCallback, useMemo } from "react";
import { type TextInput, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch as expoFetch } from 'expo/fetch';
import { useChat } from "@ai-sdk/react";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { DefaultChatTransport } from 'ai';
import Animated, { FadeIn } from "react-native-reanimated";
import { ChatInterface } from "@/components/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";
import { VoiceModal } from "@/components/voice-modal";

const HomePage = () => {
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState('');
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const scrollViewRef = useRef<GHScrollView>(null);
  const { bottom, top } = useSafeAreaInsets();

  const {
    messages,
    error,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `http://localhost:3001/api/text-agent/`,
    }),
  });

  const onTextSubmit = () => {
    sendMessage({ text: input })
      .then(() => {
        setInput('');
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
    setInput('');
  }


  const handleVoicePress = useCallback(() => {
    setIsVoiceModalVisible(true);
  }, []);

  const handleVoiceClose = useCallback(() => {
    setIsVoiceModalVisible(false);
  }, []);

  const transformedMessages = useMemo(() => 
    messages.map((message) => ({
      id: message.id,
      role: message.role,
      content: message.parts.map((part) => part.type === 'text' ? part.text : '').join(''),
    })),
  [messages]);

  if (error) {
    return (
      <Animated.View
        entering={FadeIn.duration(250)}
        className="flex-1 items-center justify-center bg-background p-4"
      >
        <Text className="text-destructive text-center">Error: {error.message}</Text>
      </Animated.View>
    );
  }

  return (
      <Animated.View
        entering={FadeIn.duration(250)}
        className="flex-1 bg-background"
        style={{ paddingBottom: bottom, paddingTop: top}}
      >
        <ChatInterface
          messages={transformedMessages}
          scrollViewRef={scrollViewRef}
          isLoading={false}
        />

        <ChatInput
          ref={inputRef}
          scrollViewRef={scrollViewRef}
          input={input}
          onChangeText={setInput}
          focusOnMount={false}
          onVoicePress={handleVoicePress}
          onSubmit={onTextSubmit}
        />

        <VoiceModal
          visible={isVoiceModalVisible}
          onClose={handleVoiceClose}
        />
      </Animated.View>
  );
};

export default HomePage;
