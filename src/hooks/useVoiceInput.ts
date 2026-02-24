import { useState, useEffect, useCallback, useRef } from 'react';

export interface UseVoiceInputReturn {
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  clearTranscript: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSpeechRecognitionAPI = (): (new () => any) | null => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export function useVoiceInput(): UseVoiceInputReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const shouldRestartRef = useRef(false);

  const isSupported = getSpeechRecognitionAPI() !== null;

  const createRecognition = useCallback(() => {
    const SpeechRecognitionAPI = getSpeechRecognitionAPI();
    if (!SpeechRecognitionAPI) return null;

    const recognition = new SpeechRecognitionAPI();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + finalTranscript);
      }
      setInterimTranscript(interim);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);

      switch (event.error) {
        case 'not-allowed':
          setError('Microphone access denied. Please allow microphone permissions.');
          break;
        case 'no-speech':
          break;
        case 'network':
          setError('Network error. Please check your connection.');
          break;
        case 'aborted':
          break;
        default:
          setError(`Speech recognition error: ${event.error}`);
      }

      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setIsListening(false);
        shouldRestartRef.current = false;
      }
    };

    recognition.onend = () => {
      setInterimTranscript('');

      if (shouldRestartRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          setIsListening(false);
        }
      } else {
        setIsListening(false);
      }
    };

    return recognition;
  }, []);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    shouldRestartRef.current = true;

    if (!recognitionRef.current) {
      recognitionRef.current = createRecognition();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  }, [isSupported, createRecognition]);

  const stopListening = useCallback(() => {
    shouldRestartRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // Ignore errors on stop
      }
    }

    setIsListening(false);
    setInterimTranscript('');
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  useEffect(() => {
    return () => {
      shouldRestartRef.current = false;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    transcript,
    interimTranscript,
    error,
    clearTranscript,
  };
}
