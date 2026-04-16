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
  isEnhanced?: boolean;
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
    name: "Reading Plans",
    description: "PT plans are Palace-integrated — each day maps to rooms, floors, and memory hooks, not just chapters to check off",
    isEnhanced: true,
    phototheology: "yes",
    youversion: "yes",
    blueletter: "partial",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Commentary Access",
    description: "PT commentary connects every verse to Christ, sanctuary, prophecy, and memory rooms — not just historical notes",
    isEnhanced: true,
    phototheology: "yes",
    youversion: "partial",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Cross-References",
    description: "PT cross-refs follow typology, cycles, and thematic walls — showing how verses connect across the 8 cycles of redemption",
    isEnhanced: true,
    phototheology: "yes",
    youversion: "partial",
    blueletter: "yes",
    logos: "yes",
    biblegateway: "yes",
  },
  {
    name: "Greek/Hebrew Tools",
    description: "PT includes lexical data in the Def-Com Room with biblical context and Christ-centered application",
    isEnhanced: true,
    phototheology: "yes",
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

const FeatureWithTooltip = ({ name, description, isEnhanced }: { name: string; description?: string; isEnhanced?: boolean }) => {
  if (!description) return <span>{name}</span>;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="flex items-center gap-2 cursor-help flex-wrap">
            <span className="flex items-center gap-1.5">
              {name}
              <HelpCircle className="h-3.5 w-3.5 text-primary/70 flex-shrink-0" />
            </span>
            {isEnhanced && (
              <Badge
                variant="outline"
                className="text-[10px] sm:text-xs px-2 py-0.5 h-auto whitespace-nowrap bg-primary/10 border-primary/30 text-primary font-medium flex-shrink-0"
              >
                Enhanced
              </Badge>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-[280px] text-xs bg-card border-primary/20">
          <p className="font-medium text-primary mb-1">How PT is different:</p>
          <p className="text-muted-foreground">{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TableHeader = () => (
  <tr className="border-b border-border">
    <th className="text-left py-3 sm:py-4 px-3 sm:px-4 md:px-6 font-semibold text-foreground min-w-[160px] sm:min-w-[200px]">
      <span className="text-xs sm:text-sm">Feature</span>
    </th>
    <th className="py-3 sm:py-4 px-1.5 sm:px-2 md:px-3 text-center min-w-[60px] sm:min-w-[80px]">
      <div className="flex flex-col items-center gap-1">
        <span className="text-[10px] sm:text-xs md:text-sm font-bold text-primary whitespace-nowrap">PT App</span>
        <Badge variant="outline" className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 h-auto bg-primary/10 border-primary/30 whitespace-nowrap">OURS</Badge>
      </div>
    </th>
    <th className="py-3 sm:py-4 px-1 sm:px-2 md:px-3 text-center min-w-[55px] sm:min-w-[70px]">
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">YouVer</span>
    </th>
    <th className="py-3 sm:py-4 px-1 sm:px-2 md:px-3 text-center min-w-[55px] sm:min-w-[70px]">
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">BlueLtr</span>
    </th>
    <th className="py-3 sm:py-4 px-1 sm:px-2 md:px-3 text-center min-w-[50px] sm:min-w-[70px]">
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">Logos</span>
    </th>
    <th className="py-3 sm:py-4 px-1 sm:px-2 md:px-3 text-center min-w-[55px] sm:min-w-[70px]">
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground">BGway</span>
    </th>
  </tr>
);

const FeatureRow = ({ feature, index }: { feature: Feature; index: number }) => (
  <tr
    className={`border-b border-border/50 transition-colors hover:bg-muted/50 ${
      index % 2 === 0 ? "bg-muted/20" : ""
    }`}
  >
    <td className="py-3 px-3 sm:px-4 md:px-6 text-xs sm:text-sm font-medium text-foreground">
      <FeatureWithTooltip name={feature.name} description={feature.description} isEnhanced={feature.isEnhanced} />
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
          {/* Glass border effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 p-[1px]">
            <div className="absolute inset-0 rounded-2xl backdrop-blur-xl bg-card/80" />
          </div>
          <div className="absolute inset-0 rounded-2xl border border-white/20" />

          {/* Table Content - Scrollable on mobile */}
          <div className="relative z-10 overflow-x-auto touch-pan-x -webkit-overflow-scrolling-touch">
            <table className="w-full">
              <thead>
                <TableHeader />
              </thead>
              <tbody>
                {/* Standard Features Section */}
                <tr>
                  <td colSpan={6} className="py-3 px-4 md:px-6 bg-muted/50">
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
                      ✨ Unique to Phototheology
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
          <div className="relative z-10 flex flex-wrap justify-center gap-4 md:gap-6 py-4 px-4 border-t border-border">
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
