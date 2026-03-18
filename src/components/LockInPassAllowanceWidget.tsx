import { Link } from "react-router-dom";
import { Flame, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLockInMonthlyUsage } from "@/hooks/useLockInPass";
import { useAuth } from "@/hooks/useAuth";

export function LockInPassAllowanceWidget() {
  const { user } = useAuth();
  const { passesRemaining, loading } = useLockInMonthlyUsage();

  if (!user || loading) return null;

  return (
    <Link to="/gift">
      <Card className="group border-primary/20 bg-gradient-to-r from-primary/5 via-orange-500/5 to-primary/5 hover:border-primary/40 transition-all cursor-pointer">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-500/15 flex items-center justify-center">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                🔥 You have {passesRemaining} Lock-In {passesRemaining === 1 ? "Pass" : "Passes"} to share this month
              </p>
              <p className="text-xs text-muted-foreground">
                Give someone 5 days of full access — no credit card needed
              </p>
            </div>
          </div>
          <Gift className="h-5 w-5 text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
        </CardContent>
      </Card>
    </Link>
  );
}
