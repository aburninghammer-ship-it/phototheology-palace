import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BookOpen, Search, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

type UserIntent = "understand" | "deep-study" | "teach" | null;

const intents = [
  {
    id: "understand" as const,
    icon: BookOpen,
    title: "I want to understand the Bible better",
    description: "Start with guided reading and simple principles",
    color: "from-blue-500 to-cyan-500",
    path: "/interactive-demo",
    authPath: "/bible",
  },
  {
    id: "deep-study" as const,
    icon: Search,
    title: "I love deep prophecy & patterns",
    description: "Dive into sanctuary symbolism and prophetic timelines",
    color: "from-purple-500 to-pink-500",
    path: "/interactive-demo",
    authPath: "/palace",
  },
  {
    id: "teach" as const,
    icon: GraduationCap,
    title: "I teach or lead Bible studies",
    description: "Build series, create lessons, equip your group",
    color: "from-amber-500 to-orange-500",
    path: "/interactive-demo",
    authPath: "/series-builder",
  },
];

export function LandingPathFilter() {
  const [selectedIntent, setSelectedIntent] = useState<UserIntent>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleContinue = () => {
    if (!selectedIntent) return;
    const intent = intents.find((i) => i.id === selectedIntent);
    if (!intent) return;
    
    // Store intent for personalization
    localStorage.setItem("user_intent", selectedIntent);
    
    // Navigate based on auth state
    if (user) {
      // Go directly to the gatehouse (blue/red choice page) — no multi-step onboarding
      navigate("/gatehouse");
    } else {
      navigate(intent.path);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
            What brings you here?
          </h2>
          <p className="text-muted-foreground text-lg">
            Choose your path and we'll personalize your experience
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          {intents.map((intent, index) => {
            const Icon = intent.icon;
            const isSelected = selectedIntent === intent.id;

            return (
              <motion.button
                key={intent.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setSelectedIntent(intent.id)}
                className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 hover:shadow-lg ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="selected-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 -z-10"
                  />
                )}
                
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${intent.color} flex items-center justify-center mb-4`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{intent.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {intent.description}
                </p>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
                  >
                    <svg
                      className="w-4 h-4 text-primary-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Button
            size="lg"
            onClick={handleContinue}
            disabled={!selectedIntent}
            className="px-8 py-6 text-lg gradient-palace shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all duration-300"
          >
            {selectedIntent ? "Show Me How" : "Select Your Path"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            No account needed to explore
          </p>
        </motion.div>
      </div>
    </section>
  );
}
