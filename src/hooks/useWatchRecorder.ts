/**
 * useWatchRecorder — Records the watch session as a video
 * Captures a canvas-based audio frequency visualization + the session audio
 * into a downloadable/shareable MP4/WebM video.
 */
import { useRef, useState, useCallback, useEffect } from "react";

interface RecorderState {
  isRecording: boolean;
  isProcessing: boolean;
  videoBlob: Blob | null;
  videoUrl: string | null;
  error: string | null;
}

interface UseWatchRecorderReturn extends RecorderState {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startRecording: (audioElement: HTMLAudioElement, ambientElement?: HTMLAudioElement | null) => void;
  stopRecording: () => void;
  clearRecording: () => void;
  downloadVideo: (filename?: string) => void;
  setTitle: (t: string) => void;
  setSubtitle: (s: string) => void;
}

// Audio frequency bar colors matching the app theme
const BAR_COLORS = [
  "hsl(220, 70%, 55%)",
  "hsl(260, 60%, 60%)",
  "hsl(280, 50%, 55%)",
  "hsl(200, 65%, 50%)",
];

function drawFrequencyBars(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  analyser: AnalyserNode | null,
  frame: number
) {
  // Dark gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, "hsl(220, 20%, 8%)");
  gradient.addColorStop(1, "hsl(220, 15%, 4%)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  const barCount = 64;
  const barWidth = (width / barCount) * 0.7;
  const gap = (width / barCount) * 0.3;

  let dataArray: Uint8Array<ArrayBuffer>;
  if (analyser) {
    const buf = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(buf);
    dataArray = buf as Uint8Array<ArrayBuffer>;
  } else {
    // Fallback: generate fake waveform
    dataArray = new Uint8Array(barCount);
    for (let i = 0; i < barCount; i++) {
      dataArray[i] = Math.abs(Math.sin(frame * 0.02 + i * 0.3)) * 120 + 20;
    }
  }

  const step = Math.max(1, Math.floor(dataArray.length / barCount));

  for (let i = 0; i < barCount; i++) {
    const value = dataArray[i * step] || 0;
    const normalised = value / 255;
    const barHeight = normalised * height * 0.7 + 4;
    const x = i * (barWidth + gap) + gap / 2;
    const y = height - barHeight;

    // Gradient per bar
    const barGrad = ctx.createLinearGradient(x, y, x, height);
    const colorIdx = i % BAR_COLORS.length;
    barGrad.addColorStop(0, BAR_COLORS[colorIdx]);
    barGrad.addColorStop(1, BAR_COLORS[(colorIdx + 1) % BAR_COLORS.length] + "40");

    ctx.fillStyle = barGrad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [barWidth / 2, barWidth / 2, 0, 0]);
    ctx.fill();

    // Glow effect
    ctx.shadowColor = BAR_COLORS[colorIdx];
    ctx.shadowBlur = normalised * 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Subtle reflection
  ctx.globalAlpha = 0.08;
  ctx.scale(1, -1);
  ctx.translate(0, -height * 2);
  // (skip actual reflection draw for performance)
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
}

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  title: string,
  subtitle: string
) {
  // Title
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(title, width / 2, 50);

  // Subtitle
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "16px system-ui, -apple-system, sans-serif";
  ctx.fillText(subtitle, width / 2, 80);

  // Branding
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.font = "12px system-ui, -apple-system, sans-serif";
  ctx.fillText("Phototheology Palace", width / 2, height - 20);
}

export function useWatchRecorder(): UseWatchRecorderReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const animFrameRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const frameCountRef = useRef(0);
  const titleRef = useRef("");
  const subtitleRef = useRef("");

  const [state, setState] = useState<RecorderState>({
    isRecording: false,
    isProcessing: false,
    videoBlob: null,
    videoUrl: null,
    error: null,
  });

  const startRecording = useCallback(
    (audioElement: HTMLAudioElement, ambientElement?: HTMLAudioElement | null) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        // Set canvas size
        canvas.width = 1280;
        canvas.height = 720;
        const ctx = canvas.getContext("2d")!;

        // Set up audio context + analyser
        const audioCtx = new AudioContext();
        audioCtxRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyserRef.current = analyser;

        // Mix audio sources into destination
        const dest = audioCtx.createMediaStreamDestination();
        
        const voiceSource = audioCtx.createMediaElementSource(audioElement);
        voiceSource.connect(analyser);
        analyser.connect(dest);
        analyser.connect(audioCtx.destination); // keep audible

        if (ambientElement && ambientElement.src) {
          try {
            const ambientSource = audioCtx.createMediaElementSource(ambientElement);
            ambientSource.connect(dest);
            ambientSource.connect(audioCtx.destination);
          } catch {
            // Already connected or no source
          }
        }

        // Canvas stream
        const canvasStream = canvas.captureStream(30);

        // Combine canvas video + audio
        const combinedStream = new MediaStream([
          ...canvasStream.getVideoTracks(),
          ...dest.stream.getAudioTracks(),
        ]);

        // Determine best codec
        const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
          ? "video/webm;codecs=vp9,opus"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
            ? "video/webm;codecs=vp8,opus"
            : "video/webm";

        const recorder = new MediaRecorder(combinedStream, {
          mimeType,
          videoBitsPerSecond: 2_500_000,
        });
        mediaRecorderRef.current = recorder;
        chunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };

        recorder.onstop = () => {
          setState((s) => ({ ...s, isRecording: false, isProcessing: true }));
          const blob = new Blob(chunksRef.current, { type: mimeType });
          const url = URL.createObjectURL(blob);
          setState({
            isRecording: false,
            isProcessing: false,
            videoBlob: blob,
            videoUrl: url,
            error: null,
          });
        };

        recorder.start(1000);
        frameCountRef.current = 0;

        // Animation loop
        const draw = () => {
          frameCountRef.current++;
          drawFrequencyBars(ctx, canvas.width, canvas.height, analyser, frameCountRef.current);
          drawOverlay(ctx, canvas.width, canvas.height, titleRef.current, subtitleRef.current);
          animFrameRef.current = requestAnimationFrame(draw);
        };
        draw();

        setState({
          isRecording: true,
          isProcessing: false,
          videoBlob: null,
          videoUrl: null,
          error: null,
        });
      } catch (err) {
        console.error("[WatchRecorder] Failed to start:", err);
        setState((s) => ({
          ...s,
          error: "Recording not supported on this device",
        }));
      }
    },
    []
  );

  const stopRecording = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
  }, []);

  const clearRecording = useCallback(() => {
    if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    setState({
      isRecording: false,
      isProcessing: false,
      videoBlob: null,
      videoUrl: null,
      error: null,
    });
  }, [state.videoUrl]);

  const downloadVideo = useCallback(
    (filename?: string) => {
      if (!state.videoBlob) return;
      const url = URL.createObjectURL(state.videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename || "watch-session.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [state.videoBlob]
  );

  // Set title/subtitle for overlay
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (state.videoUrl) URL.revokeObjectURL(state.videoUrl);
    };
  }, []);

  return {
    ...state,
    canvasRef: canvasRef as React.RefObject<HTMLCanvasElement>,
    startRecording,
    stopRecording,
    clearRecording,
    downloadVideo,
    setTitle: (t: string) => { titleRef.current = t; },
    setSubtitle: (s: string) => { subtitleRef.current = s; },
  };
}
