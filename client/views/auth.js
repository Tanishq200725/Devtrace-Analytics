export default {
  template: `
    <div class="flex-grow flex items-center justify-center p-6 bg-gradient-to-b from-neutral-950 via-background to-neutral-950">
      <div class="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-neutral-700/80">
        
        <!-- Glow background decoration -->
        <div class="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl pointer-events-none"></div>

        <!-- ========================================== -->
        <!-- MAIN GATEWAY (LOGIN & SIGN UP)             -->
        <!-- ========================================== -->
        <div class="space-y-6">
          <!-- Logo & Header -->
          <div class="text-center relative">
            <div class="h-11 w-11 rounded-xl bg-accent/10 border border-accent/30 text-accent mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white" id="auth-title">DevTrace Portal</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">SECURE SYSTEM ACCESS</p>
          </div>

          <!-- Tab Selection (Linear styling) -->
          <div class="flex p-1 rounded-xl bg-neutral-900/60 border border-border">
            <button id="tab-login" class="flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-200" onclick="window.switchTab('login')">
              LOGIN
            </button>
            <button id="tab-signup" class="flex-1 py-2 text-xs font-mono font-medium rounded-lg transition-all duration-200" onclick="window.switchTab('signup')">
              SIGN UP
            </button>
          </div>

          <!-- A. LOGIN FORM -->
          <div id="login-fields-container" class="space-y-4">
            <form id="login-form" class="space-y-4">
              <div>
                <label for="login-identifier" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Username / Gmail</label>
                <input type="text" id="login-identifier" placeholder="e.g. tanishq_dev" required
                  class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <div>
                <div class="flex justify-between items-center mb-1.5">
                  <label for="login-password" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest">Password</label>
                  <button type="button" onclick="window.switchTab('forgot')" id="link-forgot-pass" class="text-[10px] font-mono text-gray-500 hover:text-white transition-colors">Forgot password?</button>
                </div>
                <input type="password" id="login-password" placeholder="••••••••" required
                  class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <!-- Dynamic Alert Box -->
              <div id="login-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

              <button type="submit" id="login-submit-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
                <span>Authorize Engine</span>
                <svg class="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          </div>

          <!-- B. SIGN UP FORM -->
          <div id="signup-fields-container" class="hidden space-y-4">
            <form id="signup-form" class="space-y-4">
              <div>
                <label for="signup-username" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Choose Username</label>
                <input type="text" id="signup-username" placeholder="e.g. tanishq_dev" required minlength="3"
                  class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
                
                <!-- Suggestions list -->
                <div id="username-suggestions-container" class="hidden mt-2 pt-2 border-t border-border/40">
                  <p class="text-[10px] text-rose-400 font-mono mb-1.5">Username taken. Try these:</p>
                  <div class="flex flex-wrap gap-2" id="username-suggestions-list">
                    <!-- Generated dynamically -->
                  </div>
                </div>
              </div>

              <div>
                <label for="signup-identifier" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Gmail / Mobile (with country code)</label>
                <input type="text" id="signup-identifier" placeholder="e.g. user@gmail.com or +919286285985" required
                  class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <div>
                <label for="signup-password" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Create Password</label>
                <input type="password" id="signup-password" placeholder="••••••••" required minlength="6"
                  class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <!-- Dynamic Alert Box -->
              <div id="signup-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

              <button type="submit" id="signup-submit-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
                <span>Create Account</span>
                <svg class="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- FORGOT PASSWORD PANEL                      -->
        <!-- ========================================== -->
        <div id="auth-forgot-panel" class="hidden space-y-6 animate-fadeIn">
          <div class="text-center">
            <div class="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Reset Access Key</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">ENTER REGISTERED GMAIL TO REQUEST KEY</p>
          </div>

          <form id="forgot-form" class="space-y-4">
            <div>
              <label for="forgot-email-input" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Registered Gmail</label>
              <input type="email" id="forgot-email-input" placeholder="e.g. user@gmail.com" required
                class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
            </div>

            <div id="forgot-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

            <button type="submit" id="forgot-submit-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
              <span>Send Recovery Passcode</span>
            </button>
          </form>

          <div class="text-center">
            <button onclick="window.backToAuth()" class="text-xs font-mono text-gray-500 hover:text-white transition-colors duration-200">
              ← Return to Gateway Login
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- RECOVERY OTP PANEL                         -->
        <!-- ========================================== -->
        <div id="auth-recovery-panel" class="hidden space-y-6 animate-fadeIn">
          <div class="text-center">
            <div class="h-11 w-11 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Enter Recovery Code</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">VERIFY THE 6-DIGIT PASSCODE SENT TO YOUR CONSOLE</p>
          </div>

          <!-- Dynamic Recovery Digit Blocks -->
          <div class="flex justify-between gap-2 max-w-xs mx-auto" id="recovery-input-group">
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="recovery-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
          </div>

          <div id="recovery-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

          <button id="recovery-verify-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
            Confirm Recovery Code
          </button>

          <div class="text-center">
            <button onclick="window.switchTab('forgot')" class="text-xs font-mono text-gray-500 hover:text-white transition-colors duration-200">
              ← Resend Recovery Code
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  mount() {
    let activeTab = 'login';
    let currentRecoveryEmail = '';

    const loginFields = document.getElementById('login-fields-container');
    const signupFields = document.getElementById('signup-fields-container');
    const forgotPanel = document.getElementById('auth-forgot-panel');
    const recoveryPanel = document.getElementById('auth-recovery-panel');
    
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginAlert = document.getElementById('login-alert');
    const signupAlert = document.getElementById('signup-alert');
    const loginSubmitBtn = document.getElementById('login-submit-btn');
    const signupSubmitBtn = document.getElementById('signup-submit-btn');

    const recoveryAlert = document.getElementById('recovery-alert');
    const recoveryVerifyBtn = document.getElementById('recovery-verify-btn');
    const recoveryBoxes = Array.from(document.querySelectorAll('.recovery-box'));

    // Switch Tab Panels
    window.switchTab = (tab) => {
      activeTab = tab;
      loginAlert.classList.add('hidden');
      signupAlert.classList.add('hidden');
      recoveryAlert.classList.add('hidden');

      const tabLogin = document.getElementById('tab-login');
      const tabSignup = document.getElementById('tab-signup');

      // Hide all panels
      loginFields.classList.add('hidden');
      signupFields.classList.add('hidden');
      forgotPanel.classList.add('hidden');
      recoveryPanel.classList.add('hidden');

      if (tab === 'login') {
        loginFields.classList.remove('hidden');
        tabLogin.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200 focus:outline-none";
        tabSignup.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200 focus:outline-none";
      } else if (tab === 'signup') {
        signupFields.classList.remove('hidden');
        tabSignup.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200 focus:outline-none";
        tabLogin.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200 focus:outline-none";
        
        document.getElementById('username-suggestions-container').classList.add('hidden');
      } else if (tab === 'forgot') {
        forgotPanel.classList.remove('hidden');
      } else if (tab === 'recovery') {
        recoveryPanel.classList.remove('hidden');
        setTimeout(() => recoveryBoxes[0].focus(), 100);
      }
    };

    window.backToAuth = () => {
      window.switchTab('login');
      recoveryBoxes.forEach(box => box.value = '');
    };

    // FORM 1: LOGIN HANDLER
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const identifier = document.getElementById('login-identifier').value.trim();
      const password = document.getElementById('login-password').value;

      loginAlert.classList.add('hidden');
      loginSubmitBtn.disabled = true;
      loginSubmitBtn.innerHTML = `<span>Verifying...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: identifier, password })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Authentication failed.');
        }

        loginAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs";
        loginAlert.innerHTML = `<div><p class="font-medium">Connection Authorized</p><p class="text-[11px] mt-0.5">Welcome back. Loading...</p></div>`;
        loginAlert.classList.remove('hidden');

        localStorage.setItem('devtrace_auth', JSON.stringify({
          identifier: result.identifier,
          username: result.username,
          token: result.token,
          membership: result.membership,
          tokens_remaining: result.tokens_remaining,
          chat_queries_remaining: result.chat_queries_remaining ?? 5,
          is_pioneer: result.is_pioneer,
          authorized: true
        }));

        setTimeout(() => {
          window.router.navigate('/dashboard');
        }, 1200);

      } catch (err) {
        loginAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs animate-fadeIn";
        loginAlert.innerHTML = `<div><p class="font-medium">Authentication Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        loginAlert.classList.remove('hidden');
      } finally {
        loginSubmitBtn.disabled = false;
        loginSubmitBtn.innerHTML = `<span>Authorize Engine</span>`;
      }
    });

    // FORM 2: SIMPLE SIGNUP HANDLER (Submit directly to choose-username)
    const suggestionsContainer = document.getElementById('username-suggestions-container');
    const suggestionsList = document.getElementById('username-suggestions-list');

    window.selectSuggestedUsername = (name) => {
      document.getElementById('signup-username').value = name;
      signupForm.requestSubmit(); // Auto trigger submit
    };

    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const chosenUsername = document.getElementById('signup-username').value.trim();
      const identifier = document.getElementById('signup-identifier').value.trim();
      const password = document.getElementById('signup-password').value;

      signupAlert.classList.add('hidden');
      signupSubmitBtn.disabled = true;
      signupSubmitBtn.innerHTML = `<span>Creating Account...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/choose-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier,
            password,
            username: chosenUsername
          })
        });

        const result = await response.json();

        if (!response.ok) {
          if (result.suggestions && result.suggestions.length > 0) {
            suggestionsList.innerHTML = result.suggestions.map(s => `
              <button type="button" onclick="window.selectSuggestedUsername('${s}')" class="px-2.5 py-1 rounded bg-neutral-900 border border-border text-[10px] font-mono text-accent hover:border-accent/40 hover:bg-neutral-800 transition-all focus:outline-none">
                ${s}
              </button>
            `).join('');
            suggestionsContainer.classList.remove('hidden');
          }
          throw new Error(result.error || 'Failed to register account.');
        }

        suggestionsContainer.classList.add('hidden');
        signupAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs";
        signupAlert.innerHTML = `<div><p class="font-medium">Onboarding Complete!</p><p class="text-[11px] mt-0.5">Account registered. Loading dashboard...</p></div>`;
        signupAlert.classList.remove('hidden');

        localStorage.setItem('devtrace_auth', JSON.stringify({
          identifier: result.identifier,
          username: result.username,
          token: result.token,
          membership: result.membership,
          tokens_remaining: result.tokens_remaining,
          chat_queries_remaining: result.chat_queries_remaining ?? 5,
          is_pioneer: result.is_pioneer,
          authorized: true
        }));

        setTimeout(() => {
          window.router.navigate('/dashboard');
        }, 1500);

      } catch (err) {
        signupAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs animate-fadeIn";
        signupAlert.innerHTML = `<div><p class="font-medium">Registration Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        signupAlert.classList.remove('hidden');
      } finally {
        signupSubmitBtn.disabled = false;
        signupSubmitBtn.innerHTML = `<span>Create Account</span>`;
      }
    });

    // FORGOT PASSWORD FLOW
    const forgotForm = document.getElementById('forgot-form');
    const forgotAlert = document.getElementById('forgot-alert');
    const forgotSubmitBtn = document.getElementById('forgot-submit-btn');

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email-input').value.trim();

      forgotAlert.classList.add('hidden');
      forgotSubmitBtn.disabled = true;
      forgotSubmitBtn.innerHTML = `<span>Requesting Key...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to request reset key.');
        }

        currentRecoveryEmail = result.email;
        window.switchTab('recovery');

      } catch (err) {
        forgotAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs animate-fadeIn";
        forgotAlert.innerHTML = `<div><p class="font-medium">Request Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        forgotAlert.classList.remove('hidden');
      } finally {
        forgotSubmitBtn.disabled = false;
        forgotSubmitBtn.innerHTML = `<span>Send Recovery Passcode</span>`;
      }
    });

    // RECOVERY OTP VERIFICATION
    recoveryBoxes.forEach((box, index) => {
      box.addEventListener('input', () => {
        const val = box.value;
        if (val && !/^[0-9]$/.test(val)) {
          box.value = '';
          return;
        }
        if (val && index < recoveryBoxes.length - 1) {
          recoveryBoxes[index + 1].focus();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
          recoveryBoxes[index - 1].focus();
        }
      });
    });

    recoveryVerifyBtn.addEventListener('click', async () => {
      const code = recoveryBoxes.map(box => box.value).join('');

      if (code.length < 6) {
        recoveryAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs animate-fadeIn";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Verification Incomplete</p><p class="text-[11px] mt-0.5">Please enter the complete 6-digit code.</p></div>`;
        recoveryAlert.classList.remove('hidden');
        return;
      }

      recoveryAlert.classList.add('hidden');
      recoveryVerifyBtn.disabled = true;
      recoveryVerifyBtn.innerHTML = `<span>Verifying...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/verify-recovery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentRecoveryEmail, code })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Recovery verification failed.');
        }

        recoveryAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Authorized</p><p class="text-[11px] mt-0.5">Logging you in...</p></div>`;
        recoveryAlert.classList.remove('hidden');

        localStorage.setItem('devtrace_auth', JSON.stringify({
          identifier: result.identifier,
          username: result.username,
          token: result.token,
          membership: result.membership,
          tokens_remaining: result.tokens_remaining,
          chat_queries_remaining: result.chat_queries_remaining ?? 5,
          is_pioneer: result.is_pioneer,
          authorized: true
        }));

        setTimeout(() => {
          window.router.navigate('/dashboard');
        }, 1200);

      } catch (err) {
        recoveryAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs animate-fadeIn";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Verification Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        recoveryAlert.classList.remove('hidden');
      } finally {
        recoveryVerifyBtn.disabled = false;
        recoveryVerifyBtn.innerHTML = `Confirm Recovery Code`;
      }
    });

    // Set initial view
    window.switchTab('login');
  }
};
