import { createServer } from "vite";

async function main() {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    console.log("\n>>> RUNNING TEST SUITE 1: PHASE 3 RBAC & ROLES <<<");
    const modPhase3 = await vite.ssrLoadModule("./test-phase3.mjs");
    await modPhase3.runTests();

    console.log("\n>>> RUNNING TEST SUITE 2: PHASE 4.1 REAL BACKEND AUTHENTICATION <<<");
    const modPhase4 = await vite.ssrLoadModule("./test-phase4.mjs");
    await modPhase4.runIntegrationTests();

    console.log("\n>>> RUNNING TEST SUITE 3: STUDENT REGISTRATION, LOGIN & PROFILE WORKFLOW <<<");
    const modStudentWorkflow = await vite.ssrLoadModule("./test-student-workflow.mjs");
    await modStudentWorkflow.runStudentWorkflowTests();
  } finally {
    await vite.close();
  }
}

main().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
