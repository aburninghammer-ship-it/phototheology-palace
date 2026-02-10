import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEventTracking } from "@/hooks/useEventTracking";
import {
  Download,
  CheckCircle,
  Building2,
  ArrowRight,
  Loader2,
  FileText,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface DownloadFile {
  name: string;
  url: string;
}

export default function StudySuiteSuccess() {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFiles, setDownloadFiles] = useState<DownloadFile[] | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const { trackPurchaseCompleted } = useEventTracking();

  // Track purchase and send email on page load
  useEffect(() => {
    trackPurchaseCompleted("study-suite", 97);
    
    // Track Facebook Pixel Purchase event
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        value: 97.00,
        currency: 'USD',
        content_name: 'Study Suite',
        content_type: 'product',
        content_ids: ['study-suite'],
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
              product: 'study-suite'
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
        body: { product: 'study-suite' }
      });

      if (error) throw error;

      if (data?.urls && Array.isArray(data.urls)) {
        // Multiple files - show download list
        setDownloadFiles(data.urls);
        toast.success(t('studySuccess.downloadsReady'));
      } else if (data?.url) {
        // Single file fallback
        window.open(data.url, '_blank');
        toast.success(t('studySuccess.downloadStarted'));
      } else {
        throw new Error("No download URL received");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(t('studySuccess.downloadFailed'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFileDownload = (url: string, name: string) => {
    window.open(url, '_blank');
    toast.success(t('studySuccess.downloadingFile', { name }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={t('studySuccess.seoTitle')}
        description={t('studySuccess.seoDescription')}
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
              {t('studySuccess.purchaseComplete')}
            </Badge>

            <h1 className="text-4xl md:text-5xl font-bold">
              {t('studySuccess.thankYou')}
            </h1>

            <p className="text-xl text-muted-foreground">
              {t('studySuccess.readyForDownload')}
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
                <Building2 className="w-12 h-12 text-primary mx-auto" />

                <div>
                  <h2 className="text-2xl font-bold mb-2">{t('studySuccess.studySuiteTitle')}</h2>
                  <p className="text-muted-foreground">
                    {t('studySuccess.completeMethodTraining')}
                  </p>
                </div>

                {!downloadFiles ? (
                  <>
                    <Button
                      size="lg"
                      onClick={handleDownload}
                      disabled={isDownloading}
                      className="w-full text-lg py-6 h-auto"
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          {t('studySuccess.preparingDownloads')}
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5 mr-2" />
                          {t('studySuccess.getYourPdfs')}
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      {t('studySuccess.downloadInstructions')}
                    </p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('studySuccess.clickEachFile')}
                    </p>
                    {downloadFiles.map((file, index) => (
                      <motion.div
                        key={file.url}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left h-auto py-4"
                          onClick={() => handleFileDownload(file.url, file.name)}
                        >
                          <FileText className="w-5 h-5 mr-3 text-primary flex-shrink-0" />
                          <span className="capitalize">{file.name}</span>
                          <Download className="w-4 h-4 ml-auto text-muted-foreground" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
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
            <h2 className="text-2xl font-bold">{t('studySuccess.beginTraining')}</h2>
            <p className="text-muted-foreground">
              {t('studySuccess.beginTrainingDescription')}
            </p>
            <Button asChild size="lg">
              <Link to="/palace">
                {t('studySuccess.enterThePalace')}
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
