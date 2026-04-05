import { useNavigate } from "react-router-dom";

export default function BasicPlansTab() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center px-6">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-xl font-bold text-white">📅 Reading Plans</h2>
        <p className="text-sm text-[hsl(220,10%,55%)]">
          Follow a structured Bible reading plan. Stay consistent with daily reading goals.
        </p>
        <button
          onClick={() => navigate("/reading-plans")}
          className="px-6 py-2.5 bg-[hsl(220,50%,45%)] hover:bg-[hsl(220,50%,50%)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          View Reading Plans
        </button>
      </div>
    </div>
  );
}
