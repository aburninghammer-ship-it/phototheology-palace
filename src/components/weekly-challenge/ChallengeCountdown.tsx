import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface ChallengeCountdownProps {
  endsAt: string;
}

export function ChallengeCountdown({ endsAt }: ChallengeCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date(endsAt);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (isExpired) {
    return (
      <Card className="border-orange-500/30 bg-orange-500/5">
        <CardContent className="py-4 text-center">
          <Clock className="h-6 w-6 mx-auto text-orange-500 mb-2" />
          <p className="font-semibold text-orange-500">Submissions Closed</p>
          <p className="text-xs text-muted-foreground">
            Awaiting Jeeves' judgment...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
      <CardContent className="py-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Time Remaining</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded-lg bg-background/50">
            <p className="text-2xl font-bold">{timeLeft.days}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <p className="text-2xl font-bold">{timeLeft.hours}</p>
            <p className="text-xs text-muted-foreground">hrs</p>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <p className="text-2xl font-bold">{timeLeft.minutes}</p>
            <p className="text-xs text-muted-foreground">min</p>
          </div>
          <div className="p-2 rounded-lg bg-background/50">
            <p className="text-2xl font-bold">{timeLeft.seconds}</p>
            <p className="text-xs text-muted-foreground">sec</p>
          </div>
        </div>
        <p className="text-xs text-center text-muted-foreground mt-3">
          Submit before Friday 11:59 PM
        </p>
      </CardContent>
    </Card>
  );
}
