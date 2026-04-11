import { cn } from "@/lib/utils";

interface ProfessorAvatarProps {
  name: string;
  size?: "sm" | "lg";
  className?: string;
}

interface ProfessorStyle {
  accentColor: string;
  bgGradient: string;
  initials: string;
}

const PROFESSOR_STYLES: Record<string, ProfessorStyle> = {
  "Professor Elias":      { accentColor: "#F59E0B", bgGradient: "from-amber-800 to-amber-950",     initials: "PE" },
  "Professor Ashworth":   { accentColor: "#D97706", bgGradient: "from-amber-700 to-orange-950",    initials: "PA" },
  "Professor Danvers":    { accentColor: "#EA580C", bgGradient: "from-orange-700 to-red-950",      initials: "PD" },
  "Professor Kingsley":   { accentColor: "#B45309", bgGradient: "from-yellow-800 to-amber-950",    initials: "PK" },
  "Professor Mercer":     { accentColor: "#92400E", bgGradient: "from-amber-900 to-stone-950",     initials: "PM" },
  "Professor Thorne":     { accentColor: "#78350F", bgGradient: "from-orange-900 to-stone-950",    initials: "PT" },
  "Professor Jewel":      { accentColor: "#F59E0B", bgGradient: "from-yellow-700 to-amber-950",    initials: "PJ" },
  "Professor Hale":       { accentColor: "#6366F1", bgGradient: "from-indigo-800 to-slate-950",    initials: "PH" },
  "Professor Lexis":      { accentColor: "#7C3AED", bgGradient: "from-violet-800 to-indigo-950",   initials: "PL" },
  "Professor Whitfield":  { accentColor: "#4F46E5", bgGradient: "from-indigo-700 to-slate-950",    initials: "PW" },
  "Professor Query":      { accentColor: "#6D28D9", bgGradient: "from-purple-800 to-violet-950",   initials: "PQ" },
  "Professor Cross":      { accentColor: "#5B21B6", bgGradient: "from-violet-700 to-purple-950",   initials: "PC" },
  "Professor Rivers":     { accentColor: "#059669", bgGradient: "from-emerald-800 to-teal-950",    initials: "PR" },
  "Professor Hart":       { accentColor: "#10B981", bgGradient: "from-emerald-700 to-green-950",   initials: "PH" },
  "Professor Strand":     { accentColor: "#047857", bgGradient: "from-green-800 to-emerald-950",   initials: "PS" },
  "Professor Archford":   { accentColor: "#065F46", bgGradient: "from-teal-800 to-emerald-950",    initials: "PA" },
  "Professor Keene":      { accentColor: "#0D9488", bgGradient: "from-teal-700 to-cyan-950",       initials: "PK" },
  "Professor Whitmore":   { accentColor: "#DC2626", bgGradient: "from-red-800 to-rose-950",        initials: "PW" },
  "Professor Prism":      { accentColor: "#E11D48", bgGradient: "from-rose-700 to-red-950",        initials: "PP" },
  "Professor Reedman":    { accentColor: "#BE123C", bgGradient: "from-rose-800 to-pink-950",       initials: "PR" },
  "Professor Magnus":     { accentColor: "#9F1239", bgGradient: "from-red-900 to-rose-950",        initials: "PM" },
  "Professor Epoch":      { accentColor: "#B91C1C", bgGradient: "from-red-800 to-stone-950",       initials: "PE" },
  "Professor Weaver":     { accentColor: "#991B1B", bgGradient: "from-red-900 to-slate-950",       initials: "PW" },
  "Professor Mirror":     { accentColor: "#F43F5E", bgGradient: "from-rose-600 to-red-950",        initials: "PM" },
  "Professor Bloom":      { accentColor: "#FB7185", bgGradient: "from-pink-600 to-rose-950",       initials: "PB" },
  "Professor Temple":     { accentColor: "#0EA5E9", bgGradient: "from-sky-700 to-blue-950",        initials: "PT" },
  "Professor Blackwell":  { accentColor: "#0284C7", bgGradient: "from-blue-700 to-sky-950",        initials: "PB" },
  "Professor Herald":     { accentColor: "#0369A1", bgGradient: "from-sky-800 to-blue-950",        initials: "PH" },
  "Professor Moadim":     { accentColor: "#075985", bgGradient: "from-blue-800 to-cyan-950",       initials: "PM" },
  "Professor Babylon":    { accentColor: "#7C2D12", bgGradient: "from-orange-900 to-amber-950",    initials: "PB" },
  "Professor Roman":      { accentColor: "#9A3412", bgGradient: "from-orange-800 to-red-950",      initials: "PR" },
  "Professor Novus":      { accentColor: "#C2410C", bgGradient: "from-orange-700 to-amber-950",    initials: "PN" },
  "Professor Covenant":   { accentColor: "#EA580C", bgGradient: "from-orange-600 to-red-950",      initials: "PC" },
  "Professor Squeeze":    { accentColor: "#F97316", bgGradient: "from-orange-500 to-amber-950",    initials: "PS" },
  "Professor Chronos":    { accentColor: "#FB923C", bgGradient: "from-amber-600 to-orange-950",    initials: "PC" },
  "Professor Flame":      { accentColor: "#EF4444", bgGradient: "from-red-600 to-orange-950",      initials: "PF" },
  "Professor Stillwater": { accentColor: "#8B5CF6", bgGradient: "from-violet-600 to-purple-950",   initials: "PS" },
  "Professor Flash":      { accentColor: "#F59E0B", bgGradient: "from-yellow-600 to-amber-950",    initials: "PF" },
  "Professor Zenith":     { accentColor: "#14B8A6", bgGradient: "from-teal-600 to-emerald-950",    initials: "PZ" },
  "Professor Axiom":      { accentColor: "#6366F1", bgGradient: "from-indigo-600 to-violet-950",   initials: "PA" },
};

const DEFAULT_STYLE: ProfessorStyle = {
  accentColor: "#F59E0B", bgGradient: "from-amber-800 to-amber-950", initials: "??",
};

// Images served from /public/professors/ — no Vite processing
function getProfessorImage(name: string): string | undefined {
  const slug = name.replace("Professor ", "").toLowerCase();
  return `/professors/${slug}.jpg`;
}

export function ProfessorAvatar({ name, size = "sm", className }: ProfessorAvatarProps) {
  const style = PROFESSOR_STYLES[name] || DEFAULT_STYLE;
  const image = getProfessorImage(name);
  const sizeClasses = size === "lg" ? "w-20 h-20" : "w-10 h-10";
  const textSize = size === "lg" ? "text-xl" : "text-xs";

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0 shadow-xl",
        sizeClasses,
        className
      )}
      style={{
        border: `3px solid ${style.accentColor}`,
        boxShadow: `0 0 12px ${style.accentColor}30`,
      }}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center font-bold text-white bg-gradient-to-br",
            style.bgGradient,
            textSize
          )}
        >
          {style.initials}
        </div>
      )}
    </div>
  );
}
