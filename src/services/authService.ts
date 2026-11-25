/**
 * Authentication Service
 * Phase 4.1 — Madrassa Management Information System (MIS)
 *
 * Integrated with real Node.js/Express backend authentication API:
 * - POST /api/auth/login (JWT credential authentication)
 * - GET  /api/auth/me    (JWT session validation)
 *
 * Replaces mock credential simulation with real cryptographic tokens,
 * while maintaining compatibility with RBAC guards and test suites.
 */

import type {
  AuthSession,
  BackendLoginResponse,
  BackendMeResponse,
  LoginCredentials,
  Role,
} from "@/types/auth";
import {
  ApiError,
  apiClient,
  getStoredToken,
  getStoredUser,
  removeStoredToken,
  removeStoredUser,
  setStoredToken,
  setStoredUser,
} from "./apiClient";
import {
  getRoleSession,
  MOCK_CLASS_ATTENDANCE,
  MOCK_STUDENT_RECORDS,
  ROLE_PROFILES,
  type MockClassAttendanceRecord,
  type MockStudentRecord,
} from "./mockAuthData";

// Session storage keys for dev/mock test harness compatibility
export const DEV_ROLE_SESSION_KEY = "madrassa_dev_role";
export const LEGACY_STORAGE_KEY = "madrassa_auth_session_v1";

const VALID_ROLES: Role[] = ["ADMIN", "TEACHER", "STUDENT"];

export class AuthService {
  /**
   * Permanently purge any legacy mock auth data from localStorage
   */
  public static purgeLegacyStorage(): void {
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      } catch (e) {
        console.warn("[AuthService] Could not clear legacy localStorage key:", e);
      }
    }
  }

  /**
   * Registers a new student account via POST /api/auth/register
   * Does NOT return a JWT token or create an authenticated session (no auto-login).
   */
  public static async register(data: {
    fullName: string;
    email: string;
    password: string;
    guardianName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    address?: string;
  }): Promise<{ message: string; user?: unknown }> {
    return apiClient.post<{ message: string; user?: unknown }>(
      "/api/auth/register",
      data,
      { skipAuth: true }
    );
  }

  /**
   * Authenticates against the real backend via POST /api/auth/login
   */
  public static async login(credentials: LoginCredentials): Promise<AuthSession> {
    this.purgeLegacyStorage();

    const email = (credentials.email || credentials.username || "").trim();
    const password = credentials.password;

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    // Call real backend authentication API (sending email primary, username for fallback)
    const response = await apiClient.post<BackendLoginResponse>(
      "/api/auth/login",
      { email, username: email, password },
      { skipAuth: true },
    );

    if (!response || !response.token || !response.user) {
      throw new Error("Invalid response received from authentication server.");
    }

    const { token, user } = response;

    // Normalize backend lowercase role (e.g. "admin") to frontend uppercase Role ("ADMIN")
    const normalizedRole = user.role.toUpperCase() as Role;
    const finalRole: Role = VALID_ROLES.includes(normalizedRole) ? normalizedRole : "ADMIN";

    const userEmail = user.email || (email.includes("@") ? email : `${user.username}@madrassa.edu.pk`);

    // Persist JWT token and identity cache
    setStoredToken(token);
    setStoredUser({
      userId: String(user.userId),
      username: user.username,
      role: finalRole,
    });

    // Also mirror to sessionStorage for role-based tab retention
    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem(DEV_ROLE_SESSION_KEY, finalRole);
      } catch {
        // Ignored
      }
    }

    const session: AuthSession = {
      userId: String(user.userId),
      name: user.fullName || user.username,
      username: user.username,
      fullName: user.fullName || user.username,
      email: userEmail,
      role: finalRole,
      avatar: finalRole === "ADMIN" ? "/images/user/muhtamim.jpeg" : "/images/user/user-01.jpg",
      loginTimestamp: Date.now(),
      token,
      phoneNumber: user.phoneNumber || undefined,
      address: user.address || undefined,
      guardianName: user.guardianName || undefined,
      dateOfBirth: user.dateOfBirth || undefined,
      ...(finalRole === "TEACHER" ? { teacherProfile: ROLE_PROFILES.TEACHER.teacherProfile } : {}),
      ...(finalRole === "STUDENT" ? { studentProfile: ROLE_PROFILES.STUDENT.studentProfile } : {}),
    };

    return session;
  }

  /**
   * Asynchronously validates current JWT token with real backend via GET /api/auth/me
   * Called during application bootstrap and page refreshes.
   */
  public static async validateSession(): Promise<AuthSession | null> {
    this.purgeLegacyStorage();

    const token = getStoredToken();
    if (!token) {
      // Check if fallback dev session is active in sessionStorage (e.g. during test suites)
      return this.getCurrentSession();
    }

    try {
      const response = await apiClient.get<BackendMeResponse>("/api/auth/me");

      if (!response || !response.user) {
        this.clearSession();
        return null;
      }

      const { user } = response;
      const normalizedRole = user.role.toUpperCase() as Role;
      const finalRole: Role = VALID_ROLES.includes(normalizedRole) ? normalizedRole : "ADMIN";

      // Restore username from cached user storage
      const cachedUser = getStoredUser();
      const username = cachedUser?.username || "admin";

      const session: AuthSession = {
        userId: String(user.userId),
        name: username,
        username,
        email: `${username}@madrassa.edu.pk`,
        role: finalRole,
        avatar: finalRole === "ADMIN" ? "/images/user/muhtamim.jpeg" : "/images/user/user-01.jpg",
        loginTimestamp: Date.now(),
        token,
        ...(finalRole === "TEACHER" ? { teacherProfile: ROLE_PROFILES.TEACHER.teacherProfile } : {}),
        ...(finalRole === "STUDENT" ? { studentProfile: ROLE_PROFILES.STUDENT.studentProfile } : {}),
      };

      // Keep cached identity refreshed
      setStoredUser({
        userId: String(user.userId),
        username,
        role: finalRole,
      });

      return session;
    } catch (error: unknown) {
      const errStatus = error instanceof ApiError ? error.status : null;
      const errMsg = error instanceof Error ? error.message : String(error);
      console.warn("[AuthService] Token validation failed against backend:", errMsg);

      // If server returned 401 (Invalid/expired token), session is terminated
      if (errStatus === 401) {
        this.clearSession();
        return null;
      }
      // On temporary network disconnection, allow cached session if valid token was present
      const cachedUser = getStoredUser();
      if (cachedUser && token) {
        return {
          userId: cachedUser.userId,
          name: cachedUser.username,
          username: cachedUser.username,
          email: `${cachedUser.username}@madrassa.edu.pk`,
          role: cachedUser.role,
          avatar: "/images/user/user-01.jpg",
          loginTimestamp: Date.now(),
          token,
        };
      }
      return null;
    }
  }

  /**
   * Synchronously retrieves the current session from local cache.
   * Enables immediate UI hydration prior to async /api/auth/me verification,
   * and preserves synchronous behavior for existing unit tests.
   */
  public static getCurrentSession(): AuthSession | null {
    this.purgeLegacyStorage();

    // 1. Check real stored token & user
    const token = getStoredToken();
    const cachedUser = getStoredUser();

    if (token && cachedUser) {
      return {
        userId: cachedUser.userId,
        name: cachedUser.username,
        username: cachedUser.username,
        email: `${cachedUser.username}@madrassa.edu.pk`,
        role: cachedUser.role,
        avatar: cachedUser.role === "ADMIN" ? "/images/user/muhtamim.jpeg" : "/images/user/user-01.jpg",
        loginTimestamp: Date.now(),
        token,
        ...(cachedUser.role === "TEACHER" ? { teacherProfile: ROLE_PROFILES.TEACHER.teacherProfile } : {}),
        ...(cachedUser.role === "STUDENT" ? { studentProfile: ROLE_PROFILES.STUDENT.studentProfile } : {}),
      };
    }

    // 2. Check dev role in sessionStorage (for mock/test suite compatibility)
    if (typeof sessionStorage !== "undefined") {
      try {
        const storedRole = sessionStorage.getItem(DEV_ROLE_SESSION_KEY) as Role | null;
        if (storedRole && VALID_ROLES.includes(storedRole)) {
          return getRoleSession(storedRole);
        }
      } catch (error) {
        console.error("[AuthService] Failed to read active role from sessionStorage:", error);
      }
    }

    return null;
  }

  /**
   * 1-Click Role Login: Used by test runner (test-phase3.mjs) and dev simulation
   */
  public static loginAsRole(role: Role): AuthSession {
    this.purgeLegacyStorage();

    const targetRole: Role = VALID_ROLES.includes(role) ? role : "ADMIN";
    const session = getRoleSession(targetRole);

    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem(DEV_ROLE_SESSION_KEY, targetRole);
      } catch (e) {
        console.error("[AuthService] Failed to persist role to sessionStorage:", e);
      }
    }

    return session;
  }

  /**
   * Terminates active session and clears all tokens and cached state
   */
  public static async logout(): Promise<void> {
    this.clearSession();
  }

  /**
   * Clears all session tokens, cached user info, and dev storage
   */
  public static clearSession(): void {
    this.purgeLegacyStorage();
    removeStoredToken();
    removeStoredUser();

    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.removeItem(DEV_ROLE_SESSION_KEY);
      } catch (e) {
        console.error("[AuthService] Failed to clear sessionStorage role:", e);
      }
    }
  }

  /**
   * Direct role profile getter (retained for backward compatibility)
   */
  public static getRoleProfile(role: Role): AuthSession {
    return ROLE_PROFILES[role] || ROLE_PROFILES.ADMIN;
  }

  // =========================================================================
  // Role & Data Isolation Demonstration Methods (Preserved for tests)
  // =========================================================================

  public static getStudentRecords(session: AuthSession): MockStudentRecord[] {
    if (session.role === "ADMIN") {
      return MOCK_STUDENT_RECORDS;
    }
    if (session.role === "STUDENT" && session.studentProfile) {
      return MOCK_STUDENT_RECORDS.filter(
        (rec) => rec.studentId === session.studentProfile?.studentId,
      );
    }
    return [];
  }

  public static getClassAttendanceRecords(session: AuthSession): MockClassAttendanceRecord[] {
    if (session.role === "ADMIN") {
      return MOCK_CLASS_ATTENDANCE;
    }
    if (session.role === "TEACHER" && session.teacherProfile) {
      return MOCK_CLASS_ATTENDANCE.filter(
        (rec) => rec.teacherId === session.teacherProfile?.teacherId,
      );
    }
    return [];
  }
}

export default AuthService;
