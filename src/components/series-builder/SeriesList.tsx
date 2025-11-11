import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Download, Share2, Presentation } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface SeriesListProps {
  series: any[];
  onUpdate: () => void;
}

export const SeriesList = ({ series, onUpdate }: SeriesListProps) => {
  const navigate = useNavigate();

  const handleDelete = async (seriesId: string) => {
    if (!confirm('Are you sure you want to delete this series? This cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('bible_study_series')
        .delete()
        .eq('id', seriesId);

      if (error) throw error;
      
      toast.success('Series deleted successfully');
      onUpdate();
    } catch (error: any) {
      console.error('Error deleting series:', error);
      toast.error('Failed to delete series');
    }
  };

  const handleExport = async (seriesId: string, seriesTitle: string) => {
    try {
      const { data: lessons, error } = await supabase
        .from('bible_study_lessons')
        .select('*')
        .eq('series_id', seriesId)
        .order('lesson_number');

      if (error) throw error;

      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let yPos = margin;

      // Title
      pdf.setFontSize(20);
      pdf.text(seriesTitle, margin, yPos);
      yPos += 15;

      // Add each lesson
      lessons?.forEach((lesson, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = margin;
        }

        pdf.setFontSize(16);
        pdf.text(`Lesson ${lesson.lesson_number}: ${lesson.title}`, margin, yPos);
        yPos += 10;

        pdf.setFontSize(12);
        
        // Big Idea
        if (lesson.big_idea) {
          pdf.setFont(undefined, 'bold');
          pdf.text('Big Idea:', margin, yPos);
          pdf.setFont(undefined, 'normal');
          yPos += 7;
          const bigIdeaText = pdf.splitTextToSize(lesson.big_idea, pageWidth - margin * 2);
          pdf.text(bigIdeaText, margin, yPos);
          yPos += (bigIdeaText.length * 7) + 5;
        }

        // Christ Emphasis
        if (lesson.christ_emphasis) {
          pdf.setFont(undefined, 'bold');
          pdf.text('Christ Emphasis:', margin, yPos);
          pdf.setFont(undefined, 'normal');
          yPos += 7;
          const christText = pdf.splitTextToSize(lesson.christ_emphasis, pageWidth - margin * 2);
          pdf.text(christText, margin, yPos);
          yPos += (christText.length * 7) + 5;
        }

        // Key Passages
        if (lesson.key_passages) {
          pdf.setFont(undefined, 'bold');
          pdf.text('Key Passages:', margin, yPos);
          pdf.setFont(undefined, 'normal');
          yPos += 7;
          const passagesText = pdf.splitTextToSize(lesson.key_passages, pageWidth - margin * 2);
          pdf.text(passagesText, margin, yPos);
          yPos += (passagesText.length * 7) + 10;
        }
      });

      pdf.save(`${seriesTitle.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      toast.success('Series exported to PDF');
    } catch (error: any) {
      console.error('Error exporting series:', error);
      toast.error('Failed to export series');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {series.map((s) => (
        <Card key={s.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>
                  Updated {formatDate(s.updated_at)}
                </CardDescription>
              </div>
              <Badge variant={s.status === 'published' ? 'default' : 'secondary'}>
                {s.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-2">
              {s.description}
            </p>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                {s.lesson_count} lessons
              </Badge>
              <Badge variant="outline" className="text-xs">
                {s.audience_type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {s.context}
              </Badge>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(`/series/${s.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="default"
                onClick={() => navigate(`/series/${s.id}/present`)}
              >
                <Presentation className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport(s.id, s.title)}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {/* Share functionality to be added */}}
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDelete(s.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
