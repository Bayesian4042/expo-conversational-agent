import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState, Platform } from "react-native";
import type { Session } from "@/lib/supabase";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		// fix ref: https://github.com/supabase/supabase-js/issues/786#issuecomment-1871436625
		...(Platform.OS !== "web" ? { storage: AsyncStorage } : {}),
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});

export {
	type AuthChangeEvent,
	type AuthError,
	type Session,
} from "@supabase/supabase-js";

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener("change", (nextAppState) => {
	if (nextAppState === "active") {
		supabase.auth.startAutoRefresh();
	} else {
		supabase.auth.stopAutoRefresh();
	}
});
