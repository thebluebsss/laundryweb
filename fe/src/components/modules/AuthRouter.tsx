import { ReactElement, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from 'contexts/auth';
import { UserRole } from 'types/user';

export function RequireAuth({ children, isAdmin }: { children: ReactElement; isAdmin?: boolean }) {
  const { auth, fetchCurrentUser } = useAuth();
  const [loading, setLoading] = useState(!auth);
  const location = useLocation();

  useEffect(() => {
    if (!auth) {
      fetchCurrentUser().finally(() => setLoading(false));
    }
  }, [auth, fetchCurrentUser]);

  if (loading) return null;

  if (!auth) {
    return <Navigate to={isAdmin ? '/admin/login' : '/login'} state={{ from: location }} replace />;
  }

  return children;
}

export function RequireRole({
  children,
  allowedRoles,
  isAdmin
}: {
  children: ReactElement;
  allowedRoles: UserRole[];
  isAdmin?: boolean;
}) {
  const { auth } = useAuth();
  if (!auth?.role) {
    return <Navigate to={isAdmin ? '/admin/login' : '/login'} replace />;
  }
  if (!allowedRoles.includes(auth.role)) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/'} replace />;
  }
  return children;
}

export function RequireAdminAuth({ children }: { children: ReactElement }) {
  return (
    <RequireAuth isAdmin>
      <RequireRole isAdmin allowedRoles={[UserRole.CLINIC_ADMIN]}>
        {children}
      </RequireRole>
    </RequireAuth>
  );
}

export function RequireAppAuth({ children }: { children: ReactElement }) {
  return (
    <RequireAuth>
      <RequireRole
        allowedRoles={[
          UserRole.CLINIC_STAFF,
          UserRole.CLINIC_PROVIDER,
          UserRole.CLINIC_ADVISOR,
          UserRole.CLINIC_ADMIN
        ]}>
        {children}
      </RequireRole>
    </RequireAuth>
  );
}
