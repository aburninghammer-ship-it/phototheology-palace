import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2, Square } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  variant?: "icon" | "button" | "large";
  className?: string;
}

export const VoiceInput = ({ 
  onTranscript, 
  disabled, 
  variant = "icon",
  className 
}: VoiceInputProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [useWhisper, setUseWhisper] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check for Web Speech API support
  const webSpeechSupported = typeof window !== 'undefined' && 
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  // Initialize Web Speech API if supported
  useEffect(() => {
    if (!webSpeechSupported) {
      setUseWhisper(true);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access denied. Please enable it in your browser settings.");
      } else if (event.error === 'no-speech') {
        // Silent error, just restart
      } else if (event.error !== 'aborted') {
        // Fall back to Whisper on error
        setUseWhisper(true);
        toast.info("Switching to enhanced voice recognition");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch (e) {
          setIsListening(false);
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onTranscript, isListening, webSpeechSupported]);

  // Get the best supported MIME type for the current browser
  const getSupportedMimeType = useCallback(() => {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      ''  // Empty string = browser default
    ];
    
    for (const type of types) {
      if (type === '' || MediaRecorder.isTypeSupported(type)) {
        console.log('Using MIME type:', type || 'browser default');
        return type;
      }
    }
    return '';
  }, []);

  // Start recording for Whisper transcription
  const startWhisperRecording = async () => {
    try {
      // Simpler audio constraints for better mobile compatibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;
      audioChunksRef.current = [];
      
      const mimeType = getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};
      
      const mediaRecorder = new MediaRecorder(stream, options);
      
      mediaRecorder.ondataavailable = (event) => {
        console.log('Audio chunk received, size:', event.data.size);
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        console.log('MediaRecorder stopped, chunks:', audioChunksRef.current.length);
        const mimeTypeForBlob = mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeTypeForBlob });
        console.log('Audio blob created, size:', audioBlob.size);
        if (audioBlob.size > 0) {
          await transcribeWithWhisper(audioBlob);
        } else {
          toast.error("No audio was recorded. Please try again.");
          setIsTranscribing(false);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      
      // Start recording - don't use timeslice on mobile for better compatibility
      // Instead, we'll collect all data when stop() is called
      mediaRecorder.start();
      
      setIsRecording(true);
      setRecordingDuration(0);
      
      // Start duration counter
      durationIntervalRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
      
      toast.success("Recording started. Speak your thoughts...");
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  // Stop recording and transcribe
  const stopWhisperRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };

  // Transcribe audio with Whisper via edge function
  const transcribeWithWhisper = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
      });
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await base64Promise;
      
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });
      
      if (error) throw error;
      
      if (data?.text) {
        onTranscript(data.text);
        toast.success("Transcription complete!");
      } else {
        toast.error("No speech detected. Please try again.");
      }
    } catch (error) {
      console.error('Transcription error:', error);
      toast.error("Failed to transcribe audio");
    } finally {
      setIsTranscribing(false);
    }
  };

  // Toggle Web Speech API listening
  const toggleWebSpeech = async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      toast.info("Voice input stopped");
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current.start();
        setIsListening(true);
        toast.success("Listening... Speak your thoughts");
      } catch (error) {
        toast.error("Microphone access denied");
      }
    }
  };

  // Main toggle handler
  const handleToggle = () => {
    if (useWhisper || !webSpeechSupported) {
      if (isRecording) {
        stopWhisperRecording();
      } else {
        startWhisperRecording();
      }
    } else {
      toggleWebSpeech();
    }
  };

  const isActive = isListening || isRecording;
  const isProcessing = isTranscribing;

  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Large variant - prominent button for mobile
  if (variant === "large") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <motion.button
          type="button"
          onClick={handleToggle}
          disabled={disabled || isProcessing}
          className={cn(
            "relative w-20 h-20 rounded-full flex items-center justify-center transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            isActive
              ? "bg-red-500 text-white focus:ring-red-500"
              : "bg-gradient-to-br from-purple-500 to-violet-600 text-white focus:ring-purple-500",
            (disabled || isProcessing) && "opacity-50 cursor-not-allowed"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div
                key="processing"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Loader2 className="h-8 w-8 animate-spin" />
              </motion.div>
            ) : isActive ? (
              <motion.div
                key="active"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Square className="h-8 w-8" />
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <Mic className="h-8 w-8" />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Pulsing ring when active */}
          <AnimatePresence>
            {isActive && (
              <>
                <motion.div
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.3, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                  className="absolute inset-0 rounded-full bg-red-500"
                />
              </>
            )}
          </AnimatePresence>
        </motion.button>
        
        <div className="text-center">
          {isProcessing ? (
            <p className="text-sm text-muted-foreground animate-pulse">Transcribing...</p>
          ) : isActive ? (
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm font-medium text-red-500">Recording</p>
              {useWhisper && (
                <p className="text-xs text-muted-foreground font-mono">{formatDuration(recordingDuration)}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Tap to speak your thoughts
            </p>
          )}
        </div>
      </div>
    );
  }

  // Button variant - text button
  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        disabled={disabled || isProcessing}
        className={cn(
          "gap-2 transition-all",
          isActive && "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30",
          !isActive && "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20",
          className
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Transcribing...
          </>
        ) : isActive ? (
          <>
            <MicOff className="h-4 w-4" />
            Stop Recording
            {useWhisper && <span className="font-mono text-xs">{formatDuration(recordingDuration)}</span>}
          </>
        ) : (
          <>
            <Mic className="h-4 w-4 text-purple-400" />
            Voice Input
          </>
        )}
      </Button>
    );
  }

  // Default icon variant
  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleToggle}
        disabled={disabled || isProcessing}
        className={cn(
          "relative transition-all",
          isActive 
            ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30" 
            : "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20"
        )}
      >
        <AnimatePresence mode="wait">
          {isProcessing ? (
            <motion.div
              key="processing"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          ) : isActive ? (
            <motion.div
              key="listening"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <MicOff className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Mic className="h-4 w-4 text-purple-400" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
      
      {/* Pulsing animation when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 rounded-md bg-red-500/30 -z-10"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
