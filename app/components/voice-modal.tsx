import React, { useState, useEffect } from "react";
import { View, Modal, Pressable, Alert } from "react-native";
import { X } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { useAudioPlayer, setAudioModeAsync, AudioModule } from "expo-audio";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import GemaVoice from "./common/gema-voice";

interface VoiceModalSimpleProps {
  visible: boolean;
  onClose: () => void;
}

export const VoiceModalSimple = ({ 
  visible, 
  onClose,
}: VoiceModalSimpleProps) => {
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "speaking">("idle");
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  
  const lastProcessedRef = React.useRef<string>("");
  const lastTranscriptRef = React.useRef<string>("");
  const silenceTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioPlayer = useAudioPlayer();
  const { state: voiceState, startRecognizing, stopRecognizing, destroyRecognizer } = useVoiceRecognition();

  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    if (!visible) return;

    const setup = async () => {
      const result = await AudioModule.requestRecordingPermissionsAsync();
      if (!result.granted) {
        Alert.alert("Permission Required", "Microphone permission is required");
        onClose();
        return;
      }

      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
      });

      setStatus("listening");
      await startRecognizing();
    };

    setup();

    return () => {
      console.log('🧹 Modal closing or unmounting, cleaning up...');
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      stopRecognizing().catch(console.error);
      destroyRecognizer().catch(console.error);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (status !== "listening") {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      return;
    }

    const currentTranscript = voiceState.partialResults[0] || voiceState.results[0] || "";
    
    if (!currentTranscript || currentTranscript.trim().length === 0) {
      lastTranscriptRef.current = "";
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      return;
    }

    if (currentTranscript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = currentTranscript;
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      silenceTimerRef.current = setTimeout(() => {
        
        if (lastProcessedRef.current === currentTranscript) {
          return;
        }
        
        lastProcessedRef.current = currentTranscript;
        handleTranscript(currentTranscript);
      }, 2000);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceState.partialResults, voiceState.results, status]);

  const handleTranscript = async (text: string) => {
    setTranscript(text);
    setStatus("processing");
    await stopRecognizing();

    try {
        const response = await fetch(`${API_URL}/voice-agent/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API error:', errorText);
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        
        setResponse(data.text);
        setStatus("speaking");

        const audioData = `data:audio/mp3;base64,${data.audio}`;
        audioPlayer.replace(audioData);
        await audioPlayer.play();

        await new Promise<void>((resolve) => {
          const checkPlayback = setInterval(() => {
            if (!audioPlayer.playing) {
              clearInterval(checkPlayback);
              resolve();
            }
          }, 100);
        });

        setTranscript("");
        setResponse("");

        lastProcessedRef.current = "";
        lastTranscriptRef.current = "";

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        setStatus("listening");
        await startRecognizing();

    } catch (error) {
        console.error('Error:', error);
        Alert.alert("Error", "Failed to process request");
        lastProcessedRef.current = "";
        lastTranscriptRef.current = "";
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
        setStatus("listening");
        await startRecognizing();
    }
  };

  const handleClose = async () => {
    try {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }

      try {
        await stopRecognizing();
      } catch (error) {
        console.log('Voice recognition already stopped or error:', error);
      }

      try {
        await destroyRecognizer();
      } catch (error) {
        console.error('Error destroying recognizer:', error);
      }

      if (audioPlayer.playing) {
        audioPlayer.pause();
      }

      lastProcessedRef.current = "";
      lastTranscriptRef.current = "";
      setStatus("idle");
      setTranscript("");
      setResponse("");
      
    } catch (error) {
      console.error('Error during cleanup:', error);
    } finally {
      onClose();
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "listening": return "Listening...";
      case "processing": return "Thinking...";
      case "speaking": return "Speaking...";
      default: return "Ready";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "listening": return "text-green-500";
      case "processing": return "text-yellow-500";
      case "speaking": return "text-blue-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row justify-between items-center px-6 py-4 pt-12">
          <Text className="text-xl font-semibold">Voice Chat</Text>
          <Pressable onPress={handleClose} className="p-2">
            <X size={24} />
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 items-center justify-center px-6">
          <GemaVoice width={300} height={300} />

          <Text className={`text-lg font-semibold mt-6 ${getStatusColor()}`}>
            {getStatusText()}
              </Text>
              
          {transcript && (
            <View className="mt-6 bg-secondary px-6 py-4 rounded-2xl">
              <Text className="text-foreground">{transcript}</Text>
            </View>
          )}

          {response && (
            <View className="mt-4 bg-primary/10 px-6 py-4 rounded-2xl">
              <Text className="text-foreground">{response}</Text>
              </View>
          )}

          <View className="mt-8 bg-secondary px-6 py-3 rounded-full">
            <Text className="text-sm text-muted-foreground">
              {status === "listening" && "Start speaking..."}
              {status === "processing" && "Processing..."}
              {status === "speaking" && "Listen to response..."}
            </Text>
              </View>
        </View>
        </View>
    </Modal>
  );
};

export const VoiceModal = VoiceModalSimple;
