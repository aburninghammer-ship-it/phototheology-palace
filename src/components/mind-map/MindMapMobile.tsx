import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, Church, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnyNodeData, FloorNodeData, RoomNodeData, SanctuaryZoneNodeData, PrincipleData } from './types';
import { palaceFloors, sanctuaryZones, sanctuaryElements, FLOOR_THEMES } from './constants';

interface MindMapMobileProps {
  analysis: {
    relevantFloors: number[];
    roomAnalysis: Record<string, { applicable: boolean; principles: PrincipleData[] }>;
    sanctuaryAnalysis?: Record<string, { applicable: boolean; insights: PrincipleData[] }>;
  } | null;
  onMakeSeed?: (content: string) => void;
}

export default function MindMapMobile({ analysis, onMakeSeed }: MindMapMobileProps) {
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set());
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const [showSanctuary, setShowSanctuary] = useState(false);

  const toggleFloor = (num: number) => {
    const next = new Set(expandedFloors);
    if (next.has(num)) next.delete(num);
    else next.add(num);
    setExpandedFloors(next);
  };

  const toggleRoom = (id: string) => {
    const next = new Set(expandedRooms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRooms(next);
  };

  const toggleZone = (id: string) => {
    const next = new Set(expandedZones);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedZones(next);
  };

  if (!analysis) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>Enter text and click "Map to Palace" to see results</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3 overflow-y-auto">
      {/* Palace Floors */}
      {palaceFloors.map((floor) => {
        const theme = FLOOR_THEMES[floor.number - 1];
        const isRelevant = analysis.relevantFloors.includes(floor.number);
        const matchingRooms = floor.rooms.filter(
          (r) => analysis.roomAnalysis[r.id]?.applicable
        );
        const matchCount = matchingRooms.reduce(
          (sum, r) => sum + (analysis.roomAnalysis[r.id]?.principles.length || 0),
          0
        );

        if (!isRelevant && matchCount === 0) return null;

        const isExpanded = expandedFloors.has(floor.number);

        return (
          <div key={floor.number} className="rounded-lg overflow-hidden border border-white/10">
            {/* Floor Header */}
            <button
              onClick={() => toggleFloor(floor.number)}
              className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r ${theme.gradient} text-white`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <div className="flex-1 text-left">
                <div className="text-xs opacity-70">Floor {floor.number}</div>
                <div className="font-semibold">{floor.name}</div>
              </div>
              {matchCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {matchCount} insights
                </span>
              )}
            </button>

            {/* Rooms */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden bg-card"
                >
                  {matchingRooms.map((room) => {
                    const roomData = analysis.roomAnalysis[room.id];
                    const isRoomExpanded = expandedRooms.has(room.id);

                    return (
                      <div key={room.id} className="border-t border-white/5">
                        <button
                          onClick={() => toggleRoom(room.id)}
                          className="w-full flex items-center gap-2 p-3 hover:bg-white/5"
                        >
                          {isRoomExpanded ? (
                            <ChevronDown className="w-3 h-3 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-3 h-3 text-muted-foreground" />
                          )}
                          <span className="text-xs font-bold text-primary">{room.tag}</span>
                          <span className="flex-1 text-left text-sm">{room.name}</span>
                          <span className="text-xs text-green-400">
                            {roomData.principles.length} insights
                          </span>
                        </button>

                        <AnimatePresence>
                          {isRoomExpanded && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-8 pr-3 pb-3 space-y-2">
                                {roomData.principles.map((principle, i) => (
                                  <PrincipleItem
                                    key={i}
                                    principle={principle}
                                    onMakeSeed={onMakeSeed}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Sanctuary Section */}
      {analysis.sanctuaryAnalysis && Object.keys(analysis.sanctuaryAnalysis).length > 0 && (
        <div className="rounded-lg overflow-hidden border border-purple-500/30">
          <button
            onClick={() => setShowSanctuary(!showSanctuary)}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-purple-600 to-violet-600 text-white"
          >
            {showSanctuary ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Church className="w-4 h-4" />
            <div className="flex-1 text-left font-semibold">The Sanctuary</div>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              {Object.values(analysis.sanctuaryAnalysis).reduce(
                (sum, z) => sum + z.insights.length,
                0
              )} insights
            </span>
          </button>

          <AnimatePresence>
            {showSanctuary && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden bg-card"
              >
                {sanctuaryZones.map((zone) => {
                  const zoneElements = sanctuaryElements.filter((e) => e.zone === zone.id);
                  const zoneInsights = zoneElements.flatMap(
                    (e) => analysis.sanctuaryAnalysis?.[e.id]?.insights || []
                  );

                  if (zoneInsights.length === 0) return null;

                  const isZoneExpanded = expandedZones.has(zone.id);

                  return (
                    <div key={zone.id} className="border-t border-white/5">
                      <button
                        onClick={() => toggleZone(zone.id)}
                        className="w-full flex items-center gap-2 p-3 hover:bg-white/5"
                      >
                        {isZoneExpanded ? (
                          <ChevronDown className="w-3 h-3 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-3 h-3 text-muted-foreground" />
                        )}
                        <span className="flex-1 text-left text-sm">{zone.name}</span>
                        <span className="text-xs text-yellow-400">
                          {zoneInsights.length} insights
                        </span>
                      </button>

                      <AnimatePresence>
                        {isZoneExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-8 pr-3 pb-3 space-y-2">
                              {zoneElements.map((element) => {
                                const elemInsights =
                                  analysis.sanctuaryAnalysis?.[element.id]?.insights || [];
                                if (elemInsights.length === 0) return null;

                                return (
                                  <div key={element.id} className="space-y-2">
                                    <div className="text-xs font-semibold text-yellow-400">
                                      {element.name}
                                    </div>
                                    {elemInsights.map((insight, i) => (
                                      <PrincipleItem
                                        key={i}
                                        principle={insight}
                                        onMakeSeed={onMakeSeed}
                                      />
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function PrincipleItem({
  principle,
  onMakeSeed,
}: {
  principle: PrincipleData;
  onMakeSeed?: (content: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-2 rounded-lg bg-background/50 border border-white/10 cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-2">
        <Lightbulb className="w-3 h-3 text-yellow-400 mt-1 flex-shrink-0" />
        <p className={`text-xs text-foreground ${expanded ? '' : 'line-clamp-2'}`}>
          {principle.content}
        </p>
        <span
          className={`text-xs px-1 py-0.5 rounded flex-shrink-0 ${
            principle.confidence >= 80
              ? 'bg-green-500/20 text-green-400'
              : principle.confidence >= 60
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-orange-500/20 text-orange-400'
          }`}
        >
          {principle.confidence}%
        </span>
      </div>

      {expanded && (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-muted-foreground italic">{principle.insight}</p>
          <p className="text-xs text-amber-400/80 italic">{principle.visualHook}</p>

          {onMakeSeed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMakeSeed(principle.content + '\n\n' + principle.insight);
              }}
              className="flex items-center gap-1 text-xs text-green-400 hover:underline"
            >
              <Sprout className="w-3 h-3" />
              Make seed
            </button>
          )}
        </div>
      )}
    </div>
  );
}
