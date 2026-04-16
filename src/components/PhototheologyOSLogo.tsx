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
    <div className={`flex items-center gap-3.5 group ${className}`}>
      {/* Icon - warm gold rounded square with sparkle */}
      <div className="relative flex-shrink-0">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #b8860b, #d4a017, #e6be44, #c8922a)",
            boxShadow: "0 0 16px rgba(212, 160, 23, 0.4), inset 0 1px 1px rgba(255,255,255,0.2)",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-8 h-8"
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
        <div className="flex flex-col leading-none gap-1">
          <div className="flex items-center gap-2">
            <span
              className="font-bold text-[22px] tracking-[0.04em] uppercase"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "#d4a017",
                textShadow: "0 0 12px rgba(212, 160, 23, 0.3)",
              }}
            >
              PHOTOTHEOLOGY
            </span>
            <span
              className="text-[12px] font-semibold tracking-wide px-2 py-0.5 rounded"
              style={{
                fontFamily: "'Inter', sans-serif",
                color: "#d4a017",
                background: "rgba(212, 160, 23, 0.15)",
                border: "1px solid rgba(212, 160, 23, 0.4)",
              }}
            >
              OS
            </span>
          </div>
          {showEden && (
            <span className="flex items-center gap-2">
              <span
               className="text-[12px] font-semibold tracking-[0.2em] uppercase"
                style={{ color: "#d4a017" }}
              >
                Eden
              </span>
              <span className="text-[9px] mx-0.5" style={{ color: "rgba(212, 160, 23, 0.4)" }}>•</span>
              <span
                className="text-[10px] tracking-wide"
                style={{ color: "rgba(255, 255, 255, 0.5)" }}
              >
                Powered by AI. Built for Biblical Intelligence.
              </span>
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
