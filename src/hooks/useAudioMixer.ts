/**
 * useAudioMixer - Mix speech audio with background music using Web Audio API
 */

import { useState } from 'react';

function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitsPerSample = 16;
  const length = buffer.length * numChannels;
  const interleaved = new Int16Array(length);

  for (let ch = 0; ch < numChannels; ch++) {
    const channelData = buffer.getChannelData(ch);
    for (let i = 0; i < buffer.length; i++) {
      const sample = Math.max(-1, Math.min(1, channelData[i]));
      interleaved[i * numChannels + ch] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
    }
  }

  const dataSize = interleaved.length * 2;
  const arrayBuffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(arrayBuffer);

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bitsPerSample / 8, true);
  view.setUint16(32, numChannels * bitsPerSample / 8, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  new Int16Array(arrayBuffer, 44).set(interleaved);

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

export function useAudioMixer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mixAndDownload = async (
    speechUrl: string,
    musicUrl: string,
    musicVolume: number,
    _filename: string
  ): Promise<Blob | null> => {
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // No music — just fetch and return speech blob
      if (!musicUrl) {
        setProgress(20);
        const response = await fetch(speechUrl);
        if (!response.ok) throw new Error('Failed to fetch audio');
        const blob = await response.blob();
        setProgress(100);
        setIsProcessing(false);
        return blob;
      }

      // Fetch both audio files
      setProgress(10);
      const [speechResponse, musicResponse] = await Promise.all([
        fetch(speechUrl),
        fetch(musicUrl),
      ]);

      if (!speechResponse.ok) throw new Error('Failed to fetch speech audio');
      if (!musicResponse.ok) throw new Error('Failed to fetch music audio');

      setProgress(30);
      const [speechArrayBuffer, musicArrayBuffer] = await Promise.all([
        speechResponse.arrayBuffer(),
        musicResponse.arrayBuffer(),
      ]);

      // Decode audio buffers
      setProgress(40);
      const audioCtx = new AudioContext();
      const [speechBuffer, musicBuffer] = await Promise.all([
        audioCtx.decodeAudioData(speechArrayBuffer),
        audioCtx.decodeAudioData(musicArrayBuffer),
      ]);
      await audioCtx.close();

      // Create offline context sized to speech duration
      setProgress(50);
      const sampleRate = speechBuffer.sampleRate;
      const numChannels = Math.max(speechBuffer.numberOfChannels, 2);
      const offlineCtx = new OfflineAudioContext(numChannels, speechBuffer.length, sampleRate);

      // Speech source at full volume
      const speechSource = offlineCtx.createBufferSource();
      speechSource.buffer = speechBuffer;
      const speechGain = offlineCtx.createGain();
      speechGain.gain.value = 1.0;
      speechSource.connect(speechGain);
      speechGain.connect(offlineCtx.destination);

      // Music source with looping and user volume
      const musicSource = offlineCtx.createBufferSource();
      musicSource.buffer = musicBuffer;
      musicSource.loop = true;
      const musicGain = offlineCtx.createGain();
      musicGain.gain.value = musicVolume;
      musicSource.connect(musicGain);
      musicGain.connect(offlineCtx.destination);

      // Start both sources
      speechSource.start(0);
      musicSource.start(0);

      // Render
      setProgress(60);
      const renderedBuffer = await offlineCtx.startRendering();

      // Encode as WAV
      setProgress(80);
      const wavBlob = encodeWav(renderedBuffer);

      setProgress(100);
      setIsProcessing(false);
      return wavBlob;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
      setIsProcessing(false);
      return null;
    }
  };

  return {
    mixAndDownload,
    isProcessing,
    progress,
    error,
  };
}
