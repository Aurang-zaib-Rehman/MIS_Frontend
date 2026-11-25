/**
 * End-to-End Verification Test Suite: Student Registration, Login & Profile Workflow
 * Phase 5 — Madrassa Management Information System (MIS)
 */

import assert from "node:assert/strict";

const API_BASE = "http://localhost:5000";

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`[PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`[FAIL] ${name}`);
    console.error(err);
    failed++;
  }
}

export async function runStudentWorkflowTests() {
  console.log("\n=================================================");
  console.log("  STUDENT WORKFLOW & PROFILE VERIFICATION SUITE  ");
  console.log("=================================================\n");

  const testStudentEmail = `verify_student_${Date.now()}@madrassa-test.com`;
  const testStudentPassword = "TestPassword@123";
  const testStudentName = "Hafiz Usman Ghani";
  const testGuardian = "Ghulam Muhammad";
  const testPhone = "0333-7654321";
  const testDob = "2005-09-20";
  const testAddress = "Madina Town, Faisalabad";

  let studentJwtToken = null;
  let registeredUserId = null;

  // 1. Role Boundary Verification: Prevent Admin/Teacher public registration
  await test("1.1 Backend rejects attempts to register as ADMIN (HTTP 403)", async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "unauthorized_admin@test.com",
        password: testStudentPassword,
        fullName: "Fake Admin",
        role: "ADMIN",
      }),
    });
    assert.equal(res.status, 403);
    const data = await res.json();
    assert.match(data.message, /restricted to students only/i);
  });

  await test("1.2 Backend rejects attempts to register as TEACHER (HTTP 403)", async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "unauthorized_teacher@test.com",
        password: testStudentPassword,
        fullName: "Fake Teacher",
        role: "TEACHER",
      }),
    });
    assert.equal(res.status, 403);
  });

  // 2. Student Registration
  await test("2.1 Student registration succeeds (HTTP 201) and does NOT return a token (no auto-login)", async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testStudentPassword,
        fullName: testStudentName,
        guardianName: testGuardian,
        phoneNumber: testPhone,
        dateOfBirth: testDob,
        address: testAddress,
      }),
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.match(data.message, /registered successfully/i);
    assert.equal(data.token, undefined); // STRICT: NO TOKEN ON SIGNUP
    assert.ok(data.user);
    assert.equal(data.user.email, testStudentEmail);
    assert.equal(data.user.fullName, testStudentName);
    registeredUserId = data.user.userId;
  });

  await test("2.2 Duplicate email registration is prevented (HTTP 409)", async () => {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testStudentPassword,
        fullName: "Duplicate User",
      }),
    });
    assert.equal(res.status, 409);
  });

  // 3. Student Authentication (Login)
  await test("3.1 Registered student authenticates successfully via POST /api/auth/login", async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testStudentEmail,
        password: testStudentPassword,
      }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.token);
    assert.equal(data.user.role, "student");
    assert.equal(data.user.email, testStudentEmail);
    assert.equal(data.user.fullName, testStudentName);
    studentJwtToken = data.token;
  });

  // 4. Student Profile Retrieval (GET /api/student/profile)
  await test("4.1 Profile endpoint returns student's actual database record (no fake data)", async () => {
    const res = await fetch(`${API_BASE}/api/student/profile`, {
      headers: { Authorization: `Bearer ${studentJwtToken}` },
    });
    assert.equal(res.status, 200);
    const profile = await res.json();

    assert.equal(profile.fullName, testStudentName);
    assert.equal(profile.email, testStudentEmail);
    assert.equal(profile.phoneNumber, testPhone);
    assert.equal(profile.address, testAddress);
    assert.equal(profile.guardianName, testGuardian);
    assert.equal(profile.role, "STUDENT");

    // Must NOT contain hardcoded fallback data
    assert.notEqual(profile.fullName, "Muhammad Abdullah Khan");
    assert.notEqual(profile.email, "student@madrassa.com");
  });

  await test("4.2 Unassigned academic details strictly return null / unassigned indicators", async () => {
    const res = await fetch(`${API_BASE}/api/student/profile`, {
      headers: { Authorization: `Bearer ${studentJwtToken}` },
    });
    const profile = await res.json();
    const academic = profile.academic;

    assert.equal(academic.isAssigned, false);
    assert.equal(academic.studentId, null);
    assert.equal(academic.rollNo, null);
    assert.equal(academic.department, null);
    assert.equal(academic.darja, null);
    assert.equal(academic.monthlyFee, null);
  });

  // 5. Edit Profile Functionality (PUT /api/student/profile)
  await test("5.1 Student can update permitted personal details immediately", async () => {
    const updatedAddress = "Al-Rehman Hostel, Room 4, Faisalabad";
    const updatedPhone = "0300-9988776";
    const updatedGuardian = "Muhammad Akbar Ghani";

    const res = await fetch(`${API_BASE}/api/student/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${studentJwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: updatedAddress,
        phoneNumber: updatedPhone,
        guardianName: updatedGuardian,
      }),
    });
    assert.equal(res.status, 200);
    const updated = await res.json();

    assert.equal(updated.address, updatedAddress);
    assert.equal(updated.phoneNumber, updatedPhone);
    assert.equal(updated.guardianName, updatedGuardian);
    assert.equal(updated.fullName, testStudentName);
  });

  await test("5.2 Student cannot alter administrative or security fields (role, fees, department)", async () => {
    const res = await fetch(`${API_BASE}/api/student/profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${studentJwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "admin",
        monthlyFee: 0,
        department: "Tajweed",
        email: "hacked@admin.com",
      }),
    });
    assert.equal(res.status, 200);
    const updated = await res.json();

    assert.equal(updated.role, "STUDENT");
    assert.equal(updated.email, testStudentEmail);
    assert.equal(updated.academic.department, null);
    assert.equal(updated.academic.monthlyFee, null);
  });

  // 6. Test Development Accounts Remain Intact
  await test("6.1 Admin test account (admin@gmail.com / 112233) remains functional", async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@gmail.com", password: "112233" }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.role, "admin");
  });

  await test("6.2 Teacher test account (teacher@gmail.com / 112233) remains functional", async () => {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "teacher@gmail.com", password: "112233" }),
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.user.role, "teacher");
  });

  await test("6.3 Student test account (student@gmail.com / 112233) profile displays real name", async () => {
    const loginRes = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "student@gmail.com", password: "112233" }),
    });
    assert.equal(loginRes.status, 200);
    const loginData = await loginRes.json();

    const profileRes = await fetch(`${API_BASE}/api/student/profile`, {
      headers: { Authorization: `Bearer ${loginData.token}` },
    });
    assert.equal(profileRes.status, 200);
    const profile = await profileRes.json();
    assert.equal(profile.fullName, "Muhammad Bilal");
    assert.equal(profile.email, "student@gmail.com");
  });

  // Clean up registered test user safely via test cleanup endpoint
  if (registeredUserId) {
    try {
      await fetch(`${API_BASE}/api/test/cleanup-test-user/${registeredUserId}`, {
        method: "DELETE",
      });
    } catch {
      // Ignored
    }
  }

  console.log("\n=================================================");
  console.log(`  STUDENT WORKFLOW RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("=================================================\n");

  if (failed > 0) {
    throw new Error(`${failed} student workflow tests failed!`);
  }
}

if (process.argv[1]?.endsWith("test-student-workflow.mjs")) {
  runStudentWorkflowTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
