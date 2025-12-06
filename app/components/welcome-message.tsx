import { View } from "react-native";
import { Text } from "@/components/ui/text";

export const WelcomeMessage = () => {
  return (
    <View className="max-w-xl rounded-xl p-6">
      <View className="mb-8 h-[50] flex-col items-center justify-center gap-2 space-x-4">
        <Text className="mr-1 text-2xl font-bold"> Hello There!</Text>
        <Text className="mr-1 text-lg"> How can I help you today?</Text>
      </View>
    </View>
  );
};
