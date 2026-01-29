import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus, Sparkles, BookOpen, Brain, Users, Target, Shield, Building2, Zap, Trophy, ChevronRight } from "lucide-react";

const comparisonData = {
  features: [
    {
      category: "Study Methodology",
      items: [
        {
          feature: "Structured Interpretive Framework",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "8-floor Palace with 30+ rooms",
          othersNote: "General search tools only",
        },
        {
          feature: "Sanctuary Blueprint Lens",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "Built into every analysis",
          othersNote: "Not a methodology",
        },
        {
          feature: "Christ-Centered Interpretation",
          pt: true,
          logos: "partial",
          accordance: "partial",
          chatgpt: "partial",
          ptNote: "Automatic with every passage",
          othersNote: "Manual cross-referencing required",
        },
        {
          feature: "Type/Antitype Recognition",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: "partial",
          ptNote: "AI-assisted identification",
          othersNote: "User must know what to look for",
        },
        {
          feature: "Prophetic Pattern Analysis",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: "partial",
          ptNote: "Systematic approach with guardrails",
          othersNote: "No structured framework",
        },
      ],
    },
    {
      category: "AI Integration",
      items: [
        {
          feature: "Theologically-Trained AI",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: "partial",
          ptNote: "Jeeves knows PT principles & SDA theology",
          othersNote: "Generic AI or none",
        },
        {
          feature: "Guardrails Against Speculation",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "Built-in theological boundaries",
          othersNote: "Can generate anything",
        },
        {
          feature: "Contextual Bible Chat",
          pt: true,
          logos: "partial",
          accordance: false,
          chatgpt: "partial",
          ptNote: "Jeeves assistant in every context",
          othersNote: "Separate tools or none",
        },
        {
          feature: "Sermon Generation with PT Principles",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: "partial",
          ptNote: "8-floor scaffold structure",
          othersNote: "Generic outlines",
        },
      ],
    },
    {
      category: "Learning & Engagement",
      items: [
        {
          feature: "Gamified Bible Learning",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "XP, badges, leaderboards, games",
          othersNote: "Traditional study tools",
        },
        {
          feature: "Weekly Community Challenges",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "AI-judged with prizes",
          othersNote: "No community features",
        },
        {
          feature: "Memory Palace Visualization",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "3D visual journey",
          othersNote: "Text-based only",
        },
        {
          feature: "Spaced Repetition System",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: false,
          ptNote: "Built-in flashcard system",
          othersNote: "No memory tools",
        },
      ],
    },
    {
      category: "Content & Resources",
      items: [
        {
          feature: "Original Language Tools",
          pt: true,
          logos: true,
          accordance: true,
          chatgpt: "partial",
          ptNote: "Strong's + AI analysis",
          othersNote: "Strong's or academic tools",
        },
        {
          feature: "Cross-Reference Chains",
          pt: true,
          logos: true,
          accordance: true,
          chatgpt: "partial",
          ptNote: "PT Chain Links + Treasury",
          othersNote: "TSK or similar",
        },
        {
          feature: "Commentary Integration",
          pt: true,
          logos: true,
          accordance: true,
          chatgpt: "partial",
          ptNote: "AI + classic commentaries",
          othersNote: "Purchased separately",
        },
        {
          feature: "Sermon Builder",
          pt: true,
          logos: "partial",
          accordance: false,
          chatgpt: "partial",
          ptNote: "Full workflow with PT scaffold",
          othersNote: "Basic or none",
        },
      ],
    },
    {
      category: "Accessibility & Pricing",
      items: [
        {
          feature: "Mobile-First Design",
          pt: true,
          logos: "partial",
          accordance: "partial",
          chatgpt: true,
          ptNote: "PWA + responsive",
          othersNote: "Separate mobile apps",
        },
        {
          feature: "Free Tier Available",
          pt: true,
          logos: false,
          accordance: false,
          chatgpt: "partial",
          ptNote: "Generous free features",
          othersNote: "$150+ starting cost",
        },
        {
          feature: "Offline Access",
          pt: true,
          logos: true,
          accordance: true,
          chatgpt: false,
          ptNote: "PWA caching",
          othersNote: "Desktop only",
        },
      ],
    },
  ],
};

const StatusIcon = ({ status }: { status: boolean | string }) => {
  if (status === true) return <Check className="h-5 w-5 text-green-500" />;
  if (status === false) return <X className="h-5 w-5 text-red-400" />;
  if (status === "partial") return <Minus className="h-5 w-5 text-yellow-500" />;
  return null;
};

export default function Comparison() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEO title="Compare Bible Apps" description="See how Phototheology compares to Logos, Accordance, ChatGPT, and other Bible study tools. Structured interpretation vs general search." />
      <Navigation />

      <main className="container max-w-7xl mx-auto px-4 py-12 md:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/30">
            Why PhotoTheology?
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Not Just Another Bible App
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how PhotoTheology's unique approach compares to traditional Bible software and AI tools.
          </p>
        </div>

        {/* Key Differentiators */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardHeader>
              <Building2 className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Structured Framework</CardTitle>
              <CardDescription>
                The 8-floor Memory Palace provides a systematic approach to Bible study that other tools lack
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardHeader>
              <Shield className="h-10 w-10 text-amber-500 mb-2" />
              <CardTitle>Theological Guardrails</CardTitle>
              <CardDescription>
                Unlike ChatGPT, our AI won't generate speculative interpretations or contradict Scripture
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5">
            <CardHeader>
              <Trophy className="h-10 w-10 text-green-500 mb-2" />
              <CardTitle>Active Learning</CardTitle>
              <CardDescription>
                Games, challenges, and community make Bible study engaging - not just reference tools
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Comparison vs ChatGPT */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle className="text-2xl">Why Not Just Use ChatGPT?</CardTitle>
                <CardDescription>
                  Many people ask - "Can't I just ask ChatGPT about the Bible?"
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  Problems with Generic AI
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No theological guardrails</strong> - Can generate heretical or speculative content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No interpretive framework</strong> - Gives random facts without structured methodology
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Can hallucinate Scripture</strong> - Invents verses or misquotes passages
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No sanctuary-centered lens</strong> - Misses the blueprint that unlocks prophecy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X className="h-4 w-4 text-red-400 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">No learning progression</strong> - Same output regardless of your level
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  PhotoTheology's Approach
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Jeeves is theologically trained</strong> - Knows PT principles, SDA positions, and proper hermeneutics
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">8-floor Palace framework</strong> - Systematic approach from observation to worship
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Scripture-first verification</strong> - Every answer grounded in the Bible
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Sanctuary blueprint lens</strong> - Unlocks typology and prophetic patterns
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">Adapts to your level</strong> - Beginner, Intermediate, or Master modes
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison vs Logos/Accordance */}
        <Card className="mb-16 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10 border-b">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <CardTitle className="text-2xl">Why Not Traditional Bible Software?</CardTitle>
                <CardDescription>
                  Logos, Accordance, and BibleWorks are powerful - but different
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-4">Traditional Software Strengths</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Extensive library of academic resources
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Deep original language tools
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Massive commentary collections
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Professional-grade for seminarians
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-4">What They're Missing</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    No interpretive methodology built-in
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    $150-$1000+ price tags
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    Steep learning curve
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    No gamification or engagement tools
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    No AI-powered insights
                  </li>
                  <li className="flex items-center gap-2">
                    <X className="h-4 w-4 text-red-400" />
                    Reference tools, not teaching systems
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                The PT Difference
              </h4>
              <p className="text-muted-foreground">
                PhotoTheology isn't trying to replace academic tools - it's filling a different need.
                We provide a <strong>teaching system</strong> that guides you through Scripture using
                a proven methodology. Logos gives you a library; PT gives you a <strong>guided tour
                with a trained instructor</strong>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Feature Comparison Table */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Feature-by-Feature Comparison</h2>

          {comparisonData.features.map((category) => (
            <Card key={category.category} className="mb-6 overflow-hidden">
              <CardHeader className="bg-muted/50 py-3">
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-3 min-w-[200px]">Feature</th>
                        <th className="text-center p-3 min-w-[100px]">
                          <span className="font-bold text-primary">PT</span>
                        </th>
                        <th className="text-center p-3 min-w-[80px]">Logos</th>
                        <th className="text-center p-3 min-w-[80px]">Accordance</th>
                        <th className="text-center p-3 min-w-[80px]">ChatGPT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {category.items.map((item, idx) => (
                        <tr key={item.feature} className={idx % 2 === 0 ? "bg-muted/10" : ""}>
                          <td className="p-3">
                            <div className="font-medium">{item.feature}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {item.ptNote}
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.pt} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.logos} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.accordance} />
                            </div>
                          </td>
                          <td className="text-center p-3">
                            <div className="flex justify-center">
                              <StatusIcon status={item.chatgpt} />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Full Support</span>
            </div>
            <div className="flex items-center gap-2">
              <Minus className="h-4 w-4 text-yellow-500" />
              <span>Partial Support</span>
            </div>
            <div className="flex items-center gap-2">
              <X className="h-4 w-4 text-red-400" />
              <span>Not Available</span>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Experience the Difference?</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands studying Scripture with the PhotoTheology method.
              Start free and discover a whole new way to understand God's Word.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                Start Free Trial
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/interactive-demo")}
              >
                Try Interactive Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
