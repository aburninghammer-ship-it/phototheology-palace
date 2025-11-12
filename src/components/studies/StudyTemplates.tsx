import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, BookOpen, Sparkles, Users } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  content: string;
}

const STUDY_TEMPLATES: Template[] = [
  {
    id: "verse-analysis",
    name: "Verse Analysis",
    description: "Deep dive into a single verse",
    icon: BookOpen,
    content: `# Verse Analysis

**Verse:** [Book Chapter:Verse]

**Text:**
[Insert verse text here]

## Observation (OR)
• What do I notice in this verse?
• Key words and phrases:
• Context:

## Interpretation (IR)
• What does this mean?
• How does this apply?

## Christ Connection (CR)
• How does this reveal Christ?

## Application
• How does this apply to my life today?

## Prayer
[Write a prayer based on this verse]`,
  },
  {
    id: "chapter-study",
    name: "Chapter Study",
    description: "Comprehensive chapter analysis",
    icon: FileText,
    content: `# Chapter Study

**Book & Chapter:** [Book Chapter]

## Overview
• Main theme:
• Key events:
• Important characters:

## Verse-by-Verse Notes
[Take notes on key verses]

## Dimensions (5D)
1. **Literal:** What happened?
2. **Christ:** How does this point to Christ?
3. **Personal:** What does this mean for me?
4. **Church:** What does this mean for the church?
5. **Heaven:** What does this reveal about eternity?

## Cross-References
• Related passages:

## Key Takeaways
1.
2.
3.

## Application
How will I apply this today?`,
  },
  {
    id: "theme-study",
    name: "Theme Study",
    description: "Explore a biblical theme",
    icon: Sparkles,
    content: `# Theme Study

**Theme:** [Your theme here]

## Definition
What is this theme about?

## Old Testament Examples
• 
• 
• 

## New Testament Examples
• 
• 
• 

## Christ Connection
How does Christ fulfill or embody this theme?

## Key Verses
1.
2.
3.

## Personal Application
How does this theme apply to my life?

## Questions to Explore
• 
• `,
  },
  {
    id: "sermon-notes",
    name: "Sermon Notes",
    description: "Take notes during sermons",
    icon: Users,
    content: `# Sermon Notes

**Date:** [Date]
**Speaker:** [Name]
**Title:** [Sermon Title]
**Text:** [Scripture Reference]

## Main Points
1.
2.
3.

## Key Quotes
"[Quote 1]"

"[Quote 2]"

## Scripture References
• 
• 

## Personal Insights
What stood out to me:

## Application
How will I apply this week:

## Prayer Requests
• `,
  },
];

interface StudyTemplatesProps {
  onSelect: (template: Template) => void;
}

export const StudyTemplates = ({ onSelect }: StudyTemplatesProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Start from Template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose a Study Template</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="grid gap-4">
            {STUDY_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => onSelect(template)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
