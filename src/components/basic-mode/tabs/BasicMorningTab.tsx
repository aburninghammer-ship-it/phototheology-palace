import { useNavigate } from "react-router-dom";

export default function BasicMorningTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold" style={{ color: "hsl(170 10% 93%)" }}>🌅 Morning Watch</h2>
        <p className="text-sm" style={{ color: "hsl(170 15% 50%)" }}>
          Start your day with a guided morning meditation. 5–8 minutes of Scripture, reflection, and prayer.
        </p>
        <button
          onClick={() => navigate("/morning-watches")}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
          style={{ background: "hsl(170 45% 38%)" }}
        >
          Begin Morning Watch
        </button>
      </div>
    </div>
  );
}
