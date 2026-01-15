import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventTracking } from "@/hooks/useEventTracking";
import {
  Download,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Layers,
  Building2,
  Sparkles,
  Clock,
  Users,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function BibleProphecyGuideSuccess() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { trackPurchaseCompleted } = useEventTracking();

  // Track purchase and send email on page load
  useEffect(() => {
    trackPurchaseCompleted("genesis-6-days", 9);
    
    // Send product email - get email from URL params or skip
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
              product: 'genesis-6-days'
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
        body: { product: 'genesis-6-days' }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Your download has started!");
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Download failed. Please contact support.");
    } finally {
      setIsDownloading(false);
    }
  };

  const palacePreview = [
    { floor: "1st Floor", name: "Furnishing Floor", description: "Memory & visualization for width" },
    { floor: "2nd Floor", name: "Investigation Floor", description: "Detective work for precision" },
    { floor: "3rd Floor", name: "Freestyle Floor", description: "Daily connections for time" },
    { floor: "4th Floor", name: "Next Level Floor", description: "Christ-centered depth" },
    { floor: "5th Floor", name: "Vision Floor", description: "Prophecy & sanctuary" },
    { floor: "6th Floor", name: "Three Heavens Floor", description: "Cycles & cosmic context" },
    { floor: "7th Floor", name: "Spiritual Floor", description: "Transformation & fire" },
    { floor: "8th Floor", name: "Master Floor", description: "Reflexive mastery" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Download Your Genesis Guide | PhotoTheology"
        description="Your Genesis in 6 Days guide is ready. Download now and discover how to access the complete Palace training system."
      />
      <Navigation />

      {/* SUCCESS HERO */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>

            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
              Purchase Complete
            </Badge>

            <h1 className="text-3xl md:text-4xl font-bold">
              Your Genesis Guide is Ready
            </h1>

            <p className="text-muted-foreground">
              Thank you for your purchase. Click below to download your PDF.
            </p>

            <Card className="border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-lg">Genesis in 6 Days</h3>
                    <p className="text-sm text-muted-foreground">PDF Study Guide</p>
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full text-lg py-6 h-auto bg-gradient-to-r from-accent to-primary"
                >
                  {isDownloading ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Preparing Download...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Download Your PDF
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* THE BIGGER PICTURE - Subscription Seed */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <Badge variant="outline" className="text-primary border-primary/30">
                <Building2 className="w-3 h-3 mr-2" />
                You Just Entered One Room
              </Badge>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                The Palace Has 8 Floors & 40+ Rooms
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Genesis in 6 Days teaches you <strong className="text-foreground">one pattern</strong> from 
                the <strong className="text-foreground">Story Room</strong> on the 1st Floor. 
                But the Phototheology system is an entire Palace designed to transform how you study Scripture.
              </p>
            </motion.div>

            {/* Palace Preview Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {palacePreview.map((floor, index) => (
                <motion.div
                  key={floor.floor}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`h-full ${index === 0 ? 'border-accent ring-2 ring-accent/20' : 'border-border/50'}`}>
                    <CardContent className="p-4">
                      <p className="text-xs text-muted-foreground">{floor.floor}</p>
                      <h4 className="font-semibold text-sm mt-1">{floor.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{floor.description}</p>
                      {index === 0 && (
                        <Badge className="mt-2 text-xs bg-accent/10 text-accent border-accent/20">
                          You are here
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Trial CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-accent/5 overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-accent p-1" />
                <CardContent className="p-8 md:p-10">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                      <Badge className="bg-primary/10 text-primary border-primary/20">
                        <Sparkles className="w-3 h-3 mr-2" />
                        7-Day Free Trial
                      </Badge>
                      
                      <h3 className="text-2xl font-bold">
                        Ready to Explore the Entire Palace?
                      </h3>
                      
                      <p className="text-muted-foreground">
                        Get unlimited access to all 8 Floors, 40+ Rooms, interactive training, 
                        AI-guided study, and a community of serious Bible students.
                      </p>

                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          Full Palace access - all Floors unlocked
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          AI study companion (Jeeves)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-primary" />
                          Cancel anytime - no obligation
                        </li>
                      </ul>
                    </div>

                    <div className="text-center">
                      <div className="mb-4">
                        <p className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                          Free for 7 Days
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Then $9.99/month or $99/year
                        </p>
                      </div>

                      <Button
                        size="lg"
                        asChild
                        className="w-full text-lg py-6 h-auto shadow-lg shadow-primary/25"
                      >
                        <Link to="/pricing">
                          Start Free Trial
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                      </Button>

                      <p className="text-xs text-muted-foreground mt-3">
                        <Users className="w-3 h-3 inline mr-1" />
                        Join 2,000+ serious Bible students
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* WHAT HAPPENS NEXT */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-xl font-semibold">What to Do Next</h3>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <Card className="border-accent/20">
                <CardContent className="p-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">1</span>
                  </div>
                  <p className="text-muted-foreground">Download & read your Genesis guide</p>
                </CardContent>
              </Card>
              
              <Card className="border-accent/20">
                <CardContent className="p-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">2</span>
                  </div>
                  <p className="text-muted-foreground">Complete the 6-day study exercises</p>
                </CardContent>
              </Card>
              
              <Card className="border-accent/20">
                <CardContent className="p-4">
                  <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-accent font-bold">3</span>
                  </div>
                  <p className="text-muted-foreground">Start your 7-day trial to explore all Floors</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
