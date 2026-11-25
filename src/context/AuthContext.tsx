/**
 * Authentication Context & Provider
 * Phase 4.1 — Madrassa Management Information System (MIS)
 *
 * Provides real backend JWT authentication state, role-based capability checks,
 * session validation, and seamless route protection.
 */

import React, { createContext, useState, useCallback, useEffect } from "react";
import type { AuthContextType, AuthSession, LoginCredentials, Permission, Role } from "@/types/auth";
import { AuthService } from "@/services/authService";
import { hasRolePermission, ROLE_DEFAULT_REDIRECTS } from "@/config/permissions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Restore initial authenticated session synchronously from local cache
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(() => {
    try {
      return AuthService.getCurrentSession();
    } catch (err) {
      console.error("[AuthProvider] Error restoring session on startup:", err);
      return null;
    }
  });

  // Start in loading state if a token is present in storage awaiting backend verification
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    try {
      const stored = AuthService.getCurrentSession();
      return Boolean(stored?.token);
    } catch {
      return false;
    }
  });

  // Asynchronously validate JWT token with real backend (/api/auth/me) on application mount
  useEffect(() => {
    let isMounted = true;

    const verifyBackendSession = async () => {
      const stored = AuthService.getCurrentSession();
      if (!stored?.token) {
        if (isMounted) setIsLoading(false);
        return;
      }

      try {
        const validated = await AuthService.validateSession();
        if (isMounted) {
          setCurrentUser(validated);
        }
      } catch (error) {
        console.error("[AuthProvider] Failed to validate token with backend:", error);
        if (isMounted) {
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    verifyBackendSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Direct 1-Click Role Login Handler (Preserved for tests)
  const loginAsRole = useCallback((role: Role): AuthSession => {
    const session = AuthService.loginAsRole(role);
    setCurrentUser(session);
    return session;
  }, []);

  // Real backend login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const session = await AuthService.login(credentials);
      setCurrentUser(session);
      return { success: true, session };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Real logout handler
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("[AuthProvider] Error during logout:", error);
      AuthService.clearSession();
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Role validation helper
  const hasRole = useCallback(
    (roles: Role | Role[]): boolean => {
      if (!currentUser) return false;
      const targetRoles = Array.isArray(roles) ? roles : [roles];
      return targetRoles.includes(currentUser.role);
    },
    [currentUser],
  );

  // Permission validation helper
  const hasPermission = useCallback(
    (permission: Permission): boolean => {
      if (!currentUser) return false;
      return hasRolePermission(currentUser.role, permission);
    },
    [currentUser],
  );

  // Returns the default landing path for the specified or current role
  const getRoleDefaultPath = useCallback(
    (role?: Role): string => {
      const targetRole = role || currentUser?.role;
      if (!targetRole) return "/signin";
      return ROLE_DEFAULT_REDIRECTS[targetRole] || "/dashboard";
    },
    [currentUser],
  );

  const value: AuthContextType = {
    currentUser,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    loginAsRole,
    login,
    logout,
    hasRole,
    hasPermission,
    getRoleDefaultPath,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export useAuth hook for backwards compatibility
// eslint-disable-next-line react-refresh/only-export-components
export { useAuth } from "@/hooks/useAuth";

export default AuthContext;
