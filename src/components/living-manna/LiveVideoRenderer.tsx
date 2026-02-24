import { useTracks, VideoTrack, RoomAudioRenderer } from "@livekit/components-react";
import { Track } from "livekit-client";
import { Radio } from "lucide-react";

export function LiveVideoRenderer() {
  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.ScreenShare,
  ]);

  // Prioritize screen share over camera
  const screenTrack = tracks.find(
    (t) => t.source === Track.Source.ScreenShare
  );
  const cameraTrack = tracks.find(
    (t) => t.source === Track.Source.Camera
  );
  const videoTrack = screenTrack || cameraTrack;

  return (
    <>
      <RoomAudioRenderer />
      <div className="relative aspect-video bg-black rounded-xl overflow-hidden">
        {videoTrack ? (
          <VideoTrack
            trackRef={videoTrack}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <Radio className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Waiting for host to start broadcasting...</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
