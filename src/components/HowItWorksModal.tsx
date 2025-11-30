import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { ReactNode } from "react";

interface HowItWorksModalProps {
  title: string;
  description: string;
  children: ReactNode;
  triggerText?: string;
}

export const HowItWorksModal = ({
  title,
  description,
  children,
  triggerText = "How it Works",
}: HowItWorksModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="mr-2 h-4 w-4" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent variant="default" className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
