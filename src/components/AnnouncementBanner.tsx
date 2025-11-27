import { X, Megaphone, AlertTriangle, CheckCircle, Sparkles } from "lucide-react";
import { useAnnouncements } from "@/hooks/useAnnouncements";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const typeConfig = {
  info: {
    icon: Megaphone,
    bgClass: "bg-primary/10 border-primary/20",
    iconClass: "text-primary"
  },
  warning: {
    icon: AlertTriangle,
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
    iconClass: "text-yellow-500"
  },
  success: {
    icon: CheckCircle,
    bgClass: "bg-green-500/10 border-green-500/20",
    iconClass: "text-green-500"
  },
  update: {
    icon: Sparkles,
    bgClass: "bg-purple-500/10 border-purple-500/20",
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
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`border-b ${config.bgClass}`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Icon className={`h-5 w-5 flex-shrink-0 ${config.iconClass}`} />
              <div className="min-w-0">
                <span className="font-semibold text-foreground">{announcement.title}</span>
                <span className="mx-2 text-muted-foreground">—</span>
                <span className="text-muted-foreground">{announcement.message}</span>
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
