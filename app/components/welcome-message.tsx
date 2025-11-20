import { View, Pressable, Linking } from "react-native";
import { Image } from "expo-image";
import { Text } from "@/components/ui/text";
import { MessageCircle } from "lucide-react-native";

export const WelcomeMessage = () => {
  return (
    <View className="max-w-xl rounded-xl p-6">
      <View className="mb-8 h-[50] flex-row items-center justify-center gap-2 space-x-4">
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={{ width: 30, height: 30, top: 2, right: 4 }}
          contentFit="contain"
        />
        <Text className="mr-1">+</Text>
        <Text className="mt-3 text-5xl">▲</Text>
        <Text className="mr-1">+</Text>
        <MessageCircle size={32} color="black" />
      </View>

      <View className="space-y-4">
        <Text className="text-center leading-7">
          This is a chatbot template built with React Native / Expo and the AI
          SDK by Vercel that complements Next.js AI Chatbot. It uses native
          components with modern UX patterns with the{" "}
          <Text className="rounded-md bg-muted px-1 py-0.5">streamText</Text>{" "}
          function in the server and the{" "}
          <Text className="rounded-md bg-muted px-1 py-0.5">useChat</Text> hook
          on the client to create a seamless chat experience.
        </Text>

        <Text className="mt-5 text-center leading-7">
          Learn more about the AI SDK by visiting the{" "}
          <Pressable
            onPress={() => Linking.openURL("https://sdk.vercel.ai/docs")}
          >
            <Text className="relative font-medium leading-5 underline">
              docs
            </Text>
          </Pressable>
          .
        </Text>
        <Text className="mt-5 text-center leading-7">
          Learn more about the Expo SDK by visiting the{" "}
          <Pressable onPress={() => Linking.openURL("https://docs.expo.dev")}>
            <Text className="relative font-medium leading-5 underline">
              docs
            </Text>
          </Pressable>
          .
        </Text>
      </View>
    </View>
  );
};
