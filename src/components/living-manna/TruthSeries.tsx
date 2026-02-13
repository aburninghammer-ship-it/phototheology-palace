import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import {
  GraduationCap, BookOpen, ChevronRight, Check,
  Sparkles, RefreshCw, HelpCircle, Lightbulb, Eye,
  Book, Gem, Film, Image, Brain, MessageCircle, Trophy,
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
        return <h3 key={i} className="text-lg font-semibold mt-4 mb-2 text-foreground">{line.replace('### ', '')}</h3>;
      } else if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
      } else if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 text-foreground/80">{line.replace('- ', '')}</li>;
      } else if (line.startsWith('*') && line.endsWith('*')) {
        return <p key={i} className="italic text-foreground/70">{line.replace(/\*/g, '')}</p>;
      } else if (line.trim() === '') {
        return <br key={i} />;
      } else {
        return <p key={i} className="text-foreground/80 mb-2">{line}</p>;
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
            <GraduationCap className="h-6 w-6 text-primary" />
            Truth Series
          </h2>
          <p className="text-foreground/70">
            Interactive studies with Palace principles for deeper understanding
          </p>
        </div>
        <Badge variant="outline" className="text-primary border-primary">
          <Sparkles className="h-3 w-3 mr-1" />
          {ALL_STUDIES.length} Studies
        </Badge>
      </div>

      {/* Progress */}
      <Card variant="glass" className="bg-card/80">
        <CardContent className="py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Journey Progress</span>
            <span className="text-sm text-foreground/70">{completedTopics.length} / {ALL_STUDIES.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Topics List */}
        <Card variant="glass" className="lg:col-span-1 bg-card/80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BookOpen className="h-5 w-5" />
              Study Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-2">
                {ALL_STUDIES.map((topic) => {
                  const isCompleted = completedTopics.includes(topic.id);
                  const isSelected = selectedTopic?.id === topic.id;
                  
                  return (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        isSelected 
                          ? "bg-primary/20 border border-primary/50" 
                          : "bg-background/50 border border-border/50 hover:bg-background/80"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isCompleted ? "bg-green-500/20 text-green-400" : "bg-primary/20 text-primary"
                        }`}>
                          {isCompleted ? <Check className="h-4 w-4" /> : topic.id}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm text-foreground">{topic.title}</h4>
                          <p className="text-xs text-foreground/60 mt-0.5 line-clamp-1">{topic.summary}</p>
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
        <Card variant="glass" className="lg:col-span-2 bg-card/80">
          <CardHeader>
            <CardTitle className="text-foreground">
              {selectedTopic ? selectedTopic.title : "Select a Topic"}
            </CardTitle>
            {selectedTopic && (
              <CardDescription className="text-foreground/70">{selectedTopic.summary}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {!selectedTopic ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <GraduationCap className="h-16 w-16 text-primary/30 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Begin Your Journey</h3>
                <p className="text-foreground/60 max-w-md">
                  Select a topic to explore interactive Christ-centered studies with Palace principles.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="content" className="text-xs sm:text-sm">
                      <BookOpen className="h-4 w-4 mr-1 hidden sm:block" />
                      Study
                    </TabsTrigger>
                    <TabsTrigger value="quiz" className="text-xs sm:text-sm">
                      <HelpCircle className="h-4 w-4 mr-1 hidden sm:block" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="palace" className="text-xs sm:text-sm">
                      <Lightbulb className="h-4 w-4 mr-1 hidden sm:block" />
                      Palace
                    </TabsTrigger>
                    <TabsTrigger value="apply" className="text-xs sm:text-sm">
                      <Target className="h-4 w-4 mr-1 hidden sm:block" />
                      Apply
                    </TabsTrigger>
                  </TabsList>

                  {/* Content Tab */}
                  <TabsContent value="content">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                              <Flame className="h-4 w-4" />
                              Opening Story
                            </h4>
                            {renderContent(selectedTopic.openingStory)}
                          </CardContent>
                        </Card>

                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {renderContent(selectedTopic.mainTeaching)}
                        </div>

                        <Card className="bg-card/50">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold mb-2">Key Passages</h4>
                            <ul className="space-y-1">
                              {selectedTopic.keyPassages.map((passage, i) => (
                                <li key={i} className="text-sm text-foreground/80">📖 {passage}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30">
                          <CardContent className="pt-4 text-center">
                            <Star className="h-5 w-5 text-amber-500 mx-auto mb-2" />
                            <h4 className="font-semibold text-amber-600 dark:text-amber-400">Memory Verse</h4>
                            <p className="text-sm italic mt-2">{selectedTopic.memoryVerse}</p>
                          </CardContent>
                        </Card>
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  {/* Quiz Tab */}
                  <TabsContent value="quiz">
                    <ScrollArea className="h-[450px] pr-4">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          Test your understanding with these questions
                        </div>

                        {selectedTopic.questions.map((q, qIdx) => (
                          <Card key={qIdx} className={`${showResults ? (answers[qIdx] === q.correctIndex ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5') : ''}`}>
                            <CardContent className="pt-4">
                              <p className="font-medium mb-3">{qIdx + 1}. {q.question}</p>
                              <RadioGroup 
                                value={answers[qIdx]?.toString()} 
                                onValueChange={(v) => handleAnswerSelect(qIdx, parseInt(v))}
                                disabled={showResults}
                              >
                                {q.options.map((option, oIdx) => (
                                  <div key={oIdx} className={`flex items-center space-x-2 p-2 rounded ${
                                    showResults && oIdx === q.correctIndex ? 'bg-green-500/20' : ''
                                  } ${
                                    showResults && answers[qIdx] === oIdx && oIdx !== q.correctIndex ? 'bg-red-500/20' : ''
                                  }`}>
                                    <RadioGroupItem value={oIdx.toString()} id={`q${qIdx}-o${oIdx}`} />
                                    <Label htmlFor={`q${qIdx}-o${oIdx}`} className="flex-1 cursor-pointer">
                                      {option}
                                    </Label>
                                    {showResults && oIdx === q.correctIndex && <Check className="h-4 w-4 text-green-500" />}
                                  </div>
                                ))}
                              </RadioGroup>
                              {showResults && (
                                <div className="mt-3 p-3 rounded bg-primary/10 text-sm">
                                  <strong>Explanation:</strong> {q.explanation}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}

                        {!showResults && (
                          <Button 
                            onClick={handleCheckAnswers} 
                            className="w-full"
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
                        <p className="text-sm text-muted-foreground mb-4">
                          Each study uses specific Palace principles to deepen understanding. Expand each to learn more and practice.
                        </p>

                        {selectedTopic.principleApplications.map((pa, idx) => {
                          const principle = PALACE_PRINCIPLES[pa.principle];
                          const Icon = principle.icon;
                          const isExpanded = expandedPrinciples.includes(pa.principle);

                          return (
                            <Collapsible key={idx} open={isExpanded} onOpenChange={() => togglePrinciple(pa.principle)}>
                              <Card className="bg-card/50">
                                <CollapsibleTrigger asChild>
                                  <CardHeader className="cursor-pointer hover:bg-primary/5 transition-colors py-3">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-primary/10">
                                          <Icon className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-sm">{principle.name}</CardTitle>
                                          <Badge variant="outline" className="text-xs mt-1">{principle.tag}</Badge>
                                        </div>
                                      </div>
                                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </div>
                                  </CardHeader>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                  <CardContent className="pt-0 space-y-4">
                                    <div className="p-3 rounded bg-primary/5 text-sm">
                                      <strong className="text-primary">What is this principle?</strong>
                                      <p className="mt-1 text-foreground/80">{principle.description}</p>
                                    </div>

                                    <div>
                                      <strong className="text-sm">How it applies here:</strong>
                                      <p className="text-sm text-foreground/80 mt-1">{pa.application}</p>
                                    </div>

                                    <Card className="bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
                                      <CardContent className="pt-3">
                                        <strong className="text-sm text-amber-600 dark:text-amber-400">🏋️ Your Exercise:</strong>
                                        <p className="text-sm mt-1">{pa.exercise}</p>
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
                        <Card className="bg-primary/5 border-primary/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold flex items-center gap-2 mb-2">
                              <MessageCircle className="h-4 w-4 text-primary" />
                              Reflection Question
                            </h4>
                            <p className="text-foreground/80">{selectedTopic.reflection}</p>
                            <Textarea 
                              placeholder="Write your thoughts here..." 
                              className="mt-3 min-h-[100px]"
                            />
                          </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-500/5 to-emerald-500/5 border-green-500/20">
                          <CardContent className="pt-4">
                            <h4 className="font-semibold flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
                              <Target className="h-4 w-4" />
                              Take Home Challenge
                            </h4>
                            <p className="text-foreground/80">{selectedTopic.takeHomeChallenge}</p>
                          </CardContent>
                        </Card>

                        <div className="flex gap-3 pt-4 border-t border-border/50">
                          <Button 
                            onClick={handleMarkComplete} 
                            className="flex-1"
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
