import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReportCard, ReportCard } from "@/hooks/useReportCard";
import { FileText, TrendingUp, TrendingDown, AlertCircle, Target, Award, MapPin } from "lucide-react";
import { format } from "date-fns";

interface ReportCardDisplayProps {
  roomId: string;
  roomName: string;
  currentLevel: number;
}

export const ReportCardDisplay: React.FC<ReportCardDisplayProps> = ({
  roomId,
  roomName,
  currentLevel,
}) => {
  const { reportCards, isLoading, generateReport, isGenerating } = useReportCard(roomId);

  if (isLoading) {
    return <div className="text-center py-8">Loading report cards...</div>;
  }

  const latestReport = reportCards?.[0];

  return (
    <div className="space-y-6">
      {!latestReport && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Report Cards Yet</h3>
            <p className="text-sm text-muted-foreground mb-4 text-center max-w-md">
              Complete activities and level up to receive personalized report cards
              analyzing your strengths and areas for improvement.
            </p>
            <Button
              onClick={() => generateReport(currentLevel)}
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Generate Report Card"}
            </Button>
          </CardContent>
        </Card>
      )}

      {reportCards?.map((report) => (
        <Card key={report.id} className="border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Level {report.mastery_level} Report Card
                </CardTitle>
                <CardDescription>
                  {roomName} • {format(new Date(report.created_at), "MMM d, yyyy")}
                </CardDescription>
              </div>
              <Badge variant="secondary">
                Level {report.mastery_level}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Strengths */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <h4 className="font-semibold">Strengths</h4>
              </div>
              <ul className="space-y-2">
                {report.report_data.strengths.map((strength, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="h-4 w-4 text-orange-500" />
                <h4 className="font-semibold">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2">
                {report.report_data.weaknesses.map((weakness, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mistakes Repeated */}
            {report.report_data.mistakes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <h4 className="font-semibold">Patterns to Address</h4>
                </div>
                <ul className="space-y-2">
                  {report.report_data.mistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Gained */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-4 w-4 text-blue-500" />
                <h4 className="font-semibold">Skills Gained</h4>
              </div>
              <ul className="space-y-2">
                {report.report_data.skills_gained.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Next Rooms */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-purple-500" />
                <h4 className="font-semibold">Suggested Next Rooms</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {report.report_data.suggested_rooms.map((room, idx) => (
                  <Badge key={idx} variant="outline">
                    {room}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Training Plan */}
            <div className="bg-muted/50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Personalized Training Plan</h4>
              <ul className="space-y-2">
                {report.report_data.training_plan.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="font-semibold text-primary">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      ))}

      {reportCards && reportCards.length > 0 && (
        <Button
          onClick={() => generateReport(currentLevel)}
          disabled={isGenerating}
          variant="outline"
          className="w-full"
        >
          {isGenerating ? "Generating..." : "Generate New Report Card"}
        </Button>
      )}
    </div>
  );
};
