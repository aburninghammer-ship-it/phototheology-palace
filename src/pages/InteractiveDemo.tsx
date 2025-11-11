import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Eye, 
  Film, 
  Image as ImageIcon, 
  Lightbulb, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const demoSteps = [
  {
    id: 0,
    title: "Welcome to the Palace Method",
    subtitle: "Your 5-minute introduction to visual Bible memory",
    icon: BookOpen,
    content: {
      type: "intro",
      text: "The Palace Method transforms Bible study by using your mind's natural ability to remember images and stories. You'll build a mental palace where every Scripture has its place. Let's try Floor 1 basics together!",
    }
  },
  {
    id: 1,
    title: "Story Room",
    subtitle: "Turn stories into mental movies",
    icon: Film,
    content: {
      type: "story",
      passage: "David and Goliath (1 Samuel 17)",
      text: "Instead of just reading, turn stories into vivid mental movies. Let's practice with David and Goliath:",
      sequence: [
        "🎯 Young shepherd with sling",
        "⚔️ Giant warrior mocking",
        "🪨 Stone flying through air",
        "💥 Giant falling forward",
        "⚡ David standing victorious"
      ],
      instruction: "Close your eyes for 10 seconds and replay this sequence in your mind like a movie. See the colors, hear the sounds, feel the tension.",
    }
  },
  {
    id: 2,
    title: "Imagination Room",
    subtitle: "Step inside the story",
    icon: Eye,
    content: {
      type: "imagination",
      passage: "The Red Sea Crossing (Exodus 14)",
      text: "Now let's go deeper—don't just watch the story, step inside it:",
      prompts: [
        "Feel the sand beneath your feet as you stand with the Israelites",
        "Hear the roar of water as the sea parts",
        "See fish swimming in the towering walls of water",
        "Smell the salt air and feel the spray on your face",
        "Sense the ground tremble as you walk through"
      ],
      instruction: "Take 15 seconds. Imagine yourself there. What do you see, hear, smell, and feel?",
    }
  },
  {
    id: 3,
    title: "24FPS Room",
    subtitle: "One image per chapter",
    icon: ImageIcon,
    content: {
      type: "frames",
      text: "Just like a movie has 24 frames per second, you can remember entire books with one symbolic image per chapter. Here are 3 chapters of Genesis:",
      examples: [
        { chapter: "Genesis 1", image: "🎂", description: "Birthday cake earth (creation)" },
        { chapter: "Genesis 3", image: "🐍🍎", description: "Snake biting apple (the fall)" },
        { chapter: "Genesis 22", image: "🔪🔥", description: "Knife over altar (Abraham's test)" },
      ],
      instruction: "These strange, memorable images help you instantly recall what happens in each chapter. Try creating your own!",
    }
  },
  {
    id: 4,
    title: "Translation Room",
    subtitle: "Turn verses into pictures",
    icon: Lightbulb,
    content: {
      type: "translation",
      text: "Abstract verses become concrete when you translate them into images:",
      examples: [
        { 
          verse: "Psalm 119:105 - 'Thy word is a lamp unto my feet'",
          image: "💡📖👣",
          description: "Glowing scroll lighting a dark path"
        },
        {
          verse: "Matthew 5:14 - 'You are the light of the world'",
          image: "🌃✨",
          description: "City glowing on a hilltop at night"
        },
        {
          verse: "John 15:5 - 'I am the vine, you are the branches'",
          image: "🌳🔌",
          description: "Branches plugged into a central vine"
        }
      ],
      instruction: "Try it yourself with a favorite verse!",
    }
  },
  {
    id: 5,
    title: "Try It Yourself",
    subtitle: "Create your own visual memory",
    icon: Brain,
    content: {
      type: "practice",
      text: "Let's practice what you've learned! Pick a Bible story and create visual anchors for it.",
      instruction: "Choose a familiar story and describe how you would visualize it using the Palace Method techniques.",
    }
  },
  {
    id: 6,
    title: "You've Mastered Floor 1 Basics!",
    subtitle: "Ready to build your full palace?",
    icon: Sparkles,
    content: {
      type: "completion",
      text: "You just experienced the foundation of Phototheology! Floor 1 has 6 rooms total, and there are 7 more floors that add detective skills, Christ-centered depth, prophecy, and mastery.",
      nextSteps: [
        "✅ You've learned to turn stories into movies (Story Room)",
        "✅ You've practiced stepping inside Scripture (Imagination Room)",
        "✅ You've seen chapter-level visual anchors (24FPS Room)",
        "✅ You've translated verses into images (Translation Room)",
      ]
    }
  }
];

export default function InteractiveDemo() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const step = demoSteps[currentStep];
  const progress = ((currentStep + 1) / demoSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setUserInput("");
      setHasInteracted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setUserInput("");
      setHasInteracted(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const StepIcon = step.icon;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-background border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 pt-32 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Step Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-4">
                <StepIcon className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{step.title}</h1>
              <p className="text-xl text-muted-foreground">{step.subtitle}</p>
            </div>

            {/* Step Content */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                {step.content.type === "intro" && (
                  <div className="space-y-6">
                    <p className="text-lg leading-relaxed">{step.content.text}</p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mt-8">
                      <div className="text-center p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl mb-2">🎬</div>
                        <h3 className="font-semibold mb-1">Visual</h3>
                        <p className="text-sm text-muted-foreground">Turn words into vivid images</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl mb-2">🧠</div>
                        <h3 className="font-semibold mb-1">Memorable</h3>
                        <p className="text-sm text-muted-foreground">Your brain loves stories and pictures</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-primary/5">
                        <div className="text-3xl mb-2">⚡</div>
                        <h3 className="font-semibold mb-1">Instant Recall</h3>
                        <p className="text-sm text-muted-foreground">Access Scripture whenever needed</p>
                      </div>
                    </div>
                  </div>
                )}

                {step.content.type === "story" && (
                  <div className="space-y-6">
                    <Badge variant="secondary" className="text-base">{step.content.passage}</Badge>
                    <p className="text-lg">{step.content.text}</p>
                    
                    <div className="space-y-3 bg-muted/50 p-6 rounded-lg">
                      {step.content.sequence.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-center gap-3 text-lg"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          {item}
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm font-medium">💡 {step.content.instruction}</p>
                    </div>
                  </div>
                )}

                {step.content.type === "imagination" && (
                  <div className="space-y-6">
                    <Badge variant="secondary" className="text-base">{step.content.passage}</Badge>
                    <p className="text-lg">{step.content.text}</p>
                    
                    <div className="space-y-4">
                      {step.content.prompts.map((prompt, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.15 }}
                          className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10"
                        >
                          <p className="text-base">{prompt}</p>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm font-medium">💡 {step.content.instruction}</p>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-medium mb-2">
                        What details did you imagine? (Optional)
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          setHasInteracted(true);
                        }}
                        placeholder="Share what you experienced in your imagination..."
                        className="min-h-24"
                      />
                    </div>
                  </div>
                )}

                {step.content.type === "frames" && (
                  <div className="space-y-6">
                    <p className="text-lg">{step.content.text}</p>
                    
                    <div className="grid gap-4">
                      {step.content.examples.map((example, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.2 }}
                          className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 border"
                        >
                          <div className="text-5xl">{example.image}</div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{example.chapter}</h4>
                            <p className="text-sm text-muted-foreground">{example.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm font-medium">💡 {step.content.instruction}</p>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-medium mb-2">
                        Try it: Create an image for Genesis 6 (Noah's Ark)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          value={userInput}
                          onChange={(e) => {
                            setUserInput(e.target.value);
                            setHasInteracted(true);
                          }}
                          placeholder="Example: 🚢🌊 (Ark on waves)"
                          className="flex-1"
                        />
                      </div>
                      {userInput && (
                        <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Great! The stranger the image, the more memorable it becomes.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {step.content.type === "translation" && (
                  <div className="space-y-6">
                    <p className="text-lg">{step.content.text}</p>
                    
                    <div className="space-y-4">
                      {step.content.examples.map((example, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.15 }}
                          className="p-4 rounded-lg border bg-gradient-to-r from-primary/5 to-transparent"
                        >
                          <p className="font-medium mb-2">{example.verse}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <div className="text-3xl">{example.image}</div>
                            <p className="text-sm text-muted-foreground">{example.description}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                      <p className="text-sm font-medium">💡 {step.content.instruction}</p>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-medium mb-2">
                        Your turn: Translate a verse into an image
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          setHasInteracted(true);
                        }}
                        placeholder="Example: For 'I can do all things through Christ' → 💪✝️ (Strength from the cross)"
                        className="min-h-20"
                      />
                    </div>
                  </div>
                )}

                {step.content.type === "practice" && (
                  <div className="space-y-6">
                    <p className="text-lg">{step.content.text}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-base">Story Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Break it into 3-5 visual scenes</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-base">Imagination Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">What would you see, hear, smell, feel?</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-base">24FPS Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Create one memorable image</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                          <CardTitle className="text-base">Translation Room</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">Find key verses to visualize</p>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-medium mb-2">
                        Choose a story and describe your visual approach:
                      </label>
                      <Textarea
                        value={userInput}
                        onChange={(e) => {
                          setUserInput(e.target.value);
                          setHasInteracted(true);
                        }}
                        placeholder="Example: 'The Good Samaritan - I see a beaten traveler on the road, religious leaders walking past, then a Samaritan stopping with compassion...'"
                        className="min-h-32"
                      />
                    </div>
                  </div>
                )}

                {step.content.type === "completion" && (
                  <div className="space-y-6">
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent mb-4 animate-pulse">
                        <Sparkles className="w-12 h-12 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {step.content.text}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {step.content.nextSteps.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-primary/5"
                        >
                          <p className="text-base">{item}</p>
                        </motion.div>
                      ))}
                    </div>

                    <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-3">What's Next?</h3>
                        <ul className="space-y-2 text-muted-foreground mb-6">
                          <li>• Explore all 6 rooms of Floor 1</li>
                          <li>• Climb to Floor 2 (Investigation) and become a detective</li>
                          <li>• Master all 8 floors with AI-guided practice</li>
                          <li>• Access 1000+ drills, games, and challenges</li>
                          <li>• Build sermons and teach with confidence</li>
                        </ul>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            size="lg" 
                            className="flex-1"
                            onClick={() => navigate("/auth")}
                          >
                            Start Free Trial
                            <ChevronRight className="ml-2 h-5 w-5" />
                          </Button>
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => navigate("/")}
                          >
                            Back to Home
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentStep < demoSteps.length - 1 ? (
                <Button onClick={handleNext}>
                  Next Step
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => navigate("/auth")}>
                  Sign Up Free
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
