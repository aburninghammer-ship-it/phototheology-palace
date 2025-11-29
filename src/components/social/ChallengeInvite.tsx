import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Check, Users, Swords, Trophy, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

interface ChallengeInviteProps {
  challengeType: "room" | "chess" | "escape" | "quiz";
  challengeId?: string;
  roomName?: string;
  onInviteSent?: () => void;
}

export const ChallengeInvite = ({ 
  challengeType, 
  challengeId, 
  roomName,
  onInviteSent 
}: ChallengeInviteProps) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const getInviteLink = () => {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams({
      type: challengeType,
      from: user?.id || "anonymous",
      ...(challengeId && { id: challengeId })
    });
    return `${baseUrl}/challenge/join?${params.toString()}`;
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(getInviteLink());
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmailInvite = () => {
    if (!email) return;
    // In production, this would send via backend
    const subject = encodeURIComponent(`Join me in a ${getChallengeTitle()} Challenge!`);
    const body = encodeURIComponent(
      `I'm challenging you to a ${getChallengeTitle()} battle on Phototheology!\n\nClick here to join: ${getInviteLink()}`
    );
    window.open(`mailto:${email}?subject=${subject}&body=${body}`);
    toast.success("Email invite opened!");
    setEmail("");
    onInviteSent?.();
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${getChallengeTitle()} Challenge`,
          text: `Join me in a ${getChallengeTitle()} battle on Phototheology!`,
          url: getInviteLink()
        });
        onInviteSent?.();
      } catch (err) {
        // User cancelled
      }
    } else {
      copyLink();
    }
  };

  const getChallengeTitle = () => {
    switch (challengeType) {
      case "room": return roomName || "Palace Room";
      case "chess": return "Chain Chess";
      case "escape": return "Escape Room";
      case "quiz": return "Palace Quiz";
      default: return "Challenge";
    }
  };

  const getChallengeIcon = () => {
    switch (challengeType) {
      case "room": return <Users className="h-5 w-5" />;
      case "chess": return <Swords className="h-5 w-5" />;
      case "escape": return <Trophy className="h-5 w-5" />;
      case "quiz": return <Trophy className="h-5 w-5" />;
      default: return <Share2 className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Challenge Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getChallengeIcon()}
            Invite to {getChallengeTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          {/* Quick share options */}
          <div className="grid grid-cols-2 gap-3">
            <Button onClick={shareNative} className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={copyLink} className="gap-2">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>

          {/* Link preview */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <LinkIcon className="h-3 w-3" />
              Invite Link
            </div>
            <p className="text-xs break-all font-mono">{getInviteLink()}</p>
          </div>

          {/* Email invite */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Send via Email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={sendEmailInvite} disabled={!email}>
                Send
              </Button>
            </div>
          </div>

          {/* Challenge info */}
          <Card className="bg-primary/5">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Challenge Type</span>
                <Badge>{getChallengeTitle()}</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
