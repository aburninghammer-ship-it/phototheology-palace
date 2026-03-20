import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Telescope, Crown, Clock, Swords } from "lucide-react";
import { motion } from "framer-motion";

export type ExamType = "master" | "foundation" | "prophecy_sanctuary" | "room_test";

interface ExamTypeConfig {
  id: ExamType;
  name: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  badges: string[];
  timeMinutes: number;
  color: string;
}

const EXAM_TYPES: ExamTypeConfig[] = [
  {
    id: "master",
    name: "Master Exam",
    subtitle: "The Full Palace",
    description:
      "50 questions spanning every domain — rooms, apologetics, gems, prophecy, sanctuary, Christ types, patterns, and more.",
    icon: <Crown className="h-7 w-7" />,
    badges: ["All 8 Floors", "AI Graded", "90 min"],
    timeMinutes: 90,
    color: "from-primary to-accent",
  },
  {
    id: "foundation",
    name: "Foundation Diagnostic",
    subtitle: "Do You Know the Map?",
    description:
      "Tests whether you understand the PT framework — floors, rooms, codes, flow, and which thinking belongs where.",
    icon: <Building2 className="h-7 w-7" />,
    badges: ["Framework", "Room ID", "60 min"],
    timeMinutes: 60,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "prophecy_sanctuary",
    name: "Prophecy & Sanctuary",
    subtitle: "The Telescope & Blueprint",
    description:
      "Tests prophetic structure, sanctuary mapping, Three Heavens, cycles, time prophecies, and the Three Angels.",
    icon: <Telescope className="h-7 w-7" />,
    badges: ["Prophecy", "Sanctuary", "60 min"],
    timeMinutes: 60,
    color: "from-purple-500 to-pink-500",
  },
];

interface ExamTypeSelectorProps {
  onSelect: (type: ExamType) => void;
}

export function ExamTypeSelector({ onSelect }: ExamTypeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Choose Your Assessment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Each exam diagnoses different aspects of your PT competency
        </p>
      </div>

      <div className="grid gap-4">
        {EXAM_TYPES.map((exam, i) => (
          <motion.div
            key={exam.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          >
            <Card
              variant="glass"
              className="cursor-pointer hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 group"
              onClick={() => onSelect(exam.id)}
            >
              <CardContent className="p-5 md:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl p-3 bg-gradient-to-br ${exam.color} text-white shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    {exam.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{exam.name}</h3>
                    </div>
                    <p className="text-sm font-medium text-primary/80 mb-1">
                      {exam.subtitle}
                    </p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {exam.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {exam.badges.map((b) => (
                        <Badge key={b} variant="outline" className="text-xs">
                          {b}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {exam.timeMinutes} min
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        50 Questions
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
