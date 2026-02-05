import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
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

  const { trackCheckoutAbandoned, trackAccountCreated, trackCheckoutRedirect, trackExternalMembershipDetected } = useEventTracking();

  // Show message if trial checkout was cancelled and track abandonment
  useEffect(() => {
    if (trialCancelled) {
      trackCheckoutAbandoned('user_cancelled_stripe');
      toast.info("Your trial signup was cancelled. To access the Palace, please complete the signup with your card details.", {
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
    console.log("[Auth] Attempting login for:", email);

    // Check and clear storage if needed before login
    const storageCheck = ensureStorageSpace();
    if (!storageCheck.success) {
      setError(getStorageErrorMessage());
      setLoading(false);
      return;
    }
    if (storageCheck.cleared > 0) {
      console.log(`[Auth] Cleared ${storageCheck.cleared} cached items to free storage`);
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: loginPassword,
      });

      console.log("[Auth] Login response - User:", data?.user?.email ?? "none", "Session:", data?.session ? "exists" : "none", "Error:", error?.message ?? "none");

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setError(
            "Invalid email or password. If you signed up with Google/Microsoft/Facebook, use that button or reset your password to set one."
          );
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please confirm your email address before logging in.");
        } else {
          setError(error.message);
        }
        return;
      }

      // Verify session was created
      try {
        const { data: sessionCheck } = await supabase.auth.getSession();
        console.log("[Auth] Post-login session check:", sessionCheck?.session?.user?.email ?? "NO SESSION");
      } catch (sessionErr) {
        console.warn("[Auth] Session check failed (non-critical):", sessionErr);
      }

      // Save email only if remember me is checked (never store passwords)
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Clean up any legacy password storage
      localStorage.removeItem("rememberedPassword");

      toast.success("Welcome back!");
      // Don't navigate here; once auth state updates, the effect above will route
      // to either the requested redirect target or the normal Gatehouse/Dashboard flow.
    } catch (err: any) {
      console.error("[Auth] Login error:", err);
      if (isQuotaError(err)) {
        setError(getStorageErrorMessage());
      } else {
        const errorMessage = err?.message || err?.toString() || "Unknown error";
        setError(`Login failed: ${errorMessage}`);
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
        redirectTo: `${window.location.origin}/auth`,
      });

      if (error) {
        setError(error.message || "Failed to send reset email");
        return;
      }

      toast.success("Password reset email sent! Check your inbox.");
      setShowPasswordReset(false);
      setResetEmail("");
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
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
          setError("Invalid referral code format");
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
          setError("This email is already registered. Please login instead.");
        } else if (error.message.includes("invalid email")) {
          setError("Please enter a valid email address.");
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

        toast.success("Account created! Redirecting to start your free trial...");
        
        // UNIFIED SIGNUP + TRIAL FLOW: Immediately redirect to Stripe checkout
        // Users MUST enter credit card to complete signup - it's one process
        try {
          // Check for external membership first (Patreon, Pickaxe, Teachable)
          const [patreonResult, pickaxeResult, teachableResult] = await Promise.all([
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

          // Grant access if external membership found
          if (patreonResult.data?.is_active_patron && patreonResult.data.entitled_cents >= 1500) {
            trackExternalMembershipDetected('patreon');
            await supabase.from("profiles").update({
              subscription_status: "active",
              subscription_tier: "premium",
              payment_source: "patreon",
              updated_at: new Date().toISOString(),
            }).eq("id", data.user.id);
            toast.success("Your Patreon membership has been linked!");
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
            toast.success("Your Pickaxe membership has been linked!");
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
            toast.success("Your Teachable membership has been linked!");
            navigate("/gatehouse", { replace: true });
            return;
          }

          // No external membership - redirect to Stripe checkout for 7-day trial
          // Track checkout redirect - STEP 2 of checkout funnel
          trackCheckoutRedirect('premium', 'monthly');

          const { data: checkoutData, error: checkoutError } = await supabase.functions.invoke('create-trial-checkout', {
            body: { plan: 'premium', billing: 'monthly' },
          });

          if (checkoutError) throw checkoutError;

          if (checkoutData?.url) {
            // Redirect to Stripe checkout - signup is not complete without payment info
            window.location.href = checkoutData.url;
            return;
          }
        } catch (checkoutErr) {
          console.error("Failed to create checkout session:", checkoutErr);
          // Fallback to pricing page if checkout creation fails
          toast.error("Could not start trial. Please try again on the pricing page.");
          navigate("/pricing?trial=true", { replace: true });
        }
      } else if (data.user && !data.session) {
        // Celebrate with confetti!
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#E5DEFF']
        });
        toast.success("Account created! Please check your email to verify your account.");
      } else {
        setError("Account creation failed. This email may already be registered. Please try logging in instead.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (isQuotaError(err)) {
        setError(getStorageErrorMessage());
      } else {
        setError("An unexpected error occurred. Please try again.");
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
      setError("Failed to connect to Patreon. Please try again.");
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
          <p className="text-muted-foreground">The Palace of Biblical Wisdom</p>
        </Link>

        {/* Patreon Connection Mode */}
        {isPatreonMode && (
          <Card className="glass-card mb-4 border-primary/30">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-2">
                <Crown className="h-10 w-10 text-amber-500" />
              </div>
              <CardTitle className="text-xl">
                {user ? "Connect Your Patreon" : "Welcome, Patron!"}
              </CardTitle>
              <CardDescription>
                {user 
                  ? "Link your Patreon account to unlock your full Patron benefits"
                  : "Connect your Patreon account to unlock your full access benefits"
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
                    Connecting...
                  </>
                ) : (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    Connect Patreon Account
                  </>
                )}
              </Button>
              {!user && (
                <p className="text-xs text-center text-muted-foreground">
                  Already have an account? Log in first, then connect your Patreon.
                </p>
              )}
              {user && (
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => navigate("/dashboard")}
                >
                  Back to Dashboard
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
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              {showPasswordReset ? (
                <form onSubmit={handlePasswordReset}>
                  <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                      Enter your email to receive a password reset link
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
                        Email
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
                          Sending...
                        </>
                      ) : (
                        "Send Reset Link"
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
                      Back to Login
                    </Button>
                  </CardFooter>
                </form>
              ) : (
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                      Login to continue your journey through the Palace
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
                          Or continue with email
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
                        Email
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
                        Password
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
                          Remember me
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
                        Forgot password?
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
                          Logging in...
                        </>
                      ) : (
                        "Login"
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
                  <CardTitle>Start Your 7-Day Free Trial</CardTitle>
                  <CardDescription>
                    Full access to the Phototheology Palace
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
                        Or sign up with email
                      </span>
                    </div>
                  </div>

                  {/* Trial Pricing Banner - Show pricing upfront */}
                  <div className="bg-gradient-to-r from-primary/10 via-accent/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown className="h-5 w-5 text-primary" />
                      <span className="font-semibold text-foreground">Premium Access</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">7 days free</span>, then $15/month
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        Card required to start trial • Cancel anytime • No charge until day 8
                      </p>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">
                      <User className="h-4 w-4 inline mr-2" />
                      Display Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Your Name"
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
                      Email
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
                      Password
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
                      Must be at least 6 characters
                    </p>
                  </div>
                  {referralCode && (
                    <Alert>
                      <AlertDescription className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        You're joining with a referral! You'll get 7 days free trial.
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
                        Creating account...
                      </>
                    ) : (
                      "Start Free Trial →"
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
              Want to try first? Explore the free demo →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
