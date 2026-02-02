import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Castle, Users, Gamepad2, Sparkles, Heart } from "lucide-react";

export function WelcomeMessage() {
  return (
    <Card className="relative overflow-hidden bg-card/90 border-primary/20 p-8 md:p-10">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Castle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to the GuestHouse
            </h2>
            <p className="text-sm text-muted-foreground">The Front Porch of Something Extraordinary</p>
          </div>
        </div>

        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>
            You've just stepped into the front porch of something extraordinary.
          </p>
          
          <p>
            <strong className="text-primary">The Phototheology Palace</strong> is a place where the Bible becomes a living, 
            breathing experience—not just words on a page, but a structured journey through Scripture 
            that reveals Christ in every verse, pattern, and promise.
          </p>
          
          <p className="text-muted-foreground italic">
            But the Palace has rooms only members can enter.
          </p>
          
          <p className="text-lg font-medium">
            So why are you here? Because <span className="text-secondary">everyone deserves a taste</span>.
          </p>
          
          <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
            <p className="mb-4">
              The <strong>GuestHouse</strong> is your open door. No account needed. No commitment required. 
              Just you, a group of fellow explorers, and a challenge from Scripture that will make you 
              see the Bible differently—even if just for one night.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Join 100 Other Guests</p>
                  <p className="text-sm text-muted-foreground">Team up with strangers for one night</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Gamepad2 className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">One of 4 Teams</p>
                  <p className="text-sm text-muted-foreground">Seekers, Watchers, Scribes, or Pathfinders</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">Scripture-Based Game</p>
                  <p className="text-sm text-muted-foreground">Race to unlock hidden truths</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium">The Big Reveal</p>
                  <p className="text-sm text-muted-foreground">See how all pieces connect</p>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-lg">
            It's <span className="font-semibold text-primary">fun</span>. 
            It's <span className="font-semibold text-secondary">fast</span>. 
            It's <span className="font-semibold text-accent">deep</span>. 
            And it's <span className="font-semibold">free</span>.
          </p>
          
          <p className="text-muted-foreground">
            Think of it as a front-row seat to what's possible when the Word is studied 
            with method, imagination, and fire.
          </p>
          
          <p className="text-muted-foreground">
            If you like what you see—you're welcome to step further into the Palace.
          </p>
          
          <motion.p 
            className="text-xl font-bold text-center pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              But for now? Welcome to the GuestHouse. Let's begin.
            </span>
          </motion.p>
        </div>
      </div>
    </Card>
  );
}
