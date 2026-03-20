import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Sparkles, Mail, Lock, User, Loader2, Crown, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { z } from "zod";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import { AuthSocialProof } from "@/components/auth/AuthSocialProof";
import { useEventTracking } from "@/hooks/useEventTracking";
import { usePaymentGate } from "@/hooks/usePaymentGate";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import { ensureStorageSpace, isQuotaError, getStorageErrorMessage } from "@/utils/storageManager";

const emailSchema = z.string().email("Please enter a valid email address").max(255, "Email is too long");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(128, "Password is too long");
const displayNameSchema = z.string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .regex(/^[a-zA-Z0-9\s\-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores");
const referralCodeSchema = z.string().trim().max(20).regex(/^[A-Z0-9]*$/).optional();

export default function Auth() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [patreonLoading, setPatreonLoading] = useState(false);
  const [error, setError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  
  const isPatreonMode = searchParams.get('patreon') === 'true';
  const trialCancelled = searchParams.get('trial') === 'cancelled';
  const redirectParam = searchParams.get('redirect');
  const safeRedirect = redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')
    ? redirectParam
    : null;
  const isChurchInvite = safeRedirect?.startsWith('/join-church') ?? false;

  const { trackCheckoutAbandoned, trackAccountCreated, trackCheckoutRedirect, trackExternalMembershipDetected } = useEventTracking();

  // Show message if trial checkout was cancelled and track abandonment
  useEffect(() => {
    if (trialCancelled) {
      trackCheckoutAbandoned('user_cancelled_stripe');
      toast.info(t('auth.trialCancelled'), {
        duration: 8000,
      });
    }
  }, [trialCancelled, trackCheckoutAbandoned]);

  // Redirect if already logged in (but NOT if in Patreon mode - let them connect)
  // We defer the gatehouse check to avoid Supabase deadlocks during auth state changes
  useEffect(() => {
    if (!user || isPatreonMode) return;

    // If we have an explicit redirect target, honor it immediately
    if (safeRedirect) {
      navigate(safeRedirect, { replace: true });
      return;
    }

    // Defer profile fetch to avoid potential deadlock with onAuthStateChange
    const checkGatehouseAndRedirect = async () => {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('has_entered_palace')
          .eq('id', user.id)
          .single();

        if (profile?.has_entered_palace) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/gatehouse", { replace: true });
        }
      } catch (err) {
        console.error("Error checking gatehouse status:", err);
        // Default to gatehouse on error
        navigate("/gatehouse", { replace: true });
      }
    };

    // Small timeout to ensure we're outside the auth state change callback
    const timer = setTimeout(checkGatehouseAndRedirect, 50);
    return () => clearTimeout(timer);
  }, [user, navigate, isPatreonMode, safeRedirect]);
  
  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Signup form
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupDisplayName, setSignupDisplayName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  
  // Password reset
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // Get referral code from URL and load saved email on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setReferralCode(ref);
    }

    // Load saved email only (never store passwords)
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setLoginEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const normalizeEmail = (email: string) => email.trim().toLowerCase();

  const validateEmail = (email: string) => {
    try {
      emailSchema.parse(normalizeEmail(email));
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      }
      return false;
    }
  };

  const validatePassword = (password: string) => {
    try {
      passwordSchema.parse(password);
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
      }
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(loginEmail) || !validatePassword(loginPassword)) {
      return;
    }

    const email = normalizeEmail(loginEmail);

    setLoading(true);

    // Check and clear storage if needed before login
    const storageCheck = ensureStorageSpace();
    if (!storageCheck.success) {
      setError(getStorageErrorMessage());
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError(t('auth.invalidCredentials'));
        } else if (error.message.includes("Email not confirmed")) {
          setError(t('auth.emailNotConfirmed'));
        } else {
          setError(error.message);
        }
        return;
      }

      // Save email only if remember me is checked (never store passwords)
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Clean up any legacy password storage
      localStorage.removeItem("rememberedPassword");

      toast.success(t('auth.welcomeBack'));
      // Don't navigate here; once auth state updates, the effect above will route
      // to either the requested redirect target or the normal Gatehouse/Dashboard flow.
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      if (isQuotaError(err)) {
        setError(getStorageErrorMessage());
      } else {
        const errorMessage = err?.message || err?.toString() || "Unknown error";
        setError(t('auth.loginFailed', { error: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(resetEmail)) {
      return;
    }

    const email = normalizeEmail(resetEmail);

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message || t('auth.resetFailed'));
        return;
      }

      toast.success(t('auth.resetEmailSent'));
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (err) {
      setError(t('errors.tryAgain'));
      console.error("Password reset error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(signupEmail) || !validatePassword(signupPassword)) {
      return;
    }

    // Validate display name
    try {
      displayNameSchema.parse(signupDisplayName);
    } catch (e) {
      if (e instanceof z.ZodError) {
        setError(e.errors[0].message);
        return;
      }
    }

    // Validate referral code if provided
    if (referralCode) {
      try {
        referralCodeSchema.parse(referralCode);
      } catch (e) {
        if (e instanceof z.ZodError) {
          setError(t('auth.invalidReferralCode'));
          return;
        }
      }
    }

    const email = normalizeEmail(signupEmail);

    setLoading(true);

    // Check and clear storage if needed before signup
    const storageCheck = ensureStorageSpace();
    if (!storageCheck.success) {
      setError(getStorageErrorMessage());
      setLoading(false);
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/`;

      const { data, error } = await supabase.auth.signUp({
        email,
        password: signupPassword,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: signupDisplayName,
            referral_code: referralCode || null,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered") || error.message.includes("User already registered")) {
          setError(t('auth.emailAlreadyRegistered'));
        } else if (error.message.includes("invalid email")) {
          setError(t('auth.invalidEmailAddress'));
        } else {
          setError(error.message);
        }
        return;
      }

      // Check if user was created (not just "fake" success for existing email)
      if (data.user && data.session) {
        // Track account creation - STEP 1 of checkout funnel
        trackAccountCreated('email', { has_referral: !!referralCode });

        // Send signup notification (pending trial - card not yet verified)
        try {
          await supabase.functions.invoke("send-signup-notification", {
            body: {
              userEmail: email,
              displayName: signupDisplayName,
              userId: data.user.id,
              subscriptionTier: 'pending', // User created but not yet completed checkout
            },
          });
        } catch (notifError) {
          console.error("Failed to send signup notification:", notifError);
        }

        // Celebrate with confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF']
        });

        toast.success(t('auth.accountCreatedRedirecting'));
        
        // UNIFIED SIGNUP + TRIAL FLOW
        // Before asking for credit card, check if user is pre-approved or has external membership
        try {
          // Small delay to let DB triggers fire (pending_lifetime_grants, church_preapproved_members)
          await new Promise(resolve => setTimeout(resolve, 500));

          // 1. Re-read profile — triggers may have already granted lifetime/church access
          const { data: freshProfile } = await supabase
            .from("profiles")
            .select("has_lifetime_access, subscription_status, subscription_tier")
            .eq("id", data.user.id)
            .single();

          if (freshProfile?.has_lifetime_access || 
              (freshProfile?.subscription_status === "active" && freshProfile?.subscription_tier)) {
            trackExternalMembershipDetected('patreon'); // pre-approved via trigger
            toast.success("Welcome! Your access has been activated automatically.");
            navigate("/gatehouse", { replace: true });
            return;
          }

          // 2. Check for external memberships (Church, Patreon, Pickaxe, Teachable)
          const [churchResult, patreonResult, pickaxeResult, teachableResult] = await Promise.all([
            supabase.rpc("has_church_access", { _user_id: data.user.id }),
            supabase.from("patreon_connections")
              .select("is_active_patron, entitled_cents")
              .eq("user_id", data.user.id)
              .maybeSingle(),
            supabase.from("pickaxe_connections")
              .select("is_paid_user")
              .eq("pickaxe_email", email.toLowerCase())
              .eq("is_paid_user", true)
              .maybeSingle(),
            supabase.from("teachable_students")
              .select("is_active")
              .eq("user_id", data.user.id)
              .eq("is_active", true)
              .maybeSingle(),
          ]);

          // Grant access if church membership found (pre-approved member auto-joined by trigger)
          if (churchResult.data && churchResult.data.length > 0 && churchResult.data[0].has_access) {
            await supabase.from("profiles").update({
              subscription_status: "active",
              subscription_tier: churchResult.data[0].church_tier || "premium",
              payment_source: "church" as any,
              updated_at: new Date().toISOString(),
            }).eq("id", data.user.id);
            toast.success(t('auth.churchMemberLinked', { defaultValue: 'Church membership verified! Welcome aboard.' }));
            navigate("/gatehouse", { replace: true });
            return;
          }

          // Grant access if external membership found
          if (patreonResult.data?.is_active_patron && patreonResult.data.entitled_cents >= 1500) {
            trackExternalMembershipDetected('patreon');
            await supabase.from("profiles").update({
              subscription_status: "active",
              subscription_tier: "premium",
              payment_source: "patreon",
              updated_at: new Date().toISOString(),
            }).eq("id", data.user.id);
            toast.success(t('auth.patreonLinked'));
            navigate("/gatehouse", { replace: true });
            return;
          }

          if (pickaxeResult.data?.is_paid_user) {
            trackExternalMembershipDetected('pickaxe');
            await supabase.from("profiles").update({
              subscription_status: "active",
              subscription_tier: "premium",
              payment_source: "pickaxe" as any,
              updated_at: new Date().toISOString(),
            }).eq("id", data.user.id);
            toast.success(t('auth.pickaxeLinked'));
            navigate("/gatehouse", { replace: true });
            return;
          }

          if (teachableResult.data?.is_active) {
            trackExternalMembershipDetected('teachable');
            await supabase.from("profiles").update({
              subscription_status: "active",
              subscription_tier: "student",
              payment_source: "teachable" as any,
              updated_at: new Date().toISOString(),
            }).eq("id", data.user.id);
            toast.success(t('auth.teachableLinked'));
            navigate("/gatehouse", { replace: true });
            return;
          }

          // No pre-approved or external membership
          // EXPLORE-FIRST FLOW: Let user explore the Palace before requiring payment
          // The IncompleteSignupPrompt modal will gently prompt them to complete checkout
          // after they've had a chance to see the value of the platform
          trackCheckoutRedirect('premium', 'monthly');
          
          toast.success("Welcome to the Palace! Take a look around — we'll help you set up your trial shortly.");
          navigate("/gatehouse", { replace: true });
        } catch (checkoutErr) {
          console.error("Failed during signup flow:", checkoutErr);
          toast.success("Welcome! Head to the Palace to get started.");
          navigate("/gatehouse", { replace: true });
        }
      } else if (data.user && !data.session) {
        // Celebrate with confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF']
        });
        toast.success(t('auth.accountCreatedVerify'));
      } else {
        setError(t('auth.accountCreationFailed'));
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (isQuotaError(err)) {
        setError(getStorageErrorMessage());
      } else {
        setError(t('errors.tryAgain'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePatreonConnect = async () => {
    setPatreonLoading(true);
    setError("");

    try {
      // Use canonical domain for Patreon OAuth to avoid redirect URI mismatches across domains
      const redirectUri = "https://phototheology.app/patreon-callback";

      const { data, error: fnError } = await supabase.functions.invoke("patreon-auth", {
        body: { redirectUri, userId: user?.id },
      });
      
      if (fnError) throw fnError;
      
      if (data?.authUrl) {
        window.location.href = data.authUrl;
      } else {
        throw new Error("Failed to get Patreon authorization URL");
      }
    } catch (err) {
      console.error("Patreon connect error:", err);
      setError(t('auth.patreonConnectFailed'));
      setPatreonLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-dreamy p-4">
      <div className="w-full max-w-md">
        {/* Logo Header */}
        <Link to="/" className="block text-center mb-8 group">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="relative">
              <Building2 className="h-12 w-12 text-primary transition-transform group-hover:scale-110" />
              <Sparkles className="h-5 w-5 text-accent absolute -top-1 -right-1 animate-pulse-glow" />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold bg-gradient-palace bg-clip-text text-transparent mb-2">
            Phototheology
          </h1>
          <p className="text-muted-foreground">{t('auth.palaceSubtitle')}</p>
        </Link>

        {/* Patreon Connection Mode */}
        {isPatreonMode && (
          <Card className="glass-card mb-4 border-primary/30">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Crown className="h-10 w-10 text-amber-500" />
              </div>
              <CardTitle className="text-xl">
                {user ? t('auth.connectPatreon') : t('auth.welcomePatron')}
              </CardTitle>
              <CardDescription>
                {user
                  ? t('auth.linkPatreonBenefits')
                  : t('auth.connectPatreonAccess')
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button
                onClick={handlePatreonConnect}
                disabled={patreonLoading}
                className="w-full bg-[#FF424D] hover:bg-[#E63946] text-white"
                size="lg"
              >
                {patreonLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('auth.connecting')}
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    {t('auth.connectPatreonAccount')}
                  </>
                )}
              </Button>
              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  {t('auth.logInFirstPatreon')}
                </p>
              )}
              {user && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  {t('nav.backToDashboard')}
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Hide login/signup form if user is logged in and in Patreon mode */}
        {!(user && isPatreonMode) && (
        <Card className="glass-card">
          <Tabs defaultValue="login" className="w-full" onValueChange={() => setShowPasswordReset(false)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('common.login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('common.signup')}</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              {showPasswordReset ? (
                <form onSubmit={handlePasswordReset}>
                  <CardHeader>
                    <CardTitle>{t('auth.resetPassword')}</CardTitle>
                    <CardDescription>
                      {t('auth.resetDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">
                        <Mail className="h-4 w-4 inline mr-2" />
                        {t('auth.email')}
                      </Label>
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="your@email.com"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      type="submit" 
                      className="w-full gradient-palace" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.sending')}
                        </>
                      ) : (
                        t('auth.sendResetLink')
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setShowPasswordReset(false);
                        setResetEmail("");
                        setError("");
                      }}
                      disabled={loading}
                    >
                      {t('auth.backToLogin')}
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>{t('auth.welcomeBack')}</CardTitle>
                    <CardDescription>
                      {t('auth.loginDescription')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Google Sign In - Primary CTA */}
                    <GoogleSignInButton />
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">
                          {t('auth.orContinueWithEmail')}
                        </span>
                      </div>
                    </div>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="login-email">
                        <Mail className="h-4 w-4 inline mr-2" />
                        {t('auth.email')}
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">
                        <Lock className="h-4 w-4 inline mr-2" />
                        {t('auth.password')}
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          disabled={loading}
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          disabled={loading}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="remember-me"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-input"
                          disabled={loading}
                        />
                        <Label htmlFor="remember-me" className="text-sm font-normal cursor-pointer">
                          {t('auth.rememberMe')}
                        </Label>
                      </div>
                      <Button
                        type="button"
                        variant="link"
                        className="px-0 text-sm text-primary hover:text-primary/80 font-medium"
                        onClick={() => {
                          setShowPasswordReset(true);
                          setError("");
                        }}
                        disabled={loading}
                      >
                        {t('auth.forgotPassword')}
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="w-full gradient-palace" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('auth.loggingIn')}
                        </>
                      ) : (
                        t('common.login')
                      )}
                    </Button>
                  </CardFooter>
                </form>
              )}
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <CardHeader>
                  <CardTitle>
                    {isChurchInvite 
                      ? t('auth.createYourAccount', { defaultValue: 'Create Your Account' })
                      : t('auth.startFreeTrial')
                    }
                  </CardTitle>
                  <CardDescription>
                    {isChurchInvite
                      ? t('auth.churchMemberWelcome', { defaultValue: 'Your church has invited you. Create an account to get started.' })
                      : t('auth.fullAccess')
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Google Sign In - Primary CTA */}
                  <GoogleSignInButton />
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        {t('auth.orSignUpWithEmail')}
                      </span>
                    </div>
                  </div>

                  {/* Trial Pricing Banner - Show pricing upfront (hidden for church invites) */}
                  {isChurchInvite ? (
                    <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="h-5 w-5 text-green-600" />
                        <span className="font-semibold text-foreground">{t('auth.churchMemberAccess', { defaultValue: 'Church Member Access' })}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          {t('auth.churchMemberNoTrial', { defaultValue: 'Full access included with your church membership. No credit card required.' })}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-foreground">{t('auth.premiumAccess')}</span>
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">
                          <span className="font-medium text-foreground">{t('auth.sevenDaysFree')}</span>, {t('auth.thenPrice')}
                        </p>
                        <p className="text-xs text-muted-foreground/80">
                          {t('auth.trialTerms')}
                        </p>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      <User className="h-4 w-4 inline mr-2" />
                      {t('profile.displayName')}
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder={t('auth.yourName')}
                      value={signupDisplayName}
                      onChange={(e) => setSignupDisplayName(e.target.value)}
                      required
                      disabled={loading}
                      maxLength={50}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      {t('auth.email')}
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">
                      <Lock className="h-4 w-4 inline mr-2" />
                      {t('auth.password')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showSignupPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        disabled={loading}
                      >
                        {showSignupPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t('auth.passwordMinHint')}
                    </p>
                  </div>
                  {referralCode && (
                    <Alert>
                      <AlertDescription className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        {t('auth.referralJoining')}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button 
                    type="submit" 
                    className="w-full gradient-palace" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('auth.creatingAccount')}
                      </>
                    ) : (
                      isChurchInvite
                        ? t('auth.createAccountButton', { defaultValue: 'Create Account →' })
                        : t('auth.startFreeTrialButton')
                    )}
                  </Button>
                  <AuthSocialProof />
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
        )}

        {/* Try Demo Link - hide for logged in users in Patreon mode */}
        {!(user && isPatreonMode) && (
          <div className="text-center mt-4">
            <Button
              variant="link"
              onClick={() => navigate("/interactive-demo")}
              className="text-muted-foreground hover:text-primary"
            >
              {t('auth.tryDemoLink')}
            </Button>
          </div>
        )}

        {/* Language Selector */}
        <div className="mt-4 max-w-[200px] mx-auto">
          <LanguageSelector showLabel={false} />
        </div>
      </div>
    </div>
  );
}
