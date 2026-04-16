import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GraduationCap, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function TeachableVerification() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [verifying, setVerifying] = useState(false);

  const { data: teachableStatus, isLoading } = useQuery({
    queryKey: ["teachable-status", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("teachable_students")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleVerify = async () => {
    if (!user) return;
    
    setVerifying(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke("verify-teachable", {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const result = response.data;
      
      if (result.verified) {
        toast.success("Successfully verified as Teachable student! You now have full premium access.");
        queryClient.invalidateQueries({ queryKey: ["teachable-status"] });
        queryClient.invalidateQueries({ queryKey: ["teachable-access"] });
        queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      } else {
        toast.error(result.message || "Could not verify Teachable enrollment");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to verify Teachable account. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="border-orange-500/20">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-500/20 bg-gradient-to-br from-orange-950/20 to-amber-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-6 h-6 text-orange-400" />
            <CardTitle className="text-lg">Teachable Student Access</CardTitle>
          </div>
          {teachableStatus?.is_active && (
            <Badge className="bg-green-600/20 text-green-400 border-green-500/30">
              <CheckCircle className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        <CardDescription>
          If you're enrolled in a Phototheology course on Teachable, verify your account to unlock full premium access.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {teachableStatus?.is_active ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-5 h-5" />
              <span>You have premium access as a Teachable student!</span>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Course:</strong> {teachableStatus.course_name}</p>
              <p><strong>Verified:</strong> {new Date(teachableStatus.verified_at).toLocaleDateString()}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-2 text-amber-300/80 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Make sure you're signed in with the same email address you used for your Teachable account.
              </p>
            </div>
            <Button 
              onClick={handleVerify} 
              disabled={verifying}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Verify Teachable Account
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
