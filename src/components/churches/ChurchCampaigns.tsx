import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ChurchCampaignsProps {
  churchId: string;
  hasTier2Access: boolean;
}

export function ChurchCampaigns({ churchId, hasTier2Access }: ChurchCampaignsProps) {
  const navigate = useNavigate();

  if (!hasTier2Access) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Church Campaigns</CardTitle>
          <CardDescription>Launch coordinated study campaigns across your entire congregation</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>Tier 2 Feature:</strong> Upgrade to Leadership Tools or Growth Suite to unlock church-wide campaign management.
              <Button 
                variant="link" 
                className="ml-2 p-0 h-auto"
                onClick={() => navigate("/pricing")}
              >
                View Plans →
              </Button>
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">What are Church Campaigns?</h3>
              <p className="text-sm text-muted-foreground">
                Launch coordinated Bible study challenges that your entire congregation participates in together. 
                For example: "This week, everyone studies Daniel 2" or "Connect the Cross to Prophecy using the Palace."
              </p>
            </div>
            
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Campaign Benefits</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Unified study across all age groups</li>
                <li>• Track participation and engagement</li>
                <li>• Pre-built campaign templates</li>
                <li>• Custom campaign creation</li>
                <li>• Automatic member notifications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // TODO: Implement actual campaign management when tier 2+ is active
  return (
    <Card>
      <CardHeader>
        <CardTitle>Church Campaigns</CardTitle>
        <CardDescription>Launch coordinated study campaigns across your entire congregation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-center py-12">
          Campaign management coming soon...
        </p>
      </CardContent>
    </Card>
  );
}
