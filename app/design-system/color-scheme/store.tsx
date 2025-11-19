import AsyncStorage from "@react-native-async-storage/async-storage";

const COLOR_SCHEME_STRING = "color-scheme";
const DISABLED_SYSTEM_THEME = "disabled-system-theme";

export async function setColorScheme(colorScheme: "light" | "dark") {
  await AsyncStorage.setItem(COLOR_SCHEME_STRING, colorScheme);
}

export async function getColorScheme() {
  const value = await AsyncStorage.getItem(COLOR_SCHEME_STRING);
  return value as "light" | "dark";
}

export async function deleteColorScheme() {
  await AsyncStorage.removeItem(COLOR_SCHEME_STRING);
}

export async function getDisabledSystemTheme() {
  return await AsyncStorage.getItem(DISABLED_SYSTEM_THEME);
}

export async function setDisabledSystemTheme() {
  await AsyncStorage.setItem(DISABLED_SYSTEM_THEME, "true");
}

export async function deleteDisabledSystemTheme() {
  await AsyncStorage.removeItem(DISABLED_SYSTEM_THEME);
}
