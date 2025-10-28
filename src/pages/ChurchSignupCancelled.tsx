import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function ChurchSignupCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      
      <div className="container mx-auto max-w-2xl px-4 py-20">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
              <p className="text-muted-foreground mb-6">
                Your church registration was not completed. No charges were made.
              </p>
              
              <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold mb-2">Want to try again?</h3>
                <p className="text-sm text-muted-foreground">
                  You can restart the registration process and complete your payment whenever you're ready.
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1"
                >
                  Go Home
                </Button>
                <Button 
                  onClick={() => navigate('/church-signup')}
                  className="flex-1"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
