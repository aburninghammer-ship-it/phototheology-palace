import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Copy, Gift } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminAccessCodes() {
  const { toast } = useToast();
  const [maxUses, setMaxUses] = useState<string>("");
  const [accessDurationMonths, setAccessDurationMonths] = useState<string>("3");
  const [isLifetime, setIsLifetime] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<{
    code: string;
    link: string;
    expiresAt: string;
    isLifetime?: boolean;
    duration?: number;
  } | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const response = await supabase.functions.invoke('generate-access-code', {
        body: { 
          maxUses: maxUses ? parseInt(maxUses) : null,
          accessDurationMonths: isLifetime ? null : (accessDurationMonths ? parseInt(accessDurationMonths) : null),
          isLifetime: isLifetime
        }
      });

      if (response.error) throw response.error;
      if (!response.data.success) throw new Error(response.data.error);

      setGeneratedCode({
        code: response.data.code,
        link: `${window.location.origin}/access?code=${response.data.code}`,
        expiresAt: response.data.expiresAt,
        isLifetime: isLifetime,
        duration: !isLifetime && accessDurationMonths ? parseInt(accessDurationMonths) : undefined
      });

      toast({
        title: "Success!",
        description: "Access code generated successfully",
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen gradient-dreamy">
      <Navigation />
      <div className="container max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Generate Access Code</CardTitle>
            <CardDescription>
              Create a special 24-hour access link that grants premium access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lifetime"
                checked={isLifetime}
                onCheckedChange={(checked) => setIsLifetime(checked as boolean)}
                disabled={loading}
              />
              <Label
                htmlFor="lifetime"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Grant Lifetime Access
              </Label>
            </div>

            {!isLifetime && (
              <div className="space-y-2">
                <Label htmlFor="accessDuration">Access Duration (Months)</Label>
                <Input
                  id="accessDuration"
                  type="number"
                  placeholder="3"
                  value={accessDurationMonths}
                  onChange={(e) => setAccessDurationMonths(e.target.value)}
                  disabled={loading}
                  min="1"
                />
                <p className="text-sm text-muted-foreground">
                  Number of months of premium access
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="maxUses">Maximum Uses (optional)</Label>
              <Input
                id="maxUses"
                type="number"
                placeholder="Leave blank for unlimited"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                disabled={loading}
              />
              <p className="text-sm text-muted-foreground">
                How many people can use this code? Leave blank for unlimited uses.
              </p>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generate Code
            </Button>

            {generatedCode && (
              <div className="space-y-4 mt-6 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label>Access Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.code}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Access Link</Label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedCode.link}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedCode.link)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Code expires in 24 hours: {new Date(generatedCode.expiresAt).toLocaleString()}</p>
                  <p className="mt-2 font-semibold">
                    {generatedCode.isLifetime
                      ? "🎉 This code grants LIFETIME premium access!"
                      : `This code grants ${generatedCode.duration} months of premium access.`
                    }
                  </p>
                  <p className="mt-1 text-xs">
                    The redemption link expires in 24 hours, but once redeemed, the access will be {generatedCode.isLifetime ? 'permanent' : `valid for ${generatedCode.duration} months`}.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
