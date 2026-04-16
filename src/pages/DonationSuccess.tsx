import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Home } from "lucide-react";
import { useEventTracking } from "@/hooks/useEventTracking";

const DonationSuccess = () => {
  const navigate = useNavigate();
  const { trackPurchaseCompleted } = useEventTracking();

  // Track donation on page load
  useEffect(() => {
    trackPurchaseCompleted("donation");
  }, [trackPurchaseCompleted]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Thank You!</h1>
        <p className="text-muted-foreground">
          Your generous donation helps us continue improving Phototheology. We're
          grateful for your support in making Bible study more accessible and
          engaging for everyone.
        </p>
        <Button onClick={() => navigate("/")} className="gap-2">
          <Home className="h-4 w-4" />
          Return Home
        </Button>
      </div>
    </div>
  );
};

export default DonationSuccess;
