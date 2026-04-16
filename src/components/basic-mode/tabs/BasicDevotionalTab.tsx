import { useNavigate } from "react-router-dom";

export default function BasicDevotionalTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold" style={{ color: "hsl(170 10% 93%)" }}>✨ Daily Devotional</h2>
        <p className="text-sm" style={{ color: "hsl(170 15% 50%)" }}>
          A fresh, deep devotional written daily by Reginald using Phototheology principles. Read or listen.
        </p>
        <button
          onClick={() => navigate("/daily-audio-devotional")}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
          style={{ background: "hsl(170 45% 38%)" }}
        >
          Today's Devotional
        </button>
      </div>
    </div>
  );
}
