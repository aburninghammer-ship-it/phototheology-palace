import { Check, X, Minus, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Feature {
  name: string;
  description?: string;
  phototheology: "yes" | "no" | "partial";
  youversion: "yes" | "no" | "partial";
  blueletter: "yes" | "no" | "partial";
  logos: "yes" | "no" | "partial";
  biblegateway: "yes" | "no" | "partial";
}

const standardFeatures: Feature[] = [
  {
    name: "Multiple Bible Translations",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Audio Bible",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Reading Plans",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "partial",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Commentary Access",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Cross-References",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Greek/Hebrew Tools",
    phototheology: "partial",
    youversion: "no",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "partial",
  },
  {
    name: "Note Taking & Highlights",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Search Functionality",
    phototheology: "yes",
    youversion: "yes",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
];

const uniqueFeatures: Feature[] = [
  {
    name: "Visual Memory Palace System",
    description: "8-Floor Memory Palace — store Scripture as vivid mental architecture you can walk through",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "24FPS Book Memorization",
    description: "Turn entire books into mental film strips with one symbolic image per chapter",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "AI Study Partner (Jeeves)",
    description: "Phototheology-trained AI that guides you through the Palace method and answers questions",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Christ-in-Every-Chapter Mode",
    description: "Guided discovery of Jesus in every chapter — the Concentration Room applied systematically",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Gamified Scripture Learning",
    description: "Escape rooms, challenges, drills, and mastery games that make learning stick",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Prophecy & Sanctuary Integration",
    description: "Daniel, Revelation, and Sanctuary woven into every study path as unified architecture",
    phototheology: "yes",
    youversion: "no",
    blueletter: "partial",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Room & Floor Mastery System",
    description: "Track your progress through 8 floors of methodology with XP, drills, and certifications",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Personalized Devotional Profiles",
    description: "AI-generated devotionals tailored to specific spiritual needs and struggles",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "partial",
    biblegateway: "no",
  },
  {
    name: "Multiplayer Bible Study",
    description: "Team challenges, church campaigns, and collaborative learning modes",
    phototheology: "yes",
    youversion: "no",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
  {
    name: "Kid-Friendly Mode",
    description: "Age-appropriate memory games and palace training designed for children",
    phototheology: "yes",
    youversion: "partial",
    blueletter: "no",
    logos: "no",
    biblegateway: "no",
  },
];

const StatusIcon = ({ status }: { status: "yes" | "no" | "partial" }) => {
  if (status === "yes") {
    return <Check className="h-5 w-5 text-green-500" />;
  }
  if (status === "partial") {
    return <Minus className="h-5 w-5 text-yellow-500" />;
  }
  return <X className="h-5 w-5 text-red-400" />;
};

const FeatureWithTooltip = ({ name, description }: { name: string; description?: string }) => {
  if (!description) return <span>{name}</span>;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-1.5 cursor-help">
            {name}
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[250px] text-xs">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TableHeader = () => (
  <tr className="border-b border-white/10">
    <th className="text-left py-4 px-4 md:px-6 font-semibold text-foreground min-w-[200px]">
      Feature
    </th>
    <th className="py-4 px-2 md:px-3 text-center min-w-[80px]">
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs md:text-sm font-bold text-primary">PT App</span>
        <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30">OURS</Badge>
      </div>
    </th>
    <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
      <span className="text-xs md:text-sm font-medium text-muted-foreground">YouVersion</span>
    </th>
    <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
      <span className="text-xs md:text-sm font-medium text-muted-foreground">Blue Letter</span>
    </th>
    <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
      <span className="text-xs md:text-sm font-medium text-muted-foreground">Logos</span>
    </th>
    <th className="py-4 px-2 md:px-3 text-center min-w-[70px]">
      <span className="text-xs md:text-sm font-medium text-muted-foreground">Bible Gateway</span>
    </th>
  </tr>
);

const FeatureRow = ({ feature, index }: { feature: Feature; index: number }) => (
  <tr 
    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
      index % 2 === 0 ? "bg-white/[0.02]" : ""
    }`}
  >
    <td className="py-3 px-4 md:px-6 text-sm font-medium text-foreground">
      <FeatureWithTooltip name={feature.name} description={feature.description} />
    </td>
    <td className="py-3 px-2 md:px-3 text-center">
      <div className="flex justify-center">
        <div className="p-1.5 rounded-full bg-primary/10">
          <StatusIcon status={feature.phototheology} />
        </div>
      </div>
    </td>
    <td className="py-3 px-2 md:px-3 text-center">
      <div className="flex justify-center">
        <StatusIcon status={feature.youversion} />
      </div>
    </td>
    <td className="py-3 px-2 md:px-3 text-center">
      <div className="flex justify-center">
        <StatusIcon status={feature.blueletter} />
      </div>
    </td>
    <td className="py-3 px-2 md:px-3 text-center">
      <div className="flex justify-center">
        <StatusIcon status={feature.logos} />
      </div>
    </td>
    <td className="py-3 px-2 md:px-3 text-center">
      <div className="flex justify-center">
        <StatusIcon status={feature.biblegateway} />
      </div>
    </td>
  </tr>
);

export function ComparisonChart() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            App Comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything They Have, <span className="text-primary">Plus Everything They Don't</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Great Bible apps help you read. Phototheology helps you <em>remember and master</em>.
          </p>
        </div>

        {/* Glass Container */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl" />
          
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent/30 rounded-full blur-3xl" />

          {/* Table Content */}
          <div className="relative z-10 overflow-x-auto">
            <table className="w-full">
              <thead>
                <TableHeader />
              </thead>
              <tbody>
                {/* Standard Features Section */}
                <tr>
                  <td colSpan={6} className="py-3 px-4 md:px-6 bg-muted/30">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Standard Bible App Features
                    </span>
                  </td>
                </tr>
                {standardFeatures.map((feature, index) => (
                  <FeatureRow key={feature.name} feature={feature} index={index} />
                ))}
                
                {/* Unique Features Section */}
                <tr>
                  <td colSpan={6} className="py-3 px-4 md:px-6 bg-primary/10">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Unique to Phototheology
                    </span>
                  </td>
                </tr>
                {uniqueFeatures.map((feature, index) => (
                  <FeatureRow key={feature.name} feature={feature} index={index} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 py-4 px-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">Full Support</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Minus className="h-4 w-4 text-yellow-500" />
              <span className="text-muted-foreground">Partial / Limited</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <X className="h-4 w-4 text-red-400" />
              <span className="text-muted-foreground">Not Available</span>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-muted-foreground mt-6 text-sm">
          Hover over unique features to learn what makes them special
        </p>
      </div>
    </section>
  );
}
