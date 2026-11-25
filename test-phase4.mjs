/**
 * Phase 4 Automated Real Backend Integration Test Suite
 * Tests real email-based authentication with Express + PostgreSQL backend
 * for all three development roles: Admin, Teacher, and Student.
 */

import assert from "node:assert/strict";

const localStorageStore = new Map();
globalThis.localStorage = {
  getItem: (key) => localStorageStore.get(key) ?? null,
  setItem: (key, val) => localStorageStore.set(key, String(val)),
  removeItem: (key) => localStorageStore.delete(key),
  clear: () => localStorageStore.clear(),
};

const sessionStorageStore = new Map();
globalThis.sessionStorage = {
  getItem: (key) => sessionStorageStore.get(key) ?? null,
  setItem: (key, val) => sessionStorageStore.set(key, String(val)),
  removeItem: (key) => sessionStorageStore.delete(key),
  clear: () => sessionStorageStore.clear(),
};

export async function runIntegrationTests() {
  console.log("=================================================");
  console.log("  REAL EMAIL AUTHENTICATION & MULTI-ROLE TEST SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  async function test(description, fn) {
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      console.error(err);
      failed++;
    }
  }

  const { AuthService } = await import("./src/services/authService.ts");
  const { getStoredToken, getStoredUser } = await import("./src/services/apiClient.ts");
  const { ROLE_DEFAULT_REDIRECTS, isRouteAuthorizedForRole } = await import("./src/config/permissions.ts");

  // SUITE 1: Backend Health
  await test("1.1 Backend server /api/health is live and connected to Madrassa DB", async () => {
    const res = await fetch("http://localhost:5000/api/health");
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, "ok");
    assert.equal(data.database, "Madrassa");
  });

  // SUITE 2: Real Admin Email Login Authentication
  let adminToken = "";
  await test("2.1 Admin login with valid email (admin@gmail.com / 112233)", async () => {
    const session = await AuthService.login({
      email: "admin@gmail.com",
      password: "112233",
    });

    assert.equal(session.role, "ADMIN");
    assert.equal(session.username, "admin");
    assert.equal(session.email, "admin@gmail.com");
    assert.notEqual(session.token, undefined);
    assert.ok(session.token.startsWith("eyJ"));
    assert.equal(ROLE_DEFAULT_REDIRECTS[session.role], "/dashboard");

    adminToken = session.token;
    assert.equal(getStoredToken(), adminToken);
    const cached = getStoredUser();
    assert.equal(cached?.username, "admin");
    assert.equal(cached?.role, "ADMIN");
  });

  await test("2.2 Admin login supports case-insensitive email (ADMIN@GMAIL.COM)", async () => {
    const session = await AuthService.login({
      email: "ADMIN@GMAIL.COM",
      password: "112233",
    });
    assert.equal(session.role, "ADMIN");
  });

  // SUITE 3: Real Teacher Email Login Authentication
  let teacherToken = "";
  await test("3.1 Teacher login with valid email (teacher@gmail.com / 112233)", async () => {
    const session = await AuthService.login({
      email: "teacher@gmail.com",
      password: "112233",
    });

    assert.equal(session.role, "TEACHER");
    assert.equal(session.username, "teacher");
    assert.equal(session.email, "teacher@gmail.com");
    assert.notEqual(session.token, undefined);
    assert.ok(session.token.startsWith("eyJ"));
    assert.equal(ROLE_DEFAULT_REDIRECTS[session.role], "/teacher/dashboard");
    assert.notEqual(session.teacherProfile, undefined);

    teacherToken = session.token;
  });

  // SUITE 4: Real Student Email Login Authentication
  let studentToken = "";
  await test("4.1 Student login with valid email (student@gmail.com / 112233)", async () => {
    const session = await AuthService.login({
      email: "student@gmail.com",
      password: "112233",
    });

    assert.equal(session.role, "STUDENT");
    assert.equal(session.username, "student");
    assert.equal(session.email, "student@gmail.com");
    assert.notEqual(session.token, undefined);
    assert.ok(session.token.startsWith("eyJ"));
    assert.equal(ROLE_DEFAULT_REDIRECTS[session.role], "/student/dashboard");
    assert.notEqual(session.studentProfile, undefined);

    studentToken = session.token;
  });

  // SUITE 5: Rejection of Invalid Credentials
  await test("5.1 Login fails with incorrect password (admin@gmail.com / wrongpass)", async () => {
    await assert.rejects(
      async () => {
        await AuthService.login({
          email: "admin@gmail.com",
          password: "wrongpassword",
        });
      },
      (err) => {
        assert.ok(err.message.includes("Invalid email or password"));
        return true;
      }
    );
  });

  await test("5.2 Login fails with non-existent email (unknown@gmail.com)", async () => {
    await assert.rejects(
      async () => {
        await AuthService.login({
          email: "unknown@gmail.com",
          password: "112233",
        });
      },
      (err) => {
        assert.ok(err.message.includes("Invalid email or password"));
        return true;
      }
    );
  });

  await test("5.3 Login fails with empty password", async () => {
    await assert.rejects(
      async () => {
        await AuthService.login({
          email: "admin@gmail.com",
          password: "",
        });
      },
      (err) => {
        assert.ok(err.message.includes("Email and password are required"));
        return true;
      }
    );
  });

  // SUITE 6: Session Validation via /api/auth/me
  await test("6.1 Validate session retrieves verified user from backend /api/auth/me", async () => {
    await AuthService.login({ email: "admin@gmail.com", password: "112233" });
    const validated = await AuthService.validateSession();
    assert.notEqual(validated, null);
    assert.equal(validated?.role, "ADMIN");
    assert.equal(validated?.username, "admin");
  });

  await test("6.2 Validate session fails and clears storage when token is invalid/tampered", async () => {
    localStorage.setItem("madrassa_jwt_token", "invalid.jwt.token");
    const result = await AuthService.validateSession();
    assert.equal(result, null);
    assert.equal(getStoredToken(), null);
  });

  // SUITE 7: Backend Role Protection & Route Authorization
  await test("7.1 Admin token allows access to /api/test/admin-only", async () => {
    const res = await fetch("http://localhost:5000/api/test/admin-only", {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.message, "Welcome Admin");
  });

  await test("7.2 Missing token is rejected with 401 on protected endpoint", async () => {
    const res = await fetch("http://localhost:5000/api/test/admin-only");
    assert.equal(res.status, 401);
  });

  await test("7.3 Teacher token is rejected on Admin-only endpoint with 403 Forbidden", async () => {
    const res = await fetch("http://localhost:5000/api/test/admin-only", {
      headers: { Authorization: `Bearer ${teacherToken}` },
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.ok(data.message.includes("Forbidden") || data.message.includes("Access denied"));
  });

  await test("7.4 Student token is rejected on Admin-only endpoint with 403 Forbidden", async () => {
    const res = await fetch("http://localhost:5000/api/test/admin-only", {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    assert.equal(res.status, 403);
  });

  // SUITE 8: Frontend Route Role Access Matrix
  await test("8.1 Role routing isolation: Admin cannot be routed to Teacher/Student only routes", () => {
    assert.equal(isRouteAuthorizedForRole("ADMIN", "/dashboard"), true);
    assert.equal(isRouteAuthorizedForRole("TEACHER", "/dashboard"), false);
    assert.equal(isRouteAuthorizedForRole("STUDENT", "/dashboard"), false);

    assert.equal(isRouteAuthorizedForRole("TEACHER", "/teacher/dashboard"), true);
    assert.equal(isRouteAuthorizedForRole("STUDENT", "/teacher/dashboard"), false);

    assert.equal(isRouteAuthorizedForRole("STUDENT", "/student/dashboard"), true);
    assert.equal(isRouteAuthorizedForRole("TEACHER", "/student/dashboard"), false);
  });

  // SUITE 9: Logout Cleanup
  await test("9.1 Logout removes token and identity cache cleanly", async () => {
    await AuthService.login({ email: "admin@gmail.com", password: "112233" });
    assert.notEqual(getStoredToken(), null);

    await AuthService.logout();
    assert.equal(getStoredToken(), null);
    assert.equal(getStoredUser(), null);
    assert.equal(AuthService.getCurrentSession(), null);
  });

  console.log("\n=================================================");
  console.log(`  INTEGRATION TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}
