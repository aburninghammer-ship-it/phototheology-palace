import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { formatJeevesResponse } from "@/lib/formatJeevesResponse";

interface StyledMarkdownProps {
  content: string;
  className?: string;
}

// Use the comprehensive formatJeevesResponse for all markdown rendering
export function StyledMarkdown({ content, className }: StyledMarkdownProps) {
  return (
    <div className={cn("styled-markdown", className)}>
      {formatJeevesResponse(content)}
    </div>
  );
}

// Enhanced version with section cards for long-form AI content
export function StyledMarkdownSections({ content, className }: StyledMarkdownProps) {
  // Split content by main headings (##) to create visual sections
  const sections = content.split(/(?=^## )/m).filter(Boolean);
  
  if (sections.length <= 1) {
    return <StyledMarkdown content={content} className={className} />;
  }

  const colors = [
    'from-blue-500/10 to-blue-500/5 border-blue-500/30',
    'from-purple-500/10 to-purple-500/5 border-purple-500/30',
    'from-green-500/10 to-green-500/5 border-green-500/30',
    'from-amber-500/10 to-amber-500/5 border-amber-500/30',
    'from-pink-500/10 to-pink-500/5 border-pink-500/30',
    'from-cyan-500/10 to-cyan-500/5 border-cyan-500/30',
  ];
  
  const emojis = ['📖', '✝️', '📜', '⚖️', '💡', '🙏', '🌟', '🔍'];

  return (
    <div className={cn("space-y-6", className)}>
      {sections.map((section, idx) => {
        const isFirstSection = idx === 0 && !section.startsWith("## ");
        
        if (isFirstSection) {
          return (
            <div key={idx} className="prose prose-lg dark:prose-invert max-w-none">
              <StyledMarkdown content={section} />
            </div>
          );
        }
        
        // Extract the heading and content
        const lines = section.split('\n');
        const heading = lines[0].replace(/^## /, '').trim();
        const sectionContent = lines.slice(1).join('\n');
        
        const colorClass = colors[idx % colors.length];
        const emoji = emojis[idx % emojis.length];
        
        return (
          <div 
            key={idx} 
            className={cn(
              "rounded-xl border-2 overflow-hidden bg-gradient-to-br",
              colorClass
            )}
          >
            <div className="px-6 py-4 bg-background/50 border-b border-inherit">
              <h3 className="text-xl font-bold flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                {heading}
              </h3>
            </div>
            <div className="p-6">
              <StyledMarkdown content={sectionContent} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
