import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Calendar, CheckCircle2, Clock, Lock } from "lucide-react";
import { format, addDays } from "date-fns";

interface RetentionTest {
  test_type: string;
  scheduled_date: string;
  completed_at?: string;
  score?: number;
  passed: boolean;
}

interface RetentionTestCardProps {
  level4ReachedAt?: string;
  retentionTests?: RetentionTest[];
  onStartTest: (testType: string) => void;
}

export const RetentionTestCard: React.FC<RetentionTestCardProps> = ({
  level4ReachedAt,
  retentionTests = [],
  onStartTest,
}) => {
  if (!level4ReachedAt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Retention Tests
          </CardTitle>
          <CardDescription>
            Unlock retention tests by reaching Level 4
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-6 rounded-lg border-2 border-dashed">
            <div className="text-center space-y-2">
              <Lock className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Complete Level 4 to unlock spaced repetition testing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const level4Date = new Date(level4ReachedAt);
  
  const tests = [
    {
      type: "7_day",
      label: "7-Day Test",
      scheduled: addDays(level4Date, 7),
      description: "First retention checkpoint",
    },
    {
      type: "14_day",
      label: "14-Day Test",
      scheduled: addDays(level4Date, 14),
      description: "Second retention checkpoint",
    },
    {
      type: "30_day",
      label: "30-Day Test",
      scheduled: addDays(level4Date, 30),
      description: "Final retention checkpoint",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Spaced Retention Tests
        </CardTitle>
        <CardDescription>
          Prove long-term retention with timed assessments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {tests.map((test) => {
          const testRecord = retentionTests.find(t => t.test_type === test.type);
          const isPassed = testRecord?.passed;
          const isScheduled = test.scheduled > new Date();
          const isReady = !isScheduled && !testRecord;
          
          return (
            <div
              key={test.type}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                {isPassed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : isReady ? (
                  <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />
                ) : (
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{test.label}</h4>
                    {isPassed && (
                      <Badge variant="default" className="text-xs">
                        {testRecord?.score}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isPassed 
                      ? `Passed on ${format(new Date(testRecord.completed_at!), "MMM d")}`
                      : isReady
                      ? "Available now"
                      : `Available ${format(test.scheduled, "MMM d, yyyy")}`
                    }
                  </p>
                </div>
              </div>
              
              {isReady && (
                <Button
                  size="sm"
                  onClick={() => onStartTest(test.type)}
                  className="gap-2"
                >
                  <Brain className="h-3 w-3" />
                  Start Test
                </Button>
              )}
              
              {isPassed && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Passed
                </Badge>
              )}
              
              {isScheduled && (
                <Badge variant="outline" className="gap-1">
                  <Clock className="h-3 w-3" />
                  Scheduled
                </Badge>
              )}
            </div>
          );
        })}

        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Retention tests verify that you haven't just memorized answers 
            but truly understand and retain the principles over time. Pass all three to achieve 
            True Master status.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
