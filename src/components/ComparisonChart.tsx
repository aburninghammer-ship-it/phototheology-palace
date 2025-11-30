import { Check, X, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Feature {
  name: string;
  phototheology: "yes" | "no" | "partial";
  youversion: "yes" | "no" | "partial";
  logos: "yes" | "no" | "partial";
  olivetree: "yes" | "no" | "partial";
  blueletter: "yes" | "no" | "partial";
}

const features: Feature[] = [
  {
    name: "Memory Palace System",
    phototheology: "yes",
    youversion: "no",
    logos: "no",
    olivetree: "no",
    blueletter: "no",
  },
  {
    name: "AI Study Companion",
    phototheology: "yes",
    youversion: "partial",
    logos: "yes",
    olivetree: "no",
    blueletter: "no",
  },
  {
    name: "Visual Learning Approach",
    phototheology: "yes",
    youversion: "partial",
    logos: "partial",
    olivetree: "no",
    blueletter: "no",
  },
  {
    name: "Christ-Centered Framework",
    phototheology: "yes",
    youversion: "partial",
    logos: "partial",
    olivetree: "partial",
    blueletter: "partial",
  },
  {
    name: "Gamified Mastery System",
    phototheology: "yes",
    youversion: "partial",
    logos: "no",
    olivetree: "no",
    blueletter: "no",
  },
  {
    name: "Bible Study Generator",
    phototheology: "yes",
    youversion: "no",
    logos: "partial",
    olivetree: "no",
    blueletter: "no",
  },
  {
    name: "Free Tier Available",
    phototheology: "yes",
    youversion: "yes",
    logos: "partial",
    olivetree: "partial",
    blueletter: "yes",
  },
  {
    name: "Prophecy & Typology Training",
    phototheology: "yes",
    youversion: "no",
    logos: "partial",
    olivetree: "no",
    blueletter: "partial",
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

export function ComparisonChart() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            App Comparison
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How We Stack Up
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See how Phototheology compares to the most popular Bible apps
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
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 md:px-6 font-semibold text-foreground min-w-[160px]">
                    Feature
                  </th>
                  <th className="py-4 px-3 md:px-4 text-center min-w-[90px]">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs md:text-sm font-bold text-primary">Phototheology</span>
                      <Badge variant="outline" className="text-[10px] bg-primary/10 border-primary/30">OURS</Badge>
                    </div>
                  </th>
                  <th className="py-4 px-3 md:px-4 text-center min-w-[80px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">YouVersion</span>
                  </th>
                  <th className="py-4 px-3 md:px-4 text-center min-w-[80px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Logos</span>
                  </th>
                  <th className="py-4 px-3 md:px-4 text-center min-w-[80px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Olive Tree</span>
                  </th>
                  <th className="py-4 px-3 md:px-4 text-center min-w-[80px]">
                    <span className="text-xs md:text-sm font-medium text-muted-foreground">Blue Letter</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={feature.name} 
                    className={`border-b border-white/5 transition-colors hover:bg-white/5 ${
                      index % 2 === 0 ? "bg-white/[0.02]" : ""
                    }`}
                  >
                    <td className="py-4 px-4 md:px-6 text-sm font-medium text-foreground">
                      {feature.name}
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center">
                      <div className="flex justify-center">
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <StatusIcon status={feature.phototheology} />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.youversion} />
                      </div>
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.logos} />
                      </div>
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.olivetree} />
                      </div>
                    </td>
                    <td className="py-4 px-3 md:px-4 text-center">
                      <div className="flex justify-center">
                        <StatusIcon status={feature.blueletter} />
                      </div>
                    </td>
                  </tr>
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
              <span className="text-muted-foreground">Partial</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <X className="h-4 w-4 text-red-400" />
              <span className="text-muted-foreground">Not Available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
