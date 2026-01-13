import { Navigate, Outlet } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface RoleRouteProps {
  allowedRoles: string[];
}

export default function RoleRoute({ allowedRoles }: RoleRouteProps) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium animate-pulse text-lg">
          Verificando permisos...
        </p>
      </div>
    );
  }

  // If userRole is null (not yet loaded or no role), but we are authenticated, it might be an issue. 
  // But strictly, if userRole is not in allowedRoles, redirect.
  // We assume userRole is "ROLE_ESPECIALISTA" or "ROLE_PASANTE" or "ROLE_SUPER_ADMIN" etc.

  // Optional: Redirect to a clearer "Unauthorized" page instead of home if desired.
  // For now, redirect to home "/" is a safe default.
  
  if (!userRole || !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
