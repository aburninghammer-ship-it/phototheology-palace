import { useNavigate } from "react-router-dom";
import { Moon, Flame, Calendar } from "lucide-react";

export default function BasicNightTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-2"
            style={{ background: "hsl(170 25% 12%)" }}>
            <Moon className="h-7 w-7" style={{ color: "hsl(250 60% 70%)" }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: "hsl(170 10% 93%)" }}>Night & Evening Watches</h2>
          <p className="text-sm" style={{ color: "hsl(170 15% 48%)" }}>
            Cinematic meditations to quiet your mind and prepare for restful sleep.
          </p>
        </div>

        {/* Watch Options */}
        <div className="space-y-3">
          {/* Free Night Watches */}
          <button
            onClick={() => navigate("/night-watches")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:brightness-110"
            style={{
              background: "hsl(170 22% 9%)",
              borderColor: "hsl(170 20% 18%)",
            }}
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "hsl(250 60% 70% / 0.15)" }}>
              <Moon className="h-5 w-5" style={{ color: "hsl(250 60% 70%)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: "hsl(170 10% 88%)" }}>
                Free Night Watches
              </div>
              <div className="text-xs" style={{ color: "hsl(170 15% 48%)" }}>
                15-minute cinematic meditations on Scripture themes
              </div>
            </div>
          </button>

          {/* 40-Day Tracts */}
          <button
            onClick={() => navigate("/night-watches")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:brightness-110"
            style={{
              background: "hsl(170 22% 9%)",
              borderColor: "hsl(170 20% 18%)",
            }}
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "hsl(15 70% 55% / 0.15)" }}>
              <Flame className="h-5 w-5" style={{ color: "hsl(15 70% 60%)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: "hsl(170 10% 88%)" }}>
                40-Day Tracts
              </div>
              <div className="text-xs" style={{ color: "hsl(170 15% 48%)" }}>
                Deep 40-day guided journeys through major biblical themes
              </div>
            </div>
          </button>

          {/* 365-Day Journeys */}
          <button
            onClick={() => navigate("/night-watches")}
            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:brightness-110"
            style={{
              background: "hsl(170 22% 9%)",
              borderColor: "hsl(170 20% 18%)",
            }}
          >
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "hsl(38 65% 55% / 0.15)" }}>
              <Calendar className="h-5 w-5" style={{ color: "hsl(38 65% 60%)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold" style={{ color: "hsl(170 10% 88%)" }}>
                365-Day Journeys
              </div>
              <div className="text-xs" style={{ color: "hsl(170 15% 48%)" }}>
                Year-long nightly meditation through the entire Bible
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
