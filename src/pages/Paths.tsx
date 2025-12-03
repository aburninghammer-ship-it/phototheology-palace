import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PATH_INFO, PathType } from "@/hooks/usePath";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Target, Trophy, Sparkles, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const pathOrder: PathType[] = ["visual", "analytical", "devotional", "warrior"];

const pathDetails: Record<PathType, {
  idealFor: string[];
  journey: string;
  monthlyFocus: string;
}> = {
  visual: {
    idealFor: ["Artists & designers", "Visual thinkers", "Those who learn by seeing"],
    journey: "Your palace becomes a gallery of vivid mental images. Each room is painted with symbolic scenes that anchor Scripture in your visual memory.",
    monthlyFocus: "Image creation, mental mapping, symbolic visualization exercises"
  },
  analytical: {
    idealFor: ["Researchers & scholars", "Detail-oriented minds", "Those who love structure"],
    journey: "Build your palace brick by brick with precise definitions, cross-references, and systematic patterns. Every room is cataloged and connected.",
    monthlyFocus: "Greek/Hebrew word studies, structural analysis, pattern detection"
  },
  devotional: {
    idealFor: ["Prayer warriors", "Contemplatives", "Those seeking intimacy with God"],
    journey: "Your palace becomes a sanctuary. Each room is a place of encounter, where Scripture moves from head knowledge to heart transformation.",
    monthlyFocus: "Meditation exercises, journaling prompts, prayer integration"
  },
  warrior: {
    idealFor: ["Teachers & preachers", "Evangelists", "Those called to share truth"],
    journey: "Your palace becomes an armory. Every room equips you with weapons for spiritual battle and tools for teaching others.",
    monthlyFocus: "Apologetics training, teaching drills, rapid-recall exercises"
  }
};

export default function Paths() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose Your Path Through the Palace
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Four learning styles. One 2-year journey. Each path guides you through all 8 floors of the Phototheology Palace—adapted to how your mind naturally learns best.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>2-Year Journey</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>24 Monthly Gates</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>Certificate of Mastery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Path Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {pathOrder.map((type, index) => {
            const path = PATH_INFO[type];
            const details = pathDetails[type];
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${path.bgColor} border-2 ${path.borderColor} overflow-hidden`}>
                  <div className="md:flex">
                    {/* Left: Icon & Title */}
                    <div className="md:w-1/3 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-border/50">
                      <div className="text-7xl mb-4">{path.icon}</div>
                      <h2 className="text-3xl font-bold mb-2">{path.name}</h2>
                      <p className="text-muted-foreground text-sm">{path.teachingStyle}</p>
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-2/3 p-8">
                      <p className="text-lg mb-6">{path.description}</p>
                      
                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Ideal For
                          </h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {details.idealFor.map((item, i) => (
                              <li key={i}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Teaching Style</h4>
                          <p className="text-sm text-muted-foreground">{path.teachingStyle}</p>
                        </div>
                      </div>

                      <div className="mb-6">
                        <h4 className="font-semibold mb-2">Your Journey</h4>
                        <p className="text-sm text-muted-foreground">{details.journey}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {path.strengths.map((strength, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin?</h2>
          <p className="text-muted-foreground mb-8">
            {user 
              ? "Choose your path and start your 2-year journey to biblical mastery."
              : "Start your free trial and choose your path. You'll have 30 days to explore before committing to your 2-year journey."
            }
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate(user ? "/dashboard" : "/auth")} 
            className="group"
          >
            {user ? "Go to Dashboard" : "Start Free Trial"}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          {!user && (
            <p className="text-sm text-muted-foreground mt-4">
              Already have an account? <Button variant="link" className="p-0 h-auto" onClick={() => navigate("/auth")}>Sign in</Button>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
