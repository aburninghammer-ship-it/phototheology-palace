import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Youtube, Globe, Play } from "lucide-react";

export default function PowerOfTheLamb() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-orange-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/90 to-orange-900/90 backdrop-blur-sm border-b border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
              <span className="text-4xl">🔥</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Power of the Lamb
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto leading-relaxed">
            Discovering the transformative power of Christ through deep biblical teaching and prophetic insight
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* YouTube Channel Card */}
          <Card className="bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                  <Youtube className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">YouTube Channel</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Watch powerful teachings, sermons, and prophetic messages
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-black shadow-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed?listType=user_uploads&list=@powerofthelamb"
                  title="Power of the Lamb YouTube Channel"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg"
                  size="lg"
                >
                  <a 
                    href="https://www.youtube.com/@powerofthelamb" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Youtube className="w-5 h-5" />
                    Visit YouTube Channel
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Subscribe for weekly biblical teachings and prophetic insights
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Website Card */}
          <Card className="bg-white/95 backdrop-blur-sm hover:shadow-2xl transition-all border-2 border-orange-200">
            <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">Official Website</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Explore articles, resources, and ministry updates
              </p>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="bg-gradient-to-br from-orange-100 to-red-100 p-8 rounded-lg border-2 border-orange-300">
                <div className="text-center space-y-4">
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    powerofthelamb.com
                  </h3>
                  <p className="text-foreground/80 leading-relaxed">
                    Your source for in-depth biblical teaching, prophetic analysis, 
                    and spiritual resources to deepen your walk with Christ.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Button 
                  asChild 
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg"
                  size="lg"
                >
                  <a 
                    href="https://powerofthelamb.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2"
                  >
                    <Globe className="w-5 h-5" />
                    Visit Website
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Discover biblical truths and prophetic insights
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Content Section */}
        <div className="mt-12">
          <Card className="bg-white/95 backdrop-blur-sm border-2 border-red-200">
            <CardHeader className="bg-gradient-to-r from-red-50 via-orange-50 to-red-50">
              <CardTitle className="text-2xl text-center text-foreground">
                Ministry Focus
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <div className="text-4xl mb-3">📚</div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">Biblical Teaching</h4>
                  <p className="text-sm text-foreground/80">
                    Deep dives into Scripture with Phototheology principles and prophetic understanding
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
                  <div className="text-4xl mb-3">🔮</div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">Prophetic Insight</h4>
                  <p className="text-sm text-foreground/80">
                    Understanding end-time prophecies and their relevance to current events
                  </p>
                </div>

                <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
                  <div className="text-4xl mb-3">✝️</div>
                  <h4 className="font-bold text-lg mb-2 text-foreground">Spiritual Formation</h4>
                  <p className="text-sm text-foreground/80">
                    Practical guidance for growing in Christ and living out biblical principles
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 shadow-2xl">
            <CardContent className="py-12 px-6">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="text-5xl">🔥</div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  Join the Movement
                </h2>
                <p className="text-xl text-red-100 leading-relaxed">
                  Connect with a community passionate about understanding God&apos;s Word 
                  through the power of visual theology and prophetic insight.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Button 
                    asChild 
                    size="lg"
                    className="bg-white text-red-600 hover:bg-red-50 h-14 text-lg px-8"
                  >
                    <a 
                      href="https://www.youtube.com/@powerofthelamb?sub_confirmation=1" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Youtube className="w-5 h-5" />
                      Subscribe on YouTube
                    </a>
                  </Button>
                  <Button 
                    asChild 
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 h-14 text-lg px-8"
                  >
                    <a 
                      href="https://powerofthelamb.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Globe className="w-5 h-5" />
                      Explore Website
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}