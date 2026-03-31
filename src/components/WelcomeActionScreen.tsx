import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  MessageCircle,
  Sparkles,
  Church,
  Users,
  Play,
  ChevronRight,
  Info,
, type LucideIcon } from "lucide-react";

interface ActionOption {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  color: string;
}

const actionOptions: ActionOption[] = [
  {
    id: "study",
    icon: BookOpen,
    title: "Study the Bible",
    description: "Read, explore, and dive deep into Scripture",
    path: "/bible",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: "palace",
    icon: Brain,
    title: "Explore the Palace",
    description: "Master the 8-floor memory system",
    path: "/palace",
    color: "from-purple-500 to-violet-600",
  },
  {
    id: "ask",
    icon: MessageCircle,
    title: "Ask Jeeves",
    description: "Get answers to your Bible questions",
    path: "/ai",
    color: "from-amber-500 to-orange-600",
  },
  {
    id: "courses",
    icon: Sparkles,
    title: "Take a Course",
    description: "Guided learning paths for growth",
    path: "/courses",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "church",
    icon: Church,
    title: "Church Features",
    description: "Tools for pastors and congregations",
    path: "/church-admin",
    color: "from-rose-500 to-pink-600",
  },
  {
    id: "community",
    icon: Users,
    title: "Join Community",
    description: "Connect with fellow students",
    path: "/community",
    color: "from-cyan-500 to-blue-600",
  },
];

interface WelcomeActionScreenProps {
  onDismiss?: () => void;
}

export const WelcomeActionScreen = ({ onDismiss }: WelcomeActionScreenProps) => {
  const navigate = useNavigate();
  const [showExplainer, setShowExplainer] = useState(false);

  const handleAction = (path: string) => {
    if (onDismiss) onDismiss();
    navigate(path);
  };

  const handleLearnMore = () => {
    setShowExplainer(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {!showExplainer ? (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl w-full"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  What would you like to do?
                </h1>
                <p className="text-muted-foreground text-lg">
                  Choose your path or discover what Phototheology can do
                </p>
              </motion.div>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {actionOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + index * 0.05 }}
                >
                  <Card
                    className="p-5 cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/50 group relative overflow-hidden"
                    onClick={() => handleAction(option.path)}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                    />
                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center mb-3`}
                      >
                        <option.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                    <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Learn More Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={handleLearnMore}
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5"
              >
                <Info className="w-5 h-5" />
                Tell me what Phototheology can do
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="explainer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl w-full"
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  What is Phototheology?
                </h2>
              </div>

              <div className="space-y-4 text-muted-foreground mb-8">
                <p>
                  <strong className="text-foreground">Phototheology</strong> is a revolutionary Bible study method that transforms how you understand and remember Scripture.
                </p>
                
                <p>
                  Imagine a <strong className="text-foreground">palace with 8 floors</strong>, each containing rooms that teach you to:
                </p>

                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-foreground">Store Scripture as images</strong> — not just words, but vivid mental pictures</li>
                  <li><strong className="text-foreground">See Christ everywhere</strong> — every story, every symbol points to Jesus</li>
                  <li><strong className="text-foreground">Connect patterns</strong> — discover how the Bible fits together</li>
                  <li><strong className="text-foreground">Apply prophecy</strong> — understand the sanctuary, cycles, and heavens</li>
                </ul>

                <p>
                  With AI-powered tools, interactive games, courses, and a supportive community, you'll master Bible study in ways you never thought possible.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => setShowExplainer(false)}
                  variant="outline"
                  className="gap-2"
                >
                  ← Back to options
                </Button>
                <Button
                  onClick={() => handleAction("/interactive-demo")}
                  className="gap-2 bg-gradient-to-r from-primary to-accent"
                >
                  <Play className="w-4 h-4" />
                  Try Interactive Demo
                </Button>
                <Button
                  onClick={() => handleAction("/auth")}
                  variant="secondary"
                  className="gap-2"
                >
                  Get Started Free
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
