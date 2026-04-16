import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Clock, Target, Brain, ChevronRight } from 'lucide-react';
import { OnboardingData } from './PTOnboardingFlow';
import { StudyTrack, PTStudyBurden } from '@/hooks/useStudyProfile';
import { cn } from '@/lib/utils';

interface OnboardingYourPathProps {
  data: OnboardingData;
  tracks: StudyTrack[];
  onComplete: (trackId: string) => void;
}

const burdenLabels: Record<PTStudyBurden, string> = {
  prophecy: 'Prophecy',
  sanctuary_gospel: 'Sanctuary & Gospel',
  study_method: 'Study Methods',
  parables_symbols: 'Symbols & Parables',
  sermon_building: 'Sermon Building',
  apologetics: 'Apologetics',
  christ_centered: 'Christ-Centered',
  study_habits: 'Study Habits',
};

const levelDescriptions = {
  beginner: 'Foundation building — clear explanations, guided steps',
  intermediate: 'Skill development — more independence, deeper connections',
  master: 'Integration — teaching others, multi-room coherence',
};

export const OnboardingYourPath = ({ data, tracks, onComplete }: OnboardingYourPathProps) => {
  const [isStarting, setIsStarting] = useState(false);

  // Calculate recommended level based on confidence
  const recommendedLevel = useMemo(() => {
    const avgConfidence = (
      data.confidenceBibleStoryline +
      data.confidenceGospelBasics +
      data.confidenceSanctuaryBasics +
      data.confidenceProphecy +
      data.confidenceParablesSymbols +
      data.confidenceCrossReferencing +
      data.confidenceStudyConsistency
    ) / 7;

    if (avgConfidence < 1) return 'beginner';
    if (avgConfidence < 2) return 'intermediate';
    return 'master';
  }, [data]);

  // Find recommended track
  const recommendedTrack = useMemo(() => {
    const primaryBurden = data.primaryBurdens[0];
    return tracks.find(t => t.burden_alignment.includes(primaryBurden)) || tracks[0];
  }, [data.primaryBurdens, tracks]);

  // Generate session previews
  const sessionPreviews = useMemo(() => {
    return [
      {
        number: 1,
        type: 'Orientation',
        title: 'Welcome & Early Win',
        description: 'Discover your first insight and build momentum',
        icon: '🎯',
      },
      {
        number: 2,
        type: 'Skill Focus',
        title: 'Single Principle Mastery',
        description: `Learn one ${recommendedTrack?.room_focus[0] || 'room'} technique deeply`,
        icon: '🔧',
      },
      {
        number: 3,
        type: 'Integration',
        title: 'Christ-Centered Connection',
        description: 'Combine two rooms to see Christ more clearly',
        icon: '✝️',
      },
    ];
  }, [recommendedTrack]);

  // Calculate cadence based on time
  const cadence = useMemo(() => {
    if (data.availableTimeMinutes >= 60) return 'Weekly deep sessions';
    if (data.availableTimeMinutes >= 20) return 'Daily 20-minute sessions';
    return 'Quick daily 10-minute sessions';
  }, [data.availableTimeMinutes]);

  const handleStart = async () => {
    if (!recommendedTrack) return;
    setIsStarting(true);
    onComplete(recommendedTrack.id);
  };

  if (!recommendedTrack) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
        >
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="font-medium text-primary">Your Path is Ready</span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-foreground mb-2"
        >
          {recommendedTrack.name}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground max-w-lg mx-auto"
        >
          {recommendedTrack.description}
        </motion.p>
      </div>

      {/* Path Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Level */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Starting Level</p>
                <p className="font-semibold capitalize">{recommendedLevel}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {levelDescriptions[recommendedLevel]}
            </p>
          </Card>
        </motion.div>

        {/* Cadence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Schedule</p>
                <p className="font-semibold">{cadence}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your {data.availableTimeMinutes} minutes available
            </p>
          </Card>
        </motion.div>

        {/* Focus Areas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="p-4 h-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Focus Areas</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {data.primaryBurdens.map(burden => (
                    <Badge key={burden} variant="outline" className="text-xs">
                      {burdenLabels[burden]}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* First 3 Sessions Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span>Your First 3 Sessions</span>
          <Badge variant="secondary">Pre-loaded</Badge>
        </h2>
        <div className="space-y-2">
          {sessionPreviews.map((session, index) => (
            <Card 
              key={session.number} 
              className={cn(
                "p-4 border-l-4",
                index === 0 && "border-l-primary bg-primary/5",
                index === 1 && "border-l-blue-500",
                index === 2 && "border-l-emerald-500"
              )}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{session.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      Session {session.number} • {session.type}
                    </span>
                  </div>
                  <h3 className="font-semibold">{session.title}</h3>
                  <p className="text-sm text-muted-foreground">{session.description}</p>
                </div>
                {index === 0 && (
                  <Badge className="bg-primary">Start Here</Badge>
                )}
              </div>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* What You'll Learn */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Card className="p-5 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <h3 className="font-semibold mb-3">By completing this track, you will:</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Master the {recommendedTrack.room_focus.slice(0, 3).join(', ')} rooms</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">Develop systematic interpretation skills</span>
            </li>
            <li className="flex items-start gap-2">
              <ChevronRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm">See Christ more clearly in every text</span>
            </li>
          </ul>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center pt-4"
      >
        <Button
          size="lg"
          onClick={handleStart}
          disabled={isStarting}
          className="min-w-[200px] bg-gradient-to-r from-primary to-accent"
        >
          {isStarting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Setting up your path...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Begin My Journey
            </>
          )}
        </Button>
        <p className="text-sm text-muted-foreground mt-3">
          You can personalize your path anytime in settings
        </p>
      </motion.div>
    </div>
  );
};
