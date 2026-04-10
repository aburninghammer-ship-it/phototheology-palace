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
  full_sermon?: string;
}

interface SermonPDFExportProps {
  sermon: Sermon;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

const stripHtml = (html: string): string => {
  if (!html) return "";
  let text = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<blockquote[^>]*>/gi, '\n"');
  text = text.replace(/<\/blockquote>/gi, '"\n');
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\n\s*\n\s*\n/g, "\n\n");
  text = text.replace(/^\s+|\s+$/g, "");
  return text;
};

// Brand colors
const COLORS = {
  primary: [45, 55, 72] as [number, number, number],       // dark slate
  accent: [99, 102, 241] as [number, number, number],      // indigo
  accentLight: [224, 231, 255] as [number, number, number], // light indigo
  muted: [107, 114, 128] as [number, number, number],      // gray
  border: [209, 213, 219] as [number, number, number],     // light gray
  bg: [249, 250, 251] as [number, number, number],         // near white
  white: [255, 255, 255] as [number, number, number],
};

export function SermonPDFExport({ sermon, variant = "outline", size = "sm" }: SermonPDFExportProps) {
  const [exporting, setExporting] = useState(false);

  const exportToPDF = async () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 22;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      const checkPageBreak = (needed: number) => {
        if (y + needed > pageHeight - 25) {
          doc.addPage();
          y = margin;
          return true;
        }
        return false;
      };

      // ─── COVER PAGE ───
      // Background accent bar at top
      doc.setFillColor(...COLORS.accent);
      doc.rect(0, 0, pageWidth, 6, "F");

      // Thin line below accent bar
      doc.setFillColor(...COLORS.accentLight);
      doc.rect(0, 6, pageWidth, 2, "F");

      y = 70;

      // Title
      const titleText = stripHtml(sermon.title || "Untitled Sermon");
      doc.setFontSize(32);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...COLORS.primary);
      const titleLines = doc.splitTextToSize(titleText, contentWidth);
      doc.text(titleLines, pageWidth / 2, y, { align: "center" });
      y += titleLines.length * 14 + 8;

      // Decorative divider
      const dividerWidth = 50;
      doc.setDrawColor(...COLORS.accent);
      doc.setLineWidth(1.5);
      doc.line(pageWidth / 2 - dividerWidth / 2, y, pageWidth / 2 + dividerWidth / 2, y);
      y += 15;

      // Theme passage
      if (sermon.theme_passage) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(...COLORS.muted);
        const passageLines = doc.splitTextToSize(stripHtml(sermon.theme_passage), contentWidth - 20);
        doc.text(passageLines, pageWidth / 2, y, { align: "center" });
        y += passageLines.length * 7 + 10;
      }

      // Style badge
      if (sermon.sermon_style) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.accent);
        doc.text(`Style: ${sermon.sermon_style}`, pageWidth / 2, y, { align: "center" });
        y += 12;
      }

      // Date
      doc.setFontSize(9);
      doc.setTextColor(...COLORS.muted);
      doc.text(new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }), pageWidth / 2, y, { align: "center" });

      // Bottom accent bar on cover
      doc.setFillColor(...COLORS.accent);
      doc.rect(0, pageHeight - 6, pageWidth, 6, "F");

      // Footer text on cover
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.muted);
      doc.text("Created with Phototheology Sermon Builder", pageWidth / 2, pageHeight - 10, { align: "center" });

      // ─── CONTENT PAGES ───
      doc.addPage();
      y = margin;

      // Helper: Section header with accent bar
      const addSectionHeader = (icon: string, title: string) => {
        checkPageBreak(25);
        // Accent left bar
        doc.setFillColor(...COLORS.accent);
        doc.roundedRect(margin, y - 1, 3, 10, 1, 1, "F");
        // Title
        doc.setFontSize(15);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.primary);
        doc.text(`${icon}  ${title}`, margin + 8, y + 7);
        y += 16;
        // Subtle line
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.3);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
      };

      // Helper: Body text
      const addBodyText = (text: string, indent = 0) => {
        const cleanText = stripHtml(text);
        if (!cleanText) return;
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.primary);
        const lines = doc.splitTextToSize(cleanText, contentWidth - indent);
        for (const line of lines) {
          checkPageBreak(7);
          doc.text(line, margin + indent, y);
          y += 6;
        }
        y += 4;
      };

      // Helper: Numbered item with background
      const addNumberedItem = (num: number, text: string) => {
        const cleanText = stripHtml(text);
        if (!cleanText) return;
        const lines = doc.splitTextToSize(cleanText, contentWidth - 18);
        const blockHeight = lines.length * 6 + 8;
        checkPageBreak(blockHeight);

        // Light background
        doc.setFillColor(...COLORS.bg);
        doc.roundedRect(margin, y - 2, contentWidth, blockHeight, 2, 2, "F");

        // Number circle
        doc.setFillColor(...COLORS.accent);
        doc.circle(margin + 7, y + 5, 4, "F");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.white);
        doc.text(String(num), margin + 7, y + 6.5, { align: "center" });

        // Text
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.primary);
        let textY = y + 4;
        for (const line of lines) {
          doc.text(line, margin + 16, textY);
          textY += 6;
        }
        y += blockHeight + 4;
      };

      // ── Opening Hook ──
      if (sermon.movie_structure?.opening) {
        addSectionHeader("🎬", "Opening Hook");
        addBodyText(sermon.movie_structure.opening);
        y += 4;
      }

      // ── Theme / Main Passage ──
      if (sermon.theme_passage) {
        addSectionHeader("📖", "Theme / Main Passage");
        // Quote style block
        const passageText = stripHtml(sermon.theme_passage);
        if (passageText) {
          checkPageBreak(20);
          const passageLines = doc.splitTextToSize(passageText, contentWidth - 16);
          const blockH = passageLines.length * 6 + 10;
          doc.setFillColor(...COLORS.accentLight);
          doc.roundedRect(margin, y - 2, contentWidth, blockH, 3, 3, "F");
          doc.setFillColor(...COLORS.accent);
          doc.rect(margin, y - 2, 3, blockH, "F");
          doc.setFontSize(12);
          doc.setFont("helvetica", "italic");
          doc.setTextColor(...COLORS.primary);
          let pY = y + 5;
          for (const line of passageLines) {
            doc.text(line, margin + 10, pY);
            pY += 6;
          }
          y += blockH + 8;
        }
      }

      // ── 5 Smooth Stones ──
      if (sermon.smooth_stones?.length > 0) {
        addSectionHeader("🪨", "5 Smooth Stones — Key Insights");
        sermon.smooth_stones.forEach((stone, idx) => {
          addNumberedItem(idx + 1, stone);
        });
        y += 4;
      }

      // ── Narrative Bridges ──
      if (sermon.bridges?.length > 0) {
        addSectionHeader("🌉", "Narrative Bridges");
        sermon.bridges.forEach((bridge, idx) => {
          addNumberedItem(idx + 1, bridge);
        });
        y += 4;
      }

      // ── Climax ──
      if (sermon.movie_structure?.climax) {
        addSectionHeader("⛰️", "Climax / Main Point");
        addBodyText(sermon.movie_structure.climax);
        y += 4;
      }

      // ── Resolution ──
      if (sermon.movie_structure?.resolution) {
        addSectionHeader("✨", "Resolution");
        addBodyText(sermon.movie_structure.resolution);
        y += 4;
      }

      // ── Call to Action ──
      if (sermon.movie_structure?.call_to_action) {
        addSectionHeader("📢", "Call to Action");
        // Highlight box
        const ctaText = stripHtml(sermon.movie_structure.call_to_action);
        if (ctaText) {
          checkPageBreak(20);
          const ctaLines = doc.splitTextToSize(ctaText, contentWidth - 16);
          const ctaH = ctaLines.length * 6 + 12;
          doc.setFillColor(...COLORS.accentLight);
          doc.roundedRect(margin, y - 2, contentWidth, ctaH, 3, 3, "F");
          doc.setDrawColor(...COLORS.accent);
          doc.setLineWidth(0.5);
          doc.roundedRect(margin, y - 2, contentWidth, ctaH, 3, 3, "S");
          doc.setFontSize(11);
          doc.setFont("helvetica", "bold");
          doc.setTextColor(...COLORS.primary);
          let ctaY = y + 6;
          for (const line of ctaLines) {
            doc.text(line, margin + 8, ctaY);
            ctaY += 6;
          }
          y += ctaH + 8;
        }
      }

      // ── Full Sermon Manuscript ──
      if (sermon.full_sermon) {
        doc.addPage();
        y = margin;

        // Manuscript header
        doc.setFillColor(...COLORS.accent);
        doc.rect(0, 0, pageWidth, 4, "F");
        y = 20;

        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...COLORS.primary);
        doc.text("Full Sermon Manuscript", pageWidth / 2, y, { align: "center" });
        y += 10;

        doc.setDrawColor(...COLORS.accent);
        doc.setLineWidth(0.8);
        doc.line(pageWidth / 2 - 30, y, pageWidth / 2 + 30, y);
        y += 15;

        // Manuscript body
        const manuscriptText = stripHtml(sermon.full_sermon);
        const paragraphs = manuscriptText.split(/\n\n+/);
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...COLORS.primary);

        for (const para of paragraphs) {
          const trimmed = para.trim();
          if (!trimmed) continue;

          // Check if it's a heading (starts with ## or is all caps short line)
          const isHeading = trimmed.startsWith("##") || trimmed.startsWith("# ");
          if (isHeading) {
            checkPageBreak(15);
            const headingText = trimmed.replace(/^#+\s*/, "");
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...COLORS.accent);
            doc.text(headingText, margin, y);
            y += 10;
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(...COLORS.primary);
            continue;
          }

          const lines = doc.splitTextToSize(trimmed, contentWidth);
          for (const line of lines) {
            checkPageBreak(7);
            doc.text(line, margin, y);
            y += 6;
          }
          y += 4;
        }
      }

      // ─── PAGE NUMBERS & FOOTERS ───
      const pageCount = doc.getNumberOfPages();
      for (let i = 2; i <= pageCount; i++) {
        doc.setPage(i);
        // Top accent line
        doc.setFillColor(...COLORS.accent);
        doc.rect(0, 0, pageWidth, 2, "F");
        // Bottom bar
        doc.setFillColor(...COLORS.bg);
        doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
        doc.setDrawColor(...COLORS.border);
        doc.setLineWidth(0.3);
        doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);
        // Footer text
        doc.setFontSize(8);
        doc.setTextColor(...COLORS.muted);
        doc.text("Phototheology Sermon Builder", margin, pageHeight - 5);
        doc.text(`Page ${i - 1} of ${pageCount - 1}`, pageWidth - margin, pageHeight - 5, { align: "right" });
      }

      const filename = `${titleText.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_sermon.pdf`;
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
