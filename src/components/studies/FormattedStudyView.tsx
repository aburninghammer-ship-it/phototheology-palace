import { formatJeevesResponse } from "@/lib/formatJeevesResponse";
import { Card } from "@/components/ui/card";

interface FormattedStudyViewProps {
  content: string;
}

export const FormattedStudyView = ({ content }: FormattedStudyViewProps) => {
  // Clean content to remove any circular capital letter artifacts
  const cleanContent = (text: string) => {
    // Remove any HTML-like tags that might create circular letters
    return text
      .replace(/<span[^>]*class="[^"]*capital-letter[^"]*"[^>]*>([A-Z])<\/span>/gi, '$1')
      .replace(/\[([A-Z])\]/g, '$1') // Remove [A] style brackets
      .replace(/\{([A-Z])\}/g, '$1') // Remove {A} style braces
      .trim();
  };

  const cleanedContent = cleanContent(content);
  
  // Split content by Jeeves Research sections
  const sections = cleanedContent.split(/(?=### Jeeves Research:)/);
  
  return (
    <div className="space-y-6">
      {sections.map((section, index) => {
        if (!section.trim()) return null;
        
        // Check if this is a Jeeves Research section
        const isJeevesSection = section.includes("### Jeeves Research:");
        
        if (isJeevesSection) {
          // Extract the question and content
          const lines = section.split('\n');
          const questionLine = lines.find(l => l.includes("### Jeeves Research:"));
          const timestampLine = lines.find(l => l.includes("*Saved on"));
          
          // Get content after the timestamp
          const timestampIndex = lines.findIndex(l => l.includes("*Saved on"));
          const jeevesContent = lines.slice(timestampIndex + 1).join('\n').trim();
          
          return (
            <Card key={index} className="p-6 bg-gradient-to-br from-card to-muted/30 border-primary/20 shadow-lg">
              <div className="mb-6 pb-4 border-b border-border/50">
                <div className="flex items-start gap-3 mb-2">
                  <span className="text-3xl">🤖</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-1">
                      {questionLine?.replace("### Jeeves Research:", "").trim() || "Jeeves Research"}
                    </h3>
                    {timestampLine && (
                      <p className="text-xs text-muted-foreground">
                        {timestampLine.replace(/\*/g, "")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="jeeves-response space-y-4">
                {formatJeevesResponse(jeevesContent)}
              </div>
            </Card>
          );
        }
        
        // Regular content (non-Jeeves) - use formatJeevesResponse for consistency
        return (
          <Card key={index} className="p-6 shadow-sm">
            <div className="formatted-content space-y-4">
              {formatJeevesResponse(section)}
            </div>
          </Card>
        );
      })}
    </div>
  );
};
