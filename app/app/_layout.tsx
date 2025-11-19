import Providers from "@/providers";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Expo AI Chatbot",
          }}
        />
      </Stack>
    </Providers>
  );
}
