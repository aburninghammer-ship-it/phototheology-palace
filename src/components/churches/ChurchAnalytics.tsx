import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";

interface ChurchAnalyticsProps {
  churchId: string;
  hasTier3Access: boolean;
}

export function ChurchAnalytics({ churchId, hasTier3Access }: ChurchAnalyticsProps) {
  // TODO: Implement actual analytics when ready
  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Analytics</CardTitle>
        <CardDescription>Track engagement and identify emerging leaders</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert>
          <AlertDescription>
            Analytics dashboard coming soon. You'll be able to see:
            <ul className="mt-2 space-y-1 ml-4">
              <li>• Member engagement metrics</li>
              <li>• Campaign participation rates</li>
              <li>• Emerging teachers and evangelists</li>
              <li>• Study completion statistics</li>
              {hasTier3Access && <li>• Ministry readiness indicators</li>}
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
