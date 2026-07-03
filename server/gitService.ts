import simpleGit, { SimpleGit } from 'simple-git';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const REPOS_DIR = path.join(__dirname, '../temp_repos');

// Ensure temporary cloning directory exists
if (!fs.existsSync(REPOS_DIR)) {
  fs.mkdirSync(REPOS_DIR, { recursive: true });
}

export interface CommitData {
  hash: string;
  author: string;
  date: string;
  message: string;
}

export interface FileDiffData {
  path: string;
  status: 'added' | 'deleted' | 'modified';
  additions: number;
  deletions: number;
}

export class GitService {
  private git: SimpleGit;

  constructor() {
    this.git = simpleGit();
    try {
      execSync('git config --global --add safe.directory "*"');
      console.log('[Git Service] Global safe.directory configured.');
    } catch (err: any) {
      console.warn('[Git Service Warning] Failed to configure safe.directory:', err.message);
    }
  }

  // Securely sanitize Git repository URLs
  public static sanitizeUrl(url: string): string {
    const gitUrlRegex = /^https:\/\/[a-zA-Z0-9.-]+\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+(?:\.git)?$/;
    if (!gitUrlRegex.test(url)) {
      throw new Error('Invalid repository URL structure. Only HTTPS GitHub/GitLab clone URLs are allowed.');
    }
    return url;
  }

  // Get local repository directory name from URL
  public getRepoPath(repoUrl: string): string {
    const repoName = repoUrl.split('/').pop()?.replace('.git', '') || 'temp_repo';
    return path.join(REPOS_DIR, repoName);
  }

  // Clone a repository with shallow weight parameters
  public async cloneRepository(repoUrl: string): Promise<string> {
    const sanitizedUrl = GitService.sanitizeUrl(repoUrl);
    const targetPath = this.getRepoPath(sanitizedUrl);

    // Clean up directory if it already exists
    if (fs.existsSync(targetPath)) {
      fs.rmSync(targetPath, { recursive: true, force: true });
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
  public async getCommits(repoPath: string): Promise<CommitData[]> {
    const git = simpleGit(repoPath);
    const log = await git.log();
    return log.all.map(commit => ({
      hash: commit.hash.substring(0, 8),
      author: commit.author_name,
      date: commit.date,
      message: commit.message
    }));
  }

  // Retrieve files modified in a specific commit
  public async getChangedFiles(repoPath: string, commitHash: string): Promise<FileDiffData[]> {
    const git = simpleGit(repoPath);
    
    // Run git show --numstat to get addition/deletion counts
    const numstatOutput = execSync(`git show --numstat --format="" ${commitHash}`, { cwd: repoPath }).toString();
    const statusOutput = execSync(`git show --name-status --format="" ${commitHash}`, { cwd: repoPath }).toString();

    const statsMap = new Map<string, { additions: number, deletions: number }>();
    
    numstatOutput.split('\n').forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 3) {
        const additions = parseInt(parts[0]) || 0;
        const deletions = parseInt(parts[1]) || 0;
        const filepath = parts[2].trim();
        statsMap.set(filepath, { additions, deletions });
      }
    });

    const files: FileDiffData[] = [];
    statusOutput.split('\n').forEach(line => {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const code = parts[0].trim();
        const filepath = parts[1].trim();
        const stats = statsMap.get(filepath) || { additions: 0, deletions: 0 };
        
        let status: 'added' | 'deleted' | 'modified' = 'modified';
        if (code.startsWith('A')) status = 'added';
        if (code.startsWith('D')) status = 'deleted';

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
  public async getFileContents(repoPath: string, commitHash: string, filePath: string): Promise<{ original: string, modified: string }> {
    const git = simpleGit(repoPath);
    
    let original = '';
    let modified = '';

    // Get modified code (state at current commit)
    try {
      modified = await git.show([`${commitHash}:${filePath}`]);
    } catch (err) {
      modified = ''; // File might have been deleted
    }

    // Get original code (state before current commit, i.e., at parent commit)
    try {
      original = await git.show([`${commitHash}^:${filePath}`]);
    } catch (err) {
      original = ''; // File might be newly created (no parent state)
    }

    return { original, modified };
  }
}
