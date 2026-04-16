import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Zap, Gem, BookOpen, Eye, Star, Flame,
  Trophy, Target, Brain, Sparkles, ChevronRight,
  Lock, CheckCircle2, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface StatPopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
}

function StatPopover({ children, content }: StatPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1.5 text-xs hover:bg-white/5 rounded-md px-1.5 py-1 transition-colors cursor-pointer">
          {children}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="center" sideOffset={8}>
        {content}
      </PopoverContent>
    </Popover>
  );
}

// ─── XP Growth Map ──────────────────────────────────────────
interface XpPopoverProps {
  totalXp: number;
  roomsExplored: number;
  chaptersRead: number;
  currentStreak: number;
  gemsCount: number;
}

const XP_MILESTONES = [
  { xp: 100, reward: "Student Rank" },
  { xp: 500, reward: "Explorer Badge" },
  { xp: 2000, reward: "Apprentice Title" },
  { xp: 5000, reward: "Scholar Crown" },
  { xp: 10000, reward: "Master Status" },
];

export function XpPopover({ totalXp, roomsExplored, chaptersRead, currentStreak, gemsCount }: XpPopoverProps) {
  const nextMilestone = XP_MILESTONES.find(m => m.xp > totalXp) || XP_MILESTONES[XP_MILESTONES.length - 1];
  const prevMilestone = [...XP_MILESTONES].reverse().find(m => m.xp <= totalXp);
  const prevXp = prevMilestone?.xp || 0;
  const progress = nextMilestone.xp > prevXp ? ((totalXp - prevXp) / (nextMilestone.xp - prevXp)) * 100 : 100;

  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <h4 className="font-semibold text-sm">Growth Map</h4>
          </div>
          
          <div className="text-center py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xl font-bold text-amber-400">{totalXp.toLocaleString()} XP</p>
            <p className="text-[10px] text-muted-foreground">Total Experience</p>
          </div>

          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">Next: {nextMilestone.reward}</span>
              <span className="font-medium">{totalXp}/{nextMilestone.xp}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div className="text-[11px] space-y-1.5 text-muted-foreground">
            <p className="font-medium text-foreground text-xs mb-1">How XP is earned:</p>
            <div className="grid grid-cols-2 gap-1">
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" /> Room completion</span>
              <span className="flex items-center gap-1"><Target className="h-3 w-3" /> Challenges</span>
              <span className="flex items-center gap-1"><Brain className="h-3 w-3" /> Freestyle drills</span>
              <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Daily devotion</span>
              <span className="flex items-center gap-1"><Flame className="h-3 w-3" /> Streak bonus</span>
              <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> Bible reading</span>
            </div>
          </div>

          {currentStreak > 0 && (
            <div className="flex items-center gap-2 text-xs text-orange-400 bg-orange-500/10 rounded-md px-2 py-1.5">
              <Flame className="h-3.5 w-3.5" />
              <span>{currentStreak}-day streak = +{currentStreak * 5} bonus XP</span>
            </div>
          )}

          <Button asChild size="sm" className="w-full h-7 text-xs">
            <Link to="/palace">View Full Progress <ChevronRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      }
    >
      <Zap className="h-3.5 w-3.5 text-amber-400" />
      <span className="font-semibold text-foreground">{totalXp.toLocaleString()}</span>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">XP</span>
    </StatPopover>
  );
}

// ─── Gems Vault ──────────────────────────────────────────
export function GemsPopover({ gemsCount }: { gemsCount: number }) {
  const GEM_THRESHOLDS = [
    { count: 5, unlock: "Bronze Gem Collector" },
    { count: 25, unlock: "Silver Gem Hunter" },
    { count: 50, unlock: "Gold Gem Master" },
    { count: 100, unlock: "Diamond Prospector" },
  ];
  const next = GEM_THRESHOLDS.find(g => g.count > gemsCount);

  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Gem className="h-4 w-4 text-cyan-400" />
            <h4 className="font-semibold text-sm">Insight Vault</h4>
          </div>

          <div className="text-center py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-xl font-bold text-cyan-400">{gemsCount}</p>
            <p className="text-[10px] text-muted-foreground">Gems Discovered</p>
          </div>

          <p className="text-[11px] text-muted-foreground">
            Gems are powerful cross-text insights — the treasure chest of Phototheology.
          </p>

          {next && (
            <div className="flex items-center justify-between text-[11px] bg-cyan-500/10 rounded-md px-2 py-1.5">
              <span className="text-muted-foreground">Next unlock at {next.count} gems:</span>
              <Badge className="text-[9px] bg-cyan-500/20 text-cyan-400 border-0">{next.unlock}</Badge>
            </div>
          )}

          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1 h-7 text-xs">
              <Link to="/palace">View Gems <ChevronRight className="h-3 w-3 ml-1" /></Link>
            </Button>
          </div>
        </div>
      }
    >
      <Gem className="h-3.5 w-3.5 text-cyan-400" />
      <span className="font-semibold text-foreground">{gemsCount}</span>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">Gems</span>
    </StatPopover>
  );
}

// ─── Rooms Map ──────────────────────────────────────────
export function RoomsPopover({ roomsExplored }: { roomsExplored: number }) {
  const totalRooms = 38;
  const progress = Math.round((roomsExplored / totalRooms) * 100);

  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <h4 className="font-semibold text-sm">Palace Rooms</h4>
          </div>

          <div className="text-center py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xl font-bold text-emerald-400">{roomsExplored} / {totalRooms}</p>
            <p className="text-[10px] text-muted-foreground">Rooms Explored</p>
          </div>

          <Progress value={progress} className="h-2" />
          <p className="text-[10px] text-center text-muted-foreground">{progress}% palace explored</p>

          {roomsExplored < totalRooms && (
            <p className="text-[11px] text-muted-foreground italic">
              {totalRooms - roomsExplored} rooms waiting to be unlocked. Complete drills to gain access.
            </p>
          )}

          <Button asChild size="sm" className="w-full h-7 text-xs">
            <Link to="/palace">Explore Palace <ChevronRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      }
    >
      <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
      <span className="font-semibold text-foreground">{roomsExplored}</span>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">Rooms</span>
    </StatPopover>
  );
}

// ─── Chapters Tracker ──────────────────────────────────────────
export function ChaptersPopover({ chaptersRead }: { chaptersRead: number }) {
  const totalChapters = 1189;
  const progress = Math.min(Math.round((chaptersRead / totalChapters) * 100), 100);

  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-purple-400" />
            <h4 className="font-semibold text-sm">Study Completion</h4>
          </div>

          <div className="text-center py-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
            <p className="text-xl font-bold text-purple-400">{chaptersRead}</p>
            <p className="text-[10px] text-muted-foreground">Chapters Read</p>
          </div>

          <div>
            <div className="flex justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Bible Completion</span>
              <span>{progress}% ({chaptersRead}/{totalChapters})</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Button asChild size="sm" className="w-full h-7 text-xs">
            <Link to="/bible">Continue Reading <ChevronRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      }
    >
      <Eye className="h-3.5 w-3.5 text-purple-400" />
      <span className="font-semibold text-foreground">{chaptersRead}</span>
      <span className="text-[10px] text-muted-foreground">Chapters</span>
    </StatPopover>
  );
}

// ─── Floors Progress ──────────────────────────────────────────
const FLOOR_NAMES = ["Furnishing", "Investigation", "Freestyle", "Next Level", "Vision", "Three Heavens", "Spiritual", "Master"];
const FLOOR_COLORS = ["text-blue-400", "text-red-400", "text-amber-400", "text-purple-400", "text-emerald-400", "text-cyan-400", "text-pink-400", "text-yellow-400"];

export function FloorsPopover({ floorsUnlocked }: { floorsUnlocked: number }) {
  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <h4 className="font-semibold text-sm">Palace Progress</h4>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {FLOOR_NAMES.map((name, i) => {
              const isUnlocked = i < floorsUnlocked;
              return (
                <div key={i} className={cn(
                  "flex flex-col items-center p-1.5 rounded-md border text-center transition-all",
                  isUnlocked
                    ? "bg-primary/5 border-primary/20"
                    : "bg-muted/30 border-border/20 opacity-40"
                )}>
                  <span className={cn("text-sm font-bold", isUnlocked ? FLOOR_COLORS[i] : "text-muted-foreground")}>{i + 1}</span>
                  <span className="text-[8px] leading-tight text-muted-foreground">{name}</span>
                  {isUnlocked ? (
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 mt-0.5" />
                  ) : (
                    <Lock className="h-2.5 w-2.5 text-muted-foreground mt-0.5" />
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground text-center">
            {floorsUnlocked >= 8 ? "🏆 All floors unlocked — Master level!" : `${8 - floorsUnlocked} floors remaining`}
          </p>

          <Button asChild size="sm" className="w-full h-7 text-xs">
            <Link to="/palace">View Palace <ChevronRight className="h-3 w-3 ml-1" /></Link>
          </Button>
        </div>
      }
    >
      <Star className="h-3.5 w-3.5 text-yellow-400" />
      <span className="font-semibold text-foreground">{floorsUnlocked}/8</span>
      <span className="text-[10px] text-muted-foreground">Floors</span>
    </StatPopover>
  );
}

// ─── Streak Popover ──────────────────────────────────────────
export function StreakPopover({ currentStreak }: { currentStreak: number }) {
  if (currentStreak <= 0) return null;

  return (
    <StatPopover
      content={
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-400" />
            <h4 className="font-semibold text-sm">Study Streak</h4>
          </div>

          <div className="text-center py-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <p className="text-xl font-bold text-orange-400">{currentStreak} Days</p>
            <p className="text-[10px] text-muted-foreground">Current Streak</p>
          </div>

          <div className="text-[11px] text-muted-foreground space-y-1">
            <p>• +5 XP per streak day</p>
            <p>• 7-day streak = Bronze badge</p>
            <p>• 30-day streak = "Consistency is becoming identity"</p>
          </div>
        </div>
      }
    >
      <Flame className="h-3.5 w-3.5 text-orange-400" />
      <span className="font-semibold text-foreground">{currentStreak}d</span>
      <span className="text-[10px] text-muted-foreground hidden sm:inline">Streak</span>
    </StatPopover>
  );
}
