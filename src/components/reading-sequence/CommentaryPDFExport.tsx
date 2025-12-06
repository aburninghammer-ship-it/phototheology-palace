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

// Brand colors
const COLORS = {
  primary: { r: 139, g: 92, b: 246 }, // Purple
  secondary: { r: 245, g: 158, b: 11 }, // Amber
  accent: { r: 59, g: 130, b: 246 }, // Blue
  dark: { r: 30, g: 30, b: 40 },
  muted: { r: 100, g: 100, b: 120 },
  light: { r: 250, g: 250, b: 255 },
  success: { r: 34, g: 197, b: 94 },
};

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
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - margin * 2;
      let y = 20;

      // Helper to draw rounded rectangle
      const drawRoundedRect = (x: number, yPos: number, w: number, h: number, r: number, color: { r: number; g: number; b: number }, fill = true) => {
        doc.setDrawColor(color.r, color.g, color.b);
        if (fill) {
          doc.setFillColor(color.r, color.g, color.b);
          doc.roundedRect(x, yPos, w, h, r, r, 'F');
        } else {
          doc.roundedRect(x, yPos, w, h, r, r, 'S');
        }
      };

      // Helper to add page with header/footer
      const addNewPage = () => {
        doc.addPage();
        y = 25;
        // Add subtle header line
        doc.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        doc.setLineWidth(0.5);
        doc.line(margin, 15, pageWidth - margin, 15);
        // Mini title
        doc.setFontSize(8);
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.text(`${book} ${chapter} — Phototheology Commentary`, margin, 12);
      };

      // ============ COVER SECTION ============
      // Purple gradient header
      for (let i = 0; i < 50; i++) {
        const alpha = 1 - (i / 50);
        doc.setFillColor(
          Math.round(COLORS.primary.r * alpha + 255 * (1 - alpha)),
          Math.round(COLORS.primary.g * alpha + 255 * (1 - alpha)),
          Math.round(COLORS.primary.b * alpha + 255 * (1 - alpha))
        );
        doc.rect(0, i * 1.2, pageWidth, 1.2, 'F');
      }

      // Decorative corner accent
      doc.setFillColor(COLORS.secondary.r, COLORS.secondary.g, COLORS.secondary.b);
      doc.triangle(0, 0, 40, 0, 0, 40, 'F');

      // Main title
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(book, margin, 35);
      
      doc.setFontSize(48);
      doc.text(`Chapter ${chapter}`, margin, 52);

      // Subtitle box
      y = 70;
      const depthLabel = depth === "depth" ? "Scholarly Analysis" : depth === "intermediate" ? "Intermediate Study" : "Surface Overview";
      drawRoundedRect(margin, y, maxWidth, 20, 3, { r: 255, g: 255, b: 255 });
      doc.setFontSize(12);
      doc.setTextColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
      doc.setFont("helvetica", "bold");
      doc.text("PHOTOTHEOLOGY COMMENTARY", margin + 8, y + 9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      doc.text(`${depthLabel}`, margin + 8, y + 15);

      // Date badge
      const date = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.setFontSize(10);
      doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
      doc.text(date, pageWidth - margin - doc.getTextWidth(date), y + 15);

      y = 100;

      // ============ CONTENT SECTION ============
      // Process commentary into sections
      const cleanedCommentary = commentary
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/`(.*?)`/g, '$1');

      const paragraphs = cleanedCommentary.split(/\n\n+/).filter(p => p.trim());
      
      let sectionIndex = 0;
      const sectionColors = [COLORS.primary, COLORS.accent, COLORS.success, COLORS.secondary];

      for (const paragraph of paragraphs) {
        const lines = paragraph.split('\n').filter(l => l.trim());
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed) continue;

          // Check if we need a new page
          if (y > pageHeight - 40) {
            addNewPage();
          }

          // Detect section headers
          const isHeader = (trimmed.endsWith(':') && trimmed.length < 80) || 
                          trimmed.toUpperCase() === trimmed && trimmed.length > 3 && trimmed.length < 60;

          if (isHeader) {
            // Section header with colored accent
            y += 8;
            const color = sectionColors[sectionIndex % sectionColors.length];
            
            // Accent bar
            doc.setFillColor(color.r, color.g, color.b);
            doc.rect(margin, y - 4, 4, 12, 'F');
            
            // Header text
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(COLORS.dark.r, COLORS.dark.g, COLORS.dark.b);
            doc.text(trimmed.replace(':', ''), margin + 8, y + 4);
            
            y += 12;
            sectionIndex++;
          } else {
            // Regular paragraph text
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(COLORS.dark.r + 20, COLORS.dark.g + 20, COLORS.dark.b + 20);
            
            const wrappedLines = doc.splitTextToSize(trimmed, maxWidth - 10);
            
            for (const wrappedLine of wrappedLines) {
              if (y > pageHeight - 30) {
                addNewPage();
              }
              doc.text(wrappedLine, margin + 5, y);
              y += 6;
            }
            y += 3;
          }
        }
        y += 4;
      }

      // ============ FOOTER ON ALL PAGES ============
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Footer line
        doc.setDrawColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
        
        // Footer text
        doc.setFontSize(9);
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.setFont("helvetica", "italic");
        doc.text("Created with Phototheology", margin, pageHeight - 10);
        
        // Page number in circle
        const pageText = `${i}`;
        const pageNumX = pageWidth / 2;
        doc.setFillColor(COLORS.primary.r, COLORS.primary.g, COLORS.primary.b);
        doc.circle(pageNumX, pageHeight - 10, 5, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text(pageText, pageNumX - doc.getTextWidth(pageText) / 2, pageHeight - 8);
        
        // Total pages
        doc.setTextColor(COLORS.muted.r, COLORS.muted.g, COLORS.muted.b);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.text(`of ${pageCount}`, pageWidth - margin - 15, pageHeight - 10);
      }

      // Save
      const filename = `${book}_Chapter${chapter}_Commentary.pdf`;
      doc.save(filename);
      toast.success("Professional PDF exported successfully!");
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
      className="gap-2"
    >
      {exporting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {size !== "icon" && (exporting ? "Exporting..." : "Export PDF")}
    </Button>
  );
}