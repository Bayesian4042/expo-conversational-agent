import "@/global.css";
import Providers from "@/providers";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { ElevenLabsProvider } from "@elevenlabs/react-native";

export default function Layout() {
  return (
    <ElevenLabsProvider>
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: "Expo AI Chatbot",
          }}
        />
      </Stack>
      <PortalHost />
    </Providers>
    </ElevenLabsProvider>
  );
}
