import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  ArrowRight, 
  X, 
  BookOpen, 
  MessageSquare,
  Target,
  Home,
  Loader2,
  Maximize,
  Minimize
} from "lucide-react";
import { QuickAudioButton } from "@/components/audio";

export default function SeriesPresentationMode() {
  const { seriesId } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    loadSeriesData();
  }, [seriesId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen();
        } else {
          navigate(`/series/${seriesId}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, currentLessonIndex, lessons, isFullscreen]);

  const loadSeriesData = async () => {
    try {
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('id', seriesId)
        .single();

      if (seriesError) throw seriesError;
      setSeries(seriesData);

      const { data: lessonData, error: lessonError } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', seriesId)
        .order('lesson_number');

      if (lessonError) throw lessonError;
      setLessons(lessonData || []);
    } catch (error) {
      console.error('Error loading series:', error);
      toast.error('Failed to load series');
    } finally {
      setLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const currentLesson = lessons[currentLessonIndex];

  interface SlideContent {
    title: string;
    subtitle?: string;
    passages?: string;
    text?: string;
    points?: string[];
    questions?: string[];
  }

  interface Slide {
    type: string;
    content: SlideContent;
  }

  // Generate slides for current lesson
  const generateSlides = (): Slide[] => {
    if (!currentLesson) return [];

    const slides: Slide[] = [
      // Title slide
      {
        type: 'title',
        content: {
          title: `Lesson ${currentLesson.lesson_number}`,
          subtitle: currentLesson.title,
          passages: currentLesson.key_passages
        }
      },
      // Big Idea slide
      {
        type: 'big-idea',
        content: {
          title: 'Big Idea',
          text: currentLesson.big_idea
        }
      }
    ];

    // Core points slides
    if (currentLesson.core_points?.length > 0) {
      slides.push({
        type: 'points',
        content: {
          title: 'Core Points',
          points: currentLesson.core_points
        }
      });
    }

    // Christ emphasis slide
    if (currentLesson.christ_emphasis) {
      slides.push({
        type: 'christ',
        content: {
          title: 'Christ Emphasis',
          text: currentLesson.christ_emphasis
        }
      });
    }

    // Discussion questions slides
    if (currentLesson.discussion_questions?.length > 0) {
      slides.push({
        type: 'questions',
        content: {
          title: 'Discussion Questions',
          questions: currentLesson.discussion_questions
        }
      });
    }

    // Palace activity slide
    if (currentLesson.palace_activity) {
      slides.push({
        type: 'activity',
        content: {
          title: 'Palace Activity',
          text: currentLesson.palace_activity
        }
      });
    }

    // Take home challenge slide
    if (currentLesson.take_home_challenge) {
      slides.push({
        type: 'challenge',
        content: {
          title: 'Take-Home Challenge',
          text: currentLesson.take_home_challenge
        }
      });
    }

    return slides;
  };

  const slides = generateSlides();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setCurrentSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    } else if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      const prevLessonSlides = generateSlides();
      setCurrentSlide(prevLessonSlides.length - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!series || lessons.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No lessons found for this series</p>
            <Button onClick={() => navigate(`/series/${seriesId}`)}>
              Back to Series
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const slide = slides[currentSlide];

  const renderSlide = () => {
    if (!slide) return null;

    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center space-y-6">
            <Badge variant="outline" className="text-lg px-4 py-1">
              {slide.content.title}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold">{slide.content.subtitle}</h1>
            {slide.content.passages && (
              <p className="text-2xl text-primary">{slide.content.passages}</p>
            )}
          </div>
        );

      case 'big-idea':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{slide.content.title}</h2>
              {slide.content.text && (
                <QuickAudioButton text={slide.content.text} variant="outline" size="sm" />
              )}
            </div>
            <p className="text-2xl leading-relaxed">{slide.content.text}</p>
          </div>
        );

      case 'points':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold">{slide.content.title}</h2>
            <ul className="space-y-4">
              {(slide.content.points || []).map((point: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-xl">
                  <span className="text-primary font-bold">{idx + 1}.</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case 'christ':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{slide.content.title}</h2>
              {slide.content.text && (
                <QuickAudioButton text={slide.content.text} variant="outline" size="sm" />
              )}
            </div>
            <p className="text-2xl leading-relaxed">{slide.content.text}</p>
          </div>
        );

      case 'questions':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold">{slide.content.title}</h2>
            </div>
            <ul className="space-y-4">
              {(slide.content.questions || []).slice(0, 4).map((q: string, idx: number) => (
                <li key={idx} className="text-xl">
                  <span className="text-primary mr-2">•</span>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        );

      case 'activity':
      case 'challenge':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold">{slide.content.title}</h2>
              {slide.content.text && (
                <QuickAudioButton text={slide.content.text} variant="outline" size="sm" />
              )}
            </div>
            <p className="text-2xl leading-relaxed">{slide.content.text}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" onClick={() => navigate(`/series/${seriesId}`)}>
          <X className="h-5 w-5 mr-2" />
          Exit
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {series.title}
          </Badge>
          <Badge variant="outline">
            Lesson {currentLessonIndex + 1} of {lessons.length}
          </Badge>
          <Badge variant="outline">
            Slide {currentSlide + 1} of {slides.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-4xl w-full">
          {renderSlide()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-4 border-t">
        <Button 
          variant="outline" 
          onClick={prevSlide}
          disabled={currentSlide === 0 && currentLessonIndex === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-2 h-2 rounded-full transition-colors ${
                idx === currentSlide ? 'bg-primary' : 'bg-muted'
              }`}
              onClick={() => setCurrentSlide(idx)}
            />
          ))}
        </div>

        <Button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1 && currentLessonIndex === lessons.length - 1}
        >
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
