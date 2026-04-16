import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Grid3x3,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function SeriesPresenter() {
  const { t } = useTranslation();
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showOverview, setShowOverview] = useState(false);

  useEffect(() => {
    loadData();
  }, [seriesId]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevious();
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          exitFullscreen();
        } else {
          handleExit();
        }
      } else if (e.key === "f" || e.key === "F") {
        toggleFullscreen();
      } else if (e.key === "o" || e.key === "O") {
        setShowOverview(!showOverview);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentIndex, isFullscreen, showOverview]);

  const loadData = async () => {
    try {
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('id', seriesId)
        .single();

      if (seriesError) throw seriesError;
      setSeries(seriesData);

      const { data: lessonsData, error: lessonsError } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', seriesId)
        .order('lesson_number', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);
    } catch (error: any) {
      console.error('Error loading presentation:', error);
      toast.error(t('series.errorLoadSeries'));
      navigate('/series-builder');
    }
  };

  const handleNext = () => {
    if (currentIndex < lessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleExit = () => {
    navigate('/series-builder');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      exitFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };

  const jumpToLesson = (index: number) => {
    setCurrentIndex(index);
    setShowOverview(false);
  };

  if (!series || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">{t('series.loadingPresentation')}</p>
      </div>
    );
  }

  const currentLesson = lessons[currentIndex];

  if (showOverview) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Navigation />
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">{series.title}</h1>
              <p className="text-muted-foreground">{t('series.selectLessonToPresent')}</p>
            </div>
            <Button variant="outline" onClick={() => setShowOverview(false)}>
              <X className="h-4 w-4 mr-2" />
              {t('series.closeOverview')}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lessons.map((lesson, index) => (
              <Card
                key={lesson.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => jumpToLesson(index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-4xl font-bold text-primary opacity-20">
                      {lesson.lesson_number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {lesson.big_idea}
                      </p>
                      {lesson.key_passages && (
                        <Badge variant="outline" className="mt-2">
                          {lesson.key_passages}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex flex-col">
      <Navigation />
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleExit}>
            <X className="h-4 w-4 mr-2" />
            {t('common.exit')}
          </Button>
          <div className="hidden md:block text-sm text-muted-foreground">
            {series.title}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {t('series.lessonOf', { current: currentLesson.lesson_number, total: lessons.length })}
          </Badge>
          
          <Button variant="ghost" size="sm" onClick={() => setShowOverview(true)}>
            <Grid3x3 className="h-4 w-4 mr-2" />
            {t('series.overview')}
          </Button>

          <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div className="max-w-5xl w-full space-y-8 animate-in fade-in duration-500">
          {/* Lesson Title */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                {t('series.lessonNumber', { number: currentLesson.lesson_number })}
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-palace bg-clip-text text-transparent">
              {currentLesson.title}
            </h1>
            {currentLesson.big_idea && (
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                {currentLesson.big_idea}
              </p>
            )}
          </div>

          {/* Key Passages */}
          {currentLesson.key_passages && (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-lg">{t('series.keyPassages')}</h3>
              </div>
              <p className="text-lg text-muted-foreground">{currentLesson.key_passages}</p>
            </div>
          )}

          {/* Core Points */}
          {currentLesson.core_points && currentLesson.core_points.length > 0 && (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">{t('series.corePoints')}</h3>
              <ul className="space-y-3">
                {currentLesson.core_points.map((point: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-lg pt-1">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Discussion Questions */}
          {currentLesson.discussion_questions && currentLesson.discussion_questions.length > 0 && (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">{t('series.discussionQuestions')}</h3>
              <ul className="space-y-3">
                {currentLesson.discussion_questions.map((question: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="text-primary text-2xl font-bold">?</div>
                    <p className="text-lg pt-1">{question}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Christ Emphasis */}
          {currentLesson.christ_emphasis && (
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
              <h3 className="font-semibold text-lg mb-3 text-primary">{t('series.christEmphasis')}</h3>
              <p className="text-lg">{currentLesson.christ_emphasis}</p>
            </div>
          )}

          {/* Palace Activity */}
          {currentLesson.palace_activity && (
            <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border">
              <h3 className="font-semibold text-lg mb-3">{t('series.palaceActivity')}</h3>
              <p className="text-lg">{currentLesson.palace_activity}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between p-4 border-t bg-card/50 backdrop-blur-sm">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {t('common.previous')}
        </Button>

        <div className="flex items-center gap-2">
          {lessons.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-primary w-8' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        <Button
          variant="outline"
          onClick={handleNext}
          disabled={currentIndex === lessons.length - 1}
        >
          {t('common.next')}
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-20 right-4 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm rounded-lg p-3 border">
        <div className="space-y-1">
          <div><kbd className="px-2 py-1 bg-muted rounded">←</kbd> {t('common.previous')}</div>
          <div><kbd className="px-2 py-1 bg-muted rounded">→</kbd> / <kbd className="px-2 py-1 bg-muted rounded">Space</kbd> {t('common.next')}</div>
          <div><kbd className="px-2 py-1 bg-muted rounded">F</kbd> {t('series.fullscreen')}</div>
          <div><kbd className="px-2 py-1 bg-muted rounded">O</kbd> {t('series.overview')}</div>
          <div><kbd className="px-2 py-1 bg-muted rounded">Esc</kbd> {t('common.exit')}</div>
        </div>
      </div>
    </div>
  );
}
