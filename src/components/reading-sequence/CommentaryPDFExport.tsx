import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface CommentaryPDFExportProps {
  commentary: string;
  book: string;
  chapter: number;
  depth: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function CommentaryPDFExport({ 
  commentary, 
  book, 
  chapter, 
  depth,
  variant = "ghost", 
  size = "icon" 
}: CommentaryPDFExportProps) {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    if (!commentary) {
      toast.error("No commentary to export");
      return;
    }

    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Helper to add text with word wrap and page breaks
      const addText = (text: string, fontSize: number, isBold = false) => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", isBold ? "bold" : "normal");
        const lines = doc.splitTextToSize(text, maxWidth);
        
        for (const line of lines) {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(line, margin, y);
          y += fontSize * 0.5;
        }
        y += 5;
      };

      // Title
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(`${book} ${chapter}`, margin, y);
      y += 12;

      // Subtitle with depth
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(120, 120, 120);
      const depthLabel = depth === "depth" ? "Scholarly" : depth === "intermediate" ? "Intermediate" : "Surface";
      doc.text(`Phototheology Commentary — ${depthLabel} Level`, margin, y);
      y += 15;

      // Divider line
      doc.setDrawColor(200, 200, 200);
      doc.line(margin, y, pageWidth - margin, y);
      y += 10;

      // Commentary content - clean up markdown-style formatting
      doc.setTextColor(40, 40, 40);
      const cleanedCommentary = commentary
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markers
        .replace(/#{1,6}\s/g, '') // Remove heading markers
        .replace(/`(.*?)`/g, '$1'); // Remove code markers

      // Split by paragraphs
      const paragraphs = cleanedCommentary.split(/\n\n+/);
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          // Check for section headers (lines ending with colon or all caps)
          const lines = paragraph.split('\n');
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            
            // Detect headers
            if (trimmed.endsWith(':') && trimmed.length < 60) {
              y += 3;
              addText(trimmed, 13, true);
            } else {
              addText(trimmed, 11);
            }
          }
          y += 3;
        }
      }

      // Footer
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text("Created with Phototheology", margin, 285);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 25, 285);
      }

      // Save
      const filename = `${book}_${chapter}_commentary_${depth}.pdf`;
      doc.save(filename);
      toast.success("Commentary exported to PDF");
    } catch (error) {
      console.error("Error exporting PDF:", error);
      toast.error("Failed to export PDF");
    } finally {
      setExporting(false);
    }
  };

  return (
    <Button 
      size={size} 
      variant={variant} 
      onClick={exportToPDF} 
      disabled={exporting || !commentary}
      title="Export commentary to PDF"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
    </Button>
  );
}
