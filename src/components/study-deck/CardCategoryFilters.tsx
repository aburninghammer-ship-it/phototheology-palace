import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  selectedFloor: number | null;
  onFloorSelect: (floor: number | null) => void;
  cardCounts: Record<number, number>;
}

const FLOOR_INFO = [
  { 
    number: 1, 
    name: "Furnishing Floor",
    color: "from-purple-500 to-pink-500",
    borderColor: "border-purple-400",
    description: "Memory & Visualization"
  },
  { 
    number: 2, 
    name: "Investigation Floor",
    color: "from-blue-500 to-cyan-500",
    borderColor: "border-cyan-400",
    description: "Detective Work"
  },
  { 
    number: 3, 
    name: "Freestyle Floor",
    color: "from-green-500 to-emerald-500",
    borderColor: "border-emerald-400",
    description: "Spontaneous Connections"
  },
  { 
    number: 4, 
    name: "Next Level Floor",
    color: "from-yellow-500 to-orange-500",
    borderColor: "border-orange-400",
    description: "Christ-Centered Depth"
  },
  { 
    number: 5, 
    name: "Vision Floor",
    color: "from-red-500 to-rose-500",
    borderColor: "border-rose-400",
    description: "Prophecy & Sanctuary"
  },
  { 
    number: 6, 
    name: "Three Heavens Floor",
    color: "from-indigo-500 to-purple-500",
    borderColor: "border-indigo-400",
    description: "Cycles & Cosmic Context"
  },
  { 
    number: 7, 
    name: "Spiritual Floor",
    color: "from-pink-500 to-fuchsia-500",
    borderColor: "border-fuchsia-400",
    description: "Heart Transformation"
  },
  { 
    number: 8, 
    name: "Master Floor",
    color: "from-amber-500 to-yellow-500",
    borderColor: "border-amber-400",
    description: "Reflexive Mastery"
  },
];

export function CardCategoryFilters({ selectedFloor, onFloorSelect, cardCounts }: Props) {
  return (
    <Card variant="glass" className="border-2 border-primary/20">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">Filter by Floor</h3>
            </div>
            {selectedFloor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFloorSelect(null)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FLOOR_INFO.map((floor, index) => {
              const isSelected = selectedFloor === floor.number;
              const count = cardCounts[floor.number] || 0;
              
              return (
                <motion.div
                  key={floor.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <button
                    onClick={() => onFloorSelect(isSelected ? null : floor.number)}
                    className={`
                      w-full text-left p-3 rounded-lg border-2 transition-all
                      ${isSelected 
                        ? `bg-gradient-to-br ${floor.color} ${floor.borderColor} shadow-lg`
                        : 'bg-background border-border hover:border-primary/40'
                      }
                    `}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant={isSelected ? "secondary" : "outline"}
                          className={isSelected ? "bg-white/20 text-white border-white/40" : ""}
                        >
                          Floor {floor.number}
                        </Badge>
                        <span className={`text-xs font-mono ${isSelected ? 'text-white' : 'text-muted-foreground'}`}>
                          {count}
                        </span>
                      </div>
                      <div className={`font-semibold text-sm ${isSelected ? 'text-white' : ''}`}>
                        {floor.name}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                        {floor.description}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
