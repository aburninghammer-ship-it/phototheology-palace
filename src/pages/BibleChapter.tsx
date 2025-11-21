import { Navigation } from "@/components/Navigation";
import { BibleReader } from "@/components/bible/BibleReader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BibleChapter = () => {
  const location = useLocation();
  const { exercises, fromReadingPlan, planName, dayNumber } = location.state || {};

  return (
    <div className="min-h-screen gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          <Button variant="ghost" asChild className="mb-6">
            <Link to={fromReadingPlan ? "/daily-reading" : "/bible"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {fromReadingPlan ? "Back to Daily Reading" : "Back to Bible"}
            </Link>
          </Button>

          {fromReadingPlan && exercises && exercises.length > 0 && (
            <Card className="p-6 mb-6 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Building2 className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="text-xl font-bold text-foreground">Principles to Apply</h3>
                    {planName && (
                      <p className="text-sm text-muted-foreground">
                        {planName} - Day {dayNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <Tabs defaultValue={`floor-${exercises[0]?.floorNumber}`} className="w-full">
                <TabsList className="grid w-full mb-4" style={{ gridTemplateColumns: `repeat(${exercises.length}, minmax(0, 1fr))` }}>
                  {exercises.map((exercise: any) => (
                    <TabsTrigger 
                      key={exercise.floorNumber} 
                      value={`floor-${exercise.floorNumber}`} 
                      className="flex flex-col items-center gap-1 py-2"
                    >
                      <Building2 className="h-4 w-4" />
                      <span className="text-xs">Floor {exercise.floorNumber}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                {exercises.map((exercise: any) => (
                  <TabsContent key={exercise.floorNumber} value={`floor-${exercise.floorNumber}`} className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border">
                      <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-foreground">{exercise.floorName}</h4>
                          <Badge variant="outline" className="text-xs">Floor {exercise.floorNumber}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Rooms: {Array.isArray(exercise.rooms) ? exercise.rooms.join(" • ") : exercise.rooms || "No rooms specified"}
                        </p>
                      </div>
                    </div>

                    <Card className="p-4 bg-background/50">
                      <h5 className="font-medium text-foreground mb-2 flex items-center gap-2 text-sm">
                        <Lightbulb className="h-4 w-4 text-accent" />
                        {exercise.title}
                      </h5>
                      <p className="text-sm text-muted-foreground mb-3">{exercise.prompt}</p>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">Guiding Questions:</p>
                        <ul className="space-y-1.5">
                          {exercise.questions?.map((q: string, qIdx: number) => (
                            <li key={qIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          )}

          <BibleReader />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BibleChapter;
