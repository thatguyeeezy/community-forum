const { execSync } = require("child_process");
const path = require("path");

const repoPath = __dirname;

function run(cmd) {
    try {
        console.log("[UPDATE] Running:", cmd);
        const result = execSync(cmd, { cwd: repoPath, stdio: "inherit" });
        return result;
    } catch (err) {
        console.error("[UPDATE] Error:", err.message);
        process.exit(1);
    }
}

console.log("[UPDATE] Pulling latest changes from repository...");
run("git pull");

console.log("[UPDATE] Ensuring dependencies are installed...");
// Install all dependencies (including dev) since Next.js needs them for build
run("npm install");

console.log("[UPDATE] Building Next.js application...");
run("npm run build");

console.log("[UPDATE] Update and build complete. Starting server...");
// Start the production server
run("npm run start");

