import { useState, useCallback } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { supabase } from "@/integrations/supabase/client";

const stripePromise = loadStripe("pk_live_UywRSpOzIemPuUSh3PL77hN3");

interface EmbeddedCheckoutFormProps {
  plan?: string;
  billing?: string;
}

export function EmbeddedCheckoutForm({ plan = "premium", billing = "monthly" }: EmbeddedCheckoutFormProps) {
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = useCallback(async () => {
    const { data, error } = await supabase.functions.invoke("create-embedded-checkout", {
      body: { plan, billing },
    });
    if (error || !data?.clientSecret) {
      const msg = error?.message || "Failed to create checkout session";
      setError(msg);
      throw new Error(msg);
    }
    return data.clientSecret as string;
  }, [plan, billing]);

  if (error) {
    return (
      <div className="text-center py-8 text-destructive text-sm">
        <p>{error}</p>
        <button onClick={() => setError(null)} className="underline mt-2 text-primary">
          Try again
        </button>
      </div>
    );
  }

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout className="w-full" />
    </EmbeddedCheckoutProvider>
  );
}
