import React, { forwardRef, useEffect, useState, useCallback } from "react";
import {
  View,
  type TextInput,
  KeyboardAvoidingView,
  Keyboard,
  useColorScheme,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { ArrowUp, X, Mic } from "lucide-react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useAnimatedKeyboard,
  withSpring,
  FadeIn,
  FadeOut,
  withTiming,
  Layout,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatTextInput } from "./chat-text-input";
import { Image } from "expo-image";
import { useStore } from "@/lib/globalStore";

type Props = {
  input: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  scrollViewRef: React.RefObject<ScrollView>;
  focusOnMount?: boolean;
  onVoicePress?: () => void;
};

interface SelectedImagesProps {
  uris: string[];
  onRemove: (uri: string) => void;
}

interface ImageItemProps {
  uri: string;
  onRemove: (uri: string) => void;
}

const ImageItemComponent = ({ uri, onRemove }: ImageItemProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleRemove = useCallback(() => {
    onRemove(uri);
  }, [uri, onRemove]);

  const handleLoadEnd = useCallback(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  return (
    <Animated.View
      key={uri}
      className="relative"
      entering={FadeIn.delay(150).springify()}
    >
      <View className="relative">
        {isLoading && (
          <Animated.View className="absolute h-[55px] w-[55px] items-center justify-center rounded-md bg-gray-300 dark:bg-gray-600">
            <ActivityIndicator size="small" color="white" />
          </Animated.View>
        )}
        <Image
          source={{ uri }}
          style={{
            width: 55,
            height: 55,
            borderRadius: 6,
          }}
          contentFit="cover"
          onLoadEnd={handleLoadEnd}
        />
      </View>
      <Pressable
        onPress={handleRemove}
        className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full bg-gray-200"
      >
        <X size={12} color="black" />
      </Pressable>
    </Animated.View>
  );
};
ImageItemComponent.displayName = "ImageItem";
const ImageItem = React.memo(ImageItemComponent);

const SelectedImagesComponent = ({ uris, onRemove }: SelectedImagesProps) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(uris.length === 0 ? 0 : 65, {
        duration: 200,
      }),
    };
  }, [uris.length]);

  return (
    <Animated.View
      className="overflow-hidden"
      style={[animatedStyle]}
      entering={FadeIn.delay(150).springify()}
      exiting={FadeOut}
      layout={Layout.springify()}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        className="mb-4 overflow-visible px-4 py-2"
        style={{ minHeight: 65 }}
      >
        <View className="flex-row gap-4">
          {uris.map((uri) => (
            <ImageItem key={uri} uri={uri} onRemove={onRemove} />
          ))}
        </View>
      </ScrollView>
    </Animated.View>
  );
};
SelectedImagesComponent.displayName = "SelectedImages";
const SelectedImages = React.memo(SelectedImagesComponent);

const ChatInputComponent = forwardRef<TextInput, Props>(
  (
    { input, onChangeText, onSubmit, scrollViewRef, focusOnMount = false, onVoicePress },
    ref,
  ) => {
    const { bottom } = useSafeAreaInsets();
    const keyboard = useAnimatedKeyboard();
    const { selectedImageUris, removeImageUri } = useStore();

    useEffect(() => {
      if (focusOnMount) {
        (ref as React.RefObject<TextInput>).current?.focus();
      }
    }, [focusOnMount, ref]);

    useEffect(() => {
      const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });
      const focusSubscription = Keyboard.addListener("keyboardWillShow", () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      });

      return () => {
        showSubscription.remove();
        focusSubscription.remove();
      };
    }, [scrollViewRef]);

    const animatedStyles = useAnimatedStyle(() => ({
      paddingBottom: withSpring(keyboard.height.value - bottom, {
        damping: 20,
        stiffness: 200,
      }),
    }));

    const colorScheme = useColorScheme();

    const handleVoicePressInternal = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Keyboard.dismiss();
      onVoicePress?.();
    }, [onVoicePress]);

    const handleSubmitInternal = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onSubmit();
      Keyboard.dismiss();
    }, [onSubmit]);

    return (
      <KeyboardAvoidingView>
        <Animated.View style={animatedStyles}>
          <SelectedImages uris={selectedImageUris} onRemove={removeImageUri} />
          <View className="flex-row items-end gap-2 bg-background px-4 py-2">
            <ChatTextInput
              ref={ref}
              className="flex-1 rounded-[20] bg-muted py-[8]"
              placeholder="Message"
              multiline
              value={input}
              onChangeText={onChangeText}
            />
            {onVoicePress && (
              <Pressable
                onPress={handleVoicePressInternal}
                className="android:h-12 android:w-12 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 items-center justify-center active:opacity-70"
              >
                <Mic
                  color={colorScheme === "dark" ? "white" : "black"}
                  size={20}
                />
              </Pressable>
            )}
            <Pressable
              onPress={handleSubmitInternal}
              disabled={!input.trim()}
              className={`android:h-12 android:w-12 h-10 w-10 rounded-full items-center justify-center active:opacity-80 ${
                input.trim() 
                  ? 'bg-black dark:bg-white' 
                  : 'bg-gray-300 dark:bg-gray-600 opacity-50'
              }`}
            >
              <ArrowUp
                color={colorScheme === "dark" ? "black" : "white"}
                size={20}
              />
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  },
);

ChatInputComponent.displayName = "ChatInput";

export const ChatInput = React.memo(ChatInputComponent);
