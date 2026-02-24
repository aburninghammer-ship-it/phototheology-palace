import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePalaceAI } from "@/hooks/usePalaceAI";
import { useState } from "react";
import { Target, Sparkles, Clock, CheckCircle, Lightbulb } from "lucide-react";
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";

export const PersonalizedDrills = () => {
  const { drills, drillsLoading, generateDrills, isGeneratingDrills } = usePalaceAI();
  const { translatedFloors } = useTranslatedPalaceData();
  const [selectedRoom, setSelectedRoom] = useState<string>("");

  const allRooms = translatedFloors.flatMap(floor =>
    floor.rooms.map(room => ({ id: room.tag, name: room.name }))
  );

  const handleGenerate = () => {
    if (selectedRoom) {
      generateDrills({ roomId: selectedRoom, count: 3 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Generator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate Custom Drills
          </CardTitle>
          <CardDescription>
            AI will create personalized practice drills targeting your weaknesses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select value={selectedRoom} onValueChange={setSelectedRoom}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a room" />
              </SelectTrigger>
              <SelectContent>
                {allRooms.map(room => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.id} - {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleGenerate}
              disabled={!selectedRoom || isGeneratingDrills}
              className="gap-2"
            >
              <Target className="h-4 w-4" />
              {isGeneratingDrills ? "Generating..." : "Generate"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drills List */}
      <div className="space-y-4">
        {drillsLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-12 w-12 animate-pulse mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Loading your drills...</p>
            </CardContent>
          </Card>
        ) : drills && drills.length > 0 ? (
          drills.map((drill) => (
            <Card key={drill.id} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{drill.room_id}</Badge>
                      <Badge variant={
                        drill.difficulty_level === 'expert' ? 'destructive' :
                        drill.difficulty_level === 'hard' ? 'default' : 'outline'
                      }>
                        {drill.difficulty_level}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {drill.drill_type}
                      </Badge>
                      {drill.priority >= 8 && (
                        <Badge className="bg-yellow-500">High Priority</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{drill.target_skill}</CardTitle>
                    {drill.generated_reason && (
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        {drill.generated_reason}
                      </CardDescription>
                    )}
                  </div>
                  {drill.is_completed && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium mb-2">Challenge:</p>
                  <p className="text-sm">{drill.prompt}</p>
                </div>

                {drill.hints && Array.isArray(drill.hints) && drill.hints.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 flex items-center gap-1">
                      <Lightbulb className="h-4 w-4" />
                      Hints:
                    </p>
                    <ul className="space-y-1">
                      {(drill.hints as string[]).map((hint, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground ml-4">
                          • {hint}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {drill.verses_involved && Array.isArray(drill.verses_involved) && drill.verses_involved.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium">Verses:</p>
                    {drill.verses_involved.map((verse, idx) => (
                      <Badge key={idx} variant="outline">{verse}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {drill.attempts_count > 0 && (
                      <span>Attempts: {drill.attempts_count}</span>
                    )}
                    {drill.success_rate > 0 && (
                      <span>Success: {Math.round(drill.success_rate * 100)}%</span>
                    )}
                    {drill.avg_time_seconds && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {Math.round(drill.avg_time_seconds / 60)}m avg
                      </span>
                    )}
                  </div>
                  <Button size="sm" disabled={drill.is_completed}>
                    {drill.is_completed ? "Completed" : "Start Drill"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No Drills Yet</h3>
              <p className="text-muted-foreground mb-6">
                Generate personalized drills to practice your weaknesses
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};