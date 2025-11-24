import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Flame, Target, GraduationCap, Clock } from "lucide-react";

export const EnhancedRequirements = () => (
  <Card className="p-6">
    <h2 className="text-2xl font-bold mb-4">Enhanced Mastery Requirements</h2>
    
    <div className="space-y-6">
      {/* Level 1-3 */}
      <div>
        <h3 className="font-semibold mb-2">Levels 1-3: Foundation</h3>
        <p className="text-sm text-muted-foreground">XP-based progression only</p>
      </div>

      {/* Level 4 */}
      <div className="p-4 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Badge>Level 4: Expert</Badge>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><Target className="h-4 w-4 mt-0.5" /> 1000 XP total</li>
          <li className="flex gap-2"><Flame className="h-4 w-4 mt-0.5" /> 7-day room streak</li>
          <li className="flex gap-2"><Target className="h-4 w-4 mt-0.5" /> 50% curriculum</li>
        </ul>
      </div>

      {/* Level 5 */}
      <div className="p-4 rounded-lg border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/5 to-yellow-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-amber-600">Level 5: Master (Critical Gate)</Badge>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><Target className="h-4 w-4 mt-0.5" /> 2000 XP total</li>
          <li className="flex gap-2"><Flame className="h-4 w-4 mt-0.5" /> 7-day room streak maintained</li>
          <li className="flex gap-2"><Target className="h-4 w-4 mt-0.5" /> 100% curriculum complete</li>
          <li className="flex gap-2"><Brain className="h-4 w-4 mt-0.5" /> Pass final assessment (80%+)</li>
          <li className="flex gap-2"><GraduationCap className="h-4 w-4 mt-0.5" /> Pass teaching demo</li>
        </ul>
      </div>

      {/* True Master */}
      <div className="p-4 rounded-lg border-2 border-purple-500/40 bg-gradient-to-r from-purple-500/5 to-pink-500/5">
        <div className="flex items-center gap-2 mb-3">
          <Badge className="bg-purple-600">True Master (Post-Level 5)</Badge>
        </div>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5" /> 7-day retention test</li>
          <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5" /> 14-day retention test</li>
          <li className="flex gap-2"><Clock className="h-4 w-4 mt-0.5" /> 30-day retention test</li>
          <li className="flex gap-2"><GraduationCap className="h-4 w-4 mt-0.5" /> Teach another user</li>
        </ul>
        <p className="text-xs text-muted-foreground mt-3 p-2 rounded bg-background">
          <strong>Minimum 30 days required</strong> — retention tests enforce spaced repetition
        </p>
      </div>
    </div>
  </Card>
);
