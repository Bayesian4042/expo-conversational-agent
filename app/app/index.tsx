import { generateUUID } from "@/lib/utils";
import { Stack } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, type TextInput, ScrollView, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetch as expoFetch } from 'expo/fetch';
import { useChat } from "@ai-sdk/react";
import type { ScrollView as GHScrollView } from "react-native-gesture-handler";
import { useStore } from "@/lib/globalStore";
import { DefaultChatTransport } from 'ai';
import Animated, { FadeIn } from "react-native-reanimated";
import { ChatInterface } from "@/components/chat-interface";
import { ChatInput } from "@/components/ui/chat-input";

const HomePage = () => {
  const {
    clearImageUris,
    setBottomChatHeightHandler,
    chatId,
    setChatId,
  } = useStore();
  const inputRef = useRef<TextInput>(null);
  const [input, setInput] = useState('');

  // Initialize chatId if not set
  useEffect(() => {
    if (!chatId) {
      setChatId({ id: generateUUID(), from: "newChat" });
    }
  }, [chatId, setChatId]);

  const {
    messages,
    error,
    sendMessage
  } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: `http://localhost:3000/api/chat`,
    }),
    onFinish: () => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    },
    onError(error) {
      console.log(">> error is", error.message);
    },
  });

  const { bottom } = useSafeAreaInsets();
  const scrollViewRef = useRef<GHScrollView>(null);

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
    <Animated.View
      entering={FadeIn.duration(250)}
      className="flex-1 bg-white dark:bg-black"
      style={{ paddingBottom: bottom }}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          title: "hey",

          headerRight: () => (
            <Pressable disabled={!messages.length} onPress={() => {}}>
              <Text style={{ fontSize: 20, opacity: !messages.length ? 0.3 : 1 }}>+</Text>
            </Pressable>
          ),
        }}
      />
      <ScrollView
        className="container relative mx-auto flex-1 bg-white dark:bg-black"
        ref={scrollViewRef}
      >
        <ChatInterface
          messages={messages.map((message) => ({
            id: message.id,
            role: message.role,
            content: message.parts.map((part) => part.type === 'text' ? part.text : '').join(''),
          }))}
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
        onSubmit={() => {
          if (input.trim()) {
            setBottomChatHeightHandler(true);
            sendMessage({ text: input });
            setInput('');
            clearImageUris();
          }
        }}
      />
    </Animated.View>
  );
};

export default HomePage;
