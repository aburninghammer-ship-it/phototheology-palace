import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Sparkles } from "lucide-react";

export const StudyDeckExamples = () => {
  const examples = [
    {
      emoji: "🌅",
      card: "OR",
      cardName: "Observation Room",
      floor: "Floor 2",
      passage: "Genesis 1:1-3",
      passageText: "In the beginning God created the heaven and the earth... And God said, Let there be light: and there was light.",
      question: "What do you observe in this passage? List specific details without interpretation yet.",
      answer: "• God is the subject — He initiates creation\n• Heaven and earth are created (not eternal)\n• The earth was formless, empty, and dark\n• The Spirit of God was hovering (active presence)\n• God speaks — creation happens by His word\n• Light appears before the sun (Day 4)\n• Light and darkness are separated",
      feedback: "Excellent observation work! You noticed key details: God's initiative, creation by word, pre-solar light, and the Spirit's presence. These observations set the foundation for deeper study in other rooms.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      emoji: "✝️",
      card: "DR-2D",
      cardName: "Christological Dimension",
      floor: "Floor 4",
      passage: "Exodus 12:13",
      passageText: "And the blood shall be to you for a token upon the houses where ye are: and when I see the blood, I will pass over you.",
      question: "How does this text reveal, foreshadow, or fulfill Christ?",
      answer: "The Passover lamb is a direct type of Christ:\n\n• The lamb's blood protects from death → Christ's blood saves from eternal death (1 Cor 5:7)\n• Applied to the doorposts → Christ's sacrifice must be personally applied by faith\n• Passover timing → Jesus crucified at Passover, fulfilling the type\n• Unblemished lamb → Christ without sin (1 Peter 1:19)\n• 'When I see the blood' → God accepts Christ's atonement on our behalf",
      feedback: "Outstanding Christological reading! You connected type to antitype clearly, cited supporting Scripture (1 Cor 5:7, 1 Peter 1:19), and showed how application matters. This demonstrates mastery of the 2D dimension.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      emoji: "🔄",
      card: "@Mo",
      cardName: "Mosaic Cycle",
      floor: "Floor 6",
      passage: "Hebrews 9:11-14",
      passageText: "But Christ being come an high priest... by his own blood he entered in once into the holy place, having obtained eternal redemption for us.",
      question: "Apply the Mosaic cycle (law, tabernacle, priesthood) to this text.",
      answer: "Hebrews 9 shows Christ fulfilling the Mosaic cycle:\n\n• Mosaic Priesthood → Christ is the true High Priest\n• Tabernacle → Christ enters the heavenly sanctuary (not earthly copy)\n• Blood of animals → Christ's own blood, superior and final\n• Yearly repetition → One-time, eternal redemption\n• Earthly shadows → Heavenly reality fulfilled\n\nThe Mosaic cycle pointed forward; Christ is the goal.",
      feedback: "Brilliant cycle mapping! You showed how the Mosaic system was a pattern pointing to Christ's superior priesthood and sacrifice. The contrast between shadow and substance is key to Hebrews — well done!",
      color: "from-purple-500 to-pink-500"
    }
  ];

  return (
    <Card className="border-2 border-primary/30 bg-gradient-to-br from-background to-primary/5">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="text-4xl">📚</div>
          <CardTitle className="text-2xl">Example Walkthroughs</CardTitle>
        </div>
        <p className="text-muted-foreground">
          See how principles are applied to real passages — learn by example
        </p>
      </CardHeader>
      
      <CardContent>
        <Accordion type="single" collapsible className="space-y-3">
          {examples.map((example, index) => (
            <AccordionItem 
              key={index} 
              value={`example-${index}`}
              className="border-2 border-primary/20 rounded-lg px-4 overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex items-center gap-3 text-left">
                  <span className="text-3xl">{example.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono">{example.card}</Badge>
                      <span className="font-bold">{example.cardName}</span>
                      <Badge variant="secondary" className="text-xs">{example.floor}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{example.passage}</p>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="space-y-4 pb-4">
                {/* Passage */}
                <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">Passage</span>
                  </div>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    "{example.passageText}"
                  </p>
                </div>

                {/* Card Question */}
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">❓</span>
                    <span className="font-semibold text-sm">Card Question</span>
                  </div>
                  <p className="text-sm">{example.question}</p>
                </div>

                {/* User Answer */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✍️</span>
                    <span className="font-semibold text-sm">Example Answer</span>
                  </div>
                  <p className="text-sm whitespace-pre-line">{example.answer}</p>
                </div>

                {/* Jeeves Feedback */}
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-sm">Jeeves' Feedback</span>
                  </div>
                  <p className="text-sm">{example.feedback}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Call to action */}
        <div className="mt-6 p-4 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 border-2 border-primary/30 rounded-lg text-center">
          <p className="font-semibold mb-2 flex items-center justify-center gap-2">
            <span className="text-2xl">🚀</span>
            Ready to try it yourself?
          </p>
          <p className="text-sm text-muted-foreground">
            Scroll down to pick your passage and draw your first card!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
