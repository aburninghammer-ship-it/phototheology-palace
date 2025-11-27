import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface Sermon {
  title: string;
  theme_passage: string;
  sermon_style: string;
  smooth_stones: string[];
  bridges: string[];
  movie_structure: {
    opening?: string;
    climax?: string;
    resolution?: string;
    call_to_action?: string;
  };
}

interface SermonPDFExportProps {
  sermon: Sermon;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function SermonPDFExport({ sermon, variant = "outline", size = "sm" }: SermonPDFExportProps) {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Helper to add text with word wrap
      const addText = (text: string, fontSize: number, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, maxWidth);
        
        // Check if we need a new page
        if (y + lines.length * (fontSize * 0.5) > 280) {
          doc.addPage();
          y = 20;
        }
        
        doc.text(lines, margin, y);
        y += lines.length * (fontSize * 0.5) + 5;
      };

      const addSection = (title: string, content: string | string[]) => {
        addText(title, 14, true);
        if (Array.isArray(content)) {
          content.forEach((item, idx) => {
            addText(`${idx + 1}. ${item}`, 11);
          });
        } else if (content) {
          addText(content, 11);
        }
        y += 5;
      };

      // Title
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(sermon.title, maxWidth);
      doc.text(titleLines, margin, y);
      y += titleLines.length * 10 + 10;

      // Metadata
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      doc.text(`Style: ${sermon.sermon_style}`, margin, y);
      y += 8;
      doc.setTextColor(0, 0, 0);

      // Theme/Passage
      addSection("Theme / Main Passage", sermon.theme_passage);

      // Movie Structure - Opening
      if (sermon.movie_structure.opening) {
        addSection("Opening Hook", sermon.movie_structure.opening);
      }

      // 5 Smooth Stones
      if (sermon.smooth_stones?.length > 0) {
        addSection("5 Smooth Stones (Key Insights)", sermon.smooth_stones);
      }

      // Bridges
      if (sermon.bridges?.length > 0) {
        addSection("Narrative Bridges", sermon.bridges);
      }

      // Climax
      if (sermon.movie_structure.climax) {
        addSection("Climax / Main Point", sermon.movie_structure.climax);
      }

      // Resolution
      if (sermon.movie_structure.resolution) {
        addSection("Resolution", sermon.movie_structure.resolution);
      }

      // Call to Action
      if (sermon.movie_structure.call_to_action) {
        addSection("Call to Action", sermon.movie_structure.call_to_action);
      }

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("Created with Phototheology Sermon Builder", margin, 285);

      // Save
      const filename = `${sermon.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_sermon.pdf`;
      doc.save(filename);
      toast.success("PDF exported successfully!");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button size={size} variant={variant} onClick={exportToPDF} disabled={exporting}>
      {exporting ? (
        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-1" />
      )}
      PDF
    </Button>
  );
}
