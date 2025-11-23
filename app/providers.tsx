import type React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ColorSchemeProvider } from "@/design-system/color-scheme/provider";
import NativewindThemeProvider from "./ThemeProvider";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ColorSchemeProvider>
        <NativewindThemeProvider>
          {children}
        </NativewindThemeProvider>
      </ColorSchemeProvider>
    </GestureHandlerRootView>
  );
}

export default Providers;
