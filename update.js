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
// For private repos: Setup PAT authentication on VPS (one-time):
// 1. Create PAT on GitHub: Settings > Developer settings > Personal access tokens > Tokens (classic)
// 2. On VPS, configure credential helper:
//    git config --global credential.helper store
// 3. Do one manual pull: git pull (enter username and PAT as password)
//    This saves credentials for future use

try {
    // Try to get current branch
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoPath, encoding: "utf-8" }).trim();
    run(`git pull origin ${currentBranch}`);
} catch (err) {
    // Fallback to main if branch detection fails
    console.log("[UPDATE] Could not detect branch, using 'main' as fallback");
    run("git pull origin main");
}

console.log("[UPDATE] Ensuring dependencies are installed...");
// Install all dependencies (including dev) since Next.js needs them for build
run("npm install");

console.log("[UPDATE] Building Next.js application...");
run("npm run build");

console.log("[UPDATE] Update and build complete. Run 'npm run start' to start the server.");

