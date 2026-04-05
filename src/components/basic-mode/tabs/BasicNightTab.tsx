import { useNavigate } from "react-router-dom";

export default function BasicNightTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-white">🌙 Night Watch</h2>
        <p className="text-sm text-[hsl(220,10%,55%)]">
          End your day with a 15-minute cinematic meditation. Let Scripture quiet your mind for restful sleep.
        </p>
        <button
          onClick={() => navigate("/night-watch")}
          className="px-6 py-2.5 bg-[hsl(220,50%,45%)] hover:bg-[hsl(220,50%,50%)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Begin Night Watch
        </button>
      </div>
    </div>
  );
}
