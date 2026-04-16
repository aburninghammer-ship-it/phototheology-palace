import { ArrowLeft, Home, Bell, Menu, Globe } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { LanguageSelector } from "@/components/settings/LanguageSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MobileNavHeaderProps {
  title?: string;
  showBack?: boolean;
  showHome?: boolean;
  showNotifications?: boolean;
  showPublicLink?: boolean;
  onMenuClick?: () => void;
  className?: string;
}

export function MobileNavHeader({
  title,
  showBack = true,
  showHome = true,
  showNotifications = true,
  showPublicLink = true,
  onMenuClick,
  className
}: MobileNavHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();

  const canGoBack = window.history.length > 1;
  const isHomePage = location.pathname === '/living-manna' || location.pathname === '/dashboard';

  const handleBack = () => {
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate('/living-manna');
    }
  };

  const handleHome = () => {
    navigate('/living-manna');
  };

  const handlePublicSpace = () => {
    navigate('/');
  };

  return (
    <div className={cn(
      "sticky top-0 z-40 md:hidden bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3",
      className
    )}>
      <div className="flex items-center justify-between gap-2">
        {/* Left side - Back/Menu */}
        <div className="flex items-center gap-2">
          {showBack && !isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-9 w-9 shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onMenuClick}
              className="h-9 w-9 shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Title */}
        {title && (
          <h1 className="flex-1 text-center font-semibold text-foreground truncate px-2">
            {title}
          </h1>
        )}

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 shrink-0"
                title="Change language"
              >
                <Globe className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="end">
              <LanguageSelector showLabel={false} />
            </PopoverContent>
          </Popover>
          {showHome && !isHomePage && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleHome}
              className="h-9 w-9 shrink-0"
            >
              <Home className="h-5 w-5" />
            </Button>
          )}
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 relative"
              onClick={() => navigate('/living-manna?tab=connect')}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 min-w-[20px] p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
