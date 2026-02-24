import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Download, 
  Play, 
  FileText, 
  Heart, 
  Search, 
  Filter,
  Clock,
  Users,
  Star,
  Castle,
  Brain,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: "devotional" | "study-guide" | "video" | "template";
  category: string;
  duration?: string;
  downloads?: number;
  rating?: number;
  featured?: boolean;
  premium?: boolean;
}

const CONTENT_LIBRARY: ContentItem[] = [
  // Devotional Templates
  { id: "grief-7", title: "Walking Through Grief", description: "7-day devotional for those experiencing loss", type: "devotional", category: "Grief", duration: "7 days", downloads: 1250, rating: 4.9, featured: true },
  { id: "anxiety-14", title: "Peace Over Anxiety", description: "14-day journey to biblical peace", type: "devotional", category: "Mental Health", duration: "14 days", downloads: 2100, rating: 4.8 },
  { id: "newbeliever-30", title: "New Believer Foundations", description: "30-day guide for new Christians", type: "devotional", category: "Foundations", duration: "30 days", downloads: 3500, rating: 4.9, featured: true },
  { id: "marriage-21", title: "Strengthening Your Marriage", description: "21-day couples devotional", type: "devotional", category: "Marriage", duration: "21 days", downloads: 890, rating: 4.7 },
  { id: "parenting-14", title: "Christ-Centered Parenting", description: "Biblical wisdom for raising children", type: "devotional", category: "Family", duration: "14 days", downloads: 650 },
  
  // Study Guides
  { id: "palace-guide", title: "Complete Palace Method Guide", description: "Master all 8 floors of Phototheology", type: "study-guide", category: "Palace", downloads: 4200, rating: 4.9, featured: true },
  { id: "daniel-guide", title: "Daniel Prophecy Study", description: "In-depth study of Daniel's visions", type: "study-guide", category: "Prophecy", downloads: 1800, rating: 4.8 },
  { id: "revelation-guide", title: "Revelation Unveiled", description: "Chapter-by-chapter Revelation study", type: "study-guide", category: "Prophecy", downloads: 2400, rating: 4.7, premium: true },
  { id: "types-symbols", title: "Types & Symbols Dictionary", description: "Biblical typology reference guide", type: "study-guide", category: "Palace", downloads: 3100, rating: 4.8 },
  
  // Videos
  { id: "floor1-video", title: "Floor 1: Furnishing", description: "Video walkthrough of the Furnishing Floor", type: "video", category: "Palace", duration: "25 min", downloads: 5600 },
  { id: "floor2-video", title: "Floor 2: Investigation", description: "Learn the Investigation Floor methods", type: "video", category: "Palace", duration: "30 min", downloads: 4800 },
  { id: "memory-video", title: "Memory Techniques Masterclass", description: "Advanced Bible memorization methods", type: "video", category: "Memory", duration: "45 min", downloads: 3200, premium: true },
  
  // Templates
  { id: "sermon-template", title: "Sermon Prep Template", description: "PT-based sermon preparation framework", type: "template", category: "Ministry", downloads: 890 },
  { id: "study-template", title: "Personal Study Template", description: "Daily study structure using PT principles", type: "template", category: "Personal", downloads: 2100 },
];

export default function ContentLibrary() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = ["all", "Grief", "Mental Health", "Foundations", "Marriage", "Family", "Palace", "Prophecy", "Memory", "Ministry", "Personal"];

  const filteredContent = CONTENT_LIBRARY.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: ContentItem["type"]) => {
    switch (type) {
      case "devotional": return <Heart className="h-4 w-4" />;
      case "study-guide": return <FileText className="h-4 w-4" />;
      case "video": return <Play className="h-4 w-4" />;
      case "template": return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: ContentItem["type"]) => {
    switch (type) {
      case "devotional": return "from-pink-500 to-rose-500";
      case "study-guide": return "from-blue-500 to-cyan-500";
      case "video": return "from-purple-500 to-violet-500";
      case "template": return "from-emerald-500 to-teal-500";
    }
  };

  const handleDownload = (item: ContentItem) => {
    if (item.premium) {
      toast({ title: t('content.premiumContent'), description: t('content.upgradeToAccess'), variant: "destructive" });
      return;
    }
    toast({ title: t('content.downloadStarted'), description: t('content.downloading', { title: item.title }) });
  };

  const handleUseTemplate = (item: ContentItem) => {
    if (item.type === "devotional") {
      navigate("/devotionals");
    } else {
      toast({ title: t('content.opening'), description: t('content.loadingItem', { title: item.title }) });
    }
  };

  const featuredItems = CONTENT_LIBRARY.filter(item => item.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <Sparkles className="h-10 w-10 text-primary" />
              {t('content.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('content.description')}
            </p>
          </div>

          {/* Featured Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              {t('content.featured')}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all border-2 border-primary/20">
                    <div className={`h-2 bg-gradient-to-r ${getTypeColor(item.type)}`} />
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="gap-1">
                          {getTypeIcon(item.type)}
                          {item.type}
                        </Badge>
                        {item.rating && (
                          <div className="flex items-center gap-1 text-yellow-500">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="text-sm font-medium">{item.rating}</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {item.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.duration}
                            </span>
                          )}
                          {item.downloads && (
                            <span className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              {item.downloads.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button size="sm" onClick={() => handleUseTemplate(item)}>
                          {t('content.use')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('content.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.slice(0, 6).map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat === "all" ? t('common.all') : cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">{t('content.tabs.allContent')}</TabsTrigger>
              <TabsTrigger value="devotional">{t('content.tabs.devotionals')}</TabsTrigger>
              <TabsTrigger value="study-guide">{t('content.tabs.studyGuides')}</TabsTrigger>
              <TabsTrigger value="video">{t('content.tabs.videos')}</TabsTrigger>
              <TabsTrigger value="template">{t('content.tabs.templates')}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="gap-1">
                            {getTypeIcon(item.type)}
                            {item.type}
                          </Badge>
                          {item.premium && (
                            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500">{t('content.premium')}</Badge>
                          )}
                        </div>
                        <CardTitle className="text-base">{item.title}</CardTitle>
                        <CardDescription className="text-sm">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {item.duration && <span>{item.duration}</span>}
                            {item.downloads && <span>{t('content.downloadsCount', { defaultValue: '{{count}} downloads', count: item.downloads })}</span>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleDownload(item)}>
                              <Download className="h-3 w-3" />
                            </Button>
                            <Button size="sm" onClick={() => handleUseTemplate(item)}>
                              {t('content.use')}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {["devotional", "study-guide", "video", "template"].map(type => (
              <TabsContent key={type} value={type} className="space-y-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredContent.filter(item => item.type === type).map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {item.duration || t('content.downloadsCount', { defaultValue: '{{count}} downloads', count: item.downloads || 0 })}
                            </span>
                            <Button size="sm" onClick={() => handleUseTemplate(item)}>
                              {t('content.use')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
}
