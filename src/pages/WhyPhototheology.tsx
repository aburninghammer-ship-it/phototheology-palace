import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Brain,
  Target,
  Sparkles,
  Check,
  X,
  Minus,
  ArrowRight,
  BookOpen,
  Network,
  Eye,
  Zap,
  Crown,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

const comparisonData = [
  {
    dimension: "Ease for Beginners",
    phototheology: { rating: "medium", note: "Palace tour + simple mode" },
    youversion: { rating: "high", note: "Very simple UI" },
    oliveTree: { rating: "medium", note: "Some learning curve" },
    logos: { rating: "low", note: "Steep learning curve" },
  },
  {
    dimension: "Depth of Study Tools",
    phototheology: { rating: "high", note: "Rooms, floors, AI drills" },
    youversion: { rating: "low", note: "Basic reading only" },
    oliveTree: { rating: "medium", note: "Good with add-ons" },
    logos: { rating: "high", note: "Excellent resources" },
  },
  {
    dimension: "Memory & Retention",
    phototheology: { rating: "high", note: "Memory palace core" },
    youversion: { rating: "low", note: "Standard reading" },
    oliveTree: { rating: "medium", note: "Notes & bookmarks" },
    logos: { rating: "medium", note: "Notes & references" },
  },
  {
    dimension: "Theological Structure",
    phototheology: { rating: "high", note: "Christ-centered floors" },
    youversion: { rating: "low", note: "Linear reading" },
    oliveTree: { rating: "medium", note: "Commentary add-ons" },
    logos: { rating: "medium", note: "Requires user work" },
  },
  {
    dimension: "Prophecy Integration",
    phototheology: { rating: "high", note: "Vision Floor + 3 Angels" },
    youversion: { rating: "none", note: "Not available" },
    oliveTree: { rating: "low", note: "Via commentaries" },
    logos: { rating: "medium", note: "Resource dependent" },
  },
  {
    dimension: "Gamification & Drills",
    phototheology: { rating: "high", note: "30+ games & drills" },
    youversion: { rating: "low", note: "Streaks only" },
    oliveTree: { rating: "none", note: "Not available" },
    logos: { rating: "none", note: "Not available" },
  },
  {
    dimension: "AI Study Assistant",
    phototheology: { rating: "high", note: "Jeeves AI built-in" },
    youversion: { rating: "none", note: "Not available" },
    oliveTree: { rating: "none", note: "Not available" },
    logos: { rating: "low", note: "Basic search" },
  },
];

const getRatingIcon = (rating: string) => {
  switch (rating) {
    case "high":
      return <Check className="w-5 h-5 text-palace-green" />;
    case "medium":
      return <Minus className="w-5 h-5 text-palace-yellow" />;
    case "low":
      return <X className="w-5 h-5 text-palace-orange" />;
    default:
      return <X className="w-5 h-5 text-destructive" />;
  }
};

const uniqueFeatures = [
  {
    icon: Building2,
    title: "The Memory Palace System",
    description:
      "Transform Scripture into 8 floors of interconnected rooms. Each room trains a different study skill—from observation to meditation to prophecy.",
    gradient: "from-palace-purple to-palace-pink",
  },
  {
    icon: Target,
    title: "Christ-Centered Throughout",
    description:
      "Every floor, every room, every drill points to Jesus. The Concentration Room ensures you never study a passage without finding Christ.",
    gradient: "from-palace-teal to-palace-blue",
  },
  {
    icon: Network,
    title: "Pattern Recognition Engine",
    description:
      "See how symbols, types, and prophecies connect across all 66 books. The Pattern Room and Parallels Room reveal Scripture's hidden architecture.",
    gradient: "from-palace-orange to-palace-yellow",
  },
  {
    icon: Brain,
    title: "Built for Long-Term Memory",
    description:
      "Ancient memory techniques meet modern learning science. What you learn stays with you—not just for the exam, but for life.",
    gradient: "from-palace-green to-palace-teal",
  },
  {
    icon: Eye,
    title: "Vision Floor for Prophecy",
    description:
      "Daniel, Revelation, and the Three Angels' Messages integrated into your study system. See prophecy clearly through the sanctuary lens.",
    gradient: "from-palace-blue to-palace-purple",
  },
  {
    icon: Zap,
    title: "AI-Powered Learning",
    description:
      "Jeeves, your personal study butler, guides you through drills, answers questions, and adapts to your learning pace.",
    gradient: "from-palace-pink to-palace-orange",
  },
];

export default function WhyPhototheology() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section - The Problem */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-palace-purple/10 via-background to-palace-teal/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center space-y-6"
          >
            <Badge className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              A Different Approach
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="bg-gradient-to-r from-palace-purple via-primary to-palace-teal bg-clip-text text-transparent">
                Why Phototheology
              </span>
              <br />
              <span className="text-foreground">Changes Everything</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Most Bible apps help you read. Phototheology helps you{" "}
              <span className="text-primary font-semibold">remember</span>,{" "}
              <span className="text-palace-teal font-semibold">understand</span>, and{" "}
              <span className="text-palace-orange font-semibold">connect</span> Scripture for life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold">The Problem With Most Bible Apps</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    You've read through the Bible. You've highlighted verses. You've taken notes. But
                    when someone asks you a question about Scripture...
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    Can you recall what you studied last month? Last year?
                  </p>
                  <p>
                    Traditional Bible apps are designed for <em>consumption</em>, not{" "}
                    <em>retention</em>. You read, you scroll, you forget.
                  </p>
                </div>
              </div>

              <Card className="border-2 border-destructive/20 bg-destructive/5">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <X className="w-5 h-5 text-destructive" />
                    The Traditional Approach
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      Linear reading with no structure
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      Notes scattered across devices
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      No system for connecting themes
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      Memory fades within weeks
                    </li>
                    <li className="flex items-start gap-2">
                      <X className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      Christ-centered study requires extra work
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Solution Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Card className="border-2 border-palace-green/30 bg-palace-green/5 order-2 md:order-1">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    <Check className="w-5 h-5 text-palace-green" />
                    The Phototheology Approach
                  </h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-palace-green mt-0.5 flex-shrink-0" />
                      8-floor palace structure organizes all study
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-palace-green mt-0.5 flex-shrink-0" />
                      Each room trains a specific skill
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-palace-green mt-0.5 flex-shrink-0" />
                      Patterns & parallels reveal connections
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-palace-green mt-0.5 flex-shrink-0" />
                      Memory palace locks truth in long-term
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-palace-green mt-0.5 flex-shrink-0" />
                      Christ-centered focus built into every room
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <div className="space-y-6 order-1 md:order-2">
                <h2 className="text-3xl font-bold">
                  A System Designed for{" "}
                  <span className="text-palace-green">Transformation</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Phototheology isn't just another Bible app—it's a complete study system based on
                    the ancient memory palace technique.
                  </p>
                  <p>
                    Every chapter becomes a room. Every theme becomes a floor. Every connection
                    becomes a pathway you can walk again and again.
                  </p>
                  <p className="text-lg font-medium text-foreground">
                    What you study becomes part of who you are.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Compare</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how Phototheology stacks up against the most popular Bible apps
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-6xl mx-auto overflow-x-auto"
          >
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <Crown className="w-5 h-5 text-primary" />
                      <span className="font-bold text-primary">Phototheology</span>
                    </div>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-muted-foreground">YouVersion</span>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-muted-foreground">Olive Tree</span>
                  </th>
                  <th className="p-4 text-center">
                    <span className="text-muted-foreground">Logos</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr
                    key={row.dimension}
                    className={`border-b border-border/50 ${
                      index % 2 === 0 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="p-4 font-medium">{row.dimension}</td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingIcon(row.phototheology.rating)}
                        <span className="text-xs text-muted-foreground text-center">
                          {row.phototheology.note}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingIcon(row.youversion.rating)}
                        <span className="text-xs text-muted-foreground text-center">
                          {row.youversion.note}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingIcon(row.oliveTree.rating)}
                        <span className="text-xs text-muted-foreground text-center">
                          {row.oliveTree.note}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col items-center gap-1">
                        {getRatingIcon(row.logos.rating)}
                        <span className="text-xs text-muted-foreground text-center">
                          {row.logos.note}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Unique Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-palace-purple/10 text-palace-purple border-palace-purple/20 mb-4">
              <Building2 className="w-3 h-3 mr-1" />
              What Makes Us Different
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Features You Won't Find Anywhere Else
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {uniqueFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary/30 transition-colors group">
                  <CardContent className="p-6 space-y-4">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} shadow-lg`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-palace-purple/10 via-background to-palace-teal/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold">
              Ready to Study Scripture
              <br />
              <span className="bg-gradient-to-r from-palace-purple via-primary to-palace-teal bg-clip-text text-transparent">
                The Way Your Mind Was Made To Learn?
              </span>
            </h2>

            <p className="text-xl text-muted-foreground">
              Join thousands who are finally retaining what they read and seeing the Bible's
              patterns come alive.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 py-6 h-auto group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/interactive-demo")}
                className="text-lg px-8 py-6 h-auto"
              >
                <BookOpen className="mr-2 w-5 h-5" />
                Try Interactive Demo
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Start building your palace today
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
