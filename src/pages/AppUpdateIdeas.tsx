import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Send, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const ideaSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(200, { message: "Title must be less than 200 characters" }),
  description: z
    .string()
    .trim()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(2000, { message: "Description must be less than 2000 characters" }),
  category: z.enum(["feature", "improvement", "bug", "other"], {
    required_error: "Please select a category",
  }),
});

interface Idea {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
}

export default function AppUpdateIdeas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchIdeas();
  }, [user, navigate]);

  const fetchIdeas = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("app_update_ideas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setIdeas(data || []);
    } catch (error) {
      console.error("Error fetching ideas:", error);
      toast.error("Failed to load your ideas");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setErrors({});

    try {
      // Validate input
      const validatedData = ideaSchema.parse({
        title: title,
        description: description,
        category: category,
      });

      setSubmitting(true);

      const { error } = await supabase.from("app_update_ideas").insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
      });

      if (error) throw error;

      toast.success("Thank you! Your idea has been submitted!");
      setTitle("");
      setDescription("");
      setCategory("");
      fetchIdeas();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        toast.error("Please fix the errors in the form");
      } else {
        console.error("Error submitting idea:", error);
        toast.error("Failed to submit idea");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "implemented":
        return "bg-green-500";
      case "planned":
        return "bg-blue-500";
      case "under_review":
        return "bg-yellow-500";
      case "declined":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getCategoryLabel = (cat: string) => {
    const labels: { [key: string]: string } = {
      feature: "New Feature",
      improvement: "Improvement",
      bug: "Bug Report",
      other: "Other",
    };
    return labels[cat] || cat;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Lightbulb className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-serif font-bold">App Update Ideas</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Share your ideas, suggestions, and feedback to help improve Phototheology!
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Submit Your Idea
              </CardTitle>
              <CardDescription>
                Help us make Phototheology better by sharing your thoughts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category" className={errors.category ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">New Feature Request</SelectItem>
                      <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief summary of your idea"
                    maxLength={200}
                    className={errors.title ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{errors.title || "5-200 characters"}</span>
                    <span>{title.length}/200</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your idea in detail..."
                    rows={8}
                    maxLength={2000}
                    className={errors.description ? "border-destructive" : ""}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{errors.description || "20-2000 characters"}</span>
                    <span>{description.length}/2000</span>
                  </div>
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Idea
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Submitted Ideas</CardTitle>
              <CardDescription>Track the status of your suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : ideas.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Lightbulb className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No ideas submitted yet</p>
                  <p className="text-sm">Share your first idea!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {ideas.map((idea) => (
                    <div
                      key={idea.id}
                      className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {getCategoryLabel(idea.category)}
                            </Badge>
                            <Badge className={`text-xs ${getStatusBadgeColor(idea.status)} text-white`}>
                              {idea.status === "under_review" ? "Under Review" :
                               idea.status === "implemented" ? "Implemented ✓" :
                               idea.status.charAt(0).toUpperCase() + idea.status.slice(1)}
                            </Badge>
                          </div>
                          <h4 className="font-semibold">{idea.title}</h4>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                        {idea.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {new Date(idea.created_at).toLocaleDateString()}
                      </p>
                      {idea.status === "implemented" && (
                        <div className="mt-2 flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>This feature has been implemented!</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}