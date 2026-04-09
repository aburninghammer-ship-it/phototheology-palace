import { cn } from "@/lib/utils";

interface ProfessorAvatarProps {
  name: string;
  size?: "sm" | "lg";
  className?: string;
}

export function ProfessorAvatar({ name, size = "sm", className }: ProfessorAvatarProps) {
  const initials = name
    .split(" ")
    .filter((w) => w[0] === w[0].toUpperCase())
    .map((w) => w[0])
    .join("")
    .slice(0, 2);

  const sizeClasses = size === "lg" ? "w-20 h-20 text-2xl" : "w-10 h-10 text-sm";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shrink-0",
        "bg-gradient-to-br from-amber-500 to-orange-600",
        "ring-2 ring-amber-400/30",
        sizeClasses,
        className
      )}
    >
      {initials}
    </div>
  );
}
