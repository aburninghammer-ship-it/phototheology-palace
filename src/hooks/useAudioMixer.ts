import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AudioSegment {
  audioUrl?: string;
  audioContent?: string; // base64
  duration?: number;
}

interface MixerOptions {
  musicUrl: string;
  musicVolume?: number; // 0-1, default 0.15
  segments: AudioSegment[];
  gapBetweenSegments?: number; // seconds, default 1
}

export const useAudioMixer = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioBuffer = async (
    audioContext: OfflineAudioContext | AudioContext,
    url?: string,
    base64Content?: string
  ): Promise<AudioBuffer | null> => {
    try {
      let arrayBuffer: ArrayBuffer;

      if (base64Content) {
        // Decode base64
        const binaryString = atob(base64Content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        arrayBuffer = bytes.buffer;
      } else if (url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch: ${url}`);
        arrayBuffer = await response.arrayBuffer();
      } else {
        return null;
      }

      return await audioContext.decodeAudioData(arrayBuffer);
    } catch (err) {
      console.error("Error fetching audio buffer:", err);
      return null;
    }
  };

  const mixAndDownload = useCallback(async (options: MixerOptions): Promise<Blob | null> => {
    const { musicUrl, musicVolume = 0.15, segments, gapBetweenSegments = 1 } = options;

    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // First, use a regular AudioContext to decode all audio
      const tempContext = new AudioContext();
      
      // Fetch music
      setProgress(5);
      console.log("Fetching music...");
      const musicBuffer = await fetchAudioBuffer(tempContext, musicUrl);
      if (!musicBuffer) {
        throw new Error("Failed to load background music");
      }

      // Fetch all speech segments
      const speechBuffers: AudioBuffer[] = [];
      for (let i = 0; i < segments.length; i++) {
        setProgress(5 + (i / segments.length) * 40);
        console.log(`Fetching segment ${i + 1}/${segments.length}...`);
        
        const segment = segments[i];
        const buffer = await fetchAudioBuffer(
          tempContext,
          segment.audioUrl,
          segment.audioContent
        );
        if (buffer) {
          speechBuffers.push(buffer);
        }
      }

      if (speechBuffers.length === 0) {
        throw new Error("No audio segments to mix");
      }

      // Calculate total duration
      const totalSpeechDuration = speechBuffers.reduce(
        (acc, buf) => acc + buf.duration + gapBetweenSegments,
        0
      );
      const totalDuration = Math.max(totalSpeechDuration, musicBuffer.duration);

      console.log(`Total duration: ${totalDuration}s`);
      setProgress(50);

      // Create offline context for mixing
      const sampleRate = 44100;
      const offlineContext = new OfflineAudioContext(
        2, // stereo
        Math.ceil(totalDuration * sampleRate),
        sampleRate
      );

      // Add music track (looped if needed, at low volume)
      const musicSource = offlineContext.createBufferSource();
      musicSource.buffer = musicBuffer;
      musicSource.loop = totalDuration > musicBuffer.duration;
      
      const musicGain = offlineContext.createGain();
      musicGain.gain.value = musicVolume;
      
      musicSource.connect(musicGain);
      musicGain.connect(offlineContext.destination);
      musicSource.start(0);

      // Add speech segments sequentially
      let currentTime = 0;
      for (const buffer of speechBuffers) {
        const source = offlineContext.createBufferSource();
        source.buffer = buffer;
        
        const gain = offlineContext.createGain();
        gain.gain.value = 1.0;
        
        source.connect(gain);
        gain.connect(offlineContext.destination);
        source.start(currentTime);
        
        currentTime += buffer.duration + gapBetweenSegments;
      }

      setProgress(70);
      console.log("Rendering mixed audio...");

      // Render
      const renderedBuffer = await offlineContext.startRendering();
      
      setProgress(85);
      console.log("Encoding to WAV...");

      // Encode to WAV
      const wavBlob = encodeWAV(renderedBuffer);
      
      setProgress(100);
      await tempContext.close();

      return wavBlob;
    } catch (err) {
      console.error("Error mixing audio:", err);
      setError(err instanceof Error ? err.message : "Failed to mix audio");
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    mixAndDownload,
    isProcessing,
    progress,
    error,
  };
};

// WAV encoding utilities
function encodeWAV(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  
  const samples = interleave(audioBuffer);
  const dataLength = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(buffer);
  
  // WAV header
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataLength, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);
  
  // Write samples
  const offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    view.setInt16(offset + i * 2, intSample, true);
  }
  
  return new Blob([buffer], { type: 'audio/wav' });
}

function interleave(audioBuffer: AudioBuffer): Float32Array {
  const numChannels = audioBuffer.numberOfChannels;
  const length = audioBuffer.length;
  const result = new Float32Array(length * numChannels);
  
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(audioBuffer.getChannelData(c));
  }
  
  for (let i = 0; i < length; i++) {
    for (let c = 0; c < numChannels; c++) {
      result[i * numChannels + c] = channels[c][i];
    }
  }
  
  return result;
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
