import { CompleteCheckoutModal } from "@/components/CompleteCheckoutModal";
import { useIncompleteSignup } from "@/hooks/useIncompleteSignup";

/**
 * Renders a modal prompting users who abandoned checkout to complete their signup.
 * Detects users with payment_source='manual' and tier='free'.
 */
export function IncompleteSignupPrompt() {
  const { showCheckoutModal, userName, dismissModal } = useIncompleteSignup();

  return (
    <CompleteCheckoutModal
      open={showCheckoutModal}
      onOpenChange={(open) => { if (!open) dismissModal(); }}
      userName={userName}
    />
  );
}
