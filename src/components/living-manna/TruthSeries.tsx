import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  GraduationCap, BookOpen, ChevronRight, Check,
  Sparkles, HelpCircle, Lightbulb,
  Brain, MessageCircle, Trophy,
  ChevronDown, ChevronUp, Star, Flame, Layers, Target
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ALL_STUDIES, PALACE_PRINCIPLES } from "@/data/truthSeriesStudies";
import type { StudyContent } from "@/data/truthSeriesStudies";

interface TruthSeriesProps {
  churchId?: string;
}

export function TruthSeries({ churchId }: TruthSeriesProps) {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<StudyContent | null>(null);
  const [completedTopics, setCompletedTopics] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("content");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [expandedPrinciples, setExpandedPrinciples] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('truth-series-progress');
    if (saved) setCompletedTopics(JSON.parse(saved));
  }, []);

  const progress = (completedTopics.length / ALL_STUDIES.length) * 100;

  const handleSelectTopic = (topic: StudyContent) => {
    setSelectedTopic(topic);
    setActiveTab("content");
    setAnswers({});
    setShowResults(false);
    setExpandedPrinciples([]);
  };

  const handleMarkComplete = () => {
    if (!selectedTopic) return;
    const newCompleted = [...completedTopics, selectedTopic.id];
    setCompletedTopics(newCompleted);
    localStorage.setItem('truth-series-progress', JSON.stringify(newCompleted));
    toast.success(`Completed: ${selectedTopic.title}!`, { icon: "🎉" });
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: answerIndex }));
  };

  const handleCheckAnswers = () => {
    setShowResults(true);
    const correct = selectedTopic?.questions.filter((q, i) => answers[i] === q.correctIndex).length || 0;
    const total = selectedTopic?.questions.length || 0;
    if (correct === total) {
      toast.success("Perfect score! 🌟");
    } else {
      toast.info(`${correct}/${total} correct. Review the explanations below!`);
    }
  };

  const togglePrinciple = (principle: string) => {
    setExpandedPrinciples(prev =>
      prev.includes(principle) ? prev.filter(p => p !== principle) : [...prev, principle]
    );
  };

  const renderContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={i} className="text-lg font-bold mt-6 mb-3 bg-gradient-to-r from-primary via-purple-400 to-blue-400 bg-clip-text text-transparent">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-foreground text-base">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.startsWith('- ')) {
        return (
          <li key={i} className="ml-4 text-foreground/80 flex items-start gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary to-purple-400 mt-2 shrink-0" />
            <span>{line.replace('- ', '')}</span>
          </li>
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return (
          <p key={i} className="italic text-primary/70 border-l-2 border-primary/30 pl-3 my-2">
            {line.replace(/\*/g, '')}
          </p>
        );
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else {
        return <p key={i} className="text-foreground/80 mb-2 leading-relaxed">{line}</p>;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card variant="glass" className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-primary/15 via-card to-purple-500/10 border-t-4 border-t-primary">
        <CardContent className="py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/30">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Truth Series
                </h2>
                <p className="text-foreground/60 text-sm">
                  Interactive studies with Palace principles for deeper understanding
                </p>
              </div>
            </div>
            <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0 shadow-md px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1.5" />
              {ALL_STUDIES.length} Studies
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card variant="glass" className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-emerald-500/10 via-card to-cyan-500/10">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-gradient-to-br from-emerald-500 to-cyan-500">
                <Layers className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                Journey Progress
              </span>
            </div>
            <span className="text-sm font-bold text-foreground/70">{completedTopics.length} / {ALL_STUDIES.length}</span>
          </div>
          <Progress value={progress} className="h-2.5" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <Card variant="glass" className="lg:col-span-1 overflow-hidden border-0 shadow-lg bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-500/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-purple-600 shadow">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent font-bold">
                Study Topics
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-1.5">
                {ALL_STUDIES.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isSelected = selectedTopic?.id === topic.id;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                        isSelected
                          ? "bg-gradient-to-r from-primary/20 to-purple-500/15 border border-primary/40 shadow-md shadow-primary/10"
                          : "bg-background/30 border border-transparent hover:bg-primary/5 hover:border-primary/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 shadow-sm ${
                          isCompleted
                            ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white"
                            : isSelected
                              ? "bg-gradient-to-br from-primary to-purple-600 text-white"
                              : "bg-primary/10 text-primary"
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : topic.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-medium text-sm truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                            {topic.title}
                          </h4>
                          <p className="text-xs text-foreground/50 mt-0.5 line-clamp-1">{topic.summary}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Study Content */}
        <Card variant="glass" className="lg:col-span-2 overflow-hidden border-0 shadow-lg bg-gradient-to-b from-card/90 to-card/70 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-primary/10 via-transparent to-purple-500/5 border-b border-border/30">
            <CardTitle className={selectedTopic ? "text-xl bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" : "text-foreground/50"}>
              {selectedTopic ? selectedTopic.title : "Select a Topic"}
            </CardTitle>
            {selectedTopic && (
              <CardDescription className="text-foreground/60">{selectedTopic.summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTopic ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 mb-6">
                  <GraduationCap className="h-16 w-16 text-primary/40" />
                </div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent mb-2">
                  Begin Your Journey
                </h3>
                <p className="text-foreground/50 max-w-md text-sm">
                  Select a topic to explore interactive Christ-centered studies with Palace principles.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full bg-card/50 backdrop-blur border border-border/50">
                    <TabsTrigger value="content" className="text-xs sm:text-sm gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-purple-600 data-[state=active]:text-white">
                      <BookOpen className="h-4 w-4 hidden sm:block" />
                      Study
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="text-xs sm:text-sm gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white">
                      <HelpCircle className="h-4 w-4 hidden sm:block" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="palace" className="text-xs sm:text-sm gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white">
                      <Lightbulb className="h-4 w-4 hidden sm:block" />
                      Palace
                    </TabsTrigger>
                    <TabsTrigger value="apply" className="text-xs sm:text-sm gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-white">
                      <Target className="h-4 w-4 hidden sm:block" />
                      Apply
                    </TabsTrigger>
                  </TabsList>

                  {/* Content Tab */}
                  <TabsContent value="content">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        {/* Opening Story */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-orange-500/15 via-card to-amber-500/10 border-l-4 border-l-orange-500">
                          <CardHeader className="bg-gradient-to-r from-orange-500/15 to-amber-500/5 border-b border-orange-500/20 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 shadow">
                                <Flame className="h-4 w-4 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent font-bold">
                                Opening Story
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="prose prose-sm max-w-none">
                              {renderContent(selectedTopic.openingStory)}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Main Teaching */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-blue-500/10 via-card to-indigo-500/10 border-l-4 border-l-blue-500">
                          <CardHeader className="bg-gradient-to-r from-blue-500/15 to-indigo-500/5 border-b border-blue-500/20 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow">
                                <Lightbulb className="h-4 w-4 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-bold">
                                Comprehensive Teaching
                              </span>
                            </CardTitle>
                            <CardDescription>In-depth doctrinal study with Scripture foundation</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <div className="prose prose-sm max-w-none">
                              {renderContent(selectedTopic.mainTeaching)}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Key Passages */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-cyan-500/10 via-card to-teal-500/10 border-l-4 border-l-cyan-500">
                          <CardHeader className="bg-gradient-to-r from-cyan-500/15 to-teal-500/5 border-b border-cyan-500/20 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-500 shadow">
                                <BookOpen className="h-4 w-4 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-cyan-600 to-teal-600 dark:from-cyan-400 dark:to-teal-400 bg-clip-text text-transparent font-bold">
                                Key Passages
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <ul className="space-y-2">
                              {selectedTopic.keyPassages.map((passage, i) => (
                                <li key={i} className="flex items-start gap-3 p-2.5 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors">
                                  <div className="p-1 rounded bg-gradient-to-br from-cyan-500 to-teal-500 mt-0.5 shrink-0">
                                    <BookOpen className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-sm text-foreground/80">{passage}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        {/* Memory Verse */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-amber-500/15 via-card to-yellow-500/10 border-t-4 border-t-amber-500">
                          <CardContent className="py-6 text-center">
                            <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 mb-4">
                              <Star className="h-6 w-6 text-amber-500" />
                            </div>
                            <h4 className="font-bold text-lg bg-gradient-to-r from-amber-500 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent mb-3">
                              Memory Verse
                            </h4>
                            <blockquote className="text-base italic text-foreground/80 max-w-lg mx-auto leading-relaxed border-l-4 border-amber-500/50 pl-4 text-left">
                              {selectedTopic.memoryVerse}
                            </blockquote>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Quiz Tab */}
                  <TabsContent value="quiz">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-5">
                        <Card className="overflow-hidden border-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
                          <CardContent className="py-3 flex items-center gap-2 text-sm">
                            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 shadow">
                              <Trophy className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent font-semibold">
                              Test your understanding with these questions
                            </span>
                          </CardContent>
                        </Card>

                        {selectedTopic.questions.map((q, qIdx) => {
                          const questionColors = [
                            { from: 'from-blue-500/10', to: 'to-cyan-500/10', border: 'border-l-blue-500', accent: 'from-blue-500 to-cyan-500' },
                            { from: 'from-violet-500/10', to: 'to-purple-500/10', border: 'border-l-violet-500', accent: 'from-violet-500 to-purple-500' },
                            { from: 'from-emerald-500/10', to: 'to-teal-500/10', border: 'border-l-emerald-500', accent: 'from-emerald-500 to-teal-500' },
                            { from: 'from-rose-500/10', to: 'to-pink-500/10', border: 'border-l-rose-500', accent: 'from-rose-500 to-pink-500' },
                            { from: 'from-orange-500/10', to: 'to-amber-500/10', border: 'border-l-orange-500', accent: 'from-orange-500 to-amber-500' },
                          ];
                          const qColors = questionColors[qIdx % questionColors.length];
                          const isCorrectAnswer = showResults && answers[qIdx] === q.correctIndex;
                          const isWrongAnswer = showResults && answers[qIdx] !== undefined && answers[qIdx] !== q.correctIndex;

                          return (
                            <Card key={qIdx} className={`overflow-hidden border-0 shadow-lg border-l-4 ${
                              isCorrectAnswer ? 'border-l-green-500 bg-gradient-to-br from-green-500/10 via-card to-emerald-500/5' :
                              isWrongAnswer ? 'border-l-red-500 bg-gradient-to-br from-red-500/10 via-card to-rose-500/5' :
                              `${qColors.border} bg-gradient-to-br ${qColors.from} via-card ${qColors.to}`
                            }`}>
                              <CardContent className="pt-4">
                                <p className="font-semibold mb-3 flex items-start gap-2">
                                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-white text-xs font-bold shrink-0 shadow bg-gradient-to-br ${
                                    isCorrectAnswer ? 'from-green-500 to-emerald-500' :
                                    isWrongAnswer ? 'from-red-500 to-rose-500' :
                                    qColors.accent
                                  }`}>
                                    {qIdx + 1}
                                  </span>
                                  <span className="text-foreground/90">{q.question}</span>
                                </p>
                                <RadioGroup
                                  value={answers[qIdx]?.toString()}
                                  onValueChange={(v) => handleAnswerSelect(qIdx, parseInt(v))}
                                  disabled={showResults}
                                >
                                  {q.options.map((option, oIdx) => (
                                    <div key={oIdx} className={`flex items-center space-x-2 p-2.5 rounded-lg transition-colors ${
                                      showResults && oIdx === q.correctIndex ? 'bg-green-500/20 border border-green-500/30' : ''
                                    } ${
                                      showResults && answers[qIdx] === oIdx && oIdx !== q.correctIndex ? 'bg-red-500/15 border border-red-500/30' : ''
                                    } ${
                                      !showResults ? 'hover:bg-primary/5' : ''
                                    }`}>
                                      <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                                      <Label htmlFor={`q${qIdx}-o${oIdx}`} className="flex-1 cursor-pointer text-sm">
                                        {option}
                                      </Label>
                                      {showResults && oIdx === q.correctIndex && <Check className="h-4 w-4 text-green-500" />}
                                    </div>
                                  ))}
                                </RadioGroup>
                                {showResults && (
                                  <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 text-sm">
                                    <strong className="text-primary">Explanation:</strong>{' '}
                                    <span className="text-foreground/80">{q.explanation}</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          );
                        })}

                        {!showResults && (
                          <Button
                            onClick={handleCheckAnswers}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25"
                            disabled={Object.keys(answers).length < selectedTopic.questions.length}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Check Answers
                          </Button>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Palace Principles Tab */}
                  <TabsContent value="palace">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-3">
                        <Card className="overflow-hidden border-0 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
                          <CardContent className="py-3">
                            <p className="text-sm text-foreground/70">
                              Each study uses specific Palace principles to deepen understanding. Expand each to learn more and practice.
                            </p>
                          </CardContent>
                        </Card>

                        {selectedTopic.principleApplications.map((pa, idx) => {
                          const principle = PALACE_PRINCIPLES[pa.principle];
                          const Icon = principle.icon;
                          const isExpanded = expandedPrinciples.includes(pa.principle);

                          const principleColors = [
                            { bg: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-500/30', accent: 'from-blue-500 to-cyan-500', headerBg: 'from-blue-500/15 to-cyan-500/5' },
                            { bg: 'from-violet-500/10 to-purple-500/10', border: 'border-violet-500/30', accent: 'from-violet-500 to-purple-500', headerBg: 'from-violet-500/15 to-purple-500/5' },
                            { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-500/30', accent: 'from-emerald-500 to-teal-500', headerBg: 'from-emerald-500/15 to-teal-500/5' },
                            { bg: 'from-rose-500/10 to-pink-500/10', border: 'border-rose-500/30', accent: 'from-rose-500 to-pink-500', headerBg: 'from-rose-500/15 to-pink-500/5' },
                            { bg: 'from-amber-500/10 to-orange-500/10', border: 'border-amber-500/30', accent: 'from-amber-500 to-orange-500', headerBg: 'from-amber-500/15 to-orange-500/5' },
                          ];
                          const pColors = principleColors[idx % principleColors.length];

                          return (
                            <Collapsible key={idx} open={isExpanded} onOpenChange={() => togglePrinciple(pa.principle)}>
                              <Card className={`overflow-hidden border-0 shadow-lg bg-gradient-to-br ${pColors.bg} via-card ${pColors.border}`}>
                                <CollapsibleTrigger asChild>
                                  <CardHeader className={`cursor-pointer hover:bg-gradient-to-r hover:${pColors.headerBg} transition-colors py-3`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-gradient-to-br ${pColors.accent} shadow-lg`}>
                                          <Icon className="h-4 w-4 text-white" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-sm">{principle.name}</CardTitle>
                                          <Badge className={`text-xs mt-1 bg-gradient-to-r ${pColors.accent} text-white border-0 shadow-sm`}>
                                            {principle.tag}
                                          </Badge>
                                        </div>
                                      </div>
                                      <div className={`p-1 rounded-md transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="h-4 w-4 text-foreground/50" />
                                      </div>
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <CardContent className="pt-0 space-y-4">
                                    <div className={`p-3 rounded-xl bg-gradient-to-r ${pColors.headerBg} border ${pColors.border} text-sm`}>
                                      <strong className="bg-gradient-to-r ${pColors.accent} bg-clip-text text-transparent">What is this principle?</strong>
                                      <p className="mt-1 text-foreground/80">{principle.description}</p>
                                    </div>

                                    <div className="p-3 rounded-xl bg-card/50 border border-border/30">
                                      <strong className="text-sm text-foreground">How it applies here:</strong>
                                      <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{pa.application}</p>
                                    </div>

                                    <Card className="overflow-hidden border-0 shadow-md bg-gradient-to-br from-amber-500/10 via-card to-orange-500/10 border-l-4 border-l-amber-500">
                                      <CardContent className="pt-3 pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="p-1 rounded-md bg-gradient-to-br from-amber-500 to-orange-500">
                                            <Target className="h-3 w-3 text-white" />
                                          </div>
                                          <strong className="text-sm bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                                            Your Exercise
                                          </strong>
                                        </div>
                                        <p className="text-sm text-foreground/80">{pa.exercise}</p>
                                      </CardContent>
                                    </Card>
                                  </CardContent>
                                </CollapsibleContent>
                              </Card>
                            </Collapsible>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Apply Tab */}
                  <TabsContent value="apply">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        {/* Reflection */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-violet-500/15 via-card to-purple-500/10 border-l-4 border-l-violet-500">
                          <CardHeader className="bg-gradient-to-r from-violet-500/15 to-purple-500/5 border-b border-violet-500/20 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 shadow">
                                <MessageCircle className="h-4 w-4 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent font-bold">
                                Reflection Question
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-foreground/80 leading-relaxed mb-3">{selectedTopic.reflection}</p>
                            <Textarea
                              placeholder="Write your thoughts here..."
                              className="min-h-[100px] bg-background/50 border-violet-500/20 focus:border-violet-500/50"
                            />
                          </CardContent>
                        </Card>

                        {/* Take Home Challenge */}
                        <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-emerald-500/15 via-card to-green-500/10 border-l-4 border-l-emerald-500">
                          <CardHeader className="bg-gradient-to-r from-emerald-500/15 to-green-500/5 border-b border-emerald-500/20 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 shadow">
                                <Target className="h-4 w-4 text-white" />
                              </div>
                              <span className="bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent font-bold">
                                Take Home Challenge
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-foreground/80 leading-relaxed">{selectedTopic.takeHomeChallenge}</p>
                          </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-border/30">
                          <Button
                            onClick={handleMarkComplete}
                            className={`flex-1 shadow-lg ${
                              completedTopics.includes(selectedTopic.id)
                                ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-green-500/25'
                                : 'bg-gradient-to-r from-primary to-purple-600 shadow-primary/25'
                            } text-white`}
                            disabled={completedTopics.includes(selectedTopic.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {completedTopics.includes(selectedTopic.id) ? 'Completed' : 'Mark Complete'}
                          </Button>
                          {selectedTopic.id < ALL_STUDIES.length && (
                            <Button
                              onClick={() => {
                                const next = ALL_STUDIES.find(s => s.id === selectedTopic.id + 1);
                                if (next) handleSelectTopic(next);
                              }}
                              variant="outline"
                              className="border-primary/30 hover:bg-primary/5"
                            >
                              Next
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
