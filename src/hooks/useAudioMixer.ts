/**
 * useAudioMixer - Mix one or more speech tracks (concatenated) with one or
 * more music tracks (chained to cover full speech length) using Web Audio API.
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

/** Concatenate multiple AudioBuffers into one, normalising to the same sample rate / channel count */
function concatBuffers(buffers: AudioBuffer[], sampleRate: number, numChannels: number): AudioBuffer {
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const result = new AudioContext().createBuffer(numChannels, totalLength, sampleRate);

  let offset = 0;
  for (const buf of buffers) {
    for (let ch = 0; ch < numChannels; ch++) {
      const srcCh = ch < buf.numberOfChannels ? buf.getChannelData(ch) : new Float32Array(buf.length);
      result.getChannelData(ch).set(srcCh, offset);
    }
    offset += buf.length;
  }
  return result;
}

export function useAudioMixer() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mix one or more speech URLs (concatenated in order) with one or more
   * music URLs (chained to cover the full speech length) and return a WAV blob.
   *
   * @param speechUrls  Single URL or array of speech audio URLs (max 5 for Epic)
   * @param musicUrls   Single URL or array of music track URLs to chain in sequence
   * @param musicVolume 0–1 gain for the music layer
   * @param _filename   Target filename (unused here, returned to caller)
   */
  const mixAndDownload = async (
    speechUrls: string | string[],
    musicUrls: string | string[],
    musicVolume: number,
    _filename: string
  ): Promise<Blob | null> => {
    const speechList = Array.isArray(speechUrls)
      ? speechUrls.filter(Boolean)
      : speechUrls ? [speechUrls] : [];
    const musicList = Array.isArray(musicUrls)
      ? musicUrls.filter(Boolean)
      : musicUrls ? [musicUrls] : [];

    if (speechList.length === 0) {
      setError('No speech audio provided');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      // ── Fetch all speech files ────────────────────────────────────────────
      setProgress(5);
      const speechResponses = await Promise.all(speechList.map(url => fetch(url)));
      for (const r of speechResponses) {
        if (!r.ok) throw new Error(`Failed to fetch speech audio: ${r.url}`);
      }
      setProgress(15);

      const speechArrayBuffers = await Promise.all(speechResponses.map(r => r.arrayBuffer()));
      setProgress(25);

      // ── Decode speech audio ───────────────────────────────────────────────
      const decodeCtx = new AudioContext();
      const speechBuffers = await Promise.all(
        speechArrayBuffers.map(ab => decodeCtx.decodeAudioData(ab.slice(0)))
      );
      await decodeCtx.close();
      setProgress(35);

      // Normalise to highest channel count / sample rate among speech tracks
      const sampleRate = Math.max(...speechBuffers.map(b => b.sampleRate));
      const numChannels = Math.max(Math.max(...speechBuffers.map(b => b.numberOfChannels)), 2);

      // Concatenate speech if multiple chapters
      const speechBuffer = speechBuffers.length === 1
        ? speechBuffers[0]
        : concatBuffers(speechBuffers, sampleRate, numChannels);
      setProgress(45);

      // ── No music branch ───────────────────────────────────────────────────
      if (musicList.length === 0) {
        const wavBlob = encodeWav(speechBuffer);
        setProgress(100);
        setIsProcessing(false);
        return wavBlob;
      }

      // ── Fetch all music files ─────────────────────────────────────────────
      setProgress(50);
      const musicResponses = await Promise.all(musicList.map(url => fetch(url)));
      for (const r of musicResponses) {
        if (!r.ok) throw new Error(`Failed to fetch music audio: ${r.url}`);
      }

      const musicArrayBuffers = await Promise.all(musicResponses.map(r => r.arrayBuffer()));
      setProgress(58);

      const decodeCtx2 = new AudioContext();
      const musicBuffers = await Promise.all(
        musicArrayBuffers.map(ab => decodeCtx2.decodeAudioData(ab.slice(0)))
      );
      await decodeCtx2.close();
      setProgress(65);

      // ── Build offline context ─────────────────────────────────────────────
      const fadeOutDuration = 3;
      const totalLength = speechBuffer.length + Math.floor(fadeOutDuration * sampleRate);
      const offlineCtx = new OfflineAudioContext(numChannels, totalLength, sampleRate);

      // ── Speech source ─────────────────────────────────────────────────────
      const speechSource = offlineCtx.createBufferSource();
      speechSource.buffer = speechBuffer;
      const speechGain = offlineCtx.createGain();
      speechGain.gain.setValueAtTime(1.0, 0);
      const speechEnd = speechBuffer.length / sampleRate;
      speechGain.gain.setValueAtTime(1.0, Math.max(0, speechEnd - 0.5));
      speechGain.gain.linearRampToValueAtTime(0, speechEnd);
      speechSource.connect(speechGain);
      speechGain.connect(offlineCtx.destination);
      speechSource.start(0);

      // ── Music source(s) — chained to cover the full speech length ─────────
      // We schedule each music track back-to-back; the last one loops until
      // the speech ends, then all fade out together.
      const crossfadeTime = 1.5; // seconds cross-fade between songs

      let musicOffset = 0;
      for (let mi = 0; mi < musicBuffers.length; mi++) {
        const mb = musicBuffers[mi];
        const isLast = mi === musicBuffers.length - 1;

        // Apply crossfade within the buffer for seamless looping
        const crossfadeSamples = Math.min(
          Math.floor(sampleRate * 2),
          Math.floor(mb.length / 4)
        );
        const xfadedBuf = offlineCtx.createBuffer(mb.numberOfChannels, mb.length, sampleRate);
        for (let ch = 0; ch < mb.numberOfChannels; ch++) {
          const src = mb.getChannelData(ch);
          const dst = xfadedBuf.getChannelData(ch);
          dst.set(src);
          for (let i = 0; i < crossfadeSamples; i++) {
            const t = i / crossfadeSamples;
            const tailIdx = mb.length - crossfadeSamples + i;
            dst[i] = src[i] * t + src[tailIdx] * (1 - t);
            dst[tailIdx] = src[tailIdx] * t + src[i] * (1 - t);
          }
        }

        const musicSrc = offlineCtx.createBufferSource();
        musicSrc.buffer = xfadedBuf;
        musicSrc.loop = isLast; // only the last track loops to fill remaining time

        const musicGainNode = offlineCtx.createGain();

        // Fade-in: crossfade from previous track (or from silence at start)
        const fadeInStart = mi === 0 ? 0 : musicOffset - crossfadeTime;
        musicGainNode.gain.setValueAtTime(mi === 0 ? musicVolume : 0, Math.max(0, fadeInStart));
        if (mi > 0) {
          musicGainNode.gain.linearRampToValueAtTime(musicVolume, musicOffset);
        }

        // Fade-out when speech ends
        musicGainNode.gain.setValueAtTime(musicVolume, speechEnd);
        musicGainNode.gain.linearRampToValueAtTime(0, speechEnd + fadeOutDuration);

        musicSrc.connect(musicGainNode);
        musicGainNode.connect(offlineCtx.destination);

        const startAt = Math.max(0, musicOffset - (mi === 0 ? 0 : crossfadeTime));
        musicSrc.start(startAt);

        musicOffset += mb.duration;

        // If we've covered enough time for speech and this isn't the last track, stop
        if (!isLast && musicOffset >= speechEnd + fadeOutDuration) break;
      }

      setProgress(75);

      // ── Render ────────────────────────────────────────────────────────────
      const renderedBuffer = await offlineCtx.startRendering();
      setProgress(88);

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
