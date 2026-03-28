import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventTracking } from "@/hooks/useEventTracking";
import {
  Download,
  CheckCircle,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function QuickStartSuccess() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { trackPurchaseCompleted } = useEventTracking();

  // Track purchase and send email on page load
  useEffect(() => {
    trackPurchaseCompleted("quick-start-guide", 17);
    
    // Track Facebook Pixel Purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: 17.00,
        currency: 'USD',
        content_name: 'Quick-Start Guide',
        content_type: 'product',
        content_ids: ['quick-start-guide'],
      });
    }
    
    // Send product email
    const sendProductEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const customerEmail = urlParams.get('email');
      const customerName = urlParams.get('name');
      
      if (customerEmail && !emailSent) {
        try {
          const { error } = await supabase.functions.invoke('send-product-email', {
            body: { 
              email: customerEmail,
              name: customerName || undefined,
              product: 'quick-start-guide'
            }
          });
          
          if (!error) {
            setEmailSent(true);
            console.log('Product email sent successfully');
          }
        } catch (err) {
          console.error('Failed to send product email:', err);
        }
      }
    };
    
    sendProductEmail();
  }, [trackPurchaseCompleted, emailSent]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-product-download', {
        body: { product: 'quick-start-guide' }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Download started!");
      } else {
        throw new Error("No download URL received");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again or contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Thank You | Quick-Start Guide"
        description="Your PhotoTheology Quick-Start Guide is ready for download."
      />
      <Navigation />

      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-background to-primary/5" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </motion.div>

            <Badge variant="outline" className="text-green-600 border-green-500/30">
              Purchase Complete
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold">
              Thank You for Your Purchase
            </h1>

            <p className="text-xl text-muted-foreground">
              Your PhotoTheology Quick-Start Guide is ready for download.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-xl mx-auto"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8 text-center space-y-6">
                <BookOpen className="w-12 h-12 text-primary mx-auto" />

                <div>
                  <h2 className="text-2xl font-bold mb-2">PhotoTheology Quick-Start Guide</h2>
                  <p className="text-muted-foreground">
                    Your orientation to the Palace framework
                  </p>
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full text-lg py-6 h-auto"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download PDF
                    </>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground">
                  Click the button above to download your PDF.
                  You can return to this page anytime from your purchase confirmation email.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <h2 className="text-2xl font-bold">Ready for the Next Level?</h2>
            <p className="text-muted-foreground">
              Once you've oriented yourself with the Quick-Start Guide, PhototheologyOS
              provides complete method training for all 8 Floors of the Palace.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/study-suite">
                Explore PhototheologyOS
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
