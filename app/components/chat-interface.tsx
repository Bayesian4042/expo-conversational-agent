import { View, ScrollView, ActivityIndicator, type NativeSyntheticEvent, type NativeScrollEvent } from "react-native";

// import Markdown from "react-native-markdown-display";
import { CustomMarkdown } from "@/components/ui/markdown";
import { Text } from "@/components/ui/text";
import WeatherCard from "@/components/weather";
import { WelcomeMessage } from "@/components/welcome-message";
import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LottieLoader } from "@/components/lottie-loader";

type ToolInvocation = {
  toolName: string;
  toolCallId: string;
  state: string;
  result?: any;
};

type Message = {
  id: string;
  role: "user" | "assistant" | "system" | "function" | "data" | "tool";
  content: string;
  toolInvocations?: ToolInvocation[];
};

type ChatInterfaceProps = {
  messages: Message[];
  scrollViewRef: React.RefObject<ScrollView>;
  isLoading?: boolean;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onContentSizeChange?: (w: number, h: number) => void;
};

const ChatInterfaceComponent = forwardRef<ScrollView, ChatInterfaceProps>(
  ({ messages, scrollViewRef, isLoading, onScroll, onContentSizeChange }, ref) => {

    return (  
      <View className="flex-1">
        <ScrollView 
          ref={scrollViewRef} 
          className="flex-1 space-y-4 p-4"
          onScroll={onScroll}
          scrollEventThrottle={16}
          onContentSizeChange={onContentSizeChange}
        >
          {!messages.length && <WelcomeMessage />}
          {messages.length > 0
            ? messages.map((m, index) => {
                const toolInvocationElements = m.toolInvocations
                  ?.map((t, toolIndex) => {
                    if (t.toolName === "getWeather") {
                      if (t.state !== "result") {
                        return (
                          <View
                            key={`${m.id}-tool-${t.toolCallId}-${toolIndex}-loading`}
                            className={cn(
                              "mt-4 max-w-[85%] rounded-2xl bg-muted/50 p-4",
                            )}
                          >
                            <ActivityIndicator size="small" color="black" />
                            <Text>Getting weather data...</Text>
                          </View>
                        );
                      }
                      if (t.state === "result") {
                        return (
                          <WeatherCard
                            key={`${m.id}-tool-${t.toolCallId}-${toolIndex}-result`}
                            city={t.result.city || "Unknown"}
                            temperature={t.result.current.temperature_2m}
                            weatherCode={t.result.current.weathercode}
                            humidity={t.result.current.relative_humidity_2m}
                            wind={t.result.current.wind_speed_10m}
                          />
                        );
                      }
                    }
                    return null;
                  })
                  .filter(Boolean) || [];

                return (
                <React.Fragment key={`message-${m.id}-${index}`}>
                  {toolInvocationElements}

                  <View
                    key={`content-${m.id}`}
                    className={`flex-row px-4 ${m.role === "user" ? "ml-auto max-w-[85%]" : "max-w-[95%] pl-0"} rounded-3xl ${m.role === "user" ? "bg-muted/50" : ""} `}
                  >
                    {m.content.length > 0 && (
                      <React.Fragment key={`${m.id}-content-wrapper`}>
                        <View
                          key={`${m.id}-avatar`}
                          className={
                            m.role === "user"
                              ? ""
                              : "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base">
                            {m.role === "user" ? "" : "🤖"}
                          </Text>
                        </View>
                        <CustomMarkdown key={`${m.id}-markdown`} content={m.content} />
                      </React.Fragment>
                    )}
                  </View>
                  {isLoading &&
                    messages[messages.length - 1].role === "user" &&
                    m === messages[messages.length - 1] && (
                      <View key={`loading-${m.id}`} className="flex-row">
                        <View
                          className={
                            "mr-2 mt-1 h-8 w-8 items-center justify-center rounded-full bg-gray-200"
                          }
                        >
                          <Text className="text-base">{"🤖"}</Text>
                        </View>
                        <View className="-ml-2 -mt-[1px]">
                          <LottieLoader width={40} height={40} />
                        </View>
                      </View>
                    )}
                </React.Fragment>
                );
              })
            : null}
        </ScrollView>
      </View>
    );
  },
);

ChatInterfaceComponent.displayName = "ChatInterface";

export const ChatInterface = React.memo(ChatInterfaceComponent);
