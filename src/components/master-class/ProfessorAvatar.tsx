import { cn } from "@/lib/utils";

interface ProfessorAvatarProps {
  name: string;
  size?: "sm" | "lg";
  className?: string;
}

// Each professor gets a unique, hand-designed avatar profile
// Mix of young adults (25-35) and a few older mentors (40-55), leaning young
interface AvatarProfile {
  skinTone: string;      // fill color for face
  hairColor: string;     // fill color for hair
  hairStyle: "short" | "wavy" | "curly" | "long" | "buzz" | "locs" | "bun" | "afro" | "slicked" | "braids" | "mohawk" | "side-part";
  gender: "m" | "f";
  hasBeard?: boolean;
  hasGlasses?: boolean;
  accentColor: string;   // gradient accent for background ring
  age: "young" | "mature";
}

const PROFESSOR_AVATARS: Record<string, AvatarProfile> = {
  // Class 1 - Intro & Master Floor
  "Professor Elias":     { skinTone: "#C68642", hairColor: "#1A1A2E", hairStyle: "short", gender: "m", hasGlasses: true, accentColor: "#F59E0B", age: "mature" },

  // Floor 1: Furnishing
  "Professor Ashworth":  { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "locs", gender: "m", accentColor: "#D97706", age: "young" },
  "Professor Danvers":   { skinTone: "#F1C27D", hairColor: "#6B3A2A", hairStyle: "wavy", gender: "f", accentColor: "#EA580C", age: "young" },
  "Professor Kingsley":  { skinTone: "#FFDBB4", hairColor: "#2C1810", hairStyle: "slicked", gender: "m", accentColor: "#B45309", age: "young" },
  "Professor Mercer":    { skinTone: "#C68642", hairColor: "#1A1A1A", hairStyle: "buzz", gender: "m", accentColor: "#92400E", age: "young" },
  "Professor Thorne":    { skinTone: "#E0AC69", hairColor: "#3B1F0B", hairStyle: "short", gender: "m", hasGlasses: true, accentColor: "#78350F", age: "young" },
  "Professor Jewel":     { skinTone: "#A0522D", hairColor: "#0D0D0D", hairStyle: "braids", gender: "f", accentColor: "#F59E0B", age: "young" },

  // Floor 2: Investigation
  "Professor Hale":      { skinTone: "#FFDBB4", hairColor: "#4A2C17", hairStyle: "side-part", gender: "m", accentColor: "#6366F1", age: "mature" },
  "Professor Lexis":     { skinTone: "#F1C27D", hairColor: "#1A0F00", hairStyle: "bun", gender: "f", hasGlasses: true, accentColor: "#7C3AED", age: "young" },
  "Professor Whitfield": { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "short", gender: "m", hasBeard: true, accentColor: "#4F46E5", age: "mature" },
  "Professor Query":     { skinTone: "#E0AC69", hairColor: "#2C1810", hairStyle: "curly", gender: "f", accentColor: "#6D28D9", age: "young" },
  "Professor Cross":     { skinTone: "#C68642", hairColor: "#1C1C1C", hairStyle: "wavy", gender: "m", accentColor: "#5B21B6", age: "young" },

  // Floor 3: Freestyle
  "Professor Rivers":    { skinTone: "#A0522D", hairColor: "#0D0D0D", hairStyle: "afro", gender: "f", accentColor: "#059669", age: "young" },
  "Professor Hart":      { skinTone: "#FFDBB4", hairColor: "#8B4513", hairStyle: "long", gender: "f", accentColor: "#10B981", age: "young" },
  "Professor Strand":    { skinTone: "#F1C27D", hairColor: "#2C1810", hairStyle: "mohawk", gender: "m", accentColor: "#047857", age: "young" },
  "Professor Archford":  { skinTone: "#C68642", hairColor: "#1A1A2E", hairStyle: "short", gender: "m", hasGlasses: true, accentColor: "#065F46", age: "mature" },
  "Professor Keene":     { skinTone: "#E0AC69", hairColor: "#3B1F0B", hairStyle: "braids", gender: "f", accentColor: "#0D9488", age: "young" },

  // Floor 4: Next Level
  "Professor Whitmore":  { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "locs", gender: "m", hasBeard: true, accentColor: "#DC2626", age: "young" },
  "Professor Prism":     { skinTone: "#F1C27D", hairColor: "#4A2C17", hairStyle: "curly", gender: "f", hasGlasses: true, accentColor: "#E11D48", age: "young" },
  "Professor Reedman":   { skinTone: "#FFDBB4", hairColor: "#2C1810", hairStyle: "wavy", gender: "m", accentColor: "#BE123C", age: "young" },
  "Professor Magnus":    { skinTone: "#C68642", hairColor: "#1A1A1A", hairStyle: "short", gender: "m", accentColor: "#9F1239", age: "mature" },
  "Professor Epoch":     { skinTone: "#E0AC69", hairColor: "#1A0F00", hairStyle: "bun", gender: "f", accentColor: "#B91C1C", age: "young" },
  "Professor Weaver":    { skinTone: "#A0522D", hairColor: "#0D0D0D", hairStyle: "afro", gender: "m", accentColor: "#991B1B", age: "young" },
  "Professor Mirror":    { skinTone: "#F1C27D", hairColor: "#6B3A2A", hairStyle: "long", gender: "f", accentColor: "#F43F5E", age: "young" },
  "Professor Bloom":     { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "short", gender: "f", accentColor: "#FB7185", age: "young" },

  // Floor 5: Vision
  "Professor Temple":    { skinTone: "#C68642", hairColor: "#1A1A2E", hairStyle: "side-part", gender: "m", hasGlasses: true, accentColor: "#0EA5E9", age: "mature" },
  "Professor Blackwell": { skinTone: "#FFDBB4", hairColor: "#2C1810", hairStyle: "short", gender: "m", hasBeard: true, accentColor: "#0284C7", age: "young" },
  "Professor Herald":    { skinTone: "#A0522D", hairColor: "#0D0D0D", hairStyle: "buzz", gender: "m", accentColor: "#0369A1", age: "young" },
  "Professor Moadim":    { skinTone: "#E0AC69", hairColor: "#3B1F0B", hairStyle: "curly", gender: "f", accentColor: "#075985", age: "young" },

  // Floor 6: Three Heavens & Cycles
  "Professor Babylon":   { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "locs", gender: "m", accentColor: "#7C2D12", age: "young" },
  "Professor Roman":     { skinTone: "#F1C27D", hairColor: "#4A2C17", hairStyle: "wavy", gender: "m", accentColor: "#9A3412", age: "young" },
  "Professor Novus":     { skinTone: "#C68642", hairColor: "#1A1A1A", hairStyle: "braids", gender: "f", accentColor: "#C2410C", age: "young" },
  "Professor Covenant":  { skinTone: "#FFDBB4", hairColor: "#2C1810", hairStyle: "short", gender: "m", hasBeard: true, hasGlasses: true, accentColor: "#EA580C", age: "mature" },
  "Professor Squeeze":   { skinTone: "#E0AC69", hairColor: "#1A0F00", hairStyle: "afro", gender: "f", accentColor: "#F97316", age: "young" },
  "Professor Chronos":   { skinTone: "#A0522D", hairColor: "#0D0D0D", hairStyle: "slicked", gender: "m", hasGlasses: true, accentColor: "#FB923C", age: "young" },

  // Floor 7: Transformation
  "Professor Flame":     { skinTone: "#8D5524", hairColor: "#0D0D0D", hairStyle: "mohawk", gender: "m", accentColor: "#EF4444", age: "young" },
  "Professor Stillwater":{ skinTone: "#F1C27D", hairColor: "#6B3A2A", hairStyle: "long", gender: "f", accentColor: "#8B5CF6", age: "young" },
  "Professor Flash":     { skinTone: "#C68642", hairColor: "#1A1A1A", hairStyle: "buzz", gender: "m", accentColor: "#F59E0B", age: "young" },

  // New classes
  "Professor Zenith":    { skinTone: "#E0AC69", hairColor: "#2C1810", hairStyle: "curly", gender: "f", accentColor: "#14B8A6", age: "young" },
  "Professor Axiom":     { skinTone: "#FFDBB4", hairColor: "#1A1A2E", hairStyle: "short", gender: "m", hasGlasses: true, accentColor: "#6366F1", age: "young" },
};

const DEFAULT_PROFILE: AvatarProfile = {
  skinTone: "#C68642", hairColor: "#1A1A1A", hairStyle: "short", gender: "m", accentColor: "#F59E0B", age: "young",
};

function renderHair(style: AvatarProfile["hairStyle"], color: string, gender: string) {
  switch (style) {
    case "short":
      return <path d="M12 4C8 4 5.5 6 5.5 9c0 0 0-3.5 6.5-4.5S24 7 18.5 9c0-3-2-5-6.5-5z" fill={color} />;
    case "wavy":
      return <path d="M6 9c0-4 2.5-5.5 6-5.5s6 1.5 6 5.5c1 0 1.5-1 1.5-1S20 3 12 3 4 8 4 9c0 0 .5 1 2 0z" fill={color} />;
    case "curly":
      return (
        <g fill={color}>
          <circle cx="7" cy="7" r="2.5" />
          <circle cx="12" cy="5" r="3" />
          <circle cx="17" cy="7" r="2.5" />
          <circle cx="9" cy="5.5" r="2" />
          <circle cx="15" cy="5.5" r="2" />
        </g>
      );
    case "long":
      return (
        <g fill={color}>
          <path d="M5 9c0-4 3-6 7-6s7 2 7 6c0 0 1-1 1-3 0-4-3.5-7-8-7S4 2 4 6c0 2 1 3 1 3z" />
          <path d="M5 9c0 0-1 3-1 6s0 4 0 4h2s-1-3-1-5 0-5 0-5z" opacity="0.9" />
          <path d="M19 9c0 0 1 3 1 6s0 4 0 4h-2s1-3 1-5 0-5 0-5z" opacity="0.9" />
        </g>
      );
    case "buzz":
      return <path d="M6 9c0-3.5 2.5-5 6-5s6 1.5 6 5c0 0 0-.5 0-1 0-3-2.5-5-6-5S6 5 6 8c0 .5 0 1 0 1z" fill={color} opacity="0.7" />;
    case "locs":
      return (
        <g fill={color}>
          <path d="M5.5 9c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6c0 0 0-1 0-2 0-3.5-3-6-6.5-6S5.5 4.5 5.5 7c0 1 0 2 0 2z" />
          <rect x="6" y="8" width="1.5" height="6" rx="0.75" />
          <rect x="9" y="7" width="1.5" height="7" rx="0.75" />
          <rect x="13.5" y="7" width="1.5" height="7" rx="0.75" />
          <rect x="16.5" y="8" width="1.5" height="6" rx="0.75" />
        </g>
      );
    case "bun":
      return (
        <g fill={color}>
          <path d="M5.5 9c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6c0 0 0-1 0-2 0-3.5-3-6-6.5-6S5.5 4.5 5.5 7c0 1 0 2 0 2z" />
          <circle cx="12" cy="3.5" r="3" />
        </g>
      );
    case "afro":
      return (
        <g fill={color}>
          <ellipse cx="12" cy="7" rx="8" ry="6" />
        </g>
      );
    case "slicked":
      return <path d="M5 9.5c0-4 3-6.5 7-6.5s7 2.5 7 6.5c0 0 .5-1 .5-2.5 0-3.5-3-6-7.5-6s-7.5 2.5-7.5 6c0 1.5.5 2.5.5 2.5z" fill={color} />;
    case "braids":
      return (
        <g fill={color}>
          <path d="M5.5 9c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6c0 0 0-1 0-2 0-3.5-3-6-6.5-6S5.5 4.5 5.5 7c0 1 0 2 0 2z" />
          <rect x="5" y="8" width="1.2" height="8" rx="0.6" />
          <rect x="7.5" y="7.5" width="1.2" height="9" rx="0.6" />
          <rect x="15.3" y="7.5" width="1.2" height="9" rx="0.6" />
          <rect x="17.8" y="8" width="1.2" height="8" rx="0.6" />
        </g>
      );
    case "mohawk":
      return (
        <g fill={color}>
          <path d="M6 9c0-3 2.5-5 6-5s6 2 6 5c0 0 0-.5 0-1 0-3-2.5-5-6-5S6 5 6 8c0 .5 0 1 0 1z" />
          <rect x="10" y="2" width="4" height="6" rx="2" />
        </g>
      );
    case "side-part":
      return <path d="M5.5 9c0-3.5 3-6 6.5-6s6.5 2.5 6.5 6c0 0 0-1 0-2 0-3.5-3-6-6.5-6S5.5 4.5 5.5 7c0 1 0 2 0 2zM8 5.5L5 8" fill={color} />;
    default:
      return <path d="M12 4C8 4 5.5 6 5.5 9c0 0 0-3.5 6.5-4.5S24 7 18.5 9c0-3-2-5-6.5-5z" fill={color} />;
  }
}

function AvatarSVG({ profile, sizeNum }: { profile: AvatarProfile; sizeNum: number }) {
  const { skinTone, hairColor, hairStyle, gender, hasBeard, hasGlasses, age } = profile;
  // Slightly darker shade for ears/shadows
  const earColor = skinTone;

  return (
    <svg viewBox="0 0 24 24" width={sizeNum} height={sizeNum} xmlns="http://www.w3.org/2000/svg">
      {/* Background circle */}
      <circle cx="12" cy="12" r="12" fill="#1E1E2E" />

      {/* Neck */}
      <rect x="10" y="16" width="4" height="3" rx="1" fill={skinTone} />

      {/* Shoulders hint */}
      <path d="M6 22c0-3 2.5-4 6-4s6 1 6 4" fill={profile.accentColor} opacity="0.6" />

      {/* Ears */}
      <ellipse cx="5.5" cy="11" rx="1.3" ry="1.8" fill={earColor} />
      <ellipse cx="18.5" cy="11" rx="1.3" ry="1.8" fill={earColor} />

      {/* Face */}
      <ellipse cx="12" cy="11" rx="6.5" ry="7.5" fill={skinTone} />

      {/* Hair */}
      {renderHair(hairStyle, hairColor, gender)}

      {/* Eyes */}
      <ellipse cx="9.5" cy="11" rx="1" ry="1.1" fill="white" />
      <ellipse cx="14.5" cy="11" rx="1" ry="1.1" fill="white" />
      <circle cx="9.5" cy="11.2" r="0.6" fill="#1A1A2E" />
      <circle cx="14.5" cy="11.2" r="0.6" fill="#1A1A2E" />

      {/* Eyebrows */}
      <path d="M8 9.3c.5-.4 1.2-.6 2-.3" stroke={hairColor} strokeWidth="0.4" fill="none" />
      <path d="M13.5 9c.8-.3 1.5-.1 2 .3" stroke={hairColor} strokeWidth="0.4" fill="none" />

      {/* Nose */}
      <path d="M12 11.5v1.5c-.3.2-.5.3-.7.2" stroke={skinTone} strokeWidth="0.3" fill="none" opacity="0.5" />

      {/* Mouth */}
      <path d="M10 14.5c.8.8 2.4.8 3.2 0" stroke="#C0392B" strokeWidth="0.5" fill="none" strokeLinecap="round" />

      {/* Beard */}
      {hasBeard && (
        <path d="M7.5 13c0 3 2 4.5 4.5 4.5s4.5-1.5 4.5-4.5" fill={hairColor} opacity="0.35" />
      )}

      {/* Glasses */}
      {hasGlasses && (
        <g fill="none" stroke="#555" strokeWidth="0.5">
          <circle cx="9.5" cy="11" r="2" />
          <circle cx="14.5" cy="11" r="2" />
          <path d="M11.5 11h1" />
          <path d="M7.5 11H5.5" />
          <path d="M16.5 11h2" />
        </g>
      )}

      {/* Age lines for mature professors */}
      {age === "mature" && (
        <g stroke={skinTone} strokeWidth="0.2" opacity="0.3">
          <path d="M7.5 10c.2-.3.3-.3.5 0" />
          <path d="M16 10c.2-.3.3-.3.5 0" />
        </g>
      )}
    </svg>
  );
}

export function ProfessorAvatar({ name, size = "sm", className }: ProfessorAvatarProps) {
  const profile = PROFESSOR_AVATARS[name] || DEFAULT_PROFILE;
  const sizeNum = size === "lg" ? 80 : 40;
  const sizeClasses = size === "lg" ? "w-20 h-20" : "w-10 h-10";

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden shrink-0",
        "ring-2",
        sizeClasses,
        className
      )}
      style={{ boxShadow: `0 0 0 2px ${profile.accentColor}40` }}
    >
      <AvatarSVG profile={profile} sizeNum={sizeNum} />
    </div>
  );
}
