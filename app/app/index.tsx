import { generateUUID } from "@/lib/utils";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { type TextInput, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch as expoFetch } from 'expo/fetch';
import { useChat } from "@ai-sdk/react";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { useStore } from "@/lib/globalStore";
import { DefaultChatTransport } from 'ai';
import Animated, { FadeIn } from "react-native-reanimated";
import { ChatInterface } from "@/components/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";
import { ElevenLabsProvider } from "@elevenlabs/react-native";
import { VoiceModal } from "@/components/voice-modal";

const HomePage = () => {
  const {
    clearImageUris,
    chatId,
    setChatId,
  } = useStore();
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState('');
  const [isVoiceModalVisible, setIsVoiceModalVisible] = useState(false);
  const scrollViewRef = useRef<GHScrollView>(null);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!chatId) {
      setChatId({ id: generateUUID(), from: "newChat" });
    }
  }, [chatId, setChatId]);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const transport = useMemo(() => new DefaultChatTransport({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: `http://localhost:3001/api/text-agent/`,
  }), []);

  const handleFinish = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
      scrollTimeoutRef.current = null;
    }, 100);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.log(">> error is", error.message);
  }, []);

  const {
    messages,
    error,
    sendMessage
  } = useChat({
    transport,
    onFinish: handleFinish,
    onError: handleError,
  });

  const handleSubmit = useCallback(() => {
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
      clearImageUris();
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [input, sendMessage, clearImageUris]);

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
        className="flex-1 items-center justify-center bg-white dark:bg-black p-4"
      >
        <Text className="text-red-500 text-center">Error: {error.message}</Text>
      </Animated.View>
    );
  }

  return (
    <ElevenLabsProvider>
      <Animated.View
        entering={FadeIn.duration(250)}
        className="flex-1 bg-white dark:bg-black"
        style={{ paddingBottom: bottom }}
      >
        <ScrollView
          className="container relative mx-auto flex-1 bg-white dark:bg-black"
          ref={scrollViewRef}
        >
          <ChatInterface
            messages={transformedMessages}
            scrollViewRef={scrollViewRef}
            isLoading={false}
          />
        </ScrollView>


        <ChatInput
          ref={inputRef}
          scrollViewRef={scrollViewRef}
          input={input}
          onChangeText={setInput}
          focusOnMount={false}
          onVoicePress={handleVoicePress}
          onSubmit={handleSubmit}
        />

        <VoiceModal
          visible={isVoiceModalVisible}
          onClose={handleVoiceClose}
        />
      </Animated.View>
    </ElevenLabsProvider>
  );
};

export default HomePage;
