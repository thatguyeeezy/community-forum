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
// Uses GITHUB_TOKEN environment variable if available for private repo authentication

const githubToken = process.env.GITHUB_TOKEN;
let pullCommand;

try {
    // Try to get current branch
    const currentBranch = execSync("git rev-parse --abbrev-ref HEAD", { cwd: repoPath, encoding: "utf-8" }).trim();
    
    if (githubToken) {
        // Get remote URL and inject token for authentication
        const remoteUrl = execSync("git config --get remote.origin.url", { cwd: repoPath, encoding: "utf-8" }).trim();
        if (remoteUrl.startsWith("https://")) {
            // Insert token into HTTPS URL
            const urlWithToken = remoteUrl.replace("https://", `https://${githubToken}@`);
            pullCommand = `git pull ${urlWithToken} ${currentBranch}`;
        } else {
            pullCommand = `git pull origin ${currentBranch}`;
        }
    } else {
        pullCommand = `git pull origin ${currentBranch}`;
    }
    run(pullCommand);
} catch (err) {
    // Fallback to main if branch detection fails
    console.log("[UPDATE] Could not detect branch, using 'main' as fallback");
    if (githubToken) {
        try {
            const remoteUrl = execSync("git config --get remote.origin.url", { cwd: repoPath, encoding: "utf-8" }).trim();
            if (remoteUrl.startsWith("https://")) {
                const urlWithToken = remoteUrl.replace("https://", `https://${githubToken}@`);
                run(`git pull ${urlWithToken} main`);
            } else {
                run("git pull origin main");
            }
        } catch (e) {
            run("git pull origin main");
        }
    } else {
        run("git pull origin main");
    }
}

console.log("[UPDATE] Ensuring dependencies are installed...");
// Install all dependencies (including dev) since Next.js needs them for build
run("npm install");

console.log("[UPDATE] Building Next.js application...");
run("npm run build");

console.log("[UPDATE] Update and build complete. Starting server...");
// Start the production server
run("npm run start");

