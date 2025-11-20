import "@/global.css";
import Providers from "@/providers";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

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
      <PortalHost />
    </Providers>
  );
}
