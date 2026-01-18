import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flame, Loader2, Thermometer } from "lucide-react";
import { motion } from "framer-motion";

interface SimmerNewSessionProps {
  onSubmit: (params: {
    theme: string;
    themePassage?: string;
    idea?: string;
    targetStyle?: string;
    targetDensity?: string;
    targetPurpose?: string;
  }) => void;
  isLoading: boolean;
}

export function SimmerNewSession({ onSubmit, isLoading }: SimmerNewSessionProps) {
  const [theme, setTheme] = useState("");
  const [themePassage, setThemePassage] = useState("");
  const [idea, setIdea] = useState("");
  const [targetStyle, setTargetStyle] = useState("balanced");
  const [targetDensity, setTargetDensity] = useState("teaching");
  const [targetPurpose, setTargetPurpose] = useState("evangelistic");

  const handleSubmit = () => {
    if (!theme.trim()) return;
    onSubmit({
      theme,
      themePassage: themePassage || undefined,
      idea: idea || undefined,
      targetStyle,
      targetDensity,
      targetPurpose,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            Ignite New Sermon
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-orange-200">Sermon Theme *</Label>
            <Textarea
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="e.g., God uses delay as a weapon against false certainty"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50 min-h-[100px]"
            />
            <p className="text-xs text-orange-200/60">
              Be specific. The more tension in your theme, the more powerful the sermon.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-orange-200">Anchor Passage (Optional)</Label>
            <Input
              value={themePassage}
              onChange={(e) => setThemePassage(e.target.value)}
              placeholder="e.g., Psalm 27:14 or John 11:1-44"
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-orange-200">Your Idea (Optional)</Label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Share your sermon idea, angle, or key insight you want to explore..."
              className="bg-black/30 border-orange-500/30 text-white placeholder:text-orange-200/50 min-h-[80px]"
            />
            <p className="text-xs text-orange-200/60">
              Any thoughts, angles, or directions you already have in mind.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-orange-200 flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                Heat Level
              </Label>
              <Select value={targetStyle} onValueChange={setTargetStyle}>
                <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">🔥 Conservative</SelectItem>
                  <SelectItem value="balanced">🔥🔥 Balanced</SelectItem>
                  <SelectItem value="aggressive">🔥🔥🔥 Aggressive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-orange-200">Density</Label>
              <Select value={targetDensity} onValueChange={setTargetDensity}>
                <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teaching">📚 Teaching</SelectItem>
                  <SelectItem value="punchy">💥 Punchy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-orange-200">Purpose</Label>
              <Select value={targetPurpose} onValueChange={setTargetPurpose}>
                <SelectTrigger className="bg-black/30 border-orange-500/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evangelistic">🌱 Evangelistic</SelectItem>
                  <SelectItem value="doctrinal">📖 Doctrinal</SelectItem>
                  <SelectItem value="prophetic">⚡ Prophetic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!theme.trim() || isLoading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-6 text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Igniting...
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 mr-2" />
                Start the Forge
              </>
            )}
          </Button>

          <p className="text-xs text-center text-orange-200/60">
            "Most tools write sermons. Simmer forges them."
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
