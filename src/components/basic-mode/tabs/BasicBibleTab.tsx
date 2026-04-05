/**
 * BasicBibleTab — Redirects to the existing Study Bible within the Basic shell
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function BasicBibleTab() {
  const navigate = useNavigate();

  // For now, render an embedded-feeling Bible reader prompt
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-white">📖 Study Bible</h2>
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Read Scripture with verse-by-verse commentary powered by Phototheology insights.
        </p>
        <button
          onClick={() => navigate("/bible")}
          className="px-6 py-2.5 bg-[hsl(220,50%,45%)] hover:bg-[hsl(220,50%,50%)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Open Study Bible
        </button>
      </div>
    </div>
  );
}
