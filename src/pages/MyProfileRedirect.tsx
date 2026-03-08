import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function MyProfileRedirect() {
  const { user } = useAuth();
  if (!user) return <LoadingScreen />;
  return <Navigate to={`/user/${user.id}`} replace />;
}
