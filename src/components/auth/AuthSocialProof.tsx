import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Shield, Star } from "lucide-react";

export function AuthSocialProof() {
  const [userCount, setUserCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserCount = async () => {
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });
      setUserCount(count);
    };
    fetchUserCount();
  }, []);

  return (
    <div className="space-y-4">
      {/* User count badge */}
      {userCount && userCount > 100 && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Join {userCount.toLocaleString()}+ believers building their palace</span>
        </div>
      )}

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Shield className="h-3 w-3 text-green-500" />
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500" />
          <span>No credit card</span>
        </div>
      </div>

      {/* Mini testimonial */}
      <div className="text-center px-4 py-3 bg-muted/50 rounded-lg">
        <p className="text-sm italic text-muted-foreground">
          "Finally, a Bible study method that actually sticks!"
        </p>
        <p className="text-xs text-muted-foreground mt-1">— Sarah M., Teacher</p>
      </div>

      {/* Value props */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span>🎯 Memorize Scripture</span>
        <span>📖 Christ-centered</span>
        <span>🤖 AI Guide</span>
      </div>
    </div>
  );
}
