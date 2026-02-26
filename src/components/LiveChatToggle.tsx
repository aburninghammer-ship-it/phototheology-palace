import { useState, useRef, useCallback } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useLiveChat } from '@/contexts/LiveChatContext';
import { usePublicChat } from '@/hooks/usePublicChat';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveChatToggle() {
  const { user } = useAuth();
  const { isOpen, setIsOpen } = useLiveChat();
  const { totalUnread } = usePublicChat();

  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem('live-chat-btn-pos');
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, moved: false });

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY, moved: false };
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragStartRef.current.moved = true;
    }
    if (dragStartRef.current.moved) {
      setPosition(prev => {
        const next = { x: prev.x + e.movementX, y: prev.y + e.movementY };
        return next;
      });
    }
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    if (!dragStartRef.current.moved) {
      setIsOpen(true);
    } else {
      localStorage.setItem('live-chat-btn-pos', JSON.stringify(position));
    }
    setIsDragging(false);
  }, [position, setIsOpen]);

  if (!user || isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      className="fixed bottom-[88px] right-4 z-[55] md:bottom-6 touch-none select-none"
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
    >
      <Button
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        size="icon"
        className={`relative h-14 w-14 rounded-full shadow-xl shadow-primary/25 bg-gradient-to-br from-primary to-primary/80 hover:shadow-2xl hover:shadow-primary/35 transition-all duration-300 ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'}`}
      >
        <MessageSquare className="h-6 w-6 pointer-events-none" />

        {!isDragging && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/20 pointer-events-none" style={{ animationDuration: '3s' }} />
        )}

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
