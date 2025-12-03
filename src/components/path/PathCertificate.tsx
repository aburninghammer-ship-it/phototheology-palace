import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PATH_INFO, PathType, PathCompletion } from "@/hooks/usePath";
import { Download, Share2, Award, Crown, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface PathCertificateProps {
  completion: PathCompletion;
  userName: string;
}

export function PathCertificate({ completion, userName }: PathCertificateProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const pathType = completion.path_type as PathType;
  const pathData = PATH_INFO[pathType];

  const handleDownload = async () => {
    // For now, just show a toast - full PDF generation would require jspdf
    toast({
      title: "Certificate Download",
      description: "Certificate download feature coming soon!",
    });
  };

  const handleShare = async () => {
    const shareData = {
      title: `${pathData.name} Certificate - Phototheology Palace`,
      text: `I've completed the ${pathData.name} in Phototheology Palace! 🎉`,
      url: window.location.origin,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(
        `${shareData.text}\n${shareData.url}`
      );
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const getMasterTitle = () => {
    switch (completion.master_level) {
      case 1: return "Apprentice";
      case 2: return "Journeyman";
      case 3: return "Adept";
      case 4: return "Master";
      default: return "Scholar";
    }
  };

  return (
    <div className="space-y-4">
      {/* Certificate Display */}
      <div
        ref={certificateRef}
        className={`relative overflow-hidden rounded-xl border-4 ${pathData.borderColor} bg-gradient-to-br from-background via-background to-muted p-8`}
      >
        {/* Decorative corners */}
        <div className="absolute top-0 left-0 w-24 h-24 border-t-4 border-l-4 border-primary/30 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-24 h-24 border-t-4 border-r-4 border-primary/30 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-4 border-l-4 border-primary/30 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-4 border-r-4 border-primary/30 rounded-br-xl" />

        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent" />
        </div>

        <div className="relative text-center space-y-6">
          {/* Header */}
          <div className="flex justify-center">
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${pathData.color} flex items-center justify-center shadow-lg`}>
              <span className="text-4xl">{pathData.icon}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Certificate of Completion
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Phototheology Palace
            </h1>
          </div>

          {/* Recipient */}
          <div className="py-6 space-y-2">
            <p className="text-muted-foreground">This certifies that</p>
            <h2 className="text-4xl font-serif italic text-primary">
              {userName}
            </h2>
            <p className="text-muted-foreground">has successfully completed</p>
          </div>

          {/* Path */}
          <div className={`inline-block px-8 py-4 rounded-lg bg-gradient-to-r ${pathData.color} text-white`}>
            <h3 className="text-2xl font-bold">{pathData.name}</h3>
            <p className="text-sm opacity-90">2-Year Mastery Journey</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-3 gap-4 pt-6 text-center">
            <div>
              <Award className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Title Earned</p>
              <p className="font-semibold">{getMasterTitle()}</p>
            </div>
            <div>
              <Sparkles className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Completion Date</p>
              <p className="font-semibold">
                {format(new Date(completion.completed_at), "MMM d, yyyy")}
              </p>
            </div>
            <div>
              <Crown className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Master Level</p>
              <p className="font-semibold">{completion.master_level}</p>
            </div>
          </div>

          {/* Signature area */}
          <div className="pt-8 mt-8 border-t border-border">
            <p className="text-sm text-muted-foreground italic">
              "These are they which testify of me" — John 5:39
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button onClick={handleDownload} className="flex-1">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={handleShare} variant="outline" className="flex-1">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}

// Component to display all earned certificates
export function PathCertificatesGallery({ 
  completions, 
  userName 
}: { 
  completions: PathCompletion[]; 
  userName: string;
}) {
  if (!completions || completions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Crown className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
          <p className="text-muted-foreground">
            Complete a learning path to earn your first certificate!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Award className="h-5 w-5" />
          Your Certificates
        </h2>
        <Badge variant="secondary">
          {completions.length} Path{completions.length !== 1 ? "s" : ""} Mastered
        </Badge>
      </div>

      <div className="grid gap-6">
        {completions.map((completion) => (
          <PathCertificate 
            key={completion.id} 
            completion={completion} 
            userName={userName}
          />
        ))}
      </div>
    </div>
  );
}
