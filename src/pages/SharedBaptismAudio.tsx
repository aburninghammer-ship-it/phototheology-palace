import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, BookOpen, Share2 } from "lucide-react";

export default function SharedBaptismAudio() {
  const { token } = useParams<{ token: string }>();
  const [audio, setAudio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    loadAudio();
  }, [token]);

  const loadAudio = async () => {
    const { data, error } = await supabase
      .from("baptism_study_audio")
      .select("*")
      .eq("share_token", token)
      .eq("status", "ready")
      .maybeSingle();

    if (error || !data) {
      setError("Audio not found or no longer available.");
    } else {
      setAudio(data);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    if (!audio?.public_url) return;
    try {
      const response = await fetch(audio.public_url);
      const blob = await response.blob();
      const filename = `Fundamental-${audio.fundamental_number}-${audio.title.replace(/\s+/g, "-")}.mp3`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(audio.public_url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !audio) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">{error || "Audio not found."}</p>
            <Button className="mt-4" onClick={() => window.location.href = "/"}>
              Go to Phototheology
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Lesson ${audio.fundamental_number}: ${audio.title} - Phototheology`}</title>
        <meta name="description" content={`Listen to Fundamental Belief #${audio.fundamental_number}: ${audio.title}. Baptismal study audio from Phototheology.`} />
      </Helmet>

      <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="max-w-lg w-full shadow-xl">
          <CardHeader className="text-center border-b">
            <div className="flex justify-center mb-3">
              <div className="p-3 rounded-full bg-primary/10">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-xl">
              Fundamental Belief #{audio.fundamental_number}
            </CardTitle>
            <p className="text-primary font-medium text-lg">{audio.title}</p>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <audio controls className="w-full" src={audio.public_url} preload="metadata" />

            <Button onClick={handleDownload} className="w-full" size="lg">
              <Download className="h-4 w-4 mr-2" />
              Download MP3
            </Button>

            {typeof navigator.share === "function" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  navigator.share({
                    title: `Lesson ${audio.fundamental_number}: ${audio.title}`,
                    text: `📖 Listen to this baptism study lesson on "${audio.title}"`,
                    url: window.location.href,
                  });
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">Powered by</p>
              <a href="/" className="text-primary font-bold hover:underline">
                🏰 Phototheology Palace
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
