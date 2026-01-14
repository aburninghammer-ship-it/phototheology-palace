import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Building2, Repeat, Star, Cloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { PTMapping } from "@/types/sermonWriter";

interface SparkPTMappingTabProps {
  ptMapping?: PTMapping;
  onUpdate?: (mapping: PTMapping) => void;
  readOnly?: boolean;
}

// Palace Room codes with descriptions
const ROOM_CODES: Record<string, string> = {
  SR: "Story Room",
  IR: "Image Room",
  "24F": "24 Features Floor",
  BR: "Blueprint Room",
  TR: "Timeline Room",
  GR: "Gallery Room",
  OR: "Overview Room",
  DC: "Document Chamber",
  ST: "Study",
  QR: "Question Room",
  QA: "Q&A Archive",
  NF: "North Face",
  PF: "Palace Foundation",
  BF: "Basement Floor",
  HF: "Heaven Floor",
  LR: "Library Room",
  CR: "Creation Room",
  DR: "Dining Room",
  C6: "Covenant 6",
  TRm: "Throne Room",
  TZ: "Time Zone",
  PRm: "Prophet Room",
  "P‖": "Parallel Prophecy",
  FRt: "First Fruits",
  BL: "Burning Lamp",
  PR: "Prayer Room",
  "3A": "Three Angels",
};

// Sanctuary articles
const SANCTUARY_ARTICLES = [
  "Altar of Burnt Offering",
  "Laver",
  "Lampstand",
  "Table of Showbread",
  "Altar of Incense",
  "Ark of the Covenant",
];

// Covenant cycles
const CYCLES: Record<string, string> = {
  "@Ad": "Adam",
  "@No": "Noah",
  "@Ab": "Abraham",
  "@Mo": "Moses",
  "@Cy": "Cyrus",
  "@CyC": "Cyrus Cycle",
  "@Sp": "Spiritual",
  "@Re": "Restoration",
};

// Three Heavens
const HEAVENS = ["1H (DoL¹/NE¹)", "2H (DoL²/NE²)", "3H (DoL³/NE³)"];

export function SparkPTMappingTab({
  ptMapping,
  onUpdate,
  readOnly = false,
}: SparkPTMappingTabProps) {
  const [addingTo, setAddingTo] = useState<'rooms' | 'cycles' | 'sanctuary' | 'heavens' | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const rooms = ptMapping?.rooms || [];
  const cycles = ptMapping?.cycles || [];
  const sanctuary = ptMapping?.sanctuary || [];
  const heavens = ptMapping?.heavens || [];

  const handleAdd = (category: 'rooms' | 'cycles' | 'sanctuary' | 'heavens', value: string) => {
    if (!onUpdate) return;
    const currentValues = ptMapping?.[category] || [];
    if (currentValues.includes(value)) return;
    onUpdate({
      ...ptMapping,
      [category]: [...currentValues, value],
    });
    setAddingTo(null);
    setSearchQuery("");
  };

  const handleRemove = (category: 'rooms' | 'cycles' | 'sanctuary' | 'heavens', value: string) => {
    if (!onUpdate) return;
    const currentValues = ptMapping?.[category] || [];
    onUpdate({
      ...ptMapping,
      [category]: currentValues.filter((v) => v !== value),
    });
  };

  const hasAnyMapping = rooms.length > 0 || cycles.length > 0 || sanctuary.length > 0 || heavens.length > 0;

  if (!hasAnyMapping && readOnly) {
    return (
      <div className="text-center text-slate-400 py-4">
        <p className="text-sm">No Phototheology mappings added yet.</p>
      </div>
    );
  }

  const renderBadgeList = (
    category: 'rooms' | 'cycles' | 'sanctuary' | 'heavens',
    items: string[],
    colorClass: string,
    icon: React.ReactNode,
    availableItems: Record<string, string> | string[]
  ) => {
    const isArray = Array.isArray(availableItems);
    const filteredAvailable = isArray
      ? (availableItems as string[]).filter(
          (item) => !items.includes(item) && item.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : Object.entries(availableItems as Record<string, string>).filter(
          ([code, label]) =>
            !items.includes(code) &&
            (code.toLowerCase().includes(searchQuery.toLowerCase()) ||
              label.toLowerCase().includes(searchQuery.toLowerCase()))
        );

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Badge variant="outline" className={`text-xs ${colorClass} group`}>
                  {icon}
                  <span className="ml-1">
                    {isArray
                      ? item
                      : (availableItems as Record<string, string>)[item]
                      ? `${item} (${(availableItems as Record<string, string>)[item]})`
                      : item}
                  </span>
                  {!readOnly && (
                    <button
                      className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemove(category, item)}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>

          {!readOnly && addingTo !== category && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs text-slate-400 hover:text-white"
              onClick={() => setAddingTo(category)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
        </div>

        {addingTo === category && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-700/50 rounded-lg p-2 space-y-2"
          >
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-slate-800 border-slate-600 text-white text-sm h-7"
              autoFocus
            />
            <div className="max-h-32 overflow-y-auto space-y-1">
              {isArray
                ? (filteredAvailable as string[]).map((item) => (
                    <button
                      key={item}
                      className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-600 rounded px-2 py-1"
                      onClick={() => handleAdd(category, item)}
                    >
                      {item}
                    </button>
                  ))
                : (filteredAvailable as [string, string][]).map(([code, label]) => (
                    <button
                      key={code}
                      className="w-full text-left text-xs text-slate-300 hover:text-white hover:bg-slate-600 rounded px-2 py-1"
                      onClick={() => handleAdd(category, code)}
                    >
                      <span className="font-medium">{code}</span>
                      <span className="text-slate-400 ml-1">- {label}</span>
                    </button>
                  ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 text-xs w-full"
              onClick={() => {
                setAddingTo(null);
                setSearchQuery("");
              }}
            >
              Cancel
            </Button>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Connect this spark to the Phototheology framework: Palace rooms, covenant cycles, sanctuary articles, and heavens.
      </p>

      {/* Palace Rooms */}
      <div>
        <Label className="text-xs text-slate-300 flex items-center gap-1 mb-1">
          <Building2 className="w-3.5 h-3.5" />
          Palace Rooms
        </Label>
        {renderBadgeList(
          'rooms',
          rooms,
          'bg-blue-500/20 text-blue-400 border-blue-500/30',
          <Building2 className="w-3 h-3" />,
          ROOM_CODES
        )}
      </div>

      {/* Covenant Cycles */}
      <div>
        <Label className="text-xs text-slate-300 flex items-center gap-1 mb-1">
          <Repeat className="w-3.5 h-3.5" />
          Covenant Cycles
        </Label>
        {renderBadgeList(
          'cycles',
          cycles,
          'bg-purple-500/20 text-purple-400 border-purple-500/30',
          <Repeat className="w-3 h-3" />,
          CYCLES
        )}
      </div>

      {/* Sanctuary Articles */}
      <div>
        <Label className="text-xs text-slate-300 flex items-center gap-1 mb-1">
          <Star className="w-3.5 h-3.5" />
          Sanctuary Articles
        </Label>
        {renderBadgeList(
          'sanctuary',
          sanctuary,
          'bg-amber-500/20 text-amber-400 border-amber-500/30',
          <Star className="w-3 h-3" />,
          SANCTUARY_ARTICLES
        )}
      </div>

      {/* Three Heavens */}
      <div>
        <Label className="text-xs text-slate-300 flex items-center gap-1 mb-1">
          <Cloud className="w-3.5 h-3.5" />
          Three Heavens
        </Label>
        {renderBadgeList(
          'heavens',
          heavens,
          'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
          <Cloud className="w-3 h-3" />,
          HEAVENS
        )}
      </div>
    </div>
  );
}
