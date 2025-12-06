import { useState, useEffect, useCallback } from "react";
import Voice, {
  SpeechErrorEvent,
  SpeechResultsEvent,
} from "@react-native-voice/voice";

interface IState {
  recognized: string;
  pitch: string;
  error: string;
  end: string;
  started: string;
  results: string[];
  partialResults: string[];
  isRecording: boolean;
}

export const useVoiceRecognition = () => {
  const [state, setState] = useState<IState>({
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    isRecording: false,
  });

  const resetState = useCallback(() => {
    setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: "",
      isRecording: false,
    });
  }, [setState]);

  const startRecognizing = useCallback(async () => {
    resetState();
    try {
      await Voice.start("en-US", {
        RECOGNIZER_ENGINE: "GOOGLE",
        EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS: 2000,
        EXTRA_SPEECH_INPUT_POSSIBLY_COMPLETE_SILENCE_LENGTH_MILLIS: 3000,
        EXTRA_MAX_RESULTS: 1,
      });
    } catch (e) {
      console.error(e);
    }
  }, [resetState]);

  const stopRecognizing = useCallback(async () => {
    try {
      await Voice.stop();
      setState((prevState) => ({
        ...prevState,
        isRecording: false,
      }));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const cancelRecognizing = useCallback(async () => {
    try {
      await Voice.cancel();
    } catch (e) {
      console.error(e);
    }
  }, []);

  const destroyRecognizer = useCallback(async () => {
    try {
      await Voice.destroy();
    } catch (e) {
      console.error(e);
    }
    resetState();
  }, [resetState]);

  useEffect(() => {
    Voice.onSpeechStart = () => {
      console.log('Voice recognition started');
      setState((prevState) => ({
        ...prevState,
        started: "√",
        isRecording: true,
        error: "",
      }));
    };
    Voice.onSpeechRecognized = () => {
      setState((prevState) => ({ ...prevState, recognized: "√" }));
    };
    Voice.onSpeechEnd = () => {
      console.log('Voice recognition ended');
      setState((prevState) => ({ ...prevState, end: "√", isRecording: false }));
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      console.log('Voice recognition error:', e.error);
      
      const errorMessage = e.error?.message || '';
      const errorCode = e.error?.code || '';
      
      const isSimulatorIssue = 
        errorCode === '203' || 
        errorCode === '1110' ||
        errorCode === 'recognition_fail' ||
        errorCode === 'start_recording' ||
        errorMessage.includes('Timeout') ||
        errorMessage.includes('No speech detected') ||
        errorMessage.includes('sampleRate');
      
      if (isSimulatorIssue) {
        console.log('Simulator audio issue (non-fatal):', errorCode);
        setState((prevState) => ({
          ...prevState,
          isRecording: false,
        }));
      } else {  
        setState((prevState) => ({
          ...prevState,
          error: JSON.stringify(e.error),
          isRecording: false,
        }));
      }
    };
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, results: e.value! }));
      }
    };
    Voice.onSpeechPartialResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setState((prevState) => ({ ...prevState, partialResults: e.value! }));
      }
    };
    Voice.onSpeechVolumeChanged = (e: any) => {
      setState((prevState) => ({ ...prevState, pitch: e.value }));
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return {
    state,
    setState,
    resetState,
    startRecognizing,
    stopRecognizing,
    cancelRecognizing,
    destroyRecognizer,
  };
};

