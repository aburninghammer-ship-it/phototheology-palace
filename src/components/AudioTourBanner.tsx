import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Headphones, ChevronRight, Castle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AudioTourBanner = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-5 cursor-pointer group"
      onClick={() => navigate("/palace/tour")}
    >
      {/* Decorative background icon */}
      <Castle className="absolute -right-4 -bottom-4 h-28 w-28 text-primary/5 rotate-12 transition-transform group-hover:rotate-6 group-hover:scale-110" />

      <div className="relative z-10 flex items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
          <Headphones className="h-7 w-7 text-primary-foreground" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground text-base leading-tight mb-0.5">
            🎧 Take the Palace Audio Tour
          </h3>
          <p className="text-sm text-muted-foreground leading-snug">
            Let Reginald walk you through all 8 floors — hear how the method works in under 15 minutes.
          </p>
        </div>

        {/* Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors"
          tabIndex={-1}
        >
          <ChevronRight className="h-5 w-5 text-primary group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
};
