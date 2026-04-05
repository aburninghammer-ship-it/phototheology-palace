import { useNavigate } from "react-router-dom";

export default function BasicAudioTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-white">🎧 Audio Commentary</h2>
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Listen to chapter-by-chapter Bible commentary. Perfect for driving, walking, or winding down.
        </p>
        <button
          onClick={() => navigate("/audio-library")}
          className="px-6 py-2.5 bg-[hsl(220,50%,45%)] hover:bg-[hsl(220,50%,50%)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Open Audio Library
        </button>
      </div>
    </div>
  );
}
