import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GCConflictTag } from "./GCConflictTag";
import { COTAParagraph } from "@/data/cotaCommentary";
import { BookOpen, Sparkles, Shield, Target } from "lucide-react";

interface COTAParagraphViewProps {
  paragraph: COTAParagraph;
}

export function COTAParagraphView({ paragraph }: COTAParagraphViewProps) {
  return (
    <div className="space-y-4">
      {/* EGW Text */}
      <Card className="bg-gradient-to-br from-amber-950/20 to-yellow-950/20 border-amber-500/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-semibold text-amber-300">
              {paragraph.book.replace(/_/g, " ").toUpperCase()} • Chapter {paragraph.chapter} • ¶{paragraph.paragraphNumber}
            </span>
          </div>
          <p className="text-base leading-relaxed text-foreground/90 font-serif">
            {paragraph.egwText}
          </p>
        </CardContent>
      </Card>

      {/* GC Conflict Tag - SIGNATURE FEATURE */}
      <GCConflictTag tag={paragraph.gcConflictTag} defaultExpanded={false} />

      {/* Layered Commentary Tabs - Conditional based on paragraph type */}
      {/* Only show Scripture/PT/Doctrine tabs for theological paragraphs */}
      {paragraph.paragraphType !== "historical" && (paragraph.scriptureRefs || paragraph.ptPrinciples || paragraph.doctrinesPresent) && (
        <Tabs defaultValue={paragraph.scriptureRefs ? "scripture" : paragraph.ptPrinciples ? "pt" : "doctrine"} className="w-full">
          <TabsList className={`grid w-full ${
            [
              paragraph.scriptureRefs,
              paragraph.ptPrinciples,
              paragraph.doctrinesPresent,
              paragraph.apologeticsImplications
            ].filter(Boolean).length === 4 ? 'grid-cols-4' :
            [
              paragraph.scriptureRefs,
              paragraph.ptPrinciples,
              paragraph.doctrinesPresent,
              paragraph.apologeticsImplications
            ].filter(Boolean).length === 3 ? 'grid-cols-3' :
            [
              paragraph.scriptureRefs,
              paragraph.ptPrinciples,
              paragraph.doctrinesPresent,
              paragraph.apologeticsImplications
            ].filter(Boolean).length === 2 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {paragraph.scriptureRefs && (
              <TabsTrigger value="scripture" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Scripture
              </TabsTrigger>
            )}
            {paragraph.ptPrinciples && (
              <TabsTrigger value="pt" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                PT Principles
              </TabsTrigger>
            )}
            {paragraph.doctrinesPresent && (
              <TabsTrigger value="doctrine" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Doctrines
              </TabsTrigger>
            )}
            {paragraph.apologeticsImplications && (
              <TabsTrigger value="defense" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Defense
              </TabsTrigger>
            )}
          </TabsList>

        {/* Scripture Commentary */}
        {paragraph.scriptureRefs && (
          <TabsContent value="scripture" className="mt-4">
            <Card className="bg-blue-950/20 border-blue-500/30">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-blue-300 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Scripture Commentary
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {paragraph.scriptureRefs.map((ref) => (
                    <Badge key={ref} variant="outline" className="border-blue-500/50 text-blue-300 text-xs">
                      {ref}
                    </Badge>
                  ))}
                </div>
                {paragraph.scriptureCommentary && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {paragraph.scriptureCommentary}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* PT Principles */}
        {paragraph.ptPrinciples && paragraph.ptPrinciples.length > 0 && (
          <TabsContent value="pt" className="mt-4">
            <div className="space-y-3">
              {paragraph.ptPrinciples.map((principle, idx) => (
                <Card key={idx} className="bg-purple-950/20 border-purple-500/30">
                  <CardContent className="p-4 space-y-2">
                    <h5 className="font-semibold text-purple-300 text-sm flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      {principle.principle}
                    </h5>
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium text-purple-400">Explanation:</span>
                        <p className="mt-1">{principle.explanation}</p>
                      </div>
                      <div>
                        <span className="font-medium text-purple-400">Application:</span>
                        <p className="mt-1">{principle.application}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}

        {/* Doctrinal Extraction */}
        {paragraph.doctrinesPresent && paragraph.doctrinesPresent.length > 0 && (
          <TabsContent value="doctrine" className="mt-4">
            <Card className="bg-amber-950/20 border-amber-500/30">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-amber-300 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Doctrines Present in This Paragraph
                </h4>
                <div className="flex flex-wrap gap-2">
                  {paragraph.doctrinesPresent.map((doctrine) => (
                    <Badge
                      key={doctrine}
                      className="bg-amber-900/40 text-amber-200 border-amber-500/50"
                    >
                      {doctrine}
                    </Badge>
                  ))}
                </div>
                {paragraph.historicalContext && (
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="font-semibold text-amber-300">Historical Context</div>
                    <div className="space-y-1 text-muted-foreground">
                      <p><span className="text-amber-400">Period:</span> {paragraph.historicalContext.dateOfEvents}</p>
                      <p><span className="text-amber-400">Powers:</span> {paragraph.historicalContext.politicalPowers.join(", ")}</p>
                      <p><span className="text-amber-400">Climate:</span> {paragraph.historicalContext.religiousClimate}</p>
                      <p><span className="text-amber-400">Timeline:</span> {paragraph.historicalContext.propheticTimeline}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Apologetics / Defense Mode */}
        {paragraph.apologeticsImplications && (
          <TabsContent value="defense" className="mt-4">
            <Card className="bg-red-950/20 border-red-500/30">
              <CardContent className="p-4 space-y-3">
                <h4 className="font-semibold text-red-300 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Apologetics: {paragraph.apologeticsImplications.doctrine}
                </h4>
                <div className="space-y-3">
                  {paragraph.apologeticsImplications.likelyAttacks.map((attack, idx) => (
                    <div key={idx} className="p-3 bg-black/30 rounded-lg border border-red-500/20">
                      <div className="text-xs font-semibold text-white mb-2 capitalize">
                        {attack.opponent} AI Critic
                      </div>
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-orange-400 font-medium">Attack:</span>
                          <p className="text-muted-foreground mt-0.5">{attack.attack}</p>
                        </div>
                        <div>
                          <span className="text-green-400 font-medium">Defense:</span>
                          <p className="text-muted-foreground mt-0.5">{attack.defense}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
      )}
    </div>
  );
}
