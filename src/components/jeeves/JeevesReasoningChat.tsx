import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Brain, Shield, Building, Eye, Sparkles, AlertTriangle, HelpCircle, Lightbulb, ArrowUpRight, Trash2, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useJeevesReasoning, JeevesMode, JeevesLens, Spark, ClaimLadder } from '@/hooks/useJeevesReasoning';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const MODE_CONFIG = {
  explorer: {
    icon: Eye,
    label: 'Explorer',
    description: 'Generate connections, patterns, and hypotheses',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  auditor: {
    icon: Shield,
    label: 'Auditor',
    description: 'Challenge assumptions and demand evidence',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10'
  },
  architect: {
    icon: Building,
    label: 'Architect',
    description: 'Build formal Claim Ladders and frameworks',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  }
};

const SPARK_KIND_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hypothesis: Lightbulb,
  pattern: Brain,
  parallel: ArrowUpRight,
  warning: AlertTriangle,
  application: Sparkles,
  question: HelpCircle
};

const CONFIDENCE_COLORS: Record<string, string> = {
  speculative: 'bg-slate-500',
  tentative: 'bg-amber-500',
  moderate: 'bg-blue-500',
  strong: 'bg-green-500'
};

interface SparkCardProps {
  spark: Spark;
  onPromote: (spark: Spark) => void;
  onAudit: (spark: Spark) => void;
  onRemove: (sparkId: string) => void;
  onSave: (spark: Spark) => void;
  isSaved: boolean;
}

function SparkCard({ spark, onPromote, onAudit, onRemove, onSave, isSaved }: SparkCardProps) {
  const Icon = SPARK_KIND_ICONS[spark.spark_kind] || Sparkles;
  
  return (
    <Card className="bg-card/50 border-border/50">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">{spark.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="text-xs">
              {spark.spark_kind}
            </Badge>
            <div className={cn("w-2 h-2 rounded-full", CONFIDENCE_COLORS[spark.confidence_level])} />
            {isSaved && <BookmarkCheck className="h-4 w-4 text-amber-500" />}
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">{spark.summary}</p>
        
        {spark.anchors.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {spark.anchors.map((anchor, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {anchor.ref}
              </Badge>
            ))}
          </div>
        )}
        
        {spark.assumptions.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Assumes: </span>
            {spark.assumptions.slice(0, 2).join('; ')}
            {spark.assumptions.length > 2 && '...'}
          </div>
        )}
        
        <div className="flex gap-2 pt-2 flex-wrap">
          {!isSaved && (
            <Button size="sm" variant="default" onClick={() => onSave(spark)}>
              <BookmarkCheck className="h-3 w-3 mr-1" />
              Save
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onPromote(spark)}>
            <Building className="h-3 w-3 mr-1" />
            Ladder
          </Button>
          <Button size="sm" variant="outline" onClick={() => onAudit(spark)}>
            <Shield className="h-3 w-3 mr-1" />
            Audit
          </Button>
          <Button size="sm" variant="ghost" onClick={() => onRemove(spark.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ClaimLadderCardProps {
  ladder: ClaimLadder;
}

function ClaimLadderCard({ ladder }: ClaimLadderCardProps) {
  return (
    <Card className="bg-card/50 border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Building className="h-4 w-4 text-purple-400" />
          Claim Ladder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-primary">Claim:</span>
          <p className="text-muted-foreground">{ladder.claim}</p>
        </div>
        
        {ladder.textual_basis.length > 0 && (
          <div>
            <span className="font-medium text-primary">Textual Basis:</span>
            <ul className="list-disc list-inside text-muted-foreground">
              {ladder.textual_basis.map((tb, i) => (
                <li key={i}>{tb.ref} — {tb.text.substring(0, 100)}...</li>
              ))}
            </ul>
          </div>
        )}
        
        {ladder.historical_anchor && (
          <div>
            <span className="font-medium text-primary">Historical Anchor:</span>
            <p className="text-muted-foreground">{ladder.historical_anchor.period}: {ladder.historical_anchor.evidence}</p>
          </div>
        )}
        
        <div>
          <span className="font-medium text-primary">Logical Move:</span>
          <p className="text-muted-foreground">{ladder.logical_move}</p>
        </div>
        
        <div>
          <span className="font-medium text-primary">Theological Implication:</span>
          <p className="text-muted-foreground">{ladder.theological_implication}</p>
        </div>
        
        {ladder.risk_counterpoint.length > 0 && (
          <div>
            <span className="font-medium text-amber-400">⚠️ Risks/Counterpoints:</span>
            <ul className="list-disc list-inside text-muted-foreground">
              {ladder.risk_counterpoint.map((rc, i) => (
                <li key={i}><strong>{rc.objection}</strong> → {rc.response}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function JeevesReasoningChat() {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    currentMode,
    currentLens,
    activeSparks,
    activeClaimLadder,
    sendMessage,
    changeMode,
    changeLens,
    promoteSpark,
    auditClaim,
    clearSession,
    removeSpark,
    saveSparkToLibrary,
    isSparkSaved
  } = useJeevesReasoning();
  
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const message = input;
    setInput('');
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const ModeConfig = MODE_CONFIG[currentMode];

  return (
    <div className="flex h-full gap-4">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mode Selector */}
        <div className="flex items-center gap-2 p-4 border-b border-border/50">
          <TooltipProvider>
            {(Object.entries(MODE_CONFIG) as [JeevesMode, typeof MODE_CONFIG.explorer][]).map(([mode, config]) => (
              <Tooltip key={mode}>
                <TooltipTrigger asChild>
                  <Button
                    variant={currentMode === mode ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => changeMode(mode)}
                    className={cn(
                      "gap-2",
                      currentMode === mode && config.bgColor
                    )}
                  >
                    <config.icon className={cn("h-4 w-4", currentMode === mode && config.color)} />
                    {config.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{config.description}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
          
          <div className="ml-auto flex items-center gap-2">
            <select
              value={currentLens}
              onChange={(e) => changeLens(e.target.value as JeevesLens)}
              className="text-xs bg-background border border-border rounded px-2 py-1"
            >
              <option value="sda">SDA Lens</option>
              <option value="neutral_historical">Neutral Historical</option>
              <option value="comparative">Comparative</option>
            </select>
            
            <Button variant="ghost" size="sm" onClick={clearSession}>
              Clear
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <ModeConfig.icon className={cn("h-12 w-12 mx-auto mb-4", ModeConfig.color)} />
                <h3 className="font-medium text-lg mb-2">{ModeConfig.label} Mode Active</h3>
                <p className="text-sm">{ModeConfig.description}</p>
                <p className="text-xs mt-4">Start typing to begin your study session...</p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "p-4 rounded-lg",
                  msg.role === 'user' 
                    ? "bg-primary/10 ml-8" 
                    : "bg-muted/50 mr-8"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {/* Show sparks from this response */}
                {msg.response?.sparks && msg.response.sparks.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <span className="text-xs font-medium text-muted-foreground">Generated Sparks:</span>
                    <div className="grid gap-2">
                      {msg.response.sparks.map((spark) => (
                        <SparkCard 
                          key={spark.id} 
                          spark={spark}
                          onPromote={promoteSpark}
                          onAudit={(s) => auditClaim(s.claim_text || s.summary)}
                          onRemove={removeSpark}
                          onSave={saveSparkToLibrary}
                          isSaved={isSparkSaved(spark.id)}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Show auditor notes */}
                {msg.response?.auditor_notes && (
                  <div className="mt-4 p-3 bg-amber-500/10 rounded-lg text-sm">
                    <span className="font-medium text-amber-400">⚖️ Auditor Notes</span>
                    {msg.response.auditor_notes.challenges.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Challenges:</span>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {msg.response.auditor_notes.challenges.map((c, i) => <li key={i}>{c}</li>)}
                        </ul>
                      </div>
                    )}
                    {msg.response.auditor_notes.alternatives.length > 0 && (
                      <div className="mt-2">
                        <span className="text-xs font-medium">Alternatives:</span>
                        <ul className="list-disc list-inside text-muted-foreground">
                          {msg.response.auditor_notes.alternatives.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Jeeves is thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask Jeeves in ${ModeConfig.label} mode...`}
              className="min-h-[80px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar - Sparks & Claim Ladder */}
      <div className="w-80 border-l border-border/50 flex flex-col">
        <Tabs defaultValue="sparks" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b">
            <TabsTrigger value="sparks" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Sparks ({activeSparks.length})
            </TabsTrigger>
            <TabsTrigger value="ladder" className="gap-2">
              <Building className="h-4 w-4" />
              Ladder
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="sparks" className="flex-1 m-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-3">
                {activeSparks.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Sparks will appear here as you explore...
                  </p>
                ) : (
                  activeSparks.map((spark) => (
                    <SparkCard 
                      key={spark.id}
                      spark={spark}
                      onPromote={promoteSpark}
                      onAudit={(s) => auditClaim(s.claim_text || s.summary)}
                      onRemove={removeSpark}
                      onSave={saveSparkToLibrary}
                      isSaved={isSparkSaved(spark.id)}
                    />
                  ))
                )}
                
                {/* Link to Sparks Library */}
                <div className="pt-4 border-t border-border/50">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full gap-2"
                    onClick={() => navigate('/sparks-library')}
                  >
                    <ExternalLink className="h-4 w-4" />
                    View Full Sparks Library
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="ladder" className="flex-1 m-0">
            <ScrollArea className="h-full p-4">
              {activeClaimLadder ? (
                <ClaimLadderCard ladder={activeClaimLadder} />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Promote a spark to build a Claim Ladder...
                </p>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default JeevesReasoningChat;
