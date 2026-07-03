"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitService = void 0;
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const REPOS_DIR = path_1.default.join(__dirname, '../temp_repos');
// Ensure temporary cloning directory exists
if (!fs_1.default.existsSync(REPOS_DIR)) {
    fs_1.default.mkdirSync(REPOS_DIR, { recursive: true });
}
class GitService {
    git;
    constructor() {
        this.git = (0, simple_git_1.default)();
    }
    // Securely sanitize Git repository URLs
    static sanitizeUrl(url) {
        const gitUrlRegex = /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
        if (!gitUrlRegex.test(url)) {
            throw new Error('Invalid repository URL structure. Only HTTPS GitHub/GitLab clone URLs are allowed.');
        }
        return url;
    }
    // Get local repository directory name from URL
    getRepoPath(repoUrl) {
        const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'temp_repo';
        return path_1.default.join(REPOS_DIR, repoName);
    }
    // Clone a repository with shallow weight parameters
    async cloneRepository(repoUrl) {
        const sanitizedUrl = GitService.sanitizeUrl(repoUrl);
        const targetPath = this.getRepoPath(sanitizedUrl);
        // Clean up directory if it already exists
        if (fs_1.default.existsSync(targetPath)) {
            fs_1.default.rmSync(targetPath, { recursive: true, force: true });
        }
        // Run shallow clone operation: depth 10 to allow scrub timeline
        await this.git.clone(sanitizedUrl, targetPath, [
            '--depth', '10',
            '--no-tags',
            '--single-branch'
        ]);
        return targetPath;
    }
    // Retrieve commit logs from local repository
    async getCommits(repoPath) {
        const git = (0, simple_git_1.default)(repoPath);
        const log = await git.log();
        return log.all.map(commit => ({
            hash: commit.hash.substring(0, 8),
            author: commit.author_name,
            date: commit.date,
            message: commit.message
        }));
    }
    // Retrieve files modified in a specific commit
    async getChangedFiles(repoPath, commitHash) {
        const git = (0, simple_git_1.default)(repoPath);
        // Run git show --numstat to get addition/deletion counts
        const numstatOutput = (0, child_process_1.execSync)(`git show --numstat --format="" ${commitHash}`, { cwd: repoPath }).toString();
        const statusOutput = (0, child_process_1.execSync)(`git show --name-status --format="" ${commitHash}`, { cwd: repoPath }).toString();
        const statsMap = new Map();
        numstatOutput.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 3) {
                const additions = parseInt(parts[0]) || 0;
                const deletions = parseInt(parts[1]) || 0;
                const filepath = parts[2].trim();
                statsMap.set(filepath, { additions, deletions });
            }
        });
        const files = [];
        statusOutput.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const code = parts[0].trim();
                const filepath = parts[1].trim();
                const stats = statsMap.get(filepath) || { additions: 0, deletions: 0 };
                let status = 'modified';
                if (code.startsWith('A'))
                    status = 'added';
                if (code.startsWith('D'))
                    status = 'deleted';
                files.push({
                    path: filepath,
                    status,
                    additions: stats.additions,
                    deletions: stats.deletions
                });
            }
        });
        return files;
    }
    // Retrieve file contents before and after a specific commit
    async getFileContents(repoPath, commitHash, filePath) {
        const git = (0, simple_git_1.default)(repoPath);
        let original = '';
        let modified = '';
        // Get modified code (state at current commit)
        try {
            modified = await git.show([`${commitHash}:${filePath}`]);
        }
        catch (err) {
            modified = ''; // File might have been deleted
        }
        // Get original code (state before current commit, i.e., at parent commit)
        try {
            original = await git.show([`${commitHash}^:${filePath}`]);
        }
        catch (err) {
            original = ''; // File might be newly created (no parent state)
        }
        return { original, modified };
    }
}
exports.GitService = GitService;
