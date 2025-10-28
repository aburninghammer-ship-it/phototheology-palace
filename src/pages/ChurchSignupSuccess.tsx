import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function ChurchSignupSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/church-signup');
      return;
    }

    // Give webhook time to process (typically very fast)
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, navigate]);

  if (verifying) {
    return (
      <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Processing Your Payment...</h2>
              <p className="text-muted-foreground">
                Setting up your church account. This will only take a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Your church has been registered and your subscription is now active.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-2">What's Next?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Access your church admin dashboard</li>
                  <li>• Invite members to join your church</li>
                  <li>• Create campaigns and study challenges</li>
                  <li>• Track engagement and analytics</li>
                </ul>
              </div>

              <Button 
                onClick={() => navigate('/church-admin')}
                size="lg"
                className="w-full"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
