import { useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveChatToggle() {
  const { user } = useAuth();
  const { isOpen, setIsOpen, totalUnread } = useLiveChat();
  const hasDragged = useRef(false);

  if (!user || isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      drag
      dragMomentum={false}
      onDragStart={() => { hasDragged.current = true; }}
      onDragEnd={() => { setTimeout(() => { hasDragged.current = false; }, 50); }}
      className="fixed bottom-[88px] right-4 z-[55] md:bottom-6 touch-none select-none cursor-grab active:cursor-grabbing"
    >
      <Button
        onClick={() => {
          if (!hasDragged.current) setIsOpen(true);
        }}
        size="icon"
        className="relative h-14 w-14 rounded-full shadow-xl shadow-primary/25 bg-gradient-to-br from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/35 transition-all duration-300 hover:scale-105"
      >
        <MessageSquare className="h-6 w-6 pointer-events-none" />

        <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" style={{ animationDuration: '3s' }} />

        <AnimatePresence>
          {totalUnread > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-bold text-destructive-foreground shadow-lg pointer-events-none"
            >
              {totalUnread > 99 ? '99+' : totalUnread}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
