import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getToolsForRoom, type RoomTool } from "@/data/roomToolsMapping";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Gamepad2, Compass, Bot, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface RoomPracticeToolsProps {
  roomId: string;
}

const categoryConfig: Record<string, { label: string; icon: typeof Compass; className: string }> = {
  nav: { label: "Navigate", icon: Navigation, className: "bg-primary/10 text-primary border-primary/20" },
  game: { label: "Game", icon: Gamepad2, className: "bg-accent/10 text-accent border-accent/20" },
  tool: { label: "Tool", icon: Compass, className: "bg-secondary/80 text-secondary-foreground border-secondary" },
  gpt: { label: "AI", icon: Bot, className: "bg-palace-purple/10 text-palace-purple border-palace-purple/20" },
};

export function RoomPracticeTools({ roomId }: RoomPracticeToolsProps) {
  const { t } = useTranslation();
  const tools = getToolsForRoom(roomId);

  if (tools.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-foreground">Explore & Practice</h3>
      </div>
      <p className="text-sm text-muted-foreground">
        Jump to platform tools, games, and features connected to this room.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04, duration: 0.3 }}
          >
            <Link to={tool.path}>
              <Card className="h-full hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer group border-border/60 bg-card/80">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tool.icon}</span>
                      <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                  <div className="mt-auto pt-1">
                    <CategoryBadge category={tool.category} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const config = categoryConfig[category] || categoryConfig.tool;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${config.className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
}
