import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { GoalsSurvey } from "@/components/goals-survey/GoalsSurvey";
import { useGoalsSurvey } from "@/hooks/useGoalsSurvey";

export default function GoalsSurveyPage() {
  const navigate = useNavigate();
  const { saveGoals, skipSurvey } = useGoalsSurvey();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 sm:py-12">
        <GoalsSurvey
          onComplete={async (goalIds) => {
            await saveGoals(goalIds);
            navigate("/palace");
          }}
          onSkip={async () => {
            await skipSurvey();
            navigate("/palace");
          }}
        />
      </main>
    </div>
  );
}
