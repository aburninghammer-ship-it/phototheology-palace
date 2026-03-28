import { Link } from "react-router-dom";

interface PhototheologyOSLogoProps {
  to?: string;
  showEden?: boolean;
  compact?: boolean;
  className?: string;
}

export const PhototheologyOSLogo = ({
  to = "/",
  showEden = true,
  compact = false,
  className = "",
}: PhototheologyOSLogoProps) => {
  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      {/* Icon - gradient rounded square with sparkle */}
      <div className="relative flex-shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #a855f7, #ec4899, #f97316, #06b6d4)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L14.09 8.26L20 9.27L15.55 13.97L16.91 20L12 16.9L7.09 20L8.45 13.97L4 9.27L9.91 8.26L12 2Z"
              fill="white"
              fillOpacity="0.95"
            />
            <path
              d="M12 6L13.09 9.26L16 9.77L13.78 12.17L14.41 15.5L12 14.1L9.59 15.5L10.22 12.17L8 9.77L10.91 9.26L12 6Z"
              fill="white"
              fillOpacity="0.5"
            />
          </svg>
        </div>
      </div>

      {/* Text */}
      {!compact && (
        <div className="flex flex-col leading-none">
          <span
            className="font-bold text-[15px] tracking-tight bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(90deg, #a855f7, #ec4899, #f97316, #22d3ee, #4ade80)",
            }}
          >
            PhototheologyOS
          </span>
          {showEden && (
            <span className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[11px] font-semibold tracking-[0.2em] text-muted-foreground/70 uppercase">
                Operating System
              </span>
              <span className="text-[9px] text-muted-foreground/50 mx-1">•</span>
              <span className="text-[11px] font-semibold tracking-[0.15em] text-muted-foreground/50 uppercase">
                Eden
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Link to={to} aria-label="PhototheologyOS home">
      {content}
    </Link>
  );
};
