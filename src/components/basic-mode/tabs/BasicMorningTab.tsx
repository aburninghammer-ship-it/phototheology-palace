import { useNavigate } from "react-router-dom";

export default function BasicMorningTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-white">🌅 Morning Watch</h2>
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Start your day with a guided morning meditation. 5–8 minutes of Scripture, reflection, and prayer.
        </p>
        <button
          onClick={() => navigate("/morning-watch")}
          className="px-6 py-2.5 bg-[hsl(220,50%,45%)] hover:bg-[hsl(220,50%,50%)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Begin Morning Watch
        </button>
      </div>
    </div>
  );
}
