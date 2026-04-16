import { useState, useMemo } from "react";
import { GuidedTourOverlay, primeAudioForTour } from "@/components/guided-tour/GuidedTourOverlay";
import { SOURCE_LIBRARY_TOUR } from "@/data/guidedTours";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Library,
  Search,
  Upload,
  Grid,
  List,
  Star,
  FileText,
  FileType,
  Presentation,
  File,
  Plus,
  ImageIcon,
  BookOpen,
  Loader2,
  FolderOpen
} from "lucide-react";
import { useSourceLibrary, SourceDocument } from "@/hooks/useSourceLibrary";
import { SourceUploader } from "@/components/sources/SourceUploader";
import { SourceCard } from "@/components/sources/SourceCard";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

type ViewMode = "grid" | "list";
type FilterType = "all" | "pdf" | "docx" | "pptx" | "txt" | "favorites";

export default function SourceLibrary() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    sources,
    isLoading,
    isUploading,
    uploadSource,
    deleteSource,
    toggleFavorite,
  } = useSourceLibrary();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showUploader, setShowUploader] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  // Filter and search sources
  const filteredSources = useMemo(() => {
    let filtered = sources;

    // Apply type filter
    if (filterType === "favorites") {
      filtered = filtered.filter((s) => s.is_favorite);
    } else if (filterType !== "all") {
      filtered = filtered.filter((s) => s.document_type === filterType);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.extracted_text?.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [sources, filterType, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: sources.length,
      pdf: sources.filter((s) => s.document_type === "pdf").length,
      docx: sources.filter((s) => s.document_type === "docx").length,
      pptx: sources.filter((s) => s.document_type === "pptx").length,
      txt: sources.filter((s) => s.document_type === "txt").length,
      favorites: sources.filter((s) => s.is_favorite).length,
    };
  }, [sources]);

  const handleGenerateInfographic = (source: SourceDocument) => {
    navigate(`/infographics?sourceId=${source.id}&sourceType=upload`);
  };

  const handleCreateSeries = (source: SourceDocument) => {
    navigate(`/study-series?sourceId=${source.id}`);
  };

  return (
    <ProtectedRoute>
      <Helmet>
        <title>Source Library | Phototheology Palace</title>
        <meta
          name="description"
          content="Upload and manage your study documents. Create Bible studies from PDFs, Word docs, and more."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {tourOpen && <GuidedTourOverlay steps={SOURCE_LIBRARY_TOUR} onClose={() => setTourOpen(false)} />}
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Library className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Source Library</h1>
                  <p className="text-muted-foreground">
                    Upload documents to generate studies, infographics, and series
                  </p>
                </div>
              </div>

              <Button onClick={() => setShowUploader(!showUploader)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge
                variant={filterType === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("all")}
              >
                All ({stats.total})
              </Badge>
              <Badge
                variant={filterType === "pdf" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("pdf")}
              >
                <FileText className="h-3 w-3 mr-1" />
                PDF ({stats.pdf})
              </Badge>
              <Badge
                variant={filterType === "docx" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("docx")}
              >
                <FileType className="h-3 w-3 mr-1" />
                DOCX ({stats.docx})
              </Badge>
              <Badge
                variant={filterType === "pptx" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("pptx")}
              >
                <Presentation className="h-3 w-3 mr-1" />
                PPTX ({stats.pptx})
              </Badge>
              <Badge
                variant={filterType === "txt" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("txt")}
              >
                <File className="h-3 w-3 mr-1" />
                TXT ({stats.txt})
              </Badge>
              <Badge
                variant={filterType === "favorites" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("favorites")}
              >
                <Star className="h-3 w-3 mr-1" />
                Favorites ({stats.favorites})
              </Badge>
            </div>
          </motion.div>

          {/* Upload Section */}
          {showUploader && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <SourceUploader
                onUpload={uploadSource}
                isUploading={isUploading}
              />
            </motion.div>
          )}

          {/* Search and View Controls */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredSources.length === 0 ? (
            <Card className="py-20">
              <CardContent className="flex flex-col items-center justify-center text-center">
                <FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {sources.length === 0
                    ? "Your library is empty"
                    : "No documents match your search"}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {sources.length === 0
                    ? "Upload PDFs, Word docs, PowerPoints, or text files to get started. You can use them to generate infographics and Bible study series."
                    : "Try adjusting your search or filter criteria."}
                </p>
                {sources.length === 0 && (
                  <Button onClick={() => setShowUploader(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Your First Document
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : viewMode === "grid" ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {filteredSources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SourceCard
                    source={source}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteSource}
                    onGenerateInfographic={handleGenerateInfographic}
                    onCreateSeries={handleCreateSeries}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-2"
            >
              {filteredSources.map((source, index) => (
                <motion.div
                  key={source.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <SourceCard
                    source={source}
                    onToggleFavorite={toggleFavorite}
                    onDelete={deleteSource}
                    onGenerateInfographic={handleGenerateInfographic}
                    onCreateSeries={handleCreateSeries}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Quick Actions */}
          {sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/infographics")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/30">
                      <ImageIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Generate Infographic</h3>
                      <p className="text-sm text-muted-foreground">
                        Create visual summaries from your documents
                      </p>
                    </div>
                  </div>
                </Card>

                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate("/study-series")}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-950/30">
                      <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Create Study Series</h3>
                      <p className="text-sm text-muted-foreground">
                        Generate multi-lesson Bible studies
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
