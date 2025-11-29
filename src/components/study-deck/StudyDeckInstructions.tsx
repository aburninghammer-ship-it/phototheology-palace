import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

const STEP_DATA = [
  {
    step: 1,
    title: "Draw a Card",
    emoji: "🎯",
    icon: Sparkles,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    description: "Let Jeeves pick a random principle card for you, or choose your own from the deck below. Each card represents a Phototheology lens to apply to Scripture.",
  },
  {
    step: 2,
    title: "Apply to Passage",
    emoji: "📖",
    icon: BookOpen,
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    description: "Enter a verse or story, then use the card's principle to interpret, observe, or connect. Answer the card's guiding question with biblical insight.",
  },
  {
    step: 3,
    title: "Get Feedback",
    emoji: "💎",
    icon: Lightbulb,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    description: "Submit your answer and receive Jeeves' feedback. Save discoveries as gems, export as PDF, or continue the conversation to deepen understanding.",
  },
];

export const StudyDeckInstructions = () => {
  return (
    <Card variant="glass">
      {/* Gradient top border */}
      <div className="h-1.5 bg-gradient-to-r from-violet-500 via-amber-500 to-emerald-500" />
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 0.8, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, -30, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 blur-3xl"
        />
      </div>
      
      <CardHeader className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <motion.div 
            initial={{ rotate: -180, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-4xl"
          >
            🎴
          </motion.div>
          <CardTitle className="text-2xl">How to Use the Study Deck</CardTitle>
        </div>
        <p className="text-muted-foreground">
          Transform your Bible study with Phototheology principles — three simple steps
        </p>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          {STEP_DATA.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-2">
                  <Badge 
                    className={`text-lg px-3 py-1 bg-gradient-to-r ${item.gradient} text-white border-0 shadow-lg`}
                  >
                    Step {item.step}
                  </Badge>
                  <Icon className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <span className="text-2xl">{item.emoji}</span>
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Quick tip with glass effect */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-[2px] rounded-xl"
        >
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <p className="text-sm flex items-start gap-2">
              <span className="text-xl">💡</span>
              <span>
                <strong>Pro Tip:</strong> Start with easier principles (Floor 1-2) like{" "}
                <Badge variant="outline" className="mx-1 border-white/20">SR</Badge> Story Room 
                or <Badge variant="outline" className="mx-1 border-white/20">OR</Badge> Observation, then advance to deeper ones like{" "}
                <Badge variant="outline" className="mx-1 border-white/20">DR-2D</Badge> Christological or{" "}
                <Badge variant="outline" className="mx-1 border-white/20">@CyC</Badge> Cyrus-Christ Cycle.
              </span>
            </p>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};
