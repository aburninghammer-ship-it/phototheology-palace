import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Clock, Users, Trophy, Zap } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { RoomPrerequisites } from "@/components/RoomPrerequisites";
import { ShareChallenge } from "@/components/ShareChallenge";

interface AvailableRoom {
  id: string;
  title: string;
  mode: string;
  category: string | null;
  difficulty: string;
  time_limit_minutes: number;
  expires_at: string;
}

export default function EscapeRoom() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);
  const [mode, setMode] = useState<"room_as_room" | "category_gauntlet" | "floor_race" | "live_mission" | "async_hunt">("room_as_room");
  const [category, setCategory] = useState<string>("sanctuary");
  const [scenario, setScenario] = useState("");
  const [teamMode, setTeamMode] = useState<"solo" | "team">("solo");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard" | "pro">("medium");
  const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);

  // All Palace rooms available for Room-as-Room mode
  const allPalaceRooms = [
    { id: "sanctuary", label: "Sanctuary (BL) - Furniture & Typology", floor: 5 },
    { id: "prophecy", label: "Prophecy (PR) - Timelines & Symbols", floor: 5 },
    { id: "three_angels", label: "Three Angels (3A) - Final Messages", floor: 5 },
    { id: "feasts", label: "Feasts (FE) - Biblical Festivals", floor: 5 },
    { id: "story", label: "Story Room (SR) - Narrative Flow", floor: 1 },
    { id: "imagination", label: "Imagination (IR) - Immersion", floor: 1 },
    { id: "translation", label: "Translation (TR) - Verse to Image", floor: 1 },
    { id: "gems", label: "Gems Room (GR) - Key Insights", floor: 1 },
    { id: "observation", label: "Observation (OR) - Detective Work", floor: 2 },
    { id: "def_com", label: "Def-Com (DC) - Definitions", floor: 2 },
    { id: "types", label: "Symbols/Types (ST) - Typology", floor: 2 },
    { id: "questions", label: "Questions (QR) - Investigation", floor: 2 },
    { id: "nature_freestyle", label: "Nature Freestyle (NF)", floor: 3 },
    { id: "personal_freestyle", label: "Personal Freestyle (PF)", floor: 3 },
    { id: "bible_freestyle", label: "Bible Freestyle (BF)", floor: 3 },
    { id: "history_freestyle", label: "History Freestyle (HF)", floor: 3 },
    { id: "listening", label: "Listening Room (LR)", floor: 3 },
    { id: "christ_concentration", label: "Concentration (CR) - Christ Focus", floor: 4 },
    { id: "dimensions", label: "Dimensions (DR) - 5 Layers", floor: 4 },
    { id: "connect_6", label: "Connect 6 (C6) - Genre Analysis", floor: 4 },
    { id: "theme", label: "Theme Room (TRm) - Walls", floor: 4 },
    { id: "time_zone", label: "Time Zone (TZ) - Past/Present/Future", floor: 4 },
    { id: "patterns", label: "Patterns (PRm) - Motifs", floor: 4 },
    { id: "parallels", label: "Parallels (P‖) - Mirrored Actions", floor: 4 },
    { id: "fruit", label: "Fruit Room (FRt) - Character Test", floor: 4 },
    { id: "juice", label: "Juice Room (JR) - Full Extraction", floor: 6 },
    { id: "fire", label: "Fire Room (FRm) - Conviction", floor: 7 },
    { id: "meditation", label: "Meditation (MR) - Deep Reflection", floor: 7 },
    { id: "speed", label: "Speed Room (SRm) - Quick Recall", floor: 7 },
  ];

  useEffect(() => {
    loadAvailableRooms();
  }, []);

  const loadAvailableRooms = async () => {
    const { data, error } = await supabase
      .from('escape_rooms')
      .select('*')
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data) {
      setAvailableRooms(data);
    }
  };

  const startEscapeRoom = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-escape-room', {
        body: { 
          mode, 
          category: (mode === 'category_gauntlet' || mode === 'room_as_room') ? category : null,
          scenario: mode === 'live_mission' ? scenario : null,
          difficulty: mode === 'floor_race' ? difficulty : 'pro'
        }
      });

      if (error) {
        console.error('Escape room error:', error);
        throw error;
      }

      if (!data || !data.room_id) {
        throw new Error('No room ID returned from server');
      }

      toast.success(t('escapeRoom.roomCreated'));
      navigate(`/escape-room/play/${data.room_id}`);
    } catch (error: any) {
      console.error('Error generating escape room:', error);
      toast.error(error.message || t('escapeRoom.failedToCreate'));
    } finally {
      setIsGenerating(false);
    }
  };

  const batchGenerate = async () => {
    setIsBatchGenerating(true);
    
    try {
      toast.info(t('escapeRoom.batchGenerating'));
      
      const { data, error } = await supabase.functions.invoke('batch-generate-escape-rooms', {
        body: {}
      });

      if (error) throw error;

      toast.success(t('escapeRoom.batchSuccess', { count: data.generated_count }));
      loadAvailableRooms(); // Refresh the list
    } catch (error) {
      console.error('Error batch generating:', error);
      toast.error(t('escapeRoom.batchFailed'));
    } finally {
      setIsBatchGenerating(false);
    }
  };

  const formatTimeRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const minutes = Math.floor((expires.getTime() - now.getTime()) / (1000 * 60));
    
    if (minutes < 60) return t('escapeRoom.minutesRemaining', { minutes });
    const hours = Math.floor(minutes / 60);
    return t('escapeRoom.hoursMinutesRemaining', { hours, minutes: minutes % 60 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-12 max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t('escapeRoom.title')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('escapeRoom.subtitle')}
          </p>
        </div>

        <RoomPrerequisites 
          rooms={mode === "category_gauntlet" 
            ? category === "prophecy" ? ["PR", "TZ", "FR", "ST"] 
            : category === "sanctuary" ? ["BL", "ST", "CR", "DR"]
            : ["CR", "DR", "C6", "FRt"]
            : ["SR", "OR", "CR", "DR", "BL", "PR", "FR"]
          } 
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t('escapeRoom.modes.roomAsRoom.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('escapeRoom.modes.roomAsRoom.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('escapeRoom.modes.roomAsRoom.locks')}</li>
                <li>{t('escapeRoom.modes.roomAsRoom.fluency')}</li>
                <li>{t('escapeRoom.modes.roomAsRoom.hints')}</li>
                <li>{t('escapeRoom.modes.roomAsRoom.maxPoints')}</li>
                <li className="text-xs italic text-primary">{t('escapeRoom.modes.roomAsRoom.time')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Trophy className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{t('escapeRoom.modes.categoryGauntlet.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('escapeRoom.modes.categoryGauntlet.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('escapeRoom.modes.categoryGauntlet.rooms')}</li>
                <li>{t('escapeRoom.modes.categoryGauntlet.complexity')}</li>
                <li>{t('escapeRoom.modes.categoryGauntlet.hints')}</li>
                <li>{t('escapeRoom.modes.categoryGauntlet.maxPoints')}</li>
                <li className="text-xs italic text-accent">{t('escapeRoom.modes.categoryGauntlet.time')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{t('escapeRoom.modes.liveMission.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('escapeRoom.modes.liveMission.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('escapeRoom.modes.liveMission.challenges')}</li>
                <li>{t('escapeRoom.modes.liveMission.teamSwitch')}</li>
                <li>{t('escapeRoom.modes.liveMission.training')}</li>
                <li>{t('escapeRoom.modes.liveMission.maxPoints')}</li>
                <li className="text-xs italic text-primary">{t('escapeRoom.modes.liveMission.time')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <CardTitle className="text-lg">{t('escapeRoom.modes.asyncHunt.title')}</CardTitle>
              </div>
              <CardDescription>
                {t('escapeRoom.modes.asyncHunt.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>{t('escapeRoom.modes.asyncHunt.crisis')}</li>
                <li>{t('escapeRoom.modes.asyncHunt.defense')}</li>
                <li>{t('escapeRoom.modes.asyncHunt.ranking')}</li>
                <li>{t('escapeRoom.modes.asyncHunt.maxPoints')}</li>
                <li className="text-xs italic text-accent">{t('escapeRoom.modes.asyncHunt.time')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/30 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>{t('escapeRoom.startYourEscape')}</CardTitle>
            <CardDescription>{t('escapeRoom.configureChallenge')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Mode Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('escapeRoom.gameMode')}</Label>
              <RadioGroup value={mode} onValueChange={(v) => setMode(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="room_as_room" id="room_escape" />
                  <Label htmlFor="room_escape" className="cursor-pointer">
                    {t('escapeRoom.modeLabels.roomAsRoom')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="category_gauntlet" id="gauntlet" />
                  <Label htmlFor="gauntlet" className="cursor-pointer">
                    {t('escapeRoom.modeLabels.categoryGauntlet')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="floor_race" id="race" />
                  <Label htmlFor="race" className="cursor-pointer">
                    {t('escapeRoom.modeLabels.floorRace')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="live_mission" id="live" />
                  <Label htmlFor="live" className="cursor-pointer">
                    {t('escapeRoom.modeLabels.liveMission')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="async_hunt" id="async" />
                  <Label htmlFor="async" className="cursor-pointer">
                    {t('escapeRoom.modeLabels.asyncHunt')}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Category Selection */}
            {(mode === "category_gauntlet" || mode === "room_as_room") && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {mode === "room_as_room" ? t('escapeRoom.palaceRoom') : t('escapeRoom.category')}
                </Label>
                <RadioGroup value={category} onValueChange={(v) => setCategory(v)}>
                  {mode === "room_as_room" ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">{t('escapeRoom.chooseRoom')}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                        {allPalaceRooms.map((room) => (
                          <div key={room.id} className="flex items-center space-x-2">
                            <RadioGroupItem value={room.id} id={room.id} />
                            <Label htmlFor={room.id} className="cursor-pointer text-sm">
                              <span className="text-xs text-muted-foreground">{t('escapeRoom.floor', { floor: room.floor })}:</span> {room.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prophecy" id="prophecy" />
                        <Label htmlFor="prophecy" className="cursor-pointer">
                          {t('escapeRoom.categories.prophecy')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sanctuary" id="sanctuary" />
                        <Label htmlFor="sanctuary" className="cursor-pointer">
                          {t('escapeRoom.categories.sanctuary')}
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="gospel_mission" id="gospel" />
                        <Label htmlFor="gospel" className="cursor-pointer">
                          {t('escapeRoom.categories.gospelMission')}
                        </Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            )}

            {/* Difficulty Selection - Universal for all modes */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('escapeRoom.difficultyLevel')}</Label>
              <RadioGroup value={difficulty} onValueChange={(v) => setDifficulty(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="easy" id="diff-easy" />
                  <Label htmlFor="diff-easy" className="cursor-pointer">
                    {t('escapeRoom.difficulty.easy', { detail: mode === "floor_race" ? t('escapeRoom.diffDetail.floors4') : mode === "room_as_room" ? t('escapeRoom.diffDetail.locks3') : mode === "category_gauntlet" ? t('escapeRoom.diffDetail.rooms3') : mode === "live_mission" ? t('escapeRoom.diffDetail.challenges2') : t('escapeRoom.diffDetail.simpleCrisis') })}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="diff-medium" />
                  <Label htmlFor="diff-medium" className="cursor-pointer">
                    {t('escapeRoom.difficulty.medium', { detail: mode === "floor_race" ? t('escapeRoom.diffDetail.floors5') : mode === "room_as_room" ? t('escapeRoom.diffDetail.locks4') : mode === "category_gauntlet" ? t('escapeRoom.diffDetail.rooms4') : mode === "live_mission" ? t('escapeRoom.diffDetail.challenges3') : t('escapeRoom.diffDetail.moderateCrisis') })}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hard" id="diff-hard" />
                  <Label htmlFor="diff-hard" className="cursor-pointer">
                    {t('escapeRoom.difficulty.hard', { detail: mode === "floor_race" ? t('escapeRoom.diffDetail.floors7') : mode === "room_as_room" ? t('escapeRoom.diffDetail.locks5') : mode === "category_gauntlet" ? t('escapeRoom.diffDetail.rooms5') : mode === "live_mission" ? t('escapeRoom.diffDetail.challenges4') : t('escapeRoom.diffDetail.complexCrisis') })}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pro" id="diff-pro" />
                  <Label htmlFor="diff-pro" className="cursor-pointer">
                    {t('escapeRoom.difficulty.pro', { detail: mode === "floor_race" ? t('escapeRoom.diffDetail.allFloors') : mode === "room_as_room" ? t('escapeRoom.diffDetail.locks6') : mode === "category_gauntlet" ? t('escapeRoom.diffDetail.rooms6Meta') : mode === "live_mission" ? t('escapeRoom.diffDetail.challenges5') : t('escapeRoom.diffDetail.multiCrisis') })}
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-muted-foreground">
                {mode === "floor_race" && t('escapeRoom.diffHint.floorRace')}
                {mode === "room_as_room" && t('escapeRoom.diffHint.roomAsRoom')}
                {mode === "category_gauntlet" && t('escapeRoom.diffHint.categoryGauntlet')}
                {mode === "live_mission" && t('escapeRoom.diffHint.liveMission')}
                {mode === "async_hunt" && t('escapeRoom.diffHint.asyncHunt')}
              </p>
            </div>

            {/* Scenario Input for Live Mission */}
            {mode === "live_mission" && (
              <div className="space-y-3">
                <Label htmlFor="scenario" className="text-base font-semibold">
                  {t('escapeRoom.scenarioOptional')}
                </Label>
                <Input
                  id="scenario"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  placeholder={t('escapeRoom.scenarioPlaceholder')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('escapeRoom.scenarioHint')}
                </p>
              </div>
            )}

            {/* Team Mode */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">{t('escapeRoom.playStyle')}</Label>
              <RadioGroup value={teamMode} onValueChange={(v) => setTeamMode(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="solo" id="solo" />
                  <Label htmlFor="solo" className="cursor-pointer">
                    {t('escapeRoom.solo')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="team" id="team" />
                  <Label htmlFor="team" className="cursor-pointer">
                    {t('escapeRoom.team')}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "live_mission" ? "30" : mode === "room_as_room" ? "45" : mode === "async_hunt" ? "24h" : "60"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {mode === "async_hunt" ? t('common.hours') : t('common.minutes')}
                </div>
              </div>
              <div className="text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "live_mission" ? "3-10" : teamMode === "solo" ? "1" : "2-5"}
                </div>
                <div className="text-xs text-muted-foreground">{t('common.players')}</div>
              </div>
              <div className="text-center">
                <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold">
                  {mode === "room_as_room" ? "36" : mode === "live_mission" ? "45" : mode === "async_hunt" ? "25" : mode === "category_gauntlet" ? "40" : "41"}
                </div>
                <div className="text-xs text-muted-foreground">{t('common.maxPoints')}</div>
              </div>
            </div>

            <Button
              onClick={startEscapeRoom}
              disabled={isGenerating || isBatchGenerating}
              size="lg"
              className="w-full text-lg py-6"
            >
              {isGenerating ? t('escapeRoom.generatingChallenge') : t('escapeRoom.startEscapeRoom')}
            </Button>

            <Button
              onClick={batchGenerate}
              disabled={isGenerating || isBatchGenerating}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {isBatchGenerating ? t('escapeRoom.batchGeneratingBtn') : t('escapeRoom.generateMultipleRooms')}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('escapeRoom.requiresKjv')}
            </p>
          </CardContent>
        </Card>

        {/* Available Escape Rooms */}
        {availableRooms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('escapeRoom.availableRooms')}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {availableRooms.map((room) => (
                <Card key={room.id} className="border-primary/20 hover:border-primary/40 transition-all hover:shadow-lg cursor-pointer" onClick={() => navigate(`/escape-room/play/${room.id}`)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{room.title}</CardTitle>
                        <CardDescription className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                            {room.mode === 'category_gauntlet' ? t('escapeRoom.modes.categoryGauntlet.title') : t('escapeRoom.floorRace')}
                          </span>
                          {room.category && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/10 text-accent capitalize">
                              {room.category.replace('_', ' ')}
                            </span>
                          )}
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-muted">
                            {room.difficulty}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{room.time_limit_minutes} min</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRemaining(room.expires_at)}
                        </div>
                      </div>
                      <ShareChallenge
                        challengeType="escape-room"
                        challengeId={room.id}
                        challengeTitle={room.title}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}