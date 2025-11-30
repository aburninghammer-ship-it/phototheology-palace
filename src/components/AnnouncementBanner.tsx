import { X, Megaphone, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig = {
  info: {
    icon: Megaphone,
    bgClass: "bg-card border-primary/30",
    iconClass: "text-primary"
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-card border-yellow-500/30",
    iconClass: "text-yellow-500"
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-card border-green-500/30",
    iconClass: "text-green-500"
  },
  update: {
    icon: Sparkles,
    bgClass: "bg-card border-purple-500/30",
    iconClass: "text-purple-500"
  }
};

export function AnnouncementBanner() {
  const { announcements, dismissAnnouncement } = useAnnouncements();

  if (announcements.length === 0) return null;

  // Show only the most recent announcement
  const announcement = announcements[0];
  const config = typeConfig[announcement.type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={announcement.id}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-16 left-0 right-0 z-30 border-b backdrop-blur-xl ${config.bgClass}`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-foreground">{announcement.title}</span>
                <span className="mx-2 text-muted-foreground">—</span>
                <span className="text-muted-foreground break-words">{announcement.message}</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 flex-shrink-0"
              onClick={() => dismissAnnouncement(announcement.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
