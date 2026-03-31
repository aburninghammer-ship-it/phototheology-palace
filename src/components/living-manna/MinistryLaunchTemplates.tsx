import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  BookOpen, Users, Heart, Target, Rocket, GraduationCap,
  Calendar, CheckCircle2, ArrowRight, Download
} from "lucide-react";

interface MinistryLaunchTemplatesProps {
  churchId: string;
}

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  icon: LucideIcon;
  steps: string[];
  resources: string[];
}

const templates: Template[] = [
  {
    id: "bible-study-group",
    title: "Bible Study Group Launch",
    description: "Step-by-step guide to launching an effective small group Bible study ministry",
    category: "Small Groups",
    duration: "4-6 weeks setup",
    icon: BookOpen,
    steps: [
      "Identify and train group leaders using Phototheology curriculum",
      "Select study materials and schedule",
      "Recruit initial participants from congregation",
      "Set up meeting space and communication channels",
      "Launch pilot group and gather feedback",
      "Scale and multiply groups"
    ],
    resources: [
      "Leader Training Guide",
      "Group Discussion Templates",
      "Invitation Templates",
      "Follow-up Tracking Sheet"
    ]
  },
  {
    id: "prayer-ministry",
    title: "Prayer Ministry Team",
    description: "Establish a dedicated intercessory prayer team for your church",
    category: "Prayer",
    duration: "2-4 weeks setup",
    icon: Heart,
    steps: [
      "Cast vision for prayer ministry to congregation",
      "Recruit prayer warriors and intercessors",
      "Establish prayer meeting schedule",
      "Create prayer request management system",
      "Train team on confidentiality and prayer protocols",
      "Launch public prayer services"
    ],
    resources: [
      "Prayer Team Covenant",
      "Request Intake Forms",
      "Prayer Chain Guidelines",
      "Answered Prayer Testimonies Template"
    ]
  },
  {
    id: "evangelism-team",
    title: "Evangelism Outreach Team",
    description: "Build and train a team for community outreach and evangelism",
    category: "Evangelism",
    duration: "6-8 weeks setup",
    icon: Target,
    steps: [
      "Recruit team members with evangelism passion",
      "Complete Phototheology evangelism training modules",
      "Practice witnessing techniques with role-play",
      "Plan first outreach event",
      "Execute outreach with mentorship pairing",
      "Debrief and establish regular outreach rhythm"
    ],
    resources: [
      "Evangelism Training Manual",
      "Contact Cards & Tracking",
      "Bible Study Invitation Cards",
      "Follow-up Protocol Guide"
    ]
  },
  {
    id: "youth-ministry",
    title: "Youth Ministry Program",
    description: "Launch an engaging youth ministry grounded in Phototheology principles",
    category: "Youth",
    duration: "8-12 weeks setup",
    icon: Users,
    steps: [
      "Survey youth and parents for needs assessment",
      "Recruit and vet youth leaders",
      "Complete youth leadership certification",
      "Design age-appropriate Phototheology curriculum",
      "Plan launch event and promotion",
      "Establish ongoing programs and activities"
    ],
    resources: [
      "Youth Leader Application",
      "Parent Permission Forms",
      "Youth Curriculum Guide",
      "Event Planning Templates"
    ]
  },
  {
    id: "discipleship-pathway",
    title: "Discipleship Pathway",
    description: "Create a clear path for new believers to grow in faith",
    category: "Discipleship",
    duration: "4-6 weeks setup",
    icon: GraduationCap,
    steps: [
      "Map current discipleship journey in your church",
      "Identify gaps and create milestone markers",
      "Develop curriculum for each stage",
      "Train mentors and coaches",
      "Create enrollment and tracking system",
      "Launch with new believers"
    ],
    resources: [
      "Discipleship Pathway Map",
      "Mentor Training Guide",
      "Progress Tracking System",
      "Completion Certificates"
    ]
  },
  {
    id: "community-service",
    title: "Community Service Initiative",
    description: "Establish regular community service outreach for your congregation",
    category: "Service",
    duration: "4-6 weeks setup",
    icon: Rocket,
    steps: [
      "Survey community needs through local partnerships",
      "Identify service opportunities matching church gifts",
      "Form volunteer coordination team",
      "Plan monthly service schedule",
      "Create sign-up and communication systems",
      "Launch first community service day"
    ],
    resources: [
      "Community Needs Assessment",
      "Volunteer Signup Forms",
      "Service Day Checklists",
      "Impact Tracking Templates"
    ]
  }
];

export function MinistryLaunchTemplates({ churchId }: MinistryLaunchTemplatesProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Small Groups": "bg-blue-500/10 text-blue-500 border-blue-500/20",
      "Prayer": "bg-purple-500/10 text-purple-500 border-purple-500/20",
      "Evangelism": "bg-orange-500/10 text-orange-500 border-orange-500/20",
      "Youth": "bg-green-500/10 text-green-500 border-green-500/20",
      "Discipleship": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      "Service": "bg-pink-500/10 text-pink-500 border-pink-500/20",
    };
    return colors[category] || "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Ministry Launch Templates</h2>
        <p className="text-muted-foreground">
          Ready-to-use templates for launching new ministries in your church
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card 
              key={template.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={getCategoryColor(template.category)}>
                    {template.category}
                  </Badge>
                </div>
                <CardTitle className="text-lg mt-3">{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{template.duration}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1">
                    View <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <selectedTemplate.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <DialogTitle>{selectedTemplate.title}</DialogTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedTemplate.description}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                  <Badge className={getCategoryColor(selectedTemplate.category)}>
                    {selectedTemplate.category}
                  </Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedTemplate.duration}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    Implementation Steps
                  </h4>
                  <ol className="space-y-3">
                    {selectedTemplate.steps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-medium">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Download className="h-5 w-5 text-primary" />
                    Included Resources
                  </h4>
                  <ul className="grid grid-cols-2 gap-2">
                    {selectedTemplate.resources.map((resource, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm p-2 rounded-lg bg-muted/50">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button className="flex-1 gap-2">
                    <Rocket className="h-4 w-4" />
                    Start This Ministry
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Resources
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
