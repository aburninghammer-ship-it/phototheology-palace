import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SparkIcon } from './SparkIcon';
import { SparkCard } from './SparkCard';
import { SparkExploreFlow } from './SparkExploreFlow';
import { DraggableSparkOverlay } from './DraggableSparkOverlay';
import { cn } from '@/lib/utils';
import type { Spark } from '@/hooks/useSparks';
interface SparkContainerProps {
  sparks: Spark[];
  onOpen: (sparkId: string) => void;
  onSave: (sparkId: string) => void;
  onDismiss: (sparkId: string) => void;
  onExplore: (sparkId: string) => Promise<Spark | undefined>;
  onAddToNotes?: (text: string) => void;
  position?: 'margin' | 'inline' | 'floating';
  className?: string;
  maxDisplay?: number; // 0 or undefined = show all sparks
}

export function SparkContainer({
  sparks,
  onOpen,
  onSave,
  onDismiss,
  onExplore,
  onAddToNotes,
  position = 'floating',
  className,
  maxDisplay
}: SparkContainerProps) {
  const [openSparkId, setOpenSparkId] = useState<string | null>(null);
  const [exploringSparkId, setExploringSparkId] = useState<string | null>(null);
  const [exploreSpark, setExploreSpark] = useState<Spark | null>(null);

  const handleIconClick = (sparkId: string) => {
    onOpen(sparkId);
    setOpenSparkId(sparkId);
  };

  const handleClose = () => {
    setOpenSparkId(null);
  };

  const handleExplore = async (sparkId: string) => {
    const spark = await onExplore(sparkId);
    if (spark) {
      setExploreSpark(spark);
      setExploringSparkId(sparkId);
      setOpenSparkId(null);
    }
  };

  const handleSave = (sparkId: string) => {
    onSave(sparkId);
    setOpenSparkId(null);
  };

  const handleDismiss = (sparkId: string) => {
    onDismiss(sparkId);
    setOpenSparkId(null);
  };

  const openSpark = sparks.find(s => s.id === openSparkId);

  if (sparks.length === 0) return null;

  return (
    <div className={cn("relative", className)}>
      {/* Spark Icons - extra padding to prevent glow clipping at edges */}
      <div className="flex gap-5 flex-wrap items-center p-2 -m-2">
        <AnimatePresence>
          {(maxDisplay && maxDisplay > 0 ? sparks.slice(0, maxDisplay) : sparks).map((spark, index) => (
            <motion.div
              key={spark.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: Math.min(index * 0.1, 0.5) }}
            >
              <SparkIcon
                type={spark.spark_type}
                pulse={!spark.opened_at}
                onClick={() => handleIconClick(spark.id)}
                size="md"
                colorVariant={spark.spark_type === 'connection' ? 0 : spark.spark_type === 'pattern' ? 1 : 2}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {maxDisplay && maxDisplay > 0 && sparks.length > maxDisplay && (
          <span className="text-xs text-muted-foreground self-center ml-1">
            +{sparks.length - maxDisplay}
          </span>
        )}
      </div>

      {/* Open Spark Card - Draggable overlay */}
      {openSpark && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[9998]" 
            onClick={handleClose} 
          />
          {/* Card - draggable container */}
          <DraggableSparkOverlay onClose={handleClose}>
            <SparkCard
              spark={openSpark}
              onClose={handleClose}
              onExplore={() => handleExplore(openSpark.id)}
              onSave={() => handleSave(openSpark.id)}
              onDismiss={() => handleDismiss(openSpark.id)}
              onAddToNotes={onAddToNotes}
            />
          </DraggableSparkOverlay>
        </>
      )}

      {/* Explore Flow */}
      {exploreSpark && (
        <SparkExploreFlow
          spark={exploreSpark}
          isOpen={!!exploringSparkId}
          onClose={() => {
            setExploringSparkId(null);
            setExploreSpark(null);
          }}
        />
      )}
    </div>
  );
}
