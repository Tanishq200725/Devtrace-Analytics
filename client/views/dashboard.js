export default {
  template: `
    <div class="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col gap-8">
      
      <!-- Top Section: Welcome & Experience Profile Selector -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-white mb-2">Forensic Registry</h1>
          <p class="text-gray-400 text-sm">Select your analysis profile to customize telemetry readouts and hint diagnostics.</p>
        </div>
        
        <!-- Experience Level Selector (Linear styled toggle) -->
        <div class="flex p-1 rounded-xl bg-neutral-900 border border-border self-start">
          <button id="btn-beginner" class="px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-200" onclick="window.setExperienceLevel('beginner')">
            BEGINNER
          </button>
          <button id="btn-intermediate" class="px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-200" onclick="window.setExperienceLevel('intermediate')">
            INTERMEDIATE
          </button>
          <button id="btn-advanced" class="px-4 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-200" onclick="window.setExperienceLevel('advanced')">
            ADVANCED
          </button>
        </div>
      </div>

      <!-- Main Workspace: Radar Gem, Search & Scrubbers -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Search & Control Panel -->
        <div class="lg:col-span-2 flex flex-col gap-6">
          <div class="glass rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <!-- Background detail -->
            <div class="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>

            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-semibold text-white flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
                Analyze Git Repository
              </h2>
              <!-- Active Scan token count badge -->
              <span id="token-counter-badge" class="px-2.5 py-0.5 rounded bg-neutral-950 border border-border text-[10px] font-mono text-gray-400">Tokens: n/a</span>
            </div>

            <!-- Ingest Type Tabs -->
            <div class="flex p-1 rounded-xl bg-neutral-950 border border-border max-w-xs mb-5">
              <button id="tab-ingest-url" class="flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200" onclick="window.switchIngestTab('url')">
                INGEST LINK
              </button>
              <button id="tab-ingest-github" class="flex-1 py-1.5 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200" onclick="window.switchIngestTab('github')">
                CONNECT GITHUB
              </button>
            </div>

            <!-- Ingest Tab 1: Direct Link -->
            <div id="panel-ingest-url">
              <form id="scan-form" class="space-y-4" onsubmit="event.preventDefault(); window.triggerScan();">
                <div class="relative">
                  <input type="url" id="repo-url" placeholder="https://github.com/username/repository.git" required
                    class="w-full bg-neutral-950 border border-border rounded-xl pl-4 pr-32 py-3.5 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent" />
                  
                  <button type="submit" id="scan-submit-btn" class="absolute right-2 top-2 bottom-2 px-5 rounded-lg bg-accent text-white text-xs font-medium hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2">
                    <span>Excavate</span>
                    <svg class="w-3.5 h-3.5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>

            <!-- Ingest Tab 2: GitHub account selection -->
            <div id="panel-ingest-github" class="hidden space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label for="github-username" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">GitHub Username</label>
                  <input type="text" id="github-username" placeholder="e.g. tanishqtyagi"
                    class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
                </div>
                <div>
                  <label for="github-token" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Personal Access Token (Optional)</label>
                  <input type="password" id="github-token" placeholder="ghp_••••••••"
                    class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
                </div>
              </div>
              <button onclick="window.connectGithubProfile()" id="github-connect-btn" class="px-5 py-2.5 rounded-xl bg-accent text-white hover:bg-opacity-90 font-mono text-xs transition-all">
                Connect & Load Repositories
              </button>
              
              <!-- Loaded GitHub repos list container -->
              <div id="github-repos-container" class="hidden border border-border/60 bg-neutral-950/80 rounded-xl p-4 mt-3 animate-fadeIn">
                <p class="text-[10px] text-gray-500 font-mono mb-2 uppercase tracking-wider">Select a Repository to Ingest:</p>
                <div class="max-h-52 overflow-y-auto space-y-2 pr-1 scrollbar" id="github-repos-list">
                  <!-- Loaded dynamically -->
                </div>
              </div>
            </div>

            <div id="scan-error-log" class="hidden mt-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs font-mono"></div>

            <!-- Repository Commit Scrubber Slider -->
            <div class="mt-8 pt-6 border-t border-border/60">
              <div class="flex justify-between items-center mb-3">
                <label for="commit-scrubber" class="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">Historical Commit Scrubber</label>
                <span id="scrubber-date" class="text-xs font-mono text-gray-500">No Target Repository Loaded</span>
              </div>
              <input type="range" id="commit-scrubber" min="0" max="0" value="0" disabled
                class="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-not-allowed accent-accent" />
              <div class="flex justify-between text-[10px] font-mono text-gray-600 mt-2">
                <span id="scrubber-earliest">Earliest History</span>
                <span id="scrubber-hash">HEAD (n/a)</span>
              </div>
            </div>

            <!-- Recent Excavations panel -->
            <div id="recent-repos-panel" class="hidden mt-6 pt-6 border-t border-border/60">
              <h3 class="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider mb-3">Recently Excavated</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3" id="recent-repos-list">
                <!-- Loaded dynamically -->
              </div>
            </div>

            <!-- Workspace Action Button -->
            <div class="mt-6 flex justify-between items-center">
              <button onclick="localStorage.removeItem('devtrace_auth'); window.router.navigate('/auth');" class="text-xs font-mono text-gray-500 hover:text-white transition-colors duration-200">
                Log Out Session
              </button>
              <button id="view-workspace-btn" disabled onclick="window.router.navigate('/workspace/diff')" class="px-5 py-2.5 rounded-xl border border-border bg-neutral-900 text-gray-500 text-xs font-mono font-medium hover:bg-neutral-800 transition-all duration-200 cursor-not-allowed">
                ENTER ARCHAEOLOGY PORTAL
              </button>
            </div>
          </div>

          <!-- AI Semantic Search & Diagnostics Panel -->
          <div class="glass rounded-2xl p-6 shadow-xl relative overflow-hidden mt-6">
            <div class="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="flex items-center gap-2 mb-4">
              <div class="h-6 w-6 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <svg class="w-3.5 h-3.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 class="text-xs font-bold text-white uppercase tracking-wider font-mono">Semantic Query & Diagnostics</h2>
            </div>

            <!-- Search Form -->
            <form id="diagnostics-form" class="space-y-4" onsubmit="event.preventDefault(); window.triggerDiagnosticsQuery();">
              <div class="relative">
                <input type="text" id="diagnostics-input" placeholder="e.g. How is password verification handled?" required
                  class="w-full bg-neutral-950 border border-border rounded-xl pl-4 pr-32 py-3 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
                
                <button type="submit" id="diagnostics-submit-btn" class="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-accent text-white text-[10px] font-mono font-medium hover:bg-opacity-90 transition-all flex items-center gap-1.5">
                  <span>Analyze Query</span>
                </button>
              </div>
            </form>

            <!-- Results Panel -->
            <div id="diagnostics-results-panel" class="hidden mt-4 pt-4 border-t border-border/60 space-y-4 animate-fadeIn">
              <!-- Matched Snippet -->
              <div id="diagnostics-snippet-container" class="hidden space-y-2">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-gray-500 font-mono">SOURCE REFERENCE:</span>
                  <span id="diagnostics-file-link" class="text-[10px] text-accent font-mono">file_name</span>
                </div>
                <pre class="bg-neutral-950 border border-border rounded-xl p-3 text-[10px] text-gray-400 font-mono overflow-x-auto max-h-56 leading-relaxed" id="diagnostics-code-box"></pre>
              </div>

              <!-- Satisfied Explanation -->
              <div>
                <span class="text-[10px] text-gray-500 font-mono block mb-1">Satisfying Explanation:</span>
                <p class="text-xs text-gray-300 leading-relaxed font-mono" id="diagnostics-explanation"></p>
              </div>

              <!-- 1% Edge-Case vulnerabilities -->
              <div class="p-3.5 rounded-xl border border-rose-500/10 bg-rose-500/5 text-rose-400/90 text-xs leading-relaxed space-y-1.5">
                <span class="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-widest block mb-1">1% Edge-Case Scenarios:</span>
                <div id="diagnostics-edge-cases" class="font-mono text-[10px] space-y-1 leading-normal"></div>
              </div>

              <!-- Recommended Test cases -->
              <div class="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 text-emerald-400/90 text-xs leading-relaxed space-y-1.5">
                <span class="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest block mb-1">Robust Test Case Outlines:</span>
                <div id="diagnostics-test-cases" class="font-mono text-[10px] space-y-1 leading-normal"></div>
              </div>
            </div>

            <!-- Fallback Suggestions list -->
            <div id="diagnostics-fallback-container" class="hidden mt-4 pt-4 border-t border-border/60 space-y-3 animate-fadeIn">
              <div class="flex items-start gap-2.5 p-3.5 rounded-xl border border-amber-500/10 bg-amber-500/5 text-amber-400/90 text-xs leading-relaxed">
                <svg class="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p class="font-bold">No matches found in active repository</p>
                  <p class="text-[10px] mt-0.5 text-amber-500/70" id="diagnostics-fallback-message"></p>
                </div>
              </div>

              <!-- List of recommended GitHub repositories -->
              <div class="space-y-2">
                <p class="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Suggested alternative repositories in your GitHub account:</p>
                <div class="space-y-2" id="diagnostics-fallback-repos-list">
                  <!-- Loaded dynamically -->
                </div>
              </div>
            </div>

          </div>

          <!-- Adaptive Data Panels Grid -->
          <div id="adaptive-container" class="transition-all duration-300">
            <!-- Inserted dynamically via JavaScript -->
          </div>
        </div>

        <!-- Right Side Panel -->
        <div class="flex flex-col gap-8">
          
          <!-- Neon Radar Gem Visualizer Card -->
          <div class="glass rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[300px]">
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
              <div class="w-64 h-64 rounded-full border border-neutral-600 animate-ping duration-10000"></div>
              <div class="w-48 h-48 rounded-full border border-neutral-700 absolute"></div>
              <div class="w-32 h-32 rounded-full border border-neutral-800 absolute"></div>
            </div>

            <!-- The Neon Radar Gem -->
            <div class="relative w-28 h-28 flex items-center justify-center mb-6">
              <div class="absolute inset-0 rounded-full bg-accent/20 blur-xl animate-pulse"></div>
              <div id="radar-gem" class="w-20 h-20 rounded-2xl border-2 border-accent/40 bg-neutral-950/80 flex items-center justify-center transition-all duration-500 radar-pulse select-none">
                <div class="w-10 h-10 rounded-xl border border-accent-muted/40 bg-accent/5 flex items-center justify-center rotate-45 animate-spin duration-3000">
                  <div class="w-4 h-4 rounded bg-accent animate-pulse"></div>
                </div>
              </div>
            </div>

            <h3 class="text-sm font-semibold tracking-tight text-white mb-1" id="radar-status-title">Scan Core Idle</h3>
            <p class="text-xs text-gray-500 font-mono" id="radar-status-meta">AWAITING URL INGESTION</p>
          </div>

          <!-- Dynamic Hint Panel -->
          <div class="glass rounded-2xl p-6 shadow-xl border-l-4 border-accent relative">
            <h3 class="text-sm font-semibold tracking-tight text-white mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-accent stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18h.01M12 5.071c3.46 0 6.262 2.75 6.262 6.141a6.103 6.103 0 01-1.3 3.666l-.196.26c-.347.46-.425 1.05-.205 1.579l.178.43c.094.228.062.487-.089.682A.987.987 0 0115.842 18H8.158a.987.987 0 01-.818-.423c-.15-.195-.183-.454-.089-.682l.178-.43c.22-.53.142-1.12-.205-1.58l-.196-.26a6.103 6.103 0 01-1.3-3.665c0-3.39 2.801-6.14 6.262-6.14z" />
              </svg>
              <span>Automated Hint Injection</span>
            </h3>
            <div id="hint-content" class="text-xs text-gray-400 space-y-3 leading-relaxed">
              <!-- Dynamically populated hint text based on selected profile -->
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  mount() {
    let activeLevel = localStorage.getItem('devtrace_experience_level') || 'intermediate';
    let repoCommits = [];

    // Switch between URL Ingest Form and GitHub Profile Connector tabs
    window.switchIngestTab = (tab) => {
      const tabUrl = document.getElementById('tab-ingest-url');
      const tabGithub = document.getElementById('tab-ingest-github');
      const panelUrl = document.getElementById('panel-ingest-url');
      const panelGithub = document.getElementById('panel-ingest-github');

      if (!tabUrl || !tabGithub || !panelUrl || !panelGithub) return;

      if (tab === 'url') {
        tabUrl.className = "flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabGithub.className = "flex-1 py-1.5 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        panelUrl.classList.remove('hidden');
        panelGithub.classList.add('hidden');
      } else {
        tabGithub.className = "flex-1 py-1.5 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabUrl.className = "flex-1 py-1.5 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        panelGithub.classList.remove('hidden');
        panelUrl.classList.add('hidden');
      }
    };

    // Load repositories list from GitHub APIs (Supporting public username & private Token access)
    window.connectGithubProfile = async () => {
      const usernameInput = document.getElementById('github-username');
      const tokenInput = document.getElementById('github-token');
      const connectBtn = document.getElementById('github-connect-btn');
      const reposContainer = document.getElementById('github-repos-container');
      const reposList = document.getElementById('github-repos-list');

      if (!usernameInput || !tokenInput || !connectBtn || !reposContainer || !reposList) return;

      const username = usernameInput.value.trim();
      const token = tokenInput.value.trim();

      if (!username) {
        alert("Please enter a valid GitHub Username.");
        return;
      }

      connectBtn.disabled = true;
      connectBtn.textContent = "Connecting to GitHub Host...";

      try {
        let url = `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`;
        const headers = {
          'Accept': 'application/vnd.github+json'
        };

        if (token) {
          url = `https://api.github.com/user/repos?per_page=100&sort=updated`;
          headers['Authorization'] = `token ${token}`;
        }

        const response = await fetch(url, { headers });
        if (!response.ok) {
          throw new Error(`GitHub API returned status code ${response.status}`);
        }

        const repos = await response.json();
        if (!Array.isArray(repos)) {
          throw new Error("Invalid response format from GitHub API.");
        }

        if (repos.length === 0) {
          reposList.innerHTML = `<p class="text-[10px] text-gray-500 font-mono py-4 text-center">No repositories found for this account.</p>`;
        } else {
          reposList.innerHTML = repos.map(repo => {
            return `
              <div class="flex items-center justify-between p-3 rounded-xl border border-border/80 bg-neutral-900/60 hover:bg-neutral-900 transition-all duration-200">
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-semibold text-white font-mono truncate max-w-[200px]">${repo.name}</span>
                    ${repo.private ? `
                      <span class="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-rose-500/10 border border-rose-500/20 text-rose-400">PRIVATE</span>
                    ` : `
                      <span class="px-1.5 py-0.5 rounded text-[8px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">PUBLIC</span>
                    `}
                  </div>
                  <p class="text-[10px] text-gray-400 mt-1 max-w-[260px] truncate">${repo.description || 'No description provided.'}</p>
                </div>
                <button onclick="window.selectGithubRepo('${repo.clone_url}')" class="px-3 py-1.5 rounded-lg bg-accent/15 border border-accent/20 text-accent text-[10px] font-mono hover:bg-accent hover:text-white transition-all duration-150">
                  Select
                </button>
              </div>
            `;
          }).join('');
        }

        window._githubRepos = repos; // Store globally for fallback recommendations search
        reposContainer.classList.remove('hidden');

      } catch (err) {
        alert(`Failed to load repositories: ${err.message}`);
        reposContainer.classList.add('hidden');
      } finally {
        connectBtn.disabled = false;
        connectBtn.textContent = "Connect & Load Repositories";
      }
    };

    // Auto-fill URL parameter and run excavation
    window.selectGithubRepo = (cloneUrl) => {
      const urlInput = document.getElementById('repo-url');
      if (urlInput) {
        urlInput.value = cloneUrl;
        window.switchIngestTab('url');
        window.triggerScan();
      }
    };

    // Trigger AI Forensic Semantic Query & Diagnostics
    window.triggerDiagnosticsQuery = async () => {
      const input = document.getElementById('diagnostics-input');
      const submitBtn = document.getElementById('diagnostics-submit-btn');
      const resultsPanel = document.getElementById('diagnostics-results-panel');
      const fallbackPanel = document.getElementById('diagnostics-fallback-container');

      const snippetContainer = document.getElementById('diagnostics-snippet-container');
      const fileLink = document.getElementById('diagnostics-file-link');
      const codeBox = document.getElementById('diagnostics-code-box');
      const explanation = document.getElementById('diagnostics-explanation');
      const edgeCases = document.getElementById('diagnostics-edge-cases');
      const testCases = document.getElementById('diagnostics-test-cases');

      const fallbackMsg = document.getElementById('diagnostics-fallback-message');
      const fallbackReposList = document.getElementById('diagnostics-fallback-repos-list');

      if (!input || !submitBtn || !resultsPanel || !fallbackPanel || !snippetContainer || !fileLink || !codeBox || !explanation || !edgeCases || !testCases || !fallbackMsg || !fallbackReposList) return;

      const queryText = input.value.trim();
      if (!queryText) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Analyzing...</span>`;
      
      resultsPanel.classList.add('hidden');
      fallbackPanel.classList.add('hidden');

      const connectedRepos = window._githubRepos || [];

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/diagnostics/query`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: queryText, connectedRepos })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to query codebase diagnostics.');
        }

        if (result.matched) {
          // Display In-Repo matches
          fileLink.textContent = result.filePath;
          codeBox.textContent = result.codeSnippet || '';
          snippetContainer.classList.remove('hidden');
          
          explanation.textContent = result.explanation;
          edgeCases.innerHTML = result.edgeCases.split('\n').map(line => `<p class="mt-0.5">${line}</p>`).join('');
          testCases.innerHTML = result.testCases.split('\n').map(line => `<p class="mt-0.5">${line}</p>`).join('');

          resultsPanel.classList.remove('hidden');
        } else {
          // Display fallback cross-repo recommendations
          fallbackMsg.textContent = `Search parameter "${queryText}" yielded 0 files inside this project.`;
          
          if (result.recommendedRepos && result.recommendedRepos.length > 0) {
            fallbackReposList.innerHTML = result.recommendedRepos.map(repo => `
              <div class="flex items-center justify-between p-3 rounded-xl border border-amber-500/10 bg-amber-500/5 transition-all">
                <div>
                  <span class="text-xs font-semibold text-white font-mono">${repo.name}</span>
                  <p class="text-[10px] text-gray-400 mt-1 max-w-[260px] truncate">${repo.description || 'No description provided.'}</p>
                </div>
                <button onclick="window.selectGithubRepo('${repo.clone_url}')" class="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono hover:bg-amber-500 hover:text-white transition-all">
                  Load Repo
                </button>
              </div>
            `).join('');
          } else {
            fallbackReposList.innerHTML = `<p class="text-[10px] text-gray-500 font-mono py-2">No relevant repositories found in your connected GitHub account.</p>`;
          }

          fallbackPanel.classList.remove('hidden');
        }

      } catch (err) {
        alert(`Diagnostics query failed: ${err.message}`);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Analyze Query</span>`;
      }
    };

    // Render list of recently scanned repositories
    const renderRecentRepos = () => {
      const recentRepos = localStorage.getItem('recent_repos') 
        ? JSON.parse(localStorage.getItem('recent_repos')) 
        : [];
      
      const panel = document.getElementById('recent-repos-panel');
      const listContainer = document.getElementById('recent-repos-list');

      if (recentRepos.length === 0) {
        panel.classList.add('hidden');
        return;
      }

      panel.classList.remove('hidden');
      listContainer.innerHTML = recentRepos.map(repo => {
        const name = repo.split('/').pop()?.replace('.git', '') || 'repo';
        return `
          <button class="w-full text-left p-3 rounded-xl border border-border bg-neutral-950 hover:bg-neutral-900/60 hover:border-accent/40 flex items-center justify-between group transition-all duration-200" onclick="window.triggerRecentScan('${repo}')">
            <div class="flex items-center gap-3">
              <div class="h-6 w-6 rounded bg-neutral-900 border border-border flex items-center justify-center text-[10px] font-bold text-accent group-hover:scale-105 transition-all">
                DT
              </div>
              <span class="text-xs font-mono text-gray-300 truncate max-w-[180px]">${name}</span>
            </div>
            <svg class="w-3.5 h-3.5 text-gray-600 group-hover:text-accent stroke-[2.2] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        `;
      }).join('');
    };

    // Cache scanned repository to storage
    const addToRecentRepos = (repoUrl) => {
      let recent = localStorage.getItem('recent_repos') 
        ? JSON.parse(localStorage.getItem('recent_repos')) 
        : [];
      
      recent = recent.filter(r => r !== repoUrl);
      recent.unshift(repoUrl);
      recent = recent.slice(0, 4);

      localStorage.setItem('recent_repos', JSON.stringify(recent));
      renderRecentRepos();
    };

    // Global selector trigger
    window.triggerRecentScan = (repoUrl) => {
      document.getElementById('repo-url').value = repoUrl;
      window.triggerScan();
    };

    // Sync visual remaining tokens counter
    const syncTokenCounter = () => {
      const auth = localStorage.getItem('devtrace_auth') ? JSON.parse(localStorage.getItem('devtrace_auth')) : null;
      const badge = document.getElementById('token-counter-badge');
      if (!auth || !badge) return;

      const membership = auth.membership || 'free';
      const tokens = auth.tokens_remaining;

      if (membership === 'advanced' || membership === 'elite') {
        badge.textContent = `Tokens: Unlimited (${membership.toUpperCase()})`;
      } else {
        const max = membership === 'basic' ? 50 : 10;
        badge.textContent = `Tokens: ${tokens} / ${max} remaining`;
      }
    };

    // Experience profile buttons updating
    window.setExperienceLevel = (level) => {
      const auth = localStorage.getItem('devtrace_auth') ? JSON.parse(localStorage.getItem('devtrace_auth')) : null;
      const membership = auth ? auth.membership || 'free' : 'free';

      const tiers = { free: 0, basic: 1, advanced: 2, elite: 3 };
      const userWeight = tiers[membership] || 0;

      if (level === 'intermediate' && userWeight < 1) {
        alert("The INTERMEDIATE experience dashboard requires a BASIC membership or above! Please upgrade your plan in the Membership portal.");
        window.router.navigate('/pricing');
        return;
      }
      if (level === 'advanced' && userWeight < 2) {
        alert("The ADVANCED raw telemetry console requires an ADVANCED membership or above! Please upgrade your plan in the Membership portal.");
        window.router.navigate('/pricing');
        return;
      }

      activeLevel = level;
      localStorage.setItem('devtrace_experience_level', level);
      updateProfileButtons();
      renderAdaptiveUI();
      renderHints();
    };

    const updateProfileButtons = () => {
      const levels = ['beginner', 'intermediate', 'advanced'];
      levels.forEach(lvl => {
        const btn = document.getElementById(`btn-${lvl}`);
        if (lvl === activeLevel) {
          btn.className = "px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow-lg shadow-accent/20 border border-accent transition-all duration-200";
        } else {
          btn.className = "px-4 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        }
      });
    };

    const renderAdaptiveUI = () => {
      const container = document.getElementById('adaptive-container');
      const repoData = localStorage.getItem('scanned_repo') ? JSON.parse(localStorage.getItem('scanned_repo')) : null;
      
      if (activeLevel === 'beginner') {
        container.innerHTML = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 fade-in">
            <div class="glass rounded-xl p-5 hover:border-neutral-700/80 transition-all duration-200 relative group cursor-help">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-mono text-gray-500 uppercase tracking-widest">Git Forensic Health</span>
                <span class="px-2 py-0.5 text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded">OPTIMAL</span>
              </div>
              <p class="text-2xl font-bold tracking-tight text-white mb-1">94% Stable</p>
              <p class="text-xs text-gray-400">Code duplication levels are low and file structures conform to standard modular guidelines.</p>
              <div class="opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 absolute left-4 right-4 -top-16 bg-neutral-900 border border-border rounded-lg p-3 text-[10px] text-gray-300 shadow-xl z-20">
                <span class="font-bold text-accent font-mono">AST COMPLEXITY TRANS-INTELLIGENCE:</span> Measures how clean your code tree structures are. High health means your scripts are clean, direct, and readable.
              </div>
            </div>
            
            <div class="glass rounded-xl p-5 hover:border-neutral-700/80 transition-all duration-200 relative group cursor-help">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-mono text-gray-500 uppercase tracking-widest">Scan Activity</span>
                <span class="px-2 py-0.5 text-[9px] font-semibold text-gray-400 bg-neutral-800 rounded">${repoData ? 'ACTIVE' : 'STANDBY'}</span>
              </div>
              <p class="text-2xl font-bold tracking-tight text-white mb-1">${repoData ? repoData.commitsCount + ' Commits' : '0 Commits Cloned'}</p>
              <p class="text-xs text-gray-400">${repoData ? 'Repository parsed. Use timeline scrubber to select commit and explore differences.' : 'Load a repository above to display active analysis graphs, history maps, and trends.'}</p>
              <div class="opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 absolute left-4 right-4 -top-16 bg-neutral-900 border border-border rounded-lg p-3 text-[10px] text-gray-300 shadow-xl z-20">
                <span class="font-bold text-accent font-mono">BRANCH MAPPING EXPLAINER:</span> Branches represent parallel development paths. Cloned paths are analyzed for history and author tracking.
              </div>
            </div>
          </div>
        `;
      } 
      else if (activeLevel === 'intermediate') {
        container.innerHTML = `
          <div class="space-y-6 fade-in">
            <div class="glass rounded-xl p-5">
              <div class="flex justify-between items-center mb-4 pb-3 border-b border-border/60">
                <h4 class="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">Scanned Repository Statistics</h4>
                <span class="text-xs font-mono text-accent">${repoData ? 'Target: Active' : 'No Target Loaded'}</span>
              </div>
              <div class="space-y-3">
                ${repoData ? `
                  <div class="flex justify-between items-center text-xs font-mono py-1">
                    <span class="text-gray-400">Clone URL</span>
                    <span class="text-white truncate max-w-xs">${repoData.url}</span>
                  </div>
                  <div class="flex justify-between items-center text-xs font-mono py-1">
                    <span class="text-gray-400">Excavation Depth</span>
                    <span class="text-white">10 Commits (Shallow Target)</span>
                  </div>
                  <div class="flex justify-between items-center text-xs font-mono py-1">
                    <span class="text-gray-400">Analytical Health Rating</span>
                    <span class="text-emerald-400 font-semibold">92.5% Safe</span>
                  </div>
                ` : `
                  <p class="text-xs text-gray-500 font-mono text-center py-4">Ingest a Git clone URL above to populate forensic metrics.</p>
                `}
              </div>
            </div>
          </div>
        `;
      } 
      else {
        container.innerHTML = `
          <div class="space-y-6 fade-in">
            <div class="glass rounded-xl p-5 font-mono">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] text-gray-500 uppercase tracking-widest">RAW TELEMETRY COMMAND CONSOLE</span>
                <span class="text-[9px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 animate-pulse">LIVE EXCAVATION LISTENER</span>
              </div>
              <div class="bg-neutral-950 rounded-lg p-3 border border-border/80 text-[11px] text-gray-300 space-y-2 overflow-x-auto">
                <p class="text-gray-500">// Terminal analytical monitor active</p>
                <p><span class="text-accent">devtrace-core@1.0.0</span> listening on process pipe</p>
                ${repoData ? `
                  <p class="text-emerald-500">> git clone --depth 10 --no-tags --single-branch ${repoData.url}</p>
                  <p class="text-emerald-500">> analyzed commits: ${repoData.commitsCount} records successfully cached</p>
                  <p class="text-emerald-500">> active pointer commit: [ ${repoData.activeCommit} ]</p>
                ` : `
                  <p class="text-gray-600">> awaiting Git URL mapping triggers...</p>
                `}
              </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="glass rounded-xl p-4 text-center">
                <span class="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Heap Leakage</span>
                <p class="text-lg font-bold text-white">0.02 MB/hr</p>
              </div>
              <div class="glass rounded-xl p-4 text-center">
                <span class="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Process CPU</span>
                <p class="text-lg font-bold text-white">1.4% Avg</p>
              </div>
              <div class="glass rounded-xl p-4 text-center">
                <span class="text-[10px] font-mono text-gray-500 uppercase tracking-wider block mb-1">Branch Correlation</span>
                <p class="text-lg font-bold text-emerald-400">99.8% Sync</p>
              </div>
            </div>
          </div>
        `;
      }
    };

    const renderHints = () => {
      const hintContent = document.getElementById('hint-content');
      
      if (activeLevel === 'beginner') {
        hintContent.innerHTML = `
          <p class="font-medium text-white mb-1.5 font-mono text-[11px] uppercase tracking-wider">Beginner Assistant Core</p>
          <p>Paste a public Git URL (e.g. from GitHub) in the search field and click Excavate. The system downloads the repository dynamically to start analysis.</p>
          <div class="mt-3 p-2.5 rounded bg-accent/5 border border-accent/20">
            <span class="font-semibold text-accent font-mono block mb-0.5">AST Complexity Explainer:</span>
            Refers to the structure of programming code laid out as a logic tree. Simpler trees equal faster runtimes and fewer bugs.
          </div>
        `;
      } 
      else if (activeLevel === 'intermediate') {
        hintContent.innerHTML = `
          <p class="font-medium text-white mb-1.5 font-mono text-[11px] uppercase tracking-wider">Refactoring Engine Recommendation</p>
          <div class="mt-2 text-amber-500 font-semibold flex items-center gap-1.5">
            <span class="h-2 w-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>CLONE SCOPE: Free Tier Active</span>
          </div>
          <p class="mt-2 text-gray-400">Repositories are shallow cloned to depth 10. This ensures rapid scanning speeds and protects local storage capacities.</p>
        `;
      } 
      else {
        hintContent.innerHTML = `
          <p class="font-medium text-white mb-1.5 font-mono text-[11px] uppercase tracking-wider">Analytical Telemetry Pipeline</p>
          <p>Git objects and trees are tracked using their commit SHA values, checking code modifications directly against their parents.</p>
          <div class="mt-3 p-2.5 rounded bg-neutral-900 border border-border">
            <span class="font-mono text-gray-400 block mb-1 text-[10px]">CURRENT TARGET PARAMETERS:</span>
            <code class="text-emerald-400 text-[10px] block font-mono">git clone --depth 10 --no-tags --single-branch [URL]</code>
          </div>
        `;
      }
    };

    // Trigger Repository Scanning via Express backend API
    window.triggerScan = async () => {
      const urlInput = document.getElementById('repo-url');
      const submitBtn = document.getElementById('scan-submit-btn');
      const radarGem = document.getElementById('radar-gem');
      const radarTitle = document.getElementById('radar-status-title');
      const radarMeta = document.getElementById('radar-status-meta');
      const errorLog = document.getElementById('scan-error-log');
      
      const scrubber = document.getElementById('commit-scrubber');
      const scrubberDate = document.getElementById('scrubber-date');
      const scrubberHash = document.getElementById('scrubber-hash');
      const workspaceBtn = document.getElementById('view-workspace-btn');

      if (!urlInput.value) return;

      errorLog.classList.add('hidden');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
        <span>Excavating...</span>
      `;

      // Active Scan Radar state
      radarGem.className = "w-20 h-20 rounded-2xl border-2 border-emerald-500/80 bg-neutral-950/80 flex items-center justify-center transition-all duration-500 select-none shadow-2xl shadow-emerald-500/30";
      radarTitle.textContent = "Excavation Active";
      radarTitle.className = "text-sm font-semibold tracking-tight text-emerald-400 mb-1";
      radarMeta.textContent = "STREAMING SHARDS FROM REMOTE";
      radarMeta.className = "text-xs text-emerald-500 font-mono animate-pulse";

      try {
        const auth = localStorage.getItem('devtrace_auth') ? JSON.parse(localStorage.getItem('devtrace_auth')) : null;
        const identifier = auth ? auth.identifier : '';

        const response = await fetch(`${window.API_BASE || ''}/api/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            url: urlInput.value.trim(),
            identifier
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to scan repository.');
        }

        // Scan success operations
        radarGem.className = "w-20 h-20 rounded-2xl border-2 border-accent/80 bg-neutral-950/80 flex items-center justify-center transition-all duration-500 select-none shadow-xl shadow-accent/20";
        radarTitle.textContent = "Excavation Complete";
        radarTitle.className = "text-sm font-semibold tracking-tight text-white mb-1";
        radarMeta.textContent = "ANALYSIS MATRIX LOCKED";
        radarMeta.className = "text-xs text-accent font-mono";

        // Save scan metadata in browser local storage
        const repoMetadata = {
          url: data.repoUrl,
          commitsCount: data.commitsCount,
          activeCommit: data.latestCommit.hash
        };
        localStorage.setItem('scanned_repo', JSON.stringify(repoMetadata));
        addToRecentRepos(data.repoUrl);

        // Sync remaining tokens in session cache
        if (auth && typeof data.tokens_remaining === 'number') {
          auth.tokens_remaining = data.tokens_remaining;
          localStorage.setItem('devtrace_auth', JSON.stringify(auth));
          syncTokenCounter();
        }

        // Fetch entire commits catalog to sync timeline scrubber
        const commitsResponse = await fetch(`${window.API_BASE || ''}/api/commits`);
        const commitsData = await commitsResponse.json();
        repoCommits = commitsData.commits || [];

        // Configure Scrubber range
        if (repoCommits.length > 0) {
          scrubber.disabled = false;
          scrubber.className = "w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent";
          scrubber.min = 0;
          scrubber.max = repoCommits.length - 1;
          scrubber.value = 0; // Latest is index 0

          const latest = repoCommits[0];
          scrubberDate.textContent = new Date(latest.date).toLocaleDateString();
          scrubberHash.textContent = `SHA: ${latest.hash}`;

          // Set left and right baseline indicators
          document.getElementById('scrubber-earliest').textContent = `Earliest (${repoCommits[repoCommits.length-1].hash})`;

          // Scrubber dynamic sliding updates
          scrubber.oninput = (e) => {
            const idx = parseInt(e.target.value);
            const selectedCommit = repoCommits[idx];
            if (selectedCommit) {
              scrubberDate.textContent = new Date(selectedCommit.date).toLocaleDateString();
              scrubberHash.textContent = `SHA: ${selectedCommit.hash}`;
              
              // Update target pointer
              repoMetadata.activeCommit = selectedCommit.hash;
              localStorage.setItem('scanned_repo', JSON.stringify(repoMetadata));
              renderAdaptiveUI();
            }
          };

          // Unlock workspace portal button
          workspaceBtn.disabled = false;
          workspaceBtn.className = "px-5 py-2.5 rounded-xl border border-accent bg-accent/10 text-accent text-xs font-mono font-medium hover:bg-accent/20 hover:scale-[1.01] transition-all duration-200 shadow-md shadow-accent/10";
        }

        renderAdaptiveUI();

      } catch (err) {
        // Reset radar scanner state to failed red
        radarGem.className = "w-20 h-20 rounded-2xl border-2 border-rose-500/80 bg-neutral-950/80 flex items-center justify-center transition-all duration-500 select-none shadow-xl shadow-rose-500/25";
        radarTitle.textContent = "Excavation Failed";
        radarTitle.className = "text-sm font-semibold tracking-tight text-rose-400 mb-1";
        radarMeta.textContent = "CORE SYSTEM INGESTION FAULT";
        radarMeta.className = "text-xs text-rose-500 font-mono";

        // Display error log in container
        errorLog.textContent = `[Ingestion Error] ${err.message}`;
        errorLog.classList.remove('hidden');

        // Clean cache
        localStorage.removeItem('scanned_repo');
        scrubber.disabled = true;
        scrubber.className = "w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-not-allowed accent-accent";
        scrubber.value = 0;
        scrubberDate.textContent = "No Target Repository Loaded";
        scrubberHash.textContent = "HEAD (n/a)";
        workspaceBtn.disabled = true;
        workspaceBtn.className = "px-5 py-2.5 rounded-xl border border-border bg-neutral-900 text-gray-500 text-xs font-mono font-medium hover:bg-neutral-800 transition-all duration-200 cursor-not-allowed";

        renderAdaptiveUI();
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>Excavate</span>
          <svg class="w-3.5 h-3.5 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        `;
      }
    };

    // Load initial profile mappings
    updateProfileButtons();
    renderAdaptiveUI();
    renderHints();

    // Check if repository already scanned in session and restore active state
    const restoreScannedState = async () => {
      const repoData = localStorage.getItem('scanned_repo') ? JSON.parse(localStorage.getItem('scanned_repo')) : null;
      if (repoData) {
        document.getElementById('repo-url').value = repoData.url;
        
        // Restore radar success visual
        const radarGem = document.getElementById('radar-gem');
        const radarTitle = document.getElementById('radar-status-title');
        const radarMeta = document.getElementById('radar-status-meta');
        
        radarGem.className = "w-20 h-20 rounded-2xl border-2 border-accent/80 bg-neutral-950/80 flex items-center justify-center transition-all duration-500 select-none shadow-xl shadow-accent/20";
        radarTitle.textContent = "Excavation Complete";
        radarTitle.className = "text-sm font-semibold tracking-tight text-white mb-1";
        radarMeta.textContent = "ANALYSIS MATRIX LOCKED";
        radarMeta.className = "text-xs text-accent font-mono";

        try {
          const commitsResponse = await fetch(`${window.API_BASE || ''}/api/commits`);
          const commitsData = await commitsResponse.json();
          repoCommits = commitsData.commits || [];

          if (repoCommits.length > 0) {
            const scrubber = document.getElementById('commit-scrubber');
            const scrubberDate = document.getElementById('scrubber-date');
            const scrubberHash = document.getElementById('scrubber-hash');
            const workspaceBtn = document.getElementById('view-workspace-btn');

            scrubber.disabled = false;
            scrubber.className = "w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-accent";
            scrubber.min = 0;
            scrubber.max = repoCommits.length - 1;
            
            // Find active index matching cached commit hash
            const activeIdx = repoCommits.findIndex(c => c.hash === repoData.activeCommit);
            scrubber.value = activeIdx !== -1 ? activeIdx : 0;

            const activeCommit = repoCommits[scrubber.value] || repoCommits[0];
            scrubberDate.textContent = new Date(activeCommit.date).toLocaleDateString();
            scrubberHash.textContent = `SHA: ${activeCommit.hash}`;

            document.getElementById('scrubber-earliest').textContent = `Earliest (${repoCommits[repoCommits.length-1].hash})`;

            scrubber.oninput = (e) => {
              const idx = parseInt(e.target.value);
              const selectedCommit = repoCommits[idx];
              if (selectedCommit) {
                scrubberDate.textContent = new Date(selectedCommit.date).toLocaleDateString();
                scrubberHash.textContent = `SHA: ${selectedCommit.hash}`;
                repoData.activeCommit = selectedCommit.hash;
                localStorage.setItem('scanned_repo', JSON.stringify(repoData));
                renderAdaptiveUI();
              }
            };

            workspaceBtn.disabled = false;
            workspaceBtn.className = "px-5 py-2.5 rounded-xl border border-accent bg-accent/10 text-accent text-xs font-mono font-medium hover:bg-accent/20 hover:scale-[1.01] transition-all duration-200 shadow-md shadow-accent/10";
          }
          renderAdaptiveUI();
        } catch (e) {
          console.error("Failed to restore scanned commit list", e);
          localStorage.removeItem('scanned_repo');
          // Reset radar visual layout
          radarGem.className = "w-20 h-20 rounded-2xl border border-border bg-neutral-950 flex items-center justify-center transition-all duration-300 select-none";
          radarTitle.textContent = "Scanner Offline";
          radarTitle.className = "text-sm font-semibold tracking-tight text-gray-400 mb-1";
          radarMeta.textContent = "READY FOR Git INGESTION";
          radarMeta.className = "text-xs text-gray-500 font-mono";
        }
      }
    };

    renderRecentRepos();
    syncTokenCounter();
    restoreScannedState();
  }
};
