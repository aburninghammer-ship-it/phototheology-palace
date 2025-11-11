import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Share2 } from "lucide-react";
import jsPDF from "jspdf";
import { useAuth } from "@/hooks/useAuth";

interface AchievementCertificateProps {
  open: boolean;
  onClose: () => void;
  achievement: {
    id: string;
    name: string;
    description: string;
    icon: string;
    points: number;
  };
  unlockedAt?: string;
}

export function AchievementCertificate({ 
  open, 
  onClose, 
  achievement,
  unlockedAt 
}: AchievementCertificateProps) {
  const { user } = useAuth();
  
  const generatePDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Set font sizes
    doc.setFontSize(40);
    
    // Title
    doc.setTextColor(51, 51, 51);
    doc.text('Certificate of Achievement', 148.5, 40, { align: 'center' });
    
    // Decorative line
    doc.setLineWidth(0.5);
    doc.setDrawColor(147, 51, 234);
    doc.line(50, 50, 247, 50);
    
    // Body text
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('This is to certify that', 148.5, 70, { align: 'center' });
    
    // User name
    doc.setFontSize(32);
    doc.setTextColor(51, 51, 51);
    const userName = user?.email?.split('@')[0] || 'Student';
    doc.text(userName, 148.5, 90, { align: 'center' });
    
    // Achievement text
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text('has successfully unlocked', 148.5, 105, { align: 'center' });
    
    // Achievement name
    doc.setFontSize(28);
    doc.setTextColor(147, 51, 234);
    doc.text(`"${achievement.name}"`, 148.5, 125, { align: 'center' });
    
    // Achievement description
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    const descLines = doc.splitTextToSize(achievement.description, 200);
    doc.text(descLines, 148.5, 140, { align: 'center' });
    
    // Points badge
    doc.setFontSize(18);
    doc.setTextColor(147, 51, 234);
    doc.text(`${achievement.points} Points Earned`, 148.5, 160, { align: 'center' });
    
    // Date
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    const date = unlockedAt ? new Date(unlockedAt).toLocaleDateString() : new Date().toLocaleDateString();
    doc.text(`Date Unlocked: ${date}`, 148.5, 175, { align: 'center' });
    
    // Footer
    doc.setFontSize(10);
    doc.text('Phototheology Palace - Master the Word Through Memory', 148.5, 195, { align: 'center' });
    
    // Save
    doc.save(`${achievement.name.replace(/\s+/g, '_')}_Certificate.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <span className="text-4xl">{achievement.icon}</span>
            Print Certificate
          </DialogTitle>
          <DialogDescription>
            Generate a printable certificate for your achievement
          </DialogDescription>
        </DialogHeader>

        <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">{achievement.icon}</div>
            <h3 className="text-3xl font-bold">{achievement.name}</h3>
            <p className="text-muted-foreground">{achievement.description}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <span className="text-xl font-bold text-primary">{achievement.points}</span>
              <span className="text-sm text-muted-foreground">Points</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={generatePDF} className="flex-1 gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            Share Certificate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
