import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function PatreonCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const processedRef = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double-processing (React StrictMode / double-render protection)
      if (processedRef.current) {
        console.log("Patreon callback already processed, skipping");
        return;
      }
      
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        toast.error("Patreon connection cancelled");
        navigate("/auth?patreon=true");
        return;
      }

      if (!code) {
        toast.error("No authorization code received");
        navigate("/auth?patreon=true");
        return;
      }

      // Mark as processed BEFORE the async call
      processedRef.current = true;
      
      // Also check sessionStorage to prevent page refresh re-submission
      const processedCode = sessionStorage.getItem("patreon_processed_code");
      if (processedCode === code) {
        console.log("This Patreon code was already processed");
        navigate("/dashboard");
        return;
      }
      
      // Store the code we're processing
      sessionStorage.setItem("patreon_processed_code", code);

      try {
        // Use canonical domain for Patreon OAuth (must match what was sent in patreon-auth)
        const redirectUri = "https://phototheology.app/patreon-callback";
        
        const { data, error: fnError } = await supabase.functions.invoke("patreon-callback", {
          body: {
            code,
            redirectUri,
            userId: user?.id,
          },
        });

        if (fnError) throw fnError;

        if (data.hasAccess && data.userLinked) {
          // Active patron at $15/month or higher AND linked to account
          toast.success(`Welcome, ${data.patreonName}! Your Patron benefits are now active.`);
          navigate("/dashboard");
        } else if (data.hasAccess && !data.userLinked) {
          // Active patron but not linked - they need to sign up/login with matching email
          toast.info(`Great news, ${data.patreonName}! You're an active patron. Please sign up or log in with the email ${data.patreonEmail} to activate your benefits.`, { duration: 8000 });
          navigate("/auth");
        } else if (data.isActivePatron && !data.meetsMinimumPledge) {
          // Active patron but below $15/month minimum
          const currentPledge = (data.entitledCents / 100).toFixed(2);
          const minimumPledge = (data.minimumPledgeCents / 100).toFixed(2);
          toast.info(`Thanks for your support, ${data.patreonName}! Your current pledge is $${currentPledge}/month. Upgrade to $${minimumPledge}/month on Patreon to unlock full app access.`);
          navigate("/pricing");
        } else {
          // Not an active patron
          toast.info("Connected to Patreon, but no active patronage found. Become a Patron at $15/month for full access!");
          navigate("/pricing");
        }
      } catch (err) {
        console.error("Patreon callback error:", err);
        // Clear the processed code on error so user can retry
        sessionStorage.removeItem("patreon_processed_code");
        toast.error("Failed to connect Patreon account. Please try again.");
        navigate("/auth?patreon=true");
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, user, navigate]);

  return <LoadingScreen message="Connecting your Patreon account..." />;
}
