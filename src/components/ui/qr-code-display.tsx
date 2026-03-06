import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QrCode, Download, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QRCodeDisplayProps {
  /** The URL or text to encode */
  value: string;
  /** Size of the QR code in pixels */
  size?: number;
  /** Label shown below the QR code */
  label?: string;
  /** Whether to show inline or as a button that opens a dialog */
  variant?: "inline" | "button" | "compact";
  /** Additional class names */
  className?: string;
  /** Colors */
  fgColor?: string;
  bgColor?: string;
}

export function QRCodeDisplay({
  value,
  size = 180,
  label,
  variant = "inline",
  className,
  fgColor = "#ffffff",
  bgColor = "transparent",
}: QRCodeDisplayProps) {
  const [open, setOpen] = useState(false);

  const downloadQR = () => {
    const svg = document.querySelector(`[data-qr-value="${value}"]`);
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * 2;
      canvas.height = img.height * 2;
      if (ctx) {
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      const link = document.createElement("a");
      link.download = "pt-qr-code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const qrElement = (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="p-3 bg-white rounded-xl">
        <QRCodeSVG
          value={value}
          size={variant === "compact" ? 100 : size}
          fgColor="#1a1a2e"
          bgColor="#ffffff"
          level="M"
          data-qr-value={value}
        />
      </div>
      {label && (
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          {label}
        </p>
      )}
    </div>
  );

  if (variant === "button") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <QrCode className="h-4 w-4" />
            Show QR
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" />
              Scan to Join
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={value}
                size={240}
                fgColor="#1a1a2e"
                bgColor="#ffffff"
                level="M"
                data-qr-value={value}
              />
            </div>
            {label && (
              <p className="text-sm text-muted-foreground text-center">
                {label}
              </p>
            )}
            <Button variant="outline" size="sm" onClick={downloadQR} className="gap-2">
              <Download className="h-4 w-4" />
              Download QR
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (variant === "compact") {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="relative group cursor-pointer">
            {qrElement}
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
              <Maximize2 className="h-5 w-5 text-white" />
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">Scan QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="p-4 bg-white rounded-2xl">
              <QRCodeSVG
                value={value}
                size={280}
                fgColor="#1a1a2e"
                bgColor="#ffffff"
                level="M"
                data-qr-value={value}
              />
            </div>
            {label && <p className="text-sm text-muted-foreground text-center">{label}</p>}
            <Button variant="outline" size="sm" onClick={downloadQR} className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return qrElement;
}
