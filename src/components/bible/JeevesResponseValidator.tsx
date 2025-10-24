import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { validateJeevesResponse } from "@/utils/palaceValidation";

interface JeevesResponseValidatorProps {
  response: string;
  onValidated?: (isValid: boolean) => void;
}

/**
 * CRITICAL COMPONENT: Validates Jeeves responses to catch hallucinations
 * 
 * This component checks responses against the Palace data structure
 * and alerts users if Jeeves has made up content or confused rooms.
 */
export const JeevesResponseValidator: React.FC<JeevesResponseValidatorProps> = ({ 
  response, 
  onValidated 
}) => {
  const validation = validateJeevesResponse(response);
  
  // Notify parent of validation result
  if (onValidated) {
    onValidated(validation.valid);
  }
  
  // If valid, don't show anything
  if (validation.valid) {
    return null;
  }
  
  // Show validation errors
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Palace Validation Error</AlertTitle>
      <AlertDescription className="space-y-2">
        <p className="font-semibold">Jeeves appears to have hallucinated content that doesn't match the Palace structure:</p>
        <ul className="list-disc pl-5 space-y-1">
          {validation.errors.map((error, idx) => (
            <li key={idx} className="text-sm">{error}</li>
          ))}
        </ul>
        <p className="text-sm mt-3 italic">
          Please report this to help us improve accuracy. Only content from the actual Palace rooms should be used.
        </p>
      </AlertDescription>
    </Alert>
  );
};
