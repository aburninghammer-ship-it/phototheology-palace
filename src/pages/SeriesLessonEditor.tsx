import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScriptureLookup } from "@/components/sermon/ScriptureLookup";
import { PTIntegrationPanel } from "@/components/sermon/PTIntegrationPanel";

export default function SeriesLessonEditor() {
  const { t } = useTranslation();
  const { seriesId, lessonNumber } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [series, setSeries] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [seriesId, lessonNumber]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load series info
      const { data: seriesData, error: seriesError } = await supabase
        .from('bible_study_series')
        .select('*')
        .eq('id', seriesId)
        .single();

      if (seriesError) throw seriesError;
      setSeries(seriesData);

      // Load lesson
      const { data: lessonData, error: lessonError } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', seriesId)
        .eq('lesson_number', parseInt(lessonNumber!))
        .single();

      if (lessonError) throw lessonError;
      setLesson(lessonData);
    } catch (error: any) {
      console.error('Error loading lesson:', error);
      toast.error(t('series.errorLoadLesson'));
    } finally {
      setLoading(false);
    }
  };

  const persistLesson = async () => {
    if (!lesson) return false;

    try {
      const { error } = await supabase
        .from('bible_study_lessons')
        .update({
          title: lesson.title,
          big_idea: lesson.big_idea,
          key_passages: lesson.key_passages,
          core_points: lesson.core_points,
          discussion_questions: lesson.discussion_questions,
          palace_activity: lesson.palace_activity,
          main_floors: lesson.main_floors,
          key_rooms: lesson.key_rooms,
          christ_emphasis: lesson.christ_emphasis,
          palace_mapping_notes: lesson.palace_mapping_notes,
          take_home_challenge: lesson.take_home_challenge
        })
        .eq('id', lesson.id);

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error('Error saving lesson:', error);
      toast.error(t('series.errorSaveLesson'));
      return false;
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const saved = await persistLesson();
      if (!saved) return;

      toast.success(t('series.lessonSaved'));
    } finally {
      setSaving(false);
    }
  };

  const handleFinalizeSeries = async () => {
    if (!seriesId) return;

    try {
      setFinalizing(true);

      const saved = await persistLesson();
      if (!saved) return;

      const { error } = await supabase
        .from('bible_study_series')
        .update({ status: 'published' })
        .eq('id', seriesId);

      if (error) throw error;

      setSeries((prev: any) => prev ? { ...prev, status: 'published' } : prev);
      toast.success('Series finalized successfully');
    } catch (error: any) {
      console.error('Error finalizing series:', error);
      toast.error('Failed to finalize series');
    } finally {
      setFinalizing(false);
    }
  };

  const updateLesson = (field: string, value: any) => {
    setLesson((prev: any) => ({ ...prev, [field]: value }));
  };

  const addArrayItem = (field: string) => {
    const currentArray = lesson[field] || [];
    updateLesson(field, [...currentArray, '']);
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const currentArray = [...lesson[field]];
    currentArray[index] = value;
    updateLesson(field, currentArray);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray = [...lesson[field]];
    currentArray.splice(index, 1);
    updateLesson(field, currentArray);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  if (!lesson || !series) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-muted-foreground">{t('series.lessonNotFound')}</p>
              <Button onClick={() => navigate(seriesId ? `/series/${seriesId}` : '/bible-study-series')} className="mt-4">
              {t('series.backToSeries')}
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate(seriesId ? `/series/${seriesId}` : '/bible-study-series')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('series.backToSeries')}
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold">{t('series.lessonNumber', { number: lessonNumber })}</h1>
                  <Badge variant="outline">{series.title}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{lesson.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {series.status !== 'published' && (
                <Button variant="outline" onClick={handleFinalizeSeries} disabled={saving || finalizing}>
                  {finalizing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Finalizing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Finalize Draft
                    </>
                  )}
                </Button>
              )}
              <Button onClick={handleSave} disabled={saving || finalizing}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.saving')}
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {t('common.saveChanges')}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Scripture & PT Tools */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('series.studyTools')}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <ScriptureLookup 
                onInsert={(text) => {
                  const current = lesson.key_passages || '';
                  updateLesson('key_passages', current ? `${current}\n${text}` : text);
                  toast.success(t('series.scriptureAdded'));
                }} 
              />
              <PTIntegrationPanel 
                onInsert={(text) => {
                  const current = lesson.palace_mapping_notes || '';
                  updateLesson('palace_mapping_notes', current ? `${current}\n\n${text}` : text);
                  toast.success(t('series.ptContentAdded'));
                }} 
              />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t('series.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('series.lessonTitle')}</Label>
                <Input
                  id="title"
                  value={lesson.title}
                  onChange={(e) => updateLesson('title', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bigIdea">{t('series.bigIdea')}</Label>
                <Textarea
                  id="bigIdea"
                  value={lesson.big_idea || ''}
                  onChange={(e) => updateLesson('big_idea', e.target.value)}
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="keyPassages">{t('series.keyPassages')}</Label>
                <Input
                  id="keyPassages"
                  value={lesson.key_passages || ''}
                  onChange={(e) => updateLesson('key_passages', e.target.value)}
                  placeholder="e.g., Genesis 3:15, John 14:6"
                />
              </div>
            </CardContent>
          </Card>

          {/* Core Points */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('series.corePoints')}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('core_points')}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('series.addPoint')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {(lesson.core_points || []).map((point: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={point}
                    onChange={(e) => updateArrayItem('core_points', index, e.target.value)}
                    placeholder={t('series.pointPlaceholder', { number: index + 1 })}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeArrayItem('core_points', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discussion Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t('series.discussionQuestions')}</CardTitle>
                <Button size="sm" variant="outline" onClick={() => addArrayItem('discussion_questions')}>
                  <Plus className="h-4 w-4 mr-1" />
                  {t('series.addQuestion')}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {(lesson.discussion_questions || []).map((question: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={question}
                    onChange={(e) => updateArrayItem('discussion_questions', index, e.target.value)}
                    placeholder={t('series.questionPlaceholder', { number: index + 1 })}
                    rows={2}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeArrayItem('discussion_questions', index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Palace Integration */}
          <Card>
            <CardHeader>
              <CardTitle>{t('series.palaceIntegration')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="christEmphasis">{t('series.christEmphasis')}</Label>
                <Textarea
                  id="christEmphasis"
                  value={lesson.christ_emphasis || ''}
                  onChange={(e) => updateLesson('christ_emphasis', e.target.value)}
                  rows={3}
                  placeholder={t('series.christEmphasisPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="palaceActivity">{t('series.palaceActivity')}</Label>
                <Textarea
                  id="palaceActivity"
                  value={lesson.palace_activity || ''}
                  onChange={(e) => updateLesson('palace_activity', e.target.value)}
                  rows={3}
                  placeholder={t('series.palaceActivityPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="palaceMappingNotes">{t('series.palaceMappingNotes')}</Label>
                <Textarea
                  id="palaceMappingNotes"
                  value={lesson.palace_mapping_notes || ''}
                  onChange={(e) => updateLesson('palace_mapping_notes', e.target.value)}
                  rows={3}
                  placeholder={t('series.palaceMappingPlaceholder')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Take-Home Challenge */}
          <Card>
            <CardHeader>
              <CardTitle>{t('series.takeHomeChallenge')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={lesson.take_home_challenge || ''}
                onChange={(e) => updateLesson('take_home_challenge', e.target.value)}
                rows={3}
                placeholder={t('series.takeHomeChallengePlaceholder')}
              />
            </CardContent>
          </Card>

          {/* Save Button (Bottom) */}
          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave} disabled={saving || finalizing}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('common.saveChanges')}
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
