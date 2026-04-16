import { SimmerSession } from "@/hooks/useSimmerSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Thermometer, Settings } from "lucide-react";
import { useState } from "react";

interface SimmerHeatControlsProps {
  session: SimmerSession;
  onUpdate: (params: { targetStyle?: string; targetDensity?: string; targetPurpose?: string; title?: string }) => void;
}

export function SimmerHeatControls({ session, onUpdate }: SimmerHeatControlsProps) {
  const [title, setTitle] = useState(session.title || "");
  const [style, setStyle] = useState(session.target_style);
  const [density, setDensity] = useState(session.target_density);
  const [purpose, setPurpose] = useState(session.target_purpose);

  const handleSave = () => {
    onUpdate({
      title: title || undefined,
      targetStyle: style,
      targetDensity: density,
      targetPurpose: purpose,
    });
  };

  return (
    <Card className="bg-black/30 border-orange-500/20 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-orange-400" />
          Heat Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-orange-200">Sermon Title (Optional)</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your sermon a title"
            className="bg-black/30 border-orange-500/30 text-white"
          />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-orange-200 flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Heat Level
            </Label>
            <Select value={style} onValueChange={setStyle}>
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
            <Select value={density} onValueChange={setDensity}>
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
            <Select value={purpose} onValueChange={setPurpose}>
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

        <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">
          Save Settings
        </Button>

        <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <p className="text-orange-200 text-sm">
            <strong>Theme:</strong> {session.theme}
          </p>
          {session.theme_passage && (
            <p className="text-orange-200/60 text-sm mt-1">
              <strong>Passage:</strong> {session.theme_passage}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
