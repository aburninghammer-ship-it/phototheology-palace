import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  Gift,
  HelpCircle,
  ChevronRight,
  Sparkles,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const TRIAL_FEATURES = [
  "All 8 Palace Floors (Complete System)",
  "Unlimited Jeeves AI Conversations",
  "All Premium Games & Courses",
  "Art of War Dojo Complete",
  "Treasure Hunts & Escape Rooms",
  "Bible Study Leader Tools",
  "Full access for 7 days"
];

const SUBSCRIPTION_BENEFITS = [
  "Continue full access after trial",
  "Multiple plan options ($9-$15/mo)",
  "Annual plans save up to 20%",
  "Student discount available",
  "Church/group licensing",
  "Priority support",
  "Cancel anytime"
];

const FAQ_ITEMS = [
  {
    question: "How does the 7-day free trial work?",
    answer: "Sign up and get full access to all Premium features for 7 days — no restrictions. After your trial, choose a plan that fits your needs. We believe you should experience the full value before deciding."
  },
  {
    question: "What's the difference between PhototheologyOS and the card deck/courses?",
    answer: "PhototheologyOS is a standalone digital platform — the Operating System for Biblical Thinking. The physical card deck and video courses are separate products that complement it but are not required. PhototheologyOS contains the complete Palace method — you don't need anything else to master it."
  },
  {
    question: "How is this different from YouVersion or Logos?",
    answer: "YouVersion is excellent for reading and plans. Logos is powerful for scholarly research. Phototheology is specifically designed for memory and mastery — turning Scripture into visual palaces you'll never forget. It's not a replacement; it's a complementary approach for those who want to truly internalize the Bible."
  },
  {
    question: "Do I need to be tech-savvy to use this?",
    answer: "Not at all. The app is designed for all skill levels. Our guided tours and Jeeves AI assistant help you every step of the way. If you can use a smartphone, you can use Phototheology."
  },
  {
    question: "Is this a particular denomination's interpretation?",
    answer: "Phototheology teaches a Christ-centered, Bible-believing approach. While developed from an Adventist perspective, the Palace method and hermeneutical principles are applicable across Protestant traditions. We focus on what unites believers: Christ as the center of all Scripture."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. No contracts, no hidden fees. Cancel your subscription anytime. During your trial, you can cancel with no charge. We don't believe in locking people in."
  }
];

export const TransparencySection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge className="mb-4 gradient-palace text-white border-0">
            <Sparkles className="h-3 w-3 mr-1" />
            7-Day Free Trial
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Try Everything Before You Decide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the complete Phototheology Palace with no restrictions. Choose your plan when you're ready.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* 7-Day Free Trial */}
          <Card className="border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="mb-2 gradient-palace text-white border-0">
                    <Gift className="h-3 w-3 mr-1" />
                    Start Here
                  </Badge>
                  <CardTitle className="text-2xl">7-Day Free Trial</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$0</p>
                  <p className="text-sm text-muted-foreground">for 7 days</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Full access to everything:</p>
              <ul className="space-y-3">
                {TRIAL_FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button 
                className="w-full mt-6 gradient-palace"
                onClick={() => navigate("/pricing")}
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Start Free Trial
              </Button>
            </CardContent>
          </Card>

          {/* After Trial */}
          <Card className="border-2 border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <Badge variant="outline" className="mb-2">
                    <Crown className="h-3 w-3 mr-1" />
                    After Trial
                  </Badge>
                  <CardTitle className="text-2xl">Choose Your Plan</CardTitle>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">$9-15<span className="text-lg font-normal">/mo</span></p>
                  <p className="text-sm text-muted-foreground">or save with annual</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">Flexible options:</p>
              <ul className="space-y-3">
                {SUBSCRIPTION_BENEFITS.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button 
                variant="outline"
                className="w-full mt-6"
                onClick={() => navigate("/pricing")}
              >
                View All Plans
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 justify-center mb-6">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-xl font-bold">Frequently Asked Questions</h3>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
