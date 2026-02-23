import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Heart, Church, ChevronRight, Building2, Sparkles, Target, Flame, Trophy, Gem } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { useEventTracking } from "@/hooks/useEventTracking";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { motion, AnimatePresence } from "framer-motion";

// COMPRESSED ONBOARDING: 2 steps max (assessment → first win)
type OnboardingStep = "assessment" | "go";

const roles = [
  {
    value: "teacher",
    label: "Teach Others",
    description: "I want to lead Bible studies",
    icon: BookOpen,
  },
  {
    value: "student",
    label: "Learn Deeper",
    description: "I want to understand Scripture",
    icon: Target,
  },
  {
    value: "personal",
    label: "Personal Growth",
    description: "I want to grow spiritually",
    icon: Heart,
  },
  {
    value: "church_leader",
    label: "Equip My Church",
    description: "I lead a congregation",
    icon: Church,
  }
];

export default function Onboarding() {
  const [step, setStep] = useState<OnboardingStep>("assessment");
  const { t } = useTranslation();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { trackOnboardingStep, trackEvent } = useEventTracking();
  const { updatePreference } = useUserPreferences();

  useEffect(() => {
    trackEvent({ eventType: "onboarding_started" });
  }, []);

  useEffect(() => {
    trackOnboardingStep(step === "assessment" ? 1 : 2, step);
  }, [step]);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleGo = async () => {
    try {
      if (user && selectedRole) {
        // Save role
        await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: selectedRole as any });

        await supabase
          .from("profiles")
          .update({ 
            primary_role: selectedRole,
            onboarding_step: 100,
            onboarding_completed: true,
          })
          .eq("id", user.id);
      }
      
      localStorage.setItem("onboarding_completed", "true");
      updatePreference("onboarding_completed", true);
      
      toast({
        title: t('onboarding.letsGo'),
        description: t('onboarding.firstWinAwaits'),
      });
      
      // Go directly to first win experience
      navigate("/palace/floor/1/room/24fps");
    } catch (error) {
      console.error("Error saving onboarding:", error);
      navigate("/palace/floor/1/room/24fps");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("onboarding_completed", "true");
    updatePreference("onboarding_completed", true);
    navigate("/palace");
  };

  return (
    <div className="min-h-screen gradient-dreamy flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <Progress value={step === "assessment" ? 50 : 100} className="h-2 mb-4" />
          <div className="mx-auto w-16 h-16 rounded-full gradient-palace flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {step === "assessment" ? t('onboarding.whatBringsYou') : t('onboarding.readyFirstWin')}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {step === "assessment"
              ? t('onboarding.pickOne')
              : t('onboarding.seeBible')}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            {step === "assessment" && (
              <motion.div
                key="assessment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  {roles.map((role) => {
                    const RoleIcon = role.icon;
                    const isSelected = selectedRole === role.value;
                    
                    return (
                      <button
                        key={role.value}
                        onClick={() => handleRoleSelect(role.value)}
                        className={`p-4 rounded-lg border-2 transition-all text-left hover:border-primary/50 ${
                          isSelected 
                            ? "border-primary bg-primary/10 shadow-lg" 
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isSelected ? "bg-primary/20" : "bg-muted"}`}>
                            <RoleIcon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <div className="font-semibold">{t('onboarding.role_' + role.value)}</div>
                            <div className="text-xs text-muted-foreground">{t('onboarding.role_' + role.value + '_desc')}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="ghost" onClick={handleSkip}>
                    {t('common.skip')}
                  </Button>
                  <Button 
                    onClick={() => setStep("go")} 
                    disabled={!selectedRole}
                    size="lg"
                  >
                    {t('common.continue')}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "go" && (
              <motion.div
                key="go"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Identity Hooks Preview */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">{t('onboarding.dayStreak')}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <Trophy className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">{t('onboarding.xpPoints')}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                    <Gem className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold">0</div>
                    <div className="text-xs text-muted-foreground">{t('onboarding.gemsSaved')}</div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium mb-1">{t('onboarding.firstWin')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('onboarding.firstWinDesc')}
                  </p>
                </div>

                <Button 
                  onClick={handleGo} 
                  size="lg" 
                  className="w-full gradient-palace text-white shadow-lg"
                >
                  {t('onboarding.startFirstWin')}
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  {t('onboarding.takesAbout')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
