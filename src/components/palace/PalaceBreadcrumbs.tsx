import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home, Building2 } from "lucide-react";
import { palaceFloors } from "@/data/palaceData";

export const PalaceBreadcrumbs = () => {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  // Build breadcrumb items based on current path
  const breadcrumbs = buildBreadcrumbs(pathParts);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4 overflow-x-auto pb-2">
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-1 shrink-0">
          {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground/50" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              {crumb.icon}
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

interface Breadcrumb {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

function buildBreadcrumbs(pathParts: string[]): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [
    { label: "Home", path: "/", icon: <Home className="h-3 w-3" /> }
  ];

  if (pathParts[0] === "palace") {
    crumbs.push({ 
      label: "Palace", 
      path: "/palace", 
      icon: <Building2 className="h-3 w-3" /> 
    });

    // Floor level
    if (pathParts[1] === "floor" && pathParts[2]) {
      const floorNum = parseInt(pathParts[2]);
      const floor = palaceFloors.find(f => f.number === floorNum);
      if (floor) {
        crumbs.push({
          label: `Floor ${floorNum}: ${floor.name}`,
          path: `/palace/floor/${floorNum}`
        });

        // Room level
        if (pathParts[3] === "room" && pathParts[4]) {
          const room = floor.rooms.find(r => r.id === pathParts[4]);
          if (room) {
            crumbs.push({
              label: `${room.tag} - ${room.name}`,
              path: `/palace/floor/${floorNum}/room/${pathParts[4]}`
            });
          }
        }
      }
    }
  }

  return crumbs;
}
