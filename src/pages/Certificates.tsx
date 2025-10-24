import { useEffect, useState } from "react";
import { SimplifiedNav } from "@/components/SimplifiedNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Award, Download, Share2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  id: string;
  certificate_type: string;
  course_name: string;
  issued_at: string;
  share_token: string;
  is_public: boolean;
  certificate_data: any;
}

export default function Certificates() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCertificates();
    }
  }, [user]);

  const loadCertificates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user.id)
        .order("issued_at", { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error("Error loading certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublic = async (certId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("certificates")
        .update({ is_public: !currentStatus })
        .eq("id", certId);

      if (error) throw error;

      toast({
        title: !currentStatus ? "Certificate is now public" : "Certificate is now private",
      });

      loadCertificates();
    } catch (error) {
      console.error("Error updating certificate:", error);
    }
  };

  const shareCertificate = (shareToken: string) => {
    const url = `${window.location.origin}/certificate/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Share your achievement with others",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-dreamy">
        <SimplifiedNav />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <p className="text-center text-muted-foreground">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-dreamy">
      <SimplifiedNav />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Award className="h-8 w-8" />
            My Certificates
          </h1>
          <p className="text-muted-foreground">
            Your achievements and completed courses
          </p>
        </div>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Complete courses to earn certificates
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {certificates.map((cert) => (
              <Card key={cert.id} className="overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {cert.certificate_type.replace("_", " ").toUpperCase()}
                      </Badge>
                      <h3 className="text-2xl font-bold mb-1">
                        {cert.course_name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Completed {new Date(cert.issued_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Award className="h-12 w-12 text-primary" />
                  </div>
                </div>
                <CardContent className="pt-4">
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => shareCertificate(cert.share_token)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePublic(cert.id, cert.is_public)}
                    >
                      {cert.is_public ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Make Private
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Make Public
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
