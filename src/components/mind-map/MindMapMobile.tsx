import { useState } from 'react';
import { ChevronDown, ChevronRight, Lightbulb, Church, Sprout, Lock, Unlock, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AnyNodeData, FloorNodeData, RoomNodeData, SanctuaryZoneNodeData, PrincipleData } from './types';
import { palaceFloors, sanctuaryZones, sanctuaryElements, FLOOR_THEMES } from './constants';

interface MindMapMobileProps {
  analysis: {
    overallTheme?: string;
    relevantFloors: number[];
    roomAnalysis: Record<string, { applicable: boolean; principles: PrincipleData[] }>;
    sanctuaryAnalysis?: Record<string, { applicable: boolean; insights: PrincipleData[] }>;
  } | null;
  onMakeSeed?: (content: string) => void;
  isManualMode?: boolean;
}

export default function MindMapMobile({ analysis, onMakeSeed, isManualMode = false }: MindMapMobileProps) {
  const [expandedFloors, setExpandedFloors] = useState<Set<number>>(new Set([1])); // Start with Floor 1 expanded
  const [expandedRooms, setExpandedRooms] = useState<Set<string>>(new Set());
  const [expandedZones, setExpandedZones] = useState<Set<string>>(new Set());
  const [showSanctuary, setShowSanctuary] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(true); // Show all rooms by default

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
        <p>Enter text and click "Ask Jeeves" or "My Study" to begin</p>
      </div>
    );
  }

  // Determine if this is Jeeves-generated (has insights) or manual mode (empty rooms)
  const totalInsights = Object.values(analysis.roomAnalysis).reduce(
    (sum, r) => sum + (r.principles?.length || 0), 0
  );
  const isJeevesMode = totalInsights > 0;

  return (
    <div className="p-4 space-y-3 overflow-y-auto pb-20">
      {/* Mode indicator and toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-card/80 border border-white/10">
        <div className="flex items-center gap-2">
          {isJeevesMode ? (
            <>
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Jeeves Analysis</span>
              <span className="text-xs text-green-400">({totalInsights} insights)</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Manual Study Mode</span>
            </>
          )}
        </div>
        <button
          onClick={() => setShowAllRooms(!showAllRooms)}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-white/5 hover:bg-white/10 transition-colors"
        >
          {showAllRooms ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          {showAllRooms ? 'All Rooms' : 'Active Only'}
        </button>
      </div>

      {/* Overall Theme (if present) */}
      {analysis.overallTheme && isJeevesMode && (
        <div className="p-3 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
          <p className="text-sm text-foreground italic">{analysis.overallTheme}</p>
        </div>
      )}

      {/* Palace Floors - ALL 8 FLOORS */}
      {palaceFloors.map((floor) => {
        const theme = FLOOR_THEMES[floor.number - 1];

        // Get all rooms for this floor with their analysis data
        const allRooms = floor.rooms.map((room) => ({
          ...room,
          analysisData: analysis.roomAnalysis[room.id] || { applicable: false, principles: [] },
        }));

        // Count insights for this floor
        const insightCount = allRooms.reduce(
          (sum, r) => sum + (r.analysisData.principles?.length || 0), 0
        );

        // Determine which rooms to show
        const roomsToShow = showAllRooms
          ? allRooms  // Show all rooms
          : allRooms.filter(r => r.analysisData.applicable && r.analysisData.principles.length > 0);

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
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
                  {floor.rooms.length} rooms
                </span>
                {insightCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-green-500/30 text-xs font-semibold">
                    {insightCount} insights
                  </span>
                )}
              </div>
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
                  {roomsToShow.map((room) => {
                    const hasInsights = room.analysisData.principles && room.analysisData.principles.length > 0;
                    const isRoomExpanded = expandedRooms.has(room.id);

                    return (
                      <div key={room.id} className="border-t border-white/5">
                        <button
                          onClick={() => toggleRoom(room.id)}
                          className={`w-full flex items-center gap-2 p-3 hover:bg-white/5 ${
                            !hasInsights ? 'opacity-60' : ''
                          }`}
                        >
                          {hasInsights ? (
                            isRoomExpanded ? (
                              <ChevronDown className="w-3 h-3 text-green-400" />
                            ) : (
                              <ChevronRight className="w-3 h-3 text-green-400" />
                            )
                          ) : (
                            <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                          )}
                          <span className={`text-xs font-bold ${hasInsights ? 'text-primary' : 'text-muted-foreground'}`}>
                            {room.tag}
                          </span>
                          <span className="flex-1 text-left text-sm">{room.name}</span>
                          {hasInsights ? (
                            <span className="text-xs text-green-400 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3" />
                              {room.analysisData.principles.length}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              {isJeevesMode ? 'No match' : 'Explore'}
                            </span>
                          )}
                        </button>

                        <AnimatePresence>
                          {isRoomExpanded && hasInsights && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-8 pr-3 pb-3 space-y-2">
                                {/* Room description */}
                                <p className="text-xs text-muted-foreground mb-2 italic">
                                  {room.coreQuestion}
                                </p>
                                {/* Principles */}
                                {room.analysisData.principles.map((principle, i) => (
                                  <PrincipleItem
                                    key={i}
                                    principle={principle}
                                    onMakeSeed={onMakeSeed}
                                  />
                                ))}
                              </div>
                            </motion.div>
                          )}
                          {isRoomExpanded && !hasInsights && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-8 pr-3 pb-3">
                                <p className="text-xs text-muted-foreground italic">
                                  {room.coreQuestion}
                                </p>
                                <p className="text-xs text-muted-foreground/60 mt-1">
                                  {isJeevesMode
                                    ? 'Jeeves found no direct connections to this room.'
                                    : 'Tap to explore how your text connects to this room.'}
                                </p>
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

      {/* Sanctuary Section - Always show */}
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
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-semibold">
              {sanctuaryElements.length} elements
            </span>
            {analysis.sanctuaryAnalysis && (
              <span className="px-2 py-0.5 rounded-full bg-yellow-500/30 text-xs font-semibold">
                {Object.values(analysis.sanctuaryAnalysis).reduce(
                  (sum, z) => sum + (z.insights?.length || 0),
                  0
                )} insights
              </span>
            )}
          </div>
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

                // Get insights for all elements in this zone
                const elementsWithData = zoneElements.map((element) => ({
                  ...element,
                  insights: analysis.sanctuaryAnalysis?.[element.id]?.insights || [],
                }));

                const zoneInsightCount = elementsWithData.reduce(
                  (sum, e) => sum + e.insights.length, 0
                );

                // Show zone if showAllRooms is true or if it has insights
                const showZone = showAllRooms || zoneInsightCount > 0;
                if (!showZone) return null;

                const isZoneExpanded = expandedZones.has(zone.id);

                return (
                  <div key={zone.id} className="border-t border-white/5">
                    <button
                      onClick={() => toggleZone(zone.id)}
                      className="w-full flex items-center gap-2 p-3 hover:bg-white/5"
                    >
                      {isZoneExpanded ? (
                        <ChevronDown className="w-3 h-3 text-purple-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-purple-400" />
                      )}
                      <span className="flex-1 text-left text-sm font-medium">{zone.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {zoneElements.length} items
                      </span>
                      {zoneInsightCount > 0 && (
                        <span className="text-xs text-yellow-400">
                          {zoneInsightCount} insights
                        </span>
                      )}
                    </button>

                    <AnimatePresence>
                      {isZoneExpanded && (
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: 'auto' }}
                          exit={{ height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-8 pr-3 pb-3 space-y-3">
                            {elementsWithData.map((element) => {
                              const hasInsights = element.insights.length > 0;

                              // Show element if showAllRooms is true or if it has insights
                              if (!showAllRooms && !hasInsights) return null;

                              return (
                                <div key={element.id} className="space-y-2">
                                  <div className={`flex items-center gap-2 ${
                                    hasInsights ? 'text-yellow-400' : 'text-muted-foreground/60'
                                  }`}>
                                    {hasInsights ? (
                                      <Lightbulb className="w-3 h-3" />
                                    ) : (
                                      <div className="w-3 h-3 rounded-full border border-current" />
                                    )}
                                    <span className="text-xs font-semibold">{element.name}</span>
                                    {hasInsights && (
                                      <span className="text-xs">({element.insights.length})</span>
                                    )}
                                  </div>
                                  {/* Christ connection */}
                                  <p className="text-xs text-muted-foreground/80 italic ml-5">
                                    Christ: {element.christConnection}
                                  </p>
                                  {/* Insights */}
                                  {element.insights.map((insight, i) => (
                                    <div className="ml-5" key={i}>
                                      <PrincipleItem
                                        principle={insight}
                                        onMakeSeed={onMakeSeed}
                                      />
                                    </div>
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
