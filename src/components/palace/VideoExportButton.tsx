import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Video, Download, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { buildAllSegments } from "@/data/tourScripts";
import type { TourDefinition } from "@/data/tourScripts";
import reginaldAvatar from "@/assets/avatars/reginald-avatar.png";

interface VideoExportButtonProps {
  tour: TourDefinition;
}

type ExportStage = "idle" | "fetching" | "combining" | "rendering" | "done" | "error";

export function VideoExportButton({ tour }: VideoExportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stage, setStage] = useState<ExportStage>("idle");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const cancelRef = useRef(false);

  const allSegments = buildAllSegments(tour);

  const fetchAllAudio = useCallback(async (): Promise<ArrayBuffer[]> => {
    const buffers: ArrayBuffer[] = [];
    for (let i = 0; i < allSegments.length; i++) {
      if (cancelRef.current) throw new Error("Cancelled");
      const seg = allSegments[i];
      setStatusText(`Fetching audio ${i + 1}/${allSegments.length}: ${seg.title}`);
      setProgress(((i) / allSegments.length) * 40);

      const { data, error } = await supabase.functions.invoke("generate-palace-tour-audio", {
        body: { text: seg.script, guide: seg.guide, segmentId: seg.id, tourId: tour.id },
      });
      if (error) throw new Error(`Audio fetch failed for segment ${i}: ${error.message}`);
      const audioUrl = data?.audioUrl;
      if (!audioUrl) throw new Error(`No audio URL for segment ${i}`);

      const resp = await fetch(audioUrl);
      if (!resp.ok) throw new Error(`Failed to download audio segment ${i}`);
      buffers.push(await resp.arrayBuffer());
    }
    return buffers;
  }, [allSegments, tour.id]);

  const concatenateAudio = useCallback(async (buffers: ArrayBuffer[]): Promise<Blob> => {
    setStatusText("Combining audio segments...");
    setProgress(45);

    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 44100 });
    const decodedBuffers: AudioBuffer[] = [];

    for (let i = 0; i < buffers.length; i++) {
      if (cancelRef.current) throw new Error("Cancelled");
      setStatusText(`Decoding segment ${i + 1}/${buffers.length}...`);
      setProgress(45 + ((i) / buffers.length) * 15);
      try {
        const decoded = await audioCtx.decodeAudioData(buffers[i].slice(0));
        decodedBuffers.push(decoded);
      } catch (e) {
        console.warn(`Skipping segment ${i} decode error`, e);
      }
    }

    const totalLength = decodedBuffers.reduce((s, b) => s + b.length, 0);
    const channels = Math.max(...decodedBuffers.map(b => b.numberOfChannels), 1);
    const combined = audioCtx.createBuffer(channels, totalLength, 44100);

    let offset = 0;
    for (const buf of decodedBuffers) {
      for (let ch = 0; ch < channels; ch++) {
        const channelData = ch < buf.numberOfChannels ? buf.getChannelData(ch) : buf.getChannelData(0);
        combined.getChannelData(ch).set(channelData, offset);
      }
      offset += buf.length;
    }

    // Encode to WAV
    const wavBlob = audioBufferToWav(combined);
    await audioCtx.close();
    return wavBlob;
  }, []);

  const renderVideo = useCallback(async (audioBlob: Blob): Promise<Blob> => {
    setStatusText("Rendering video — this may take a minute...");
    setProgress(65);

    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d")!;

    // Load avatar image
    const avatarImg = new Image();
    avatarImg.crossOrigin = "anonymous";
    await new Promise<void>((resolve, reject) => {
      avatarImg.onload = () => resolve();
      avatarImg.onerror = reject;
      avatarImg.src = reginaldAvatar;
    });

    // Create audio element for playback timing
    const audioUrl = URL.createObjectURL(audioBlob);
    const audioEl = new Audio(audioUrl);
    await new Promise<void>((resolve) => {
      audioEl.onloadedmetadata = () => resolve();
      audioEl.load();
    });
    const totalDuration = audioEl.duration;

    // Set up MediaRecorder
    const stream = canvas.captureStream(24);
    
    // Create audio context for mixing into the stream
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaElementSource(audioEl);
    const destination = audioCtx.createMediaStreamDestination();
    source.connect(destination);
    source.connect(audioCtx.destination); // for timing

    // Add audio tracks to video stream
    destination.stream.getAudioTracks().forEach(track => stream.addTrack(track));

    const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
      ? "video/webm;codecs=vp9,opus"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")
        ? "video/webm;codecs=vp8,opus"
        : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 2_500_000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };

    const videoPromise = new Promise<Blob>((resolve, reject) => {
      recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      recorder.onerror = (e) => reject(e);
    });

    // Decode audio for waveform visualization
    const audioArrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioCtx.decodeAudioData(audioArrayBuffer.slice(0));
    const waveformData = audioBuffer.getChannelData(0);

    recorder.start(1000);
    audioEl.play();

    // Render loop
    const drawFrame = () => {
      if (cancelRef.current) {
        recorder.stop();
        audioEl.pause();
        return;
      }
      const currentTime = audioEl.currentTime;
      const progressPct = currentTime / totalDuration;
      setProgress(65 + progressPct * 30);
      setStatusText(`Rendering: ${Math.floor(currentTime)}s / ${Math.floor(totalDuration)}s`);

      // Find current segment
      let elapsed = 0;
      let currentSegIdx = 0;
      for (let i = 0; i < allSegments.length; i++) {
        elapsed += allSegments[i].estimatedSeconds;
        if (currentTime < elapsed) { currentSegIdx = i; break; }
        if (i === allSegments.length - 1) currentSegIdx = i;
      }
      const seg = allSegments[currentSegIdx];

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#1a1025");
      gradient.addColorStop(0.5, "#0f172a");
      gradient.addColorStop(1, "#1e1b4b");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle animated pattern
      const time = currentTime * 0.3;
      ctx.save();
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 6; i++) {
        const x = canvas.width * 0.5 + Math.sin(time + i * 1.2) * 200;
        const y = canvas.height * 0.5 + Math.cos(time + i * 0.8) * 150;
        const r = 100 + Math.sin(time + i) * 40;
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, "#8b5cf6");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.restore();

      // Top bar — Phototheology branding
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0, 0, canvas.width, 60);
      ctx.fillStyle = "#a78bfa";
      ctx.font = "bold 18px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText("PHOTOTHEOLOGY PALACE", 30, 38);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText("🎧 Audio Tour", canvas.width - 30, 38);

      // Avatar circle
      const avatarSize = 120;
      const avatarX = canvas.width / 2;
      const avatarY = 200;
      ctx.save();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2 + 4, 0, Math.PI * 2);
      ctx.fillStyle = "#a78bfa";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(avatarX, avatarY, avatarSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(avatarImg, avatarX - avatarSize / 2, avatarY - avatarSize / 2, avatarSize, avatarSize);
      ctx.restore();

      // Guide name
      ctx.fillStyle = "#e2e8f0";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(seg.guide === "jeeves" ? "🎩 Jeeves — AI Scholar" : "🎩 Reginald — Concierge", avatarX, avatarY + 80);

      // Tour title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(tour.title, canvas.width / 2, 340);

      // Current segment
      ctx.fillStyle = "#c4b5fd";
      ctx.font = "20px sans-serif";
      ctx.fillText(`${seg.roomName} — ${seg.floorName}`, canvas.width / 2, 375);

      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = "16px sans-serif";
      const segTitle = seg.title.length > 60 ? seg.title.slice(0, 57) + "..." : seg.title;
      ctx.fillText(segTitle, canvas.width / 2, 405);

      // Waveform visualization
      const waveY = 480;
      const waveH = 60;
      const waveW = canvas.width - 120;
      const waveX = 60;
      const sampleStart = Math.floor((currentTime / totalDuration) * waveformData.length);
      const barsCount = 80;
      const barWidth = waveW / barsCount;

      for (let i = 0; i < barsCount; i++) {
        const sampleIdx = Math.min(sampleStart + i * 200, waveformData.length - 1);
        const amplitude = Math.abs(waveformData[sampleIdx] || 0);
        const barH = Math.max(4, amplitude * waveH * 3);
        const x = waveX + i * barWidth;
        
        const barGrad = ctx.createLinearGradient(x, waveY - barH, x, waveY + barH);
        barGrad.addColorStop(0, "#a78bfa");
        barGrad.addColorStop(0.5, "#8b5cf6");
        barGrad.addColorStop(1, "#6d28d9");
        ctx.fillStyle = barGrad;
        ctx.fillRect(x, waveY - barH / 2, barWidth - 2, barH);
      }

      // Progress bar
      const barY = 560;
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      roundRect(ctx, waveX, barY, waveW, 8, 4);
      ctx.fill();
      ctx.fillStyle = "#a78bfa";
      roundRect(ctx, waveX, barY, waveW * progressPct, 8, 4);
      ctx.fill();

      // Time
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "14px sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(formatTime(currentTime), waveX, barY + 28);
      ctx.textAlign = "right";
      ctx.fillText(formatTime(totalDuration), waveX + waveW, barY + 28);

      // Verse text at bottom
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "italic 14px sans-serif";
      ctx.textAlign = "center";
      const verseText = tour.verseText.length > 80 ? tour.verseText.slice(0, 77) + "..." : tour.verseText;
      ctx.fillText(`"${verseText}"`, canvas.width / 2, 650);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.font = "12px sans-serif";
      ctx.fillText(`— ${tour.verse}`, canvas.width / 2, 672);

      // CTA
      ctx.fillStyle = "rgba(167,139,250,0.3)";
      ctx.font = "bold 13px sans-serif";
      ctx.fillText("phototheologybible.com", canvas.width / 2, 700);

      if (!audioEl.ended && !audioEl.paused) {
        requestAnimationFrame(drawFrame);
      } else if (audioEl.ended) {
        // Draw a few more frames then stop
        setTimeout(() => recorder.stop(), 500);
      }
    };

    drawFrame();
    const videoBlob = await videoPromise;

    audioEl.pause();
    URL.revokeObjectURL(audioUrl);
    await audioCtx.close();

    return videoBlob;
  }, [allSegments, tour]);

  const handleExport = useCallback(async () => {
    cancelRef.current = false;
    setStage("fetching");
    setProgress(0);

    try {
      const audioBuffers = await fetchAllAudio();
      if (cancelRef.current) return;

      setStage("combining");
      const audioBlob = await concatenateAudio(audioBuffers);
      if (cancelRef.current) return;

      setStage("rendering");
      const videoBlob = await renderVideo(audioBlob);
      if (cancelRef.current) return;

      // Download
      const url = URL.createObjectURL(videoBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${tour.id}-palace-tour.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      setStage("done");
      setProgress(100);
      setStatusText("Video ready!");
      toast.success("Video downloaded! Upload it directly to Facebook for native playback.");
    } catch (err: any) {
      if (err.message === "Cancelled") return;
      console.error("Video export error:", err);
      setStage("error");
      setStatusText(err.message || "Export failed");
      toast.error("Video export failed. Please try again.");
    }
  }, [fetchAllAudio, concatenateAudio, renderVideo, tour.id]);

  const handleCancel = () => {
    cancelRef.current = true;
    setStage("idle");
    setProgress(0);
    setStatusText("");
  };

  const handleClose = () => {
    if (stage === "fetching" || stage === "combining" || stage === "rendering") {
      handleCancel();
    }
    setDialogOpen(false);
    setStage("idle");
    setProgress(0);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2 justify-start"
        onClick={() => setDialogOpen(true)}
      >
        <Video className="h-4 w-4 text-purple-500" /> Download as Video
      </Button>

      <Dialog open={dialogOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-purple-500" /> Export Tour as Video
            </DialogTitle>
            <DialogDescription>
              Download a shareable video with audio & visuals you can upload directly to Facebook, Instagram, or YouTube.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-lg p-4 text-white aspect-video flex flex-col items-center justify-center gap-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent)] pointer-events-none" />
              <span className="text-3xl">{tour.emoji}</span>
              <p className="font-bold text-sm text-center z-10">{tour.title}</p>
              <p className="text-xs text-purple-300 z-10">{tour.subtitle}</p>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-purple-400/60 rounded-full"
                    style={{ height: `${8 + Math.sin(i * 0.8) * 8}px` }}
                  />
                ))}
              </div>
            </div>

            {stage === "idle" && (
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                  <p>• Generates all audio segments from the tour</p>
                  <p>• Creates a branded video with waveform visualization</p>
                  <p>• Downloads as .webm (supported by Facebook, YouTube, Instagram)</p>
                  <p className="text-amber-400 mt-2">⏱ This may take several minutes for longer tours</p>
                </div>
                <Button onClick={handleExport} className="w-full gap-2 bg-purple-600 hover:bg-purple-700">
                  <Download className="h-4 w-4" /> Generate & Download Video
                </Button>
              </div>
            )}

            {(stage === "fetching" || stage === "combining" || stage === "rendering") && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                  <span className="text-sm">{statusText}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground text-center">
                  {stage === "fetching" && "Generating audio for each segment..."}
                  {stage === "combining" && "Merging audio segments into one track..."}
                  {stage === "rendering" && "Recording video — please keep this tab open"}
                </p>
                <Button variant="outline" onClick={handleCancel} className="w-full">
                  Cancel
                </Button>
              </div>
            )}

            {stage === "done" && (
              <div className="space-y-3 text-center">
                <div className="text-4xl">🎬</div>
                <p className="font-medium text-sm">Video exported successfully!</p>
                <p className="text-xs text-muted-foreground">
                  Upload it to Facebook, Instagram, or YouTube for native playback. 
                  Your audience can listen without needing an account!
                </p>
                <Button onClick={handleExport} variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" /> Export Again
                </Button>
              </div>
            )}

            {stage === "error" && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{statusText}</span>
                </div>
                <Button onClick={handleExport} className="w-full gap-2">
                  <Download className="h-4 w-4" /> Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helpers
function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const dataSize = length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, totalSize - 8, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bytesPerSample * 8, true);
  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(buffer.getChannelData(ch));
  }

  for (let i = 0; i < length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, channels[ch][i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}
