import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSessionMode } from '@/contexts/SessionModeContext';
import { Button } from '@/components/ui/button';
import { BookOpen, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function SessionStartButton() {
  const { t } = useTranslation();
  const { isSessionActive, startSession, isLoading } = useSessionMode();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');

  if (isSessionActive) return null;

  const handleStart = async () => {
    await startSession(title || undefined);
    setTitle('');
    setOpen(false);
  };

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">{t('session.startSession')}</span>
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t('session.tooltip')}</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {t('session.startNew')}
            </DialogTitle>
            <DialogDescription>
              {t('session.description')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-session-title">{t('session.titleLabel')}</Label>
              <Input
                id="new-session-title"
                placeholder={t('session.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('session.cancel')}
            </Button>
            <Button onClick={handleStart} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('session.starting')}
                </>
              ) : (
                t('session.startSession')
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
