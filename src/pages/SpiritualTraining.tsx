import { useState, useEffect } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { SPIRITUAL_TRAINING_TOUR } from "@/data/guidedTours";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GlassBubbles } from "@/components/ui/glass-bubbles";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sword, Shield, Target, BookOpen, Flame, Trophy, Scroll, Loader2, GraduationCap, Dumbbell, Swords, Calendar, User, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SpacedRepetitionReview } from "@/components/SpacedRepetitionReview";
import { DOJO_LESSONS } from "@/data/artOfWarLessons";
import { LessonCard } from "@/components/dojo/LessonCard";
import { LessonDetail } from "@/components/dojo/LessonDetail";
import { ThirtyDayChallenge } from "@/components/dojo/ThirtyDayChallenge";
import { CharacteristicTracker } from "@/components/dojo/CharacteristicTracker";
import { WarriorProfile } from "@/components/dojo/WarriorProfile";
import { CombatArena } from "@/components/dojo/CombatArena";
import { DailyTraining } from "@/components/dojo/DailyTraining";
import { DeathChamber } from "@/components/dojo/DeathChamber";

const FRUITS_OF_SPIRIT = [
  { name: "Love", description: "Selfless care for others", color: "bg-red-500" },
  { name: "Joy", description: "Deep gladness in God", color: "bg-yellow-500" },
  { name: "Peace", description: "Inner tranquility", color: "bg-blue-500" },
  { name: "Patience", description: "Enduring without complaint", color: "bg-green-500" },
  { name: "Kindness", description: "Gentle consideration", color: "bg-pink-500" },
  { name: "Goodness", description: "Moral excellence", color: "bg-purple-500" },
  { name: "Faithfulness", description: "Loyal devotion", color: "bg-indigo-500" },
  { name: "Gentleness", description: "Humble strength", color: "bg-teal-500" },
  { name: "Self-Control", description: "Mastery over desires", color: "bg-orange-500" },
];

const ANIMAL_STYLES = [
  { name: "Lion", description: "Bold courage and strength", trait: "Courage in righteousness", color: "bg-amber-600" },
  { name: "Lamb", description: "Sacrificial humility", trait: "Willing submission to God", color: "bg-slate-100" },
  { name: "Eagle", description: "Soaring vision and perspective", trait: "Heavenly-minded focus", color: "bg-sky-600" },
  { name: "Serpent", description: "Wise discernment", trait: "Shrewd as serpents, innocent as doves", color: "bg-emerald-700" },
  { name: "Dove", description: "Pure innocence", trait: "Gentle and harmless", color: "bg-blue-200" },
  { name: "Ox", description: "Patient endurance", trait: "Steady faithfulness under burden", color: "bg-brown-600" },
];

const SPIRITUAL_WEAPONS = [
  { name: "Sword of the Spirit", description: "The Word of God", verse: "Ephesians 6:17", color: "bg-blue-600" },
  { name: "Shield of Faith", description: "Quenches fiery darts", verse: "Ephesians 6:16", color: "bg-purple-600" },
  { name: "Helmet of Salvation", description: "Protects the mind", verse: "Ephesians 6:17", color: "bg-yellow-600" },
  { name: "Breastplate of Righteousness", description: "Guards the heart", verse: "Ephesians 6:14", color: "bg-green-600" },
  { name: "Belt of Truth", description: "Foundation of integrity", verse: "Ephesians 6:14", color: "bg-indigo-600" },
  { name: "Gospel Shoes", description: "Readiness to share peace", verse: "Ephesians 6:15", color: "bg-red-600" },
  { name: "Prayer", description: "Direct communication with God", verse: "Ephesians 6:18", color: "bg-pink-600" },
];

const BESETTING_SINS = [
  { name: "Pride", weakness: "Humility neglected", counter: ["Gentleness", "Self-Control"], animal: "Lion" },
  { name: "Anger", weakness: "Peace abandoned", counter: ["Patience", "Self-Control"], animal: "Ox" },
  { name: "Lust", weakness: "Self-control lost", counter: ["Self-Control", "Faithfulness"], animal: "Dove" },
  { name: "Greed", weakness: "Contentment rejected", counter: ["Goodness", "Self-Control"], animal: "Lamb" },
  { name: "Envy", weakness: "Love withheld", counter: ["Love", "Joy"], animal: "Eagle" },
  { name: "Laziness", weakness: "Diligence despised", counter: ["Faithfulness", "Self-Control"], animal: "Ox" },
  { name: "Gluttony", weakness: "Discipline dismissed", counter: ["Self-Control", "Patience"], animal: "Lamb" },
];

type Scenario = {
  id: string;
  title: string;
  situation: string;
  correctFruits: string[];
  correctAnimal?: string;
  correctWeapon?: string;
  besettingSin?: string;
  options: { fruits: string[]; animal?: string; weapon?: string; explanation: string }[];
};

const TRAINING_SCENARIOS: Scenario[] = [
  {
    id: "workplace-conflict",
    title: "Workplace Conflict",
    situation: "Your coworker takes credit for your work in front of your boss. You feel anger rising within you.",
    correctFruits: ["Self-Control", "Patience", "Gentleness"],
    correctAnimal: "Ox",
    correctWeapon: "Shield of Faith",
    besettingSin: "Anger",
    options: [
      { fruits: ["Self-Control", "Patience", "Gentleness"], animal: "Ox", weapon: "Shield of Faith", explanation: "Correct! Like the Ox's patient endurance, you need self-control over anger, patience to endure injustice, and gentleness in response. The Shield of Faith quenches the fiery darts of rage." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "While the Lion's courage and love are always needed, this besetting sin of anger requires the Ox's patience, self-control, and the Shield of Faith to extinguish wrath." },
      { fruits: ["Faithfulness", "Goodness", "Kindness"], animal: "Dove", weapon: "Breastplate of Righteousness", explanation: "The Dove's innocence is admirable, but conquering anger requires the Ox's endurance, self-control, and the Shield of Faith." },
    ],
  },
  {
    id: "social-media-envy",
    title: "Social Media Comparison",
    situation: "Scrolling through social media, you see others' success and feel intense envy consuming your peace.",
    correctFruits: ["Love", "Joy", "Contentment"],
    correctAnimal: "Eagle",
    correctWeapon: "Helmet of Salvation",
    besettingSin: "Envy",
    options: [
      { fruits: ["Love", "Joy", "Contentment"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "Correct! Like the Eagle rising above, gain heavenly perspective. The Helmet of Salvation protects your mind from comparison's poison. Love rejoices with others, joy finds contentment in God." },
      { fruits: ["Patience", "Kindness", "Gentleness"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "The Lamb's gentleness is good, but envy requires the Eagle's higher vision and the Helmet protecting your thoughts from toxic comparison." },
      { fruits: ["Faithfulness", "Self-Control", "Peace"], animal: "Ox", weapon: "Belt of Truth", explanation: "While valuable, defeating envy needs the Eagle's perspective to see God's unique plan for you, protected by the Helmet of Salvation." },
    ],
  },
  {
    id: "temptation-lust",
    title: "Temptation in Privacy",
    situation: "Alone with access to harmful content, temptation whispers that no one will know.",
    correctFruits: ["Self-Control", "Faithfulness", "Purity"],
    correctAnimal: "Dove",
    correctWeapon: "Sword of the Spirit",
    besettingSin: "Lust",
    options: [
      { fruits: ["Self-Control", "Faithfulness", "Purity"], animal: "Dove", weapon: "Sword of the Spirit", explanation: "Correct! The Dove represents purity and innocence. The Sword of the Spirit (God's Word) cuts through temptation. Self-control masters desire, faithfulness keeps covenant with God." },
      { fruits: ["Love", "Peace", "Kindness"], animal: "Lamb", weapon: "Shield of Faith", explanation: "The Lamb's sacrifice is beautiful, but conquering lust requires the Dove's purity and the Sword of the Spirit to defeat desire." },
      { fruits: ["Patience", "Goodness", "Gentleness"], animal: "Lion", weapon: "Breastplate of Righteousness", explanation: "The Lion's strength helps, but this sin requires the Dove's innocence and the Sword cutting away impure thoughts." },
    ],
  },
  {
    id: "financial-greed",
    title: "Opportunity for Dishonest Gain",
    situation: "You discover a way to make extra money that's technically legal but morally questionable.",
    correctFruits: ["Faithfulness", "Self-Control", "Contentment"],
    correctAnimal: "Lamb",
    correctWeapon: "Belt of Truth",
    besettingSin: "Greed",
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Contentment"], animal: "Lamb", weapon: "Belt of Truth", explanation: "Correct! Like the Lamb who owns nothing yet lacks nothing, defeat greed through contentment. The Belt of Truth anchors you in integrity. Faithfulness to God, self-control over desire." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "The Eagle's vision helps, but greed requires the Lamb's contentment with little and the Belt of Truth to expose dishonesty." },
      { fruits: ["Patience", "Kindness", "Gentleness"], animal: "Dove", weapon: "Gospel Shoes", explanation: "These are valuable, but conquering greed needs the Lamb's simplicity and the Belt of Truth holding you to righteousness." },
    ],
  },
  {
    id: "recognition-pride",
    title: "Pride in Achievement",
    situation: "You've accomplished something significant and feel superior to others who haven't.",
    correctFruits: ["Gentleness", "Humility", "Self-Control"],
    correctAnimal: "Lamb",
    correctWeapon: "Gospel Shoes",
    besettingSin: "Pride",
    options: [
      { fruits: ["Gentleness", "Humility", "Self-Control"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "Correct! The Lamb demonstrates ultimate humility—Jesus, though worthy of all honor, took the form of a servant. Gospel Shoes keep you ready to serve, not lord over others. Gentleness and self-control defeat pride." },
      { fruits: ["Love", "Kindness", "Patience"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "The Lion's strength can fuel pride. This sin requires the Lamb's humility and Gospel Shoes of service." },
      { fruits: ["Faithfulness", "Goodness", "Peace"], animal: "Eagle", weapon: "Shield of Faith", explanation: "While good, pride is conquered by the Lamb's lowliness and Gospel Shoes that keep you a servant." },
    ],
  },
  {
    id: "spiritual-laziness",
    title: "Spiritual Complacency",
    situation: "You keep putting off prayer, Bible study, and spiritual disciplines. Laziness has become comfortable.",
    correctFruits: ["Faithfulness", "Self-Control", "Diligence"],
    correctAnimal: "Ox",
    correctWeapon: "Belt of Truth",
    besettingSin: "Laziness",
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Diligence"], animal: "Ox", weapon: "Belt of Truth", explanation: "Correct! The Ox embodies steady, faithful labor. The Belt of Truth exposes laziness for what it is—spiritual neglect. Faithfulness maintains disciplines, self-control resists comfort, diligence perseveres." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Dove", weapon: "Helmet of Salvation", explanation: "The Dove is gentle, but conquering laziness requires the Ox's steady work ethic and the Belt of Truth to face reality." },
      { fruits: ["Patience", "Kindness", "Goodness"], animal: "Eagle", weapon: "Sword of the Spirit", explanation: "These help, but laziness needs the Ox's relentless labor and the Belt of Truth to stop making excuses." },
    ],
  },
  {
    id: "ministry-burnout",
    title: "Ministry Exhaustion",
    situation: "You've been serving others tirelessly and now feel resentment creeping in. Your service has lost its joy.",
    correctFruits: ["Peace", "Joy", "Self-Control"],
    correctAnimal: "Dove",
    correctWeapon: "Prayer",
    besettingSin: "Resentment",
    options: [
      { fruits: ["Peace", "Joy", "Self-Control"], animal: "Dove", weapon: "Prayer", explanation: "Correct! The Dove shows when to withdraw for rest. Prayer reconnects you to God's strength. Peace restores balance, joy returns when you serve from overflow, self-control sets boundaries." },
      { fruits: ["Patience", "Faithfulness", "Goodness"], animal: "Ox", weapon: "Belt of Truth", explanation: "The Ox's endurance can lead to burnout. You need the Dove's rest and Prayer to refill your cup before continuing." },
      { fruits: ["Love", "Kindness", "Gentleness"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "These are good, but burnout requires the Dove's withdrawal for prayer and the restoration of inner peace first." },
    ],
  },
  {
    id: "family-conflict",
    title: "Family Tension",
    situation: "Your family member continuously criticizes you and refuses to hear your perspective. Bitterness is taking root.",
    correctFruits: ["Love", "Patience", "Gentleness"],
    correctAnimal: "Lamb",
    correctWeapon: "Breastplate of Righteousness",
    besettingSin: "Bitterness",
    options: [
      { fruits: ["Love", "Patience", "Gentleness"], animal: "Lamb", weapon: "Breastplate of Righteousness", explanation: "Correct! The Lamb endured unjust suffering without retaliation. The Breastplate guards your heart from bitterness. Love covers offenses, patience endures criticism, gentleness responds with grace." },
      { fruits: ["Self-Control", "Faithfulness", "Goodness"], animal: "Ox", weapon: "Shield of Faith", explanation: "These help, but family wounds need the Lamb's sacrificial love and the Breastplate protecting your heart from bitterness." },
      { fruits: ["Joy", "Peace", "Kindness"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "The Eagle's perspective helps, but healing family bitterness requires the Lamb's forgiving love and the Breastplate guarding your heart." },
    ],
  },
  {
    id: "persecution-fear",
    title: "Fear of Persecution",
    situation: "Speaking truth about your faith will cost you professionally or socially. Fear whispers to stay silent.",
    correctFruits: ["Faithfulness", "Courage", "Peace"],
    correctAnimal: "Lion",
    correctWeapon: "Sword of the Spirit",
    besettingSin: "Fear",
    options: [
      { fruits: ["Faithfulness", "Courage", "Peace"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "Correct! The Lion of Judah gives boldness. The Sword (God's Word) is your authority. Faithfulness to truth, courage under pressure, peace that casts out fear (1 John 4:18)." },
      { fruits: ["Patience", "Gentleness", "Kindness"], animal: "Dove", weapon: "Gospel Shoes", explanation: "The Dove's gentleness is good, but standing under persecution requires the Lion's courage and the Sword declaring truth boldly." },
      { fruits: ["Love", "Goodness", "Self-Control"], animal: "Lamb", weapon: "Belt of Truth", explanation: "These are valuable, but defeating fear requires the Lion's roar of courage and the Sword's authority in God's Word." },
    ],
  },
  {
    id: "addiction-cycle",
    title: "Breaking Habitual Sin",
    situation: "You keep returning to the same sin pattern despite repeated repentance. You feel trapped in an endless cycle.",
    correctFruits: ["Self-Control", "Faithfulness", "Patience"],
    correctAnimal: "Ox",
    correctWeapon: "Belt of Truth",
    besettingSin: "Addiction",
    options: [
      { fruits: ["Self-Control", "Faithfulness", "Patience"], animal: "Ox", weapon: "Belt of Truth", explanation: "Correct! The Ox's steady endurance breaks cycles. The Belt of Truth forces honesty about triggers and patterns. Self-control resists impulse, faithfulness keeps commitments, patience trusts God's timing for freedom." },
      { fruits: ["Love", "Joy", "Peace"], animal: "Dove", weapon: "Helmet of Salvation", explanation: "These are beautiful, but addiction requires the Ox's relentless consistency and the Belt of Truth exposing lies that keep you bound." },
      { fruits: ["Gentleness", "Kindness", "Goodness"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "These help, but habitual sin needs the Ox's grinding discipline and the Belt of Truth that doesn't allow excuses." },
    ],
  },
  {
    id: "doctrine-compromise",
    title: "Pressure to Compromise Truth",
    situation: "Your church community is drifting from biblical doctrine. Speaking up would make you unpopular. Silence seems safer.",
    correctFruits: ["Faithfulness", "Courage", "Love"],
    correctAnimal: "Serpent",
    correctWeapon: "Sword of the Spirit",
    besettingSin: "Cowardice",
    options: [
      { fruits: ["Faithfulness", "Courage", "Love"], animal: "Serpent", weapon: "Sword of the Spirit", explanation: "Correct! The Serpent represents wise discernment—knowing when and how to speak truth. The Sword is your authority. Faithfulness to doctrine, courage to stand, love that speaks truth for others' good." },
      { fruits: ["Peace", "Gentleness", "Patience"], animal: "Dove", weapon: "Gospel Shoes", explanation: "The Dove's gentleness can become compromise. This requires the Serpent's wisdom and the Sword's cutting clarity on truth." },
      { fruits: ["Self-Control", "Goodness", "Kindness"], animal: "Lamb", weapon: "Shield of Faith", explanation: "These are good, but defending doctrine requires the Serpent's shrewd discernment and the Sword declaring 'thus saith the Lord.'" },
    ],
  },
  {
    id: "wealth-temptation",
    title: "Sudden Financial Opportunity",
    situation: "An investment opportunity promises huge returns but requires ethically gray practices. Your family's financial security could be guaranteed.",
    correctFruits: ["Faithfulness", "Self-Control", "Peace"],
    correctAnimal: "Lamb",
    correctWeapon: "Belt of Truth",
    besettingSin: "Greed",
    options: [
      { fruits: ["Faithfulness", "Self-Control", "Peace"], animal: "Lamb", weapon: "Belt of Truth", explanation: "Correct! The Lamb trusts the Shepherd's provision. The Belt of Truth exposes 'gray areas' as compromise. Faithfulness to God over money, self-control resisting quick gains, peace trusting God's economy." },
      { fruits: ["Love", "Kindness", "Goodness"], animal: "Dove", weapon: "Helmet of Salvation", explanation: "These are lovely, but mammon requires the Lamb's radical contentment and the Belt of Truth cutting through financial rationalizations." },
      { fruits: ["Patience", "Gentleness", "Joy"], animal: "Eagle", weapon: "Sword of the Spirit", explanation: "The Eagle's vision helps, but conquering greed needs the Lamb's surrender of security to God and the Belt of Truth's integrity." },
    ],
  },
  {
    id: "church-betrayal",
    title: "Betrayal by Christian Friend",
    situation: "A trusted Christian friend gossips about your private struggles. You feel betrayed and want revenge.",
    correctFruits: ["Love", "Forgiveness", "Gentleness"],
    correctAnimal: "Lamb",
    correctWeapon: "Breastplate of Righteousness",
    besettingSin: "Revenge",
    options: [
      { fruits: ["Love", "Forgiveness", "Gentleness"], animal: "Lamb", weapon: "Breastplate of Righteousness", explanation: "Correct! The Lamb was betrayed by friends (Judas) yet forgave. The Breastplate protects your heart from vengeance. Love covers sins, forgiveness releases bitterness, gentleness responds without retaliation." },
      { fruits: ["Self-Control", "Patience", "Peace"], animal: "Ox", weapon: "Shield of Faith", explanation: "The Ox's patience is good, but betrayal requires the Lamb's forgiving heart and the Breastplate guarding against revenge." },
      { fruits: ["Faithfulness", "Joy", "Kindness"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "These help, but defeating revenge needs the Lamb's example of forgiving enemies and the Breastplate protecting your heart." },
    ],
  },
  {
    id: "doubt-attack",
    title: "Spiritual Doubt Attack",
    situation: "Unexpected tragedy strikes. You question if God really cares or if prayer actually works. Doubt floods your mind.",
    correctFruits: ["Faith", "Peace", "Patience"],
    correctAnimal: "Eagle",
    correctWeapon: "Helmet of Salvation",
    besettingSin: "Doubt",
    options: [
      { fruits: ["Faith", "Peace", "Patience"], animal: "Eagle", weapon: "Helmet of Salvation", explanation: "Correct! The Eagle rises above storms to see God's eternal perspective. The Helmet protects your mind from doubt's assault. Faith holds to what God says despite what you feel, peace trusts His sovereignty, patience waits for understanding." },
      { fruits: ["Love", "Kindness", "Gentleness"], animal: "Dove", weapon: "Gospel Shoes", explanation: "The Dove's tenderness comforts, but doubt requires the Eagle's higher view and the Helmet protecting your thoughts from unbelief." },
      { fruits: ["Self-Control", "Faithfulness", "Goodness"], animal: "Lion", weapon: "Sword of the Spirit", explanation: "These are strong, but doubt needs the Eagle soaring above circumstances and the Helmet shielding your mind from Satan's accusations." },
    ],
  },
  {
    id: "persecution-threat",
    title: "Direct Persecution",
    situation: "You're ordered to violate Sabbath commandment or lose your job. The pressure is real and immediate.",
    correctFruits: ["Faithfulness", "Courage", "Peace"],
    correctAnimal: "Lion",
    correctWeapon: "Shield of Faith",
    besettingSin: "Compromise",
    options: [
      { fruits: ["Faithfulness", "Courage", "Peace"], animal: "Lion", weapon: "Shield of Faith", explanation: "Correct! The Lion represents Daniel's friends in the furnace—courage under direct threat. The Shield quenches all fiery darts of fear. Faithfulness to God's law, courage to stand alone, peace that God will provide." },
      { fruits: ["Patience", "Gentleness", "Self-Control"], animal: "Dove", weapon: "Belt of Truth", explanation: "The Dove's meekness is good, but standing under direct persecution requires the Lion's roar of courage and the Shield deflecting threats." },
      { fruits: ["Love", "Kindness", "Goodness"], animal: "Lamb", weapon: "Gospel Shoes", explanation: "The Lamb's sacrifice inspires, but refusing the mark requires the Lion's boldness and the Shield protecting against consequences." },
    ],
  },
  {
    id: "gossip-temptation",
    title: "Temptation to Gossip",
    situation: "You know damaging information about someone who wronged you. Sharing it would make you look better and them worse.",
    correctFruits: ["Love", "Self-Control", "Kindness"],
    correctAnimal: "Serpent",
    correctWeapon: "Belt of Truth",
    besettingSin: "Gossip",
    options: [
      { fruits: ["Love", "Self-Control", "Kindness"], animal: "Serpent", weapon: "Belt of Truth", explanation: "Correct! The Serpent's wisdom knows the difference between truth-telling and gossip. The Belt of Truth exposes gossip as disguised revenge. Love covers rather than exposes, self-control controls the tongue, kindness protects others' reputation." },
      { fruits: ["Patience", "Gentleness", "Faithfulness"], animal: "Dove", weapon: "Gospel Shoes", explanation: "The Dove's innocence is good, but defeating gossip requires the Serpent's discernment and the Belt of Truth exposing your true motive." },
      { fruits: ["Peace", "Joy", "Goodness"], animal: "Lamb", weapon: "Breastplate of Righteousness", explanation: "These are valuable, but conquering gossip needs the Serpent's wisdom to see it as sin and the Belt holding you to truth, not slander." },
    ],
  },
];

export default function SpiritualTraining() {
  const { t } = useTranslation();
  const [dailyEncouragement, setDailyEncouragement] = useState("");
  const [loadingEncouragement, setLoadingEncouragement] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  
  // Spiritual Weapon Application states
  const [selectedWeapon, setSelectedWeapon] = useState<typeof SPIRITUAL_WEAPONS[0] | null>(null);
  const [lifeSituation, setLifeSituation] = useState("");
  const [isLoadingGuidance, setIsLoadingGuidance] = useState(false);
  const [weaponGuidance, setWeaponGuidance] = useState("");

  // Lesson states
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessonNotes, setLessonNotes] = useState<Record<string, string>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchLessonProgress();
    }
  }, [userId]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const fetchLessonProgress = async () => {
    if (!userId) return;

    const { data, error } = await supabase
      .from('dojo_lessons')
      .select('*')
      .eq('user_id', userId);

    if (!error && data) {
      setCompletedLessons(data.filter(l => l.completed).map(l => l.lesson_id));
      const notes: Record<string, string> = {};
      data.forEach(l => {
        if (l.notes) notes[l.lesson_id] = l.notes;
      });
      setLessonNotes(notes);
    }
  };

  const handleLessonComplete = async (lessonId: string, notes: string) => {
    if (!userId) {
      toast.error(t('training.spiritual.loginToSave'));
      return;
    }

    try {
      const { error } = await supabase
        .from('dojo_lessons')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          completed: true,
          notes: notes,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id'
        });

      if (error) throw error;

      toast.success(t('training.spiritual.lessonSaved'));
      await fetchLessonProgress();
    } catch (error) {
      console.error("Error saving lesson:", error);
      toast.error(t('training.spiritual.failedToSave'));
    }
  };

  const fetchDailyEncouragement = async () => {
    setLoadingEncouragement(true);
    try {
      const { data, error } = await supabase.functions.invoke("jeeves", {
        body: {
          mode: "daily-encouragement",
        },
      });

      if (error) throw error;
      setDailyEncouragement(data.content);
    } catch (error) {
      console.error("Error fetching encouragement:", error);
      toast.error(t('training.spiritual.failedToFetchEncouragement'));
    } finally {
      setLoadingEncouragement(false);
    }
  };

  const handleScenarioAnswer = (optionIndex: number) => {
    setUserAnswer(optionIndex);
    setShowResult(true);
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setUserAnswer(null);
    setShowResult(false);
  };

  const handleApplyWeapon = async () => {
    if (!selectedWeapon || !lifeSituation.trim()) {
      toast.error(t('training.spiritual.selectWeaponAndSituation'));
      return;
    }

    setIsLoadingGuidance(true);
    setWeaponGuidance("");

    try {
      const { data, error } = await supabase.functions.invoke('apply-spiritual-weapon', {
        body: { weapon: selectedWeapon, situation: lifeSituation }
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setWeaponGuidance(data.guidance);
      toast.success(t('training.spiritual.guidanceReceived'));
    } catch (error) {
      console.error('Error getting weapon guidance:', error);
      toast.error(t('training.spiritual.failedToGetGuidance'));
    } finally {
      setIsLoadingGuidance(false);
    }
  };

  const [tourOpen, setTourOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sword className="w-12 h-12 text-primary" />
            <h1 className="text-4xl font-bold">{t('training.spiritual.title')}</h1>
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('training.spiritual.heroQuote')}
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2">
              {t('training.spiritual.heroBadge')}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="gap-1">
              <GraduationCap className="h-4 w-4" /> Tour
            </Button>
          </div>
        </section>
        {tourOpen && <GuidedTourOverlay steps={SPIRITUAL_TRAINING_TOUR} onClose={() => setTourOpen(false)} />}

        {/* Daily Encouragement */}
        <Card variant="glass" className="border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-orange-500" />
              <CardTitle>{t('training.spiritual.todaysVictoryThought')}</CardTitle>
            </div>
            <CardDescription>{t('training.spiritual.dailyEncouragementDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            {dailyEncouragement ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{dailyEncouragement}</p>
              </div>
            ) : (
              <Button onClick={fetchDailyEncouragement} disabled={loadingEncouragement}>
                {loadingEncouragement ? t('common.loading') : t('training.spiritual.getEncouragement')}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Warrior Profile Section */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <WarriorProfile />
          </div>
          <div className="md:col-span-2">
            <DailyTraining />
          </div>
        </div>

        {/* Training Tabs */}
        <Tabs defaultValue="arena" className="w-full">
            <TabsList>
              <TabsTrigger value="arena" className="whitespace-nowrap px-3">
                <Swords className="w-4 h-4 mr-2" />
                {t('training.spiritual.combatArena')}
              </TabsTrigger>
              <TabsTrigger value="lessons" className="whitespace-nowrap px-3">
                <GraduationCap className="w-4 h-4 mr-2" />
                {t('training.spiritual.lessons')}
              </TabsTrigger>
              <TabsTrigger value="challenges" className="whitespace-nowrap px-3">
                <Dumbbell className="w-4 h-4 mr-2" />
                {t('training.spiritual.thirtyDayChallenge')}
              </TabsTrigger>
              <TabsTrigger value="characteristics" className="whitespace-nowrap px-3">
                <Target className="w-4 h-4 mr-2" />
                {t('training.spiritual.characterTracker')}
              </TabsTrigger>
              <TabsTrigger value="scenarios" className="whitespace-nowrap px-3">
                <Shield className="w-4 h-4 mr-2" />
                {t('training.spiritual.battleScenarios')}
              </TabsTrigger>
              <TabsTrigger value="weapons" className="whitespace-nowrap px-3">
                <Sword className="w-4 h-4 mr-2" />
                {t('training.spiritual.weapons')}
              </TabsTrigger>
              <TabsTrigger value="death-chamber" className="whitespace-nowrap px-3">
                <Landmark className="w-4 h-4 mr-2" />
                Death Chamber
              </TabsTrigger>
            </TabsList>

          {/* Combat Arena Tab */}
          <TabsContent value="arena" className="space-y-4">
            <CombatArena />
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-4">
            {selectedLesson ? (
              <LessonDetail
                lesson={DOJO_LESSONS.find(l => l.id === selectedLesson)!}
                onBack={() => setSelectedLesson(null)}
                onComplete={handleLessonComplete}
                isCompleted={completedLessons.includes(selectedLesson)}
                existingNotes={lessonNotes[selectedLesson]}
              />
            ) : (
              <div className="space-y-4">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>{t('training.spiritual.artOfWarManual')}</CardTitle>
                    <CardDescription>
                      {t('training.spiritual.artOfWarDesc')}
                      {' '}{t('training.spiritual.lessonsProgress', { completed: completedLessons.length, total: DOJO_LESSONS.length })}
                    </CardDescription>
                  </CardHeader>
                </Card>
                <div className="grid gap-4 md:grid-cols-2">
                  {DOJO_LESSONS.map((lesson) => (
                    <LessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={completedLessons.includes(lesson.id)}
                      onStart={setSelectedLesson}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* 30-Day Challenge Tab */}
          <TabsContent value="challenges" className="space-y-4">
            <ThirtyDayChallenge />
          </TabsContent>

          {/* Character Tracker Tab */}
          <TabsContent value="characteristics" className="space-y-4">
            <CharacteristicTracker />
          </TabsContent>

          {/* Spaced Repetition Review */}
          <TabsContent value="review" className="space-y-4">
            <SpacedRepetitionReview />
          </TabsContent>

          {/* Battle Scenarios */}
          <TabsContent value="scenarios" className="space-y-4">
            <Card variant="glass">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  <CardTitle>{t('training.spiritual.whatWouldYouDo')}</CardTitle>
                </div>
                <CardDescription>
                  {t('training.spiritual.scenariosDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedScenario ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {TRAINING_SCENARIOS.map((scenario) => (
                      <Card key={scenario.id} variant="glass" className="cursor-pointer hover:border-primary transition-colors">
                        <CardHeader onClick={() => setSelectedScenario(scenario)}>
                          <CardTitle className="text-lg">{scenario.title}</CardTitle>
                          <CardDescription className="line-clamp-3">
                            {scenario.situation}
                          </CardDescription>
                          <Button className="w-full mt-4">{t('training.spiritual.beginTraining')}</Button>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{selectedScenario.title}</h3>
                      <p className="text-lg mb-4">{selectedScenario.situation}</p>
                      <p className="text-muted-foreground">
                        {t('training.spiritual.whichFruitsQuestion')}
                      </p>
                    </div>

                     <div className="space-y-3">
                      {selectedScenario.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={userAnswer === index ? "default" : "outline"}
                          className="w-full text-left justify-start h-auto py-4 px-4"
                          onClick={() => handleScenarioAnswer(index)}
                          disabled={showResult}
                        >
                          <div className="space-y-2 w-full">
                            <div className="flex flex-wrap gap-2">
                              {option.fruits.map((fruit) => (
                                <Badge key={fruit} variant="secondary">
                                  {fruit}
                                </Badge>
                              ))}
                            </div>
                            {option.animal && (
                              <div className="text-sm text-muted-foreground">
                                {t('training.spiritual.styleLabel')}: {option.animal}
                              </div>
                            )}
                            {option.weapon && (
                              <div className="text-sm text-muted-foreground">
                                {t('training.spiritual.weaponLabel')}: {option.weapon}
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>

                    {showResult && userAnswer !== null && (
                      <Card variant="glass" className={userAnswer === 0 ? "border-green-500" : "border-orange-500"}>
                        <CardContent className="pt-6">
                          <p className="mb-4">{selectedScenario.options[userAnswer].explanation}</p>
                          <div className="flex gap-2">
                            <Button onClick={resetScenario}>{t('training.spiritual.chooseAnotherScenario')}</Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Besetting Sins */}
          <TabsContent value="besetting" className="space-y-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{t('training.spiritual.besettingSinsTitle')}</CardTitle>
                <CardDescription>
                  {t('training.spiritual.besettingSinsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {BESETTING_SINS.map((sin) => (
                    <Card key={sin.name} variant="glass" className="border-2 border-destructive/20">
                      <CardHeader>
                        <CardTitle className="text-lg text-destructive">{sin.name}</CardTitle>
                        <CardDescription className="space-y-2">
                          <p className="text-sm italic">{sin.weakness}</p>
                          <div className="pt-2">
                            <p className="text-xs font-semibold">{t('training.spiritual.counterWith')}:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {sin.counter.map((fruit) => (
                                <Badge key={fruit} variant="outline" className="text-xs">
                                  {fruit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs pt-2">
                            <span className="font-semibold">{t('training.spiritual.animalStyleLabel')}:</span> {sin.animal}
                          </p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Animal Styles */}
          <TabsContent value="animals" className="space-y-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{t('training.spiritual.animalStylesTitle')}</CardTitle>
                <CardDescription>
                  {t('training.spiritual.animalStylesDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ANIMAL_STYLES.map((animal) => (
                    <Card key={animal.name} variant="glass" className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${animal.color}`} />
                          <CardTitle className="text-lg">{animal.name}</CardTitle>
                        </div>
                        <CardDescription className="space-y-1">
                          <p className="font-semibold text-sm">{animal.description}</p>
                          <p className="text-xs italic">{animal.trait}</p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Spiritual Weapons */}
          <TabsContent value="weapons" className="space-y-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{t('training.spiritual.armorOfGodTitle')}</CardTitle>
                <CardDescription>
                  {t('training.spiritual.armorOfGodDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {SPIRITUAL_WEAPONS.map((weapon) => (
                    <Card key={weapon.name} variant="glass" className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${weapon.color}`} />
                          <CardTitle className="text-lg">{weapon.name}</CardTitle>
                        </div>
                        <CardDescription className="space-y-1">
                          <p className="font-semibold text-sm">{weapon.description}</p>
                          <p className="text-xs italic text-primary">{weapon.verse}</p>
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Weapon Application */}
            <Card variant="glass" className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('training.spiritual.applyWeaponsTitle')}
                </CardTitle>
                <CardDescription>
                  {t('training.spiritual.applyWeaponsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('training.spiritual.selectWeapon')}</label>
                  <Select
                    value={selectedWeapon?.name}
                    onValueChange={(name) => {
                      const weapon = SPIRITUAL_WEAPONS.find(w => w.name === name);
                      setSelectedWeapon(weapon || null);
                      setWeaponGuidance(""); // Clear previous guidance
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('training.spiritual.chooseWeaponPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {SPIRITUAL_WEAPONS.map((weapon) => (
                        <SelectItem key={weapon.name} value={weapon.name}>
                          {weapon.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('training.spiritual.describeSituation')}</label>
                  <Textarea
                    placeholder={t('training.spiritual.situationPlaceholder')}
                    value={lifeSituation}
                    onChange={(e) => setLifeSituation(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  onClick={handleApplyWeapon}
                  disabled={isLoadingGuidance || !selectedWeapon || !lifeSituation.trim()}
                  className="w-full"
                >
                  {isLoadingGuidance ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t('training.spiritual.gettingGuidance')}
                    </>
                  ) : (
                    <>
                      <Sword className="w-4 h-4 mr-2" />
                      {t('training.spiritual.getApplicationGuidance')}
                    </>
                  )}
                </Button>

                {weaponGuidance && (
                  <Card variant="glass" className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">{weaponGuidance}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fruits of the Spirit Training */}
          <TabsContent value="fruits" className="space-y-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle>{t('training.spiritual.fruitsOfSpiritTitle')}</CardTitle>
                <CardDescription>
                  {t('training.spiritual.fruitsOfSpiritDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {FRUITS_OF_SPIRIT.map((fruit) => (
                    <Card key={fruit.name} variant="glass" className="border-2">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${fruit.color}`} />
                          <CardTitle className="text-lg">{fruit.name}</CardTitle>
                        </div>
                        <CardDescription>{fruit.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Courses */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {[
                { title: t('training.spiritual.phototheologyCourse'), description: t('training.spiritual.phototheologyCourseDesc'), icon: BookOpen, link: "/phototheology-course" },
                { title: t('training.spiritual.danielCourse'), description: t('training.spiritual.danielCourseDesc'), icon: Scroll, link: "/daniel-course" },
                { title: t('training.spiritual.blueprintCourse'), description: t('training.spiritual.blueprintCourseDesc'), icon: Shield, link: "/blueprint-course" },
                { title: t('training.spiritual.revelationCourse'), description: t('training.spiritual.revelationCourseDesc'), icon: Flame, link: null },
              ].map((course) => (
                <Card key={course.title} variant="glass">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <course.icon className="w-6 h-6 text-primary" />
                      <CardTitle>{course.title}</CardTitle>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {course.link ? (
                    <Link to={course.link}>
                      <Button className="w-full">{t('training.spiritual.startCourse')}</Button>
                    </Link>
                  ) : (
                    <>
                      <Button className="w-full" variant="outline" disabled>
                        {t('training.spiritual.adultVersion')}
                      </Button>
                      <Button className="w-full" variant="outline" disabled>
                        {t('training.spiritual.kidsVersion')}
                      </Button>
                      <p className="text-sm text-muted-foreground text-center pt-2">
                        {t('training.spiritual.courseComingSoon')}
                      </p>
                    </>
                  )}
                </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Death Chamber Tab */}
          <TabsContent value="death-chamber" className="space-y-4">
            <DeathChamber />
          </TabsContent>
        </Tabs>

        {/* Divine Objective Section */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>{t('training.spiritual.divineObjectiveTitle')}</CardTitle>
            <CardDescription>
              {t('training.spiritual.divineObjectiveDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  {t('training.spiritual.contain')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('training.spiritual.containDesc')}
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Sword className="w-5 h-5" />
                  {t('training.spiritual.destroy')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('training.spiritual.destroyDesc')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
