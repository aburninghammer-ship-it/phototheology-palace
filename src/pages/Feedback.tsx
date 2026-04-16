import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, GraduationCap } from "lucide-react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { FEEDBACK_TOUR } from "@/data/guidedTours";
import { z } from "zod";
import { useTranslation } from "react-i18next";

const feedbackSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  description: z.string().trim().min(1, "Description is required").max(2000, "Description must be less than 2000 characters"),
  category: z.enum(["bug", "feature", "improvement"], { required_error: "Please select a category" })
});

const Feedback = () => {
  const { t } = useTranslation();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature");
  const [submitting, setSubmitting] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate input
    const validation = feedbackSchema.safeParse({ title, description, category });
    if (!validation.success) {
      toast({
        title: t('feedback.toasts.validationError'),
        description: validation.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from("feedback")
        .insert({
          user_id: user!.id,
          title: validation.data.title,
          description: validation.data.description,
          category: validation.data.category,
        });

      if (error) throw error;

      // Send email notification
      try {
        await supabase.functions.invoke('send-feedback-email', {
          body: {
            category: validation.data.category,
            title: validation.data.title,
            description: validation.data.description,
            userEmail: user?.email
          }
        });
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't fail the whole operation if email fails
      }

      toast({
        title: t('feedback.toasts.submitted'),
        description: t('feedback.toasts.submittedDescription'),
      });

      // Redirect to dashboard after successful submission
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <MessageCircle className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-5xl font-bold mb-4">{t('feedback.hero.title')}</h1>
          <p className="text-xl text-blue-100">
            {t('feedback.hero.subtitle')}
          </p>
          <Button variant="ghost" size="sm" onClick={() => { primeAudioForTour(); setTourOpen(true); }} className="mt-4 text-white/80 hover:text-white hover:bg-white/10 gap-1">
            <GraduationCap className="h-4 w-4" /> Guided Tour
          </Button>
        </div>
      </div>
      {tourOpen && <GuidedTourOverlay steps={FEEDBACK_TOUR} onClose={() => setTourOpen(false)} />}

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          <Card>
            <CardHeader>
              <CardTitle>{t('feedback.form.title')}</CardTitle>
              <CardDescription>
                {t('feedback.form.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('feedback.form.category')}</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bug">{t('feedback.form.categories.bug')}</SelectItem>
                      <SelectItem value="feature">{t('feedback.form.categories.feature')}</SelectItem>
                      <SelectItem value="improvement">{t('feedback.form.categories.improvement')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('feedback.form.titleLabel')}</label>
                  <Input
                    placeholder={t('feedback.form.titlePlaceholder')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('feedback.form.detailsLabel')}</label>
                  <Textarea
                    placeholder={t('feedback.form.detailsPlaceholder')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={submitting}>
                  {t('feedback.form.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Feedback;
