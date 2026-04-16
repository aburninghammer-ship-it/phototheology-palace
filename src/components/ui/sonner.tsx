import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      closeButton={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-gradient-to-br group-[.toaster]:from-card/95 group-[.toaster]:via-background/90 group-[.toaster]:to-primary/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-primary/30 group-[.toaster]:shadow-[0_8px_32px_-4px_rgba(var(--primary),0.3),0_0_0_1px_rgba(255,255,255,0.1)_inset] group-[.toaster]:rounded-2xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-gradient-to-r group-[.toast]:from-primary group-[.toast]:to-accent group-[.toast]:text-primary-foreground group-[.toast]:font-semibold group-[.toast]:shadow-lg group-[.toast]:border-0 group-[.toast]:hover:shadow-xl group-[.toast]:transition-all",
          cancelButton: "group-[.toast]:bg-muted/80 group-[.toast]:backdrop-blur-sm group-[.toast]:text-muted-foreground group-[.toast]:border group-[.toast]:border-border/50",
          closeButton: "group-[.toast]:bg-background/80 group-[.toast]:border group-[.toast]:border-border/50 group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted group-[.toast]:hover:text-foreground group-[.toast]:transition-colors",
          success: "group-[.toaster]:!bg-gradient-to-br group-[.toaster]:!from-emerald-500/20 group-[.toaster]:!via-green-500/10 group-[.toaster]:!to-teal-500/20 group-[.toaster]:!border-emerald-500/40 group-[.toaster]:!shadow-[0_8px_32px_-4px_rgba(16,185,129,0.4)]",
          error: "group-[.toaster]:!bg-gradient-to-br group-[.toaster]:!from-rose-500/20 group-[.toaster]:!via-red-500/10 group-[.toaster]:!to-pink-500/20 group-[.toaster]:!border-rose-500/40 group-[.toaster]:!shadow-[0_8px_32px_-4px_rgba(244,63,94,0.4)]",
          warning: "group-[.toaster]:!bg-gradient-to-br group-[.toaster]:!from-amber-500/20 group-[.toaster]:!via-orange-500/10 group-[.toaster]:!to-yellow-500/20 group-[.toaster]:!border-amber-500/40 group-[.toaster]:!shadow-[0_8px_32px_-4px_rgba(245,158,11,0.4)]",
          info: "group-[.toaster]:!bg-gradient-to-br group-[.toaster]:!from-blue-500/20 group-[.toaster]:!via-indigo-500/10 group-[.toaster]:!to-violet-500/20 group-[.toaster]:!border-blue-500/40 group-[.toaster]:!shadow-[0_8px_32px_-4px_rgba(59,130,246,0.4)]",
          icon: "group-[.toast]:text-primary",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
