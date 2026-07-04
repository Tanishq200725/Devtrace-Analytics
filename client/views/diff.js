export default {
  template: `
    <div class="flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      <!-- File Tree Sidebar -->
      <aside class="w-80 border-r border-border bg-neutral-950/40 flex flex-col flex-shrink-0">
        <div class="p-4 border-b border-border/80 flex items-center justify-between">
          <h3 class="text-xs font-mono font-medium text-gray-400 uppercase tracking-widest">Excavated Nodes</h3>
          <span id="files-modified-badge" class="px-2 py-0.5 text-[9px] font-mono text-accent bg-accent/10 border border-accent/20 rounded">0 Files</span>
        </div>
        
        <!-- Search filter input -->
        <div class="px-4 py-2 border-b border-border/40">
          <input type="text" id="file-filter-input" placeholder="Filter files (e.g. server.ts)..." 
            class="w-full bg-neutral-900 border border-border rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
        </div>
        
        <!-- File tree list -->
        <nav class="flex-grow overflow-y-auto p-3 space-y-1.5" id="file-tree-container">
          <div class="text-center py-8 text-xs text-gray-500 font-mono">No nodes parsed...</div>
        </nav>

        <!-- Sidebar footer displaying keyboard mapping -->
        <div class="p-4 border-t border-border/85 bg-neutral-950/60 text-[10px] font-mono text-gray-500 space-y-1.5">
          <p class="font-semibold uppercase tracking-wider text-gray-400">Keyboard Maps</p>
          <div class="flex justify-between">
            <span>[J] Next file node</span>
            <span>[K] Previous file node</span>
          </div>
        </div>
      </aside>

      <!-- Monaco Editor comparative viewport -->
      <main class="flex-grow flex flex-col bg-neutral-950/20 overflow-hidden relative">
        <div class="h-11 border-b border-border bg-neutral-950/60 px-6 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <span id="active-file-badge" class="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-900 border border-border text-gray-300">n/a</span>
            <span id="active-file-title" class="text-xs font-medium text-white truncate max-w-md">Select a file from the sidebar...</span>
          </div>
          
          <!-- View layout toggle & summary statistics -->
          <div class="flex items-center gap-6">
            <!-- Split vs Inline toggle -->
            <button id="toggle-view-mode-btn" class="px-3 py-1.5 rounded border border-border bg-neutral-900 hover:bg-neutral-800 text-[10px] font-mono text-gray-400 hover:text-white transition-all duration-200">
              LAYOUT: SPLIT
            </button>
            <div class="flex items-center gap-4 text-xs font-mono">
              <span class="text-emerald-400 font-semibold" id="stat-additions">+0</span>
              <span class="text-rose-400 font-semibold" id="stat-deletions">-0</span>
            </div>
          </div>
        </div>

        <!-- Monaco Container -->
        <div class="flex-grow w-full relative animate-fadeIn" id="monaco-diff-container">
          <!-- Monaco editor renders here -->
          <div id="monaco-placeholder" class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center bg-background z-10">
            <div class="h-6 w-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p class="text-xs text-gray-500 font-mono" id="monaco-placeholder-text">LOADING MONACO FRAMEWORK CDN...</p>
          </div>
        </div>
      </main>
    </div>
  `,
  mount() {
    let diffEditor = null;
    let originalModel = null;
    let modifiedModel = null;
    let activeFileIndex = 0;
    let filesList = [];

    // Read scanned repository details from LocalStorage
    const repoData = localStorage.getItem('scanned_repo') ? JSON.parse(localStorage.getItem('scanned_repo')) : null;

    if (!repoData) {
      // Redirect back or display prompt if workspace launched without scan
      document.getElementById('monaco-placeholder-text').textContent = "ERROR: NO ACTIVE REPOSITORY CLONED. REDIRECTING...";
      setTimeout(() => {
        window.router.navigate('/dashboard');
      }, 2000);
      return;
    }

    const activeCommit = repoData.activeCommit;

    // Detect programming language from file suffix
    const getLanguage = (filepath) => {
      const ext = filepath.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'js':
        case 'jsx': return 'javascript';
        case 'ts':
        case 'tsx': return 'typescript';
        case 'css': return 'css';
        case 'html': return 'html';
        case 'json': return 'json';
        case 'py': return 'python';
        case 'go': return 'go';
        case 'sh': return 'shell';
        case 'md': return 'markdown';
        default: return 'plaintext';
      }
    };

    // Retrieve file comparative code lines from backend API and update Monaco editor
    const selectFile = async (index) => {
      if (filesList.length === 0) return;
      
      activeFileIndex = index;
      const file = filesList[index];
      
      // Update sidebar list items active styles
      filesList.forEach((_, i) => {
        const item = document.getElementById(`file-item-${i}`);
        if (item) {
          if (i === index) {
            item.className = "w-full text-left p-3 rounded-xl border border-accent bg-accent/5 hover:bg-accent/10 flex flex-col gap-1 transition-all duration-200";
            item.querySelector('.file-path').className = "file-path font-mono text-xs font-semibold text-white truncate";
          } else {
            item.className = "w-full text-left p-3 rounded-xl border border-border bg-neutral-900/40 hover:bg-neutral-800/40 flex flex-col gap-1 transition-all duration-200";
            item.querySelector('.file-path').className = "file-path font-mono text-xs text-gray-400 truncate";
          }
        }
      });

      // Update file state summaries
      document.getElementById('active-file-badge').textContent = file.status.toUpperCase();
      document.getElementById('active-file-title').textContent = file.path;
      document.getElementById('stat-additions').textContent = `+${file.additions}`;
      document.getElementById('stat-deletions').textContent = `-${file.deletions}`;

      // Show loader placeholder inside Monaco during request
      const placeholder = document.createElement('div');
      placeholder.id = 'monaco-temp-loader';
      placeholder.className = "absolute inset-0 flex flex-col items-center justify-center bg-background/85 z-10 font-mono text-xs text-gray-500 gap-2";
      placeholder.innerHTML = `
        <div class="h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        <span>fetching object tree diffs...</span>
      `;
      document.getElementById('monaco-diff-container').appendChild(placeholder);

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/diff?commit=${activeCommit}&file=${encodeURIComponent(file.path)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to download diff detail.');
        }

        // Load model content in Monaco
        if (diffEditor && window.monaco) {
          if (originalModel) originalModel.dispose();
          if (modifiedModel) modifiedModel.dispose();

          const lang = getLanguage(file.path);
          originalModel = monaco.editor.createModel(data.originalCode, lang);
          modifiedModel = monaco.editor.createModel(data.modifiedCode, lang);

          diffEditor.setModel({
            original: originalModel,
            modified: modifiedModel
          });

          // Inject custom delta decorations tints
          applyDeltaDecorations(diffEditor, data);
        }

      } catch (err) {
        console.error("Monaco load file failed", err);
      } finally {
        const tempLoader = document.getElementById('monaco-temp-loader');
        if (tempLoader) tempLoader.remove();
      }
    };

    // Calculate delta decorations line tints dynamically
    const applyDeltaDecorations = (editor, diffPayload) => {
      const originalEditor = editor.getOriginalEditor();
      const modifiedEditor = editor.getModifiedEditor();

      // Read lines and calculate additions/deletions arrays
      const origLines = diffPayload.originalCode.split('\n');
      const modLines = diffPayload.modifiedCode.split('\n');

      const originalDecorations = [];
      const modifiedDecorations = [];

      // Simply map differences using diff computation mapping
      const lineChanges = editor.getLineChanges() || [];

      lineChanges.forEach(change => {
        // Red background for deleted segments in original editor
        if (change.originalEndLineNumber > 0) {
          originalDecorations.push({
            range: new monaco.Range(change.originalStartLineNumber, 1, change.originalEndLineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'monaco-line-deletion',
              marginClassName: 'monaco-line-deletion'
            }
          });
        }
        
        // Green background for added segments in modified editor
        if (change.modifiedEndLineNumber > 0) {
          modifiedDecorations.push({
            range: new monaco.Range(change.modifiedStartLineNumber, 1, change.modifiedEndLineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'monaco-line-addition',
              marginClassName: 'monaco-line-addition'
            }
          });
        }
      });

      originalEditor.createDecorationsCollection(originalDecorations);
      modifiedEditor.createDecorationsCollection(modifiedDecorations);
    };

    // Load file list changed in active commit hash
    const loadChangedFilesList = async () => {
      try {
        const response = await fetch(`${window.API_BASE || ''}/api/files?commit=${activeCommit}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to list changed files.');
        }

        filesList = data.files || [];
        
        // Update badge total files indicator
        document.getElementById('files-modified-badge').textContent = `${filesList.length} Files`;

        const container = document.getElementById('file-tree-container');
        if (filesList.length === 0) {
          container.innerHTML = `<div class="text-center py-8 text-xs text-gray-500 font-mono">No files changed in this commit.</div>`;
          return;
        }

        // Build sidebar buttons
        container.innerHTML = filesList.map((file, i) => `
          <button id="file-item-${i}" class="w-full text-left p-3 rounded-xl border border-border bg-neutral-900/40 hover:bg-neutral-800/40 flex flex-col gap-1 transition-all duration-200">
            <div class="flex items-center justify-between gap-2">
              <span class="file-path font-mono text-xs text-gray-400 truncate">${file.path}</span>
              <span class="text-[10px] font-mono text-gray-500 flex items-center gap-1">
                <span class="text-emerald-400 font-semibold">+${file.additions}</span>
                <span class="text-rose-400 font-semibold">-${file.deletions}</span>
              </span>
            </div>
          </button>
        `).join('');

        // Bind clicks
        filesList.forEach((_, i) => {
          document.getElementById(`file-item-${i}`).onclick = () => selectFile(i);
        });

        // Initialize Monaco script loading
        initMonaco();

      } catch (err) {
        console.error("Failed to load repository files list", err);
        document.getElementById('file-tree-container').innerHTML = `
          <div class="text-center p-4 text-xs text-rose-400 font-mono">
            Error loading file list. Check backend console.
          </div>
        `;
      }
    };

    // Monaco Setup Scripts
    const initMonaco = () => {
      if (window.monaco) {
        onMonacoLoaded();
        return;
      }

      if (document.getElementById('monaco-loader-script')) {
        waitForMonacoScript();
        return;
      }

      const script = document.createElement('script');
      script.id = 'monaco-loader-script';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js';
      script.onload = () => {
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' } });
        require(['vs/editor/editor.main'], function() {
          onMonacoLoaded();
        });
      };
      document.body.appendChild(script);
    };

    const waitForMonacoScript = () => {
      const timer = setInterval(() => {
        if (window.monaco) {
          clearInterval(timer);
          onMonacoLoaded();
        }
      }, 100);
    };

    const onMonacoLoaded = () => {
      const placeholder = document.getElementById('monaco-placeholder');
      if (placeholder) placeholder.remove();

      monaco.editor.defineTheme('devtrace-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#0f0f13',
          'editorLineNumber.foreground': '#4b5563',
          'editorLineNumber.activeForeground': '#a5b4fc',
          'diffEditor.insertedTextBackground': 'rgba(16, 185, 129, 0.03)',
          'diffEditor.removedTextBackground': 'rgba(239, 68, 68, 0.03)',
        }
      });

      diffEditor = monaco.editor.createDiffEditor(document.getElementById('monaco-diff-container'), {
        theme: 'devtrace-dark',
        readOnly: true,
        renderSideBySide: true,
        automaticLayout: true,
        fontFamily: 'JetBrains Mono',
        fontSize: 12,
        lineNumbers: 'on',
        minimap: { enabled: false },
        scrollbar: {
          vertical: 'visible',
          horizontal: 'visible',
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6
        }
      });

      // Load initial selected node diffs
      selectFile(activeFileIndex);
    };

    const handleKeydown = (e) => {
      if (filesList.length === 0) return;
      const key = e.key.toLowerCase();
      if (key === 'j') {
        e.preventDefault();
        const nextIndex = (activeFileIndex + 1) % filesList.length;
        selectFile(nextIndex);
      } else if (key === 'k') {
        e.preventDefault();
        const prevIndex = (activeFileIndex - 1 + filesList.length) % filesList.length;
        selectFile(prevIndex);
      }
    };

    // Layout split vs inline toggle
    let renderSideBySide = true;
    const toggleViewBtn = document.getElementById('toggle-view-mode-btn');
    toggleViewBtn.addEventListener('click', () => {
      renderSideBySide = !renderSideBySide;
      toggleViewBtn.textContent = renderSideBySide ? 'LAYOUT: SPLIT' : 'LAYOUT: UNIFIED';
      if (diffEditor) {
        diffEditor.updateOptions({
          renderSideBySide: renderSideBySide
        });
      }
    });

    // File tree search filter input
    const filterInput = document.getElementById('file-filter-input');
    filterInput.addEventListener('input', () => {
      const query = filterInput.value.toLowerCase().trim();
      filesList.forEach((file, i) => {
        const item = document.getElementById(`file-item-${i}`);
        if (item) {
          if (file.path.toLowerCase().includes(query)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });

    // Initialize bindings
    loadChangedFilesList();
    window.addEventListener('keydown', handleKeydown);

    // Save triggers reference for route unmounting
    this._keydownHandler = handleKeydown;
    this._diffEditor = diffEditor;
    this._origModel = originalModel;
    this._modModel = modifiedModel;
  },

  unmount() {
    if (this._keydownHandler) {
      window.removeEventListener('keydown', this._keydownHandler);
    }
    if (this._origModel) this._origModel.dispose();
    if (this._modModel) this._modModel.dispose();
    if (this._diffEditor) this._diffEditor.dispose();
  }
};
