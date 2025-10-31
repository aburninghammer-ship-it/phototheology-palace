import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Gift, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AccessCode() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleRedeem = async () => {
    if (!code.trim()) {
      toast({
        title: "Error",
        description: "Please enter an access code",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('redeem_access_code', {
        code_input: code.trim()
      });

      if (error) {
        console.error('RPC Error:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to redeem access code",
          variant: "destructive",
        });
        return;
      }

      // The RPC function returns a JSONB object
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      
      if (result && result.success) {
        toast({
          title: "Success!",
          description: result.message || "Access granted!",
        });
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast({
          title: "Error",
          description: result?.error || "Failed to redeem code",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error redeeming code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to redeem access code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Redeem Access Code</CardTitle>
            <CardDescription>
              Enter your special access code to unlock lifetime premium access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isAuthenticated === false && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be logged in to redeem an access code.{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto"
                    onClick={() => navigate('/auth')}
                  >
                    Sign in here
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Input
                placeholder="Enter access code (e.g., PT-XXXXXXXX)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                disabled={loading || isAuthenticated === false}
              />
            </div>
            <Button
              onClick={handleRedeem}
              disabled={loading || !code.trim() || isAuthenticated === false}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Redeem Code
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
