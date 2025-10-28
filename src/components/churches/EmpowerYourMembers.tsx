import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, TrendingUp, Award, Shield, Zap, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const EmpowerYourMembers = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: BookOpen,
      title: "One Method, One Mission",
      description: "Stop the chaos of everyone doing their own thing. Unite your entire congregation around the Phototheology Palace system—a proven, Christ-centered method of Bible study that actually sticks."
    },
    {
      icon: Users,
      title: "Turn Attendees into Workers",
      description: "Don't just fill pews—raise disciples. Our system identifies emerging teachers and evangelists in your congregation so you can deploy them like the early church did."
    },
    {
      icon: TrendingUp,
      title: "Measurable Engagement",
      description: "No more guessing who's growing. See which members are engaging deeply, completing challenges, and ready for ministry leadership—all in one dashboard."
    },
    {
      icon: Award,
      title: "Whole-Church Study Campaigns",
      description: "Launch coordinated study pushes: 'This week, everyone is in Daniel 2.' Watch your entire body move through Scripture together with structure and accountability."
    },
    {
      icon: Shield,
      title: "Prophetic & Sanctuary Grounded",
      description: "This isn't generic Christianity. Phototheology is built on the sanctuary model, the three angels' messages, and Christ-centered prophecy—distinctives your church already believes."
    },
    {
      icon: Zap,
      title: "Stop Reinventing Curriculum",
      description: "Your leaders get ready-to-use teaching outlines, discussion guides, and structured flows. Anyone can lead a small group—not just 'the Bible person.'"
    },
    {
      icon: Target,
      title: "Youth & Kids Included",
      description: "Finally, age-appropriate content that matches your theology. Youth leaders and parents get tools they can actually use without being theologians themselves."
    },
    {
      icon: Heart,
      title: "From Study to Service",
      description: "Higher tiers unlock the Ministry Launch Academy—teaching your members how to exegete their city, build mercy ministries, and launch digital outreach that reflects Isaiah 58 and Revelation 14."
    }
  ];

  return (
    <section className="py-20 px-4 gradient-dreamy">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Empower Your Members. Multiply Your Ministry.
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            This isn't just an app for your members. It's a complete discipleship engine that turns your congregation into a unified, mission-ready force.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto italic">
            "We don't replace the church. We strengthen it."
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <Card key={index} className="glass-card hover-lift">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2">{benefit.title}</CardTitle>
                    <CardDescription className="text-base">
                      {benefit.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* What You're NOT Getting */}
        <Card className="mb-12 border-2 border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What Phototheology for Churches Is NOT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-destructive">✗</span>
                <span>Not a counseling or crisis response system</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-destructive">✗</span>
                <span>Not a replacement for pastoral care</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-destructive">✗</span>
                <span>Not doctrinally flexible (this is distinctly Adventist/prophetic theology)</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-destructive">✗</span>
                <span>Not "pick and choose" features—you get the full Phototheology method or nothing</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What You ARE Getting */}
        <Card className="mb-12 border-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl text-center">What You ARE Getting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-muted-foreground">
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="font-semibold">A discipleship pipeline—from new believer to deployed worker</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Unified Bible study across all ages and groups</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Leadership visibility into who is actually growing</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="font-semibold">Ready-to-deploy teaching materials for small groups and Sabbath School</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                <span className="font-semibold">A clear path from study to service (Ministry Launch Academy)</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Strengthen Your Church?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join churches that are raising workers, not just attendees. 
            Choose your tier and give your congregation the discipleship system they deserve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/pricing")}
              className="text-lg px-8 py-6"
            >
              View Individual Plans
            </Button>
            <Button 
              size="lg" 
              variant="default"
              onClick={() => navigate("/church-signup")}
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-primary/80"
            >
              Register Your Church
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
