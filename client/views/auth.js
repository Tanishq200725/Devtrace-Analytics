export default {
  template: `
    <div class="flex-grow flex items-center justify-center p-6 bg-gradient-to-b from-neutral-950 via-background to-neutral-950">
      <div class="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-neutral-700/80">
        
        <!-- Glow background decoration -->
        <div class="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-accent/20 blur-3xl pointer-events-none"></div>

        <!-- ========================================== -->
        <!-- PANEL 1: MAIN GATEWAY (LOGIN & SIGN UP)    -->
        <!-- ========================================== -->
        <div id="auth-main-panel" class="space-y-6">
          <!-- Logo & Header -->
          <div class="text-center relative">
            <div class="h-11 w-11 rounded-xl bg-accent/10 border border-accent/30 text-accent mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white" id="auth-title">Welcome to DevTrace</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">SECURE GATEWAY ACCESS</p>
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

          <!-- Forms -->
          <form id="auth-form" class="space-y-4">
            <div>
              <label for="auth-identifier" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5" id="label-identifier">Username</label>
              <input type="text" id="auth-identifier" placeholder="e.g. tanishq_dev" required
                class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label for="auth-password" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest">Secure Password</label>
                <button type="button" onclick="window.switchTab('forgot')" id="link-forgot-pass" class="text-[10px] font-mono text-gray-500 hover:text-white transition-colors">Forgot password?</button>
              </div>
              <input type="password" id="auth-password" placeholder="••••••••" required
                class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
            </div>

            <!-- Dynamic Alert Box -->
            <div id="auth-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

            <button type="submit" id="auth-submit-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
              <span id="btn-text">Authorize Engine</span>
              <svg class="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </form>
        </div>

        <!-- ========================================== -->
        <!-- PANEL 2: REGISTRATION OTP VERIFICATION     -->
        <!-- ========================================== -->
        <div id="auth-otp-panel" class="hidden space-y-6 animate-fadeIn">
          <div class="text-center">
            <div class="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-500 mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A4 4 0 0111.897 3h.206a4 4 0 014.033 3.79l.067 1.344a1 1 0 00.278.68l.966.966a4 4 0 010 5.656l-.966.966a1 1 0 00-.278.68l-.067 1.344a4 4 0 01-4.033 3.79h-.206a4 4 0 01-4.033-3.79l-.067-1.344a1 1 0 00-.278-.68l-.966-.966a4 4 0 010-5.656l.966-.966a1 1 0 00.278-.68l.067-1.344z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Verify Access Key</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">ENTER THE 6-DIGIT PASSCODE SENT TO YOUR CONSOLE</p>
          </div>

          <!-- Dynamic OTP Digit Blocks -->
          <div class="flex justify-between gap-2 max-w-xs mx-auto" id="otp-input-group">
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
            <input type="text" maxlength="1" pattern="[0-9]" class="otp-box w-12 h-12 bg-neutral-950 border border-border rounded-xl text-center text-lg font-bold text-white transition-all focus:border-accent outline-none focus:ring-1 focus:ring-accent font-mono" />
          </div>

          <div id="otp-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

          <button id="otp-verify-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
            Confirm Access Key
          </button>

          <div class="text-center">
            <button onclick="window.backToAuth()" class="text-xs font-mono text-gray-500 hover:text-white transition-colors duration-200">
              ← Return to Registration
            </button>
          </div>
        </div>

        <!-- ========================================== -->
        <!-- PANEL 3: CHOOSE USERNAME POST-SIGNUP       -->
        <!-- ========================================== -->
        <div id="auth-username-panel" class="hidden space-y-6 animate-fadeIn">
          <div class="text-center">
            <div class="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center mb-3">
              <svg class="w-5.5 h-5.5 stroke-[1.8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <h2 class="text-2xl font-bold tracking-tight text-white">Choose Username</h2>
            <p class="text-gray-400 text-xs mt-1.5 font-mono">FINALIZE YOUR WORKSPACE PROFILE PATH</p>
          </div>

          <form id="username-choice-form" class="space-y-4">
            <div>
              <label for="chosen-username-input" class="block text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">User Handle</label>
              <input type="text" id="chosen-username-input" placeholder="e.g. tanishq_trace" required
                class="w-full bg-neutral-950 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 font-mono transition-all duration-200 outline-none focus:border-accent" />
              
              <!-- Suggestions list -->
              <div id="username-suggestions-container" class="hidden mt-3 pt-3 border-t border-border/40">
                <p class="text-[10px] text-rose-400 font-mono mb-2">Username taken. Available modifications:</p>
                <div class="flex flex-wrap gap-2" id="username-suggestions-list">
                  <!-- Generated dynamically -->
                </div>
              </div>
            </div>

            <div id="username-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

            <button type="submit" id="username-submit-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
              <span>Complete Onboarding</span>
            </button>
          </form>
        </div>

        <!-- ========================================== -->
        <!-- PANEL 4: FORGOT PASSWORD EMAIL ENTRY       -->
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
        <!-- PANEL 5: RECOVERY OTP VERIFICATION         -->
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

        <!-- Telemetry footer -->
        <div class="mt-8 pt-6 border-t border-border/60 text-center">
          <p class="text-[10px] text-gray-500 leading-normal font-mono">
            SECURE SESSION SHA-256 ENCRYPTION.<br/>
            UNAUTHORIZED ACCESS IS STRICTLY RECORDED.
          </p>
        </div>
      </div>
    </div>
  `,
  mount() {
    let activeTab = 'login';
    let currentSignupIdentifier = '';
    let currentSignupPasswordHash = '';
    let currentRecoveryEmail = '';

    const mainPanel = document.getElementById('auth-main-panel');
    const otpPanel = document.getElementById('auth-otp-panel');
    const usernamePanel = document.getElementById('auth-username-panel');
    const forgotPanel = document.getElementById('auth-forgot-panel');
    const recoveryPanel = document.getElementById('auth-recovery-panel');
    
    const form = document.getElementById('auth-form');
    const alertBox = document.getElementById('auth-alert');
    const submitBtn = document.getElementById('auth-submit-btn');
    const btnText = document.getElementById('btn-text');

    const otpAlert = document.getElementById('otp-alert');
    const otpVerifyBtn = document.getElementById('otp-verify-btn');
    const otpBoxes = Array.from(document.querySelectorAll('.otp-box'));

    const recoveryAlert = document.getElementById('recovery-alert');
    const recoveryVerifyBtn = document.getElementById('recovery-verify-btn');
    const recoveryBoxes = Array.from(document.querySelectorAll('.recovery-box'));

    // Switch between Login and Sign Up tabs and Forgot Password flow
    window.switchTab = (tab) => {
      activeTab = tab;
      alertBox.classList.add('hidden');
      otpAlert.classList.add('hidden');
      recoveryAlert.classList.add('hidden');

      const tabLogin = document.getElementById('tab-login');
      const tabSignup = document.getElementById('tab-signup');

      // Hide all panels
      mainPanel.classList.add('hidden');
      otpPanel.classList.add('hidden');
      usernamePanel.classList.add('hidden');
      forgotPanel.classList.add('hidden');
      recoveryPanel.classList.add('hidden');

      if (tab === 'login') {
        mainPanel.classList.remove('hidden');
        tabLogin.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabSignup.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        document.getElementById('label-identifier').textContent = "Username";
        document.getElementById('auth-identifier').placeholder = "e.g. tanishq_dev";
        document.getElementById('link-forgot-pass').classList.remove('hidden');
        btnText.textContent = "Authorize Engine";
      } else if (tab === 'signup') {
        mainPanel.classList.remove('hidden');
        tabSignup.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabLogin.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        document.getElementById('label-identifier').textContent = "Gmail / Mobile Number";
        document.getElementById('auth-identifier').placeholder = "e.g. user@gmail.com";
        document.getElementById('link-forgot-pass').classList.add('hidden');
        btnText.textContent = "Register & Dispatch OTP";
      } else if (tab === 'forgot') {
        forgotPanel.classList.remove('hidden');
      } else if (tab === 'recovery') {
        recoveryPanel.classList.remove('hidden');
        setTimeout(() => recoveryBoxes[0].focus(), 100);
      }
    };

    // Return to main login/signup screen
    window.backToAuth = () => {
      window.switchTab('login');
      otpBoxes.forEach(box => box.value = '');
      recoveryBoxes.forEach(box => box.value = '');
    };

    // Handle Login/Sign Up Form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const identifier = document.getElementById('auth-identifier').value.trim();
      const password = document.getElementById('auth-password').value;

      alertBox.classList.add('hidden');
      submitBtn.disabled = true;
      
      if (activeTab === 'login') {
        submitBtn.innerHTML = `
          <span class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>Verifying Credentials...</span>
        `;

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

          alertBox.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs flex items-start gap-2.5";
          alertBox.innerHTML = `
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Connection Authorized</p>
              <p class="text-[11px] text-emerald-500/80 mt-0.5">Welcome back. Loading workspace...</p>
            </div>
          `;
          alertBox.classList.remove('hidden');

          localStorage.setItem('devtrace_auth', JSON.stringify({
            identifier: result.identifier,
            username: result.username,
            token: result.token,
            membership: result.membership,
            tokens_remaining: result.tokens_remaining,
            authorized: true
          }));

          setTimeout(() => {
            window.router.navigate('/dashboard');
          }, 1200);

        } catch (err) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Authorize Engine</span>
            <svg class="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          `;
          alertBox.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
          alertBox.innerHTML = `
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-medium">Authentication Failed</p>
              <p class="text-[11px] text-rose-400/80 mt-0.5">${err.message}</p>
            </div>
          `;
          alertBox.classList.remove('hidden');
        }

      } else {
        submitBtn.innerHTML = `
          <span class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
          <span>Dispatching Verification OTP...</span>
        `;

        try {
          const response = await fetch(`${window.API_BASE || ''}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password })
          });

          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to dispatch verification code.');
          }

          currentSignupIdentifier = result.identifier;
          
          mainPanel.classList.add('hidden');
          otpPanel.classList.remove('hidden');
          
          setTimeout(() => {
            otpBoxes[0].focus();
          }, 200);

        } catch (err) {
          alertBox.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
          alertBox.innerHTML = `
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p class="font-medium">Registration Failed</p>
              <p class="text-[11px] text-rose-400/80 mt-0.5">${err.message}</p>
            </div>
          `;
          alertBox.classList.remove('hidden');
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span id="btn-text">Register & Dispatch OTP</span>
            <svg class="w-4 h-4 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          `;
        }
      }
    });

    // ==========================================
    // OTP DIGIT BOXES FOCUS NAVIGATION LISTENERS
    // ==========================================
    otpBoxes.forEach((box, index) => {
      box.addEventListener('input', () => {
        const val = box.value;
        if (val && !/^[0-9]$/.test(val)) {
          box.value = '';
          return;
        }
        if (val && index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      });

      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !box.value && index > 0) {
          otpBoxes[index - 1].focus();
        }
      });

      box.addEventListener('paste', (e) => {
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (/^[0-9]{6}$/.test(pasteData)) {
          e.preventDefault();
          pasteData.split('').forEach((char, i) => {
            if (otpBoxes[i]) otpBoxes[i].value = char;
          });
          otpBoxes[5].focus();
        }
      });
    });

    // Handle OTP Verification submission -> switch to choose username panel
    otpVerifyBtn.addEventListener('click', async () => {
      const code = otpBoxes.map(box => box.value).join('');

      if (code.length < 6) {
        otpAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        otpAlert.innerHTML = `<div><p class="font-medium">Verification Incomplete</p><p class="text-[11px] mt-0.5">Please enter the complete 6-digit code.</p></div>`;
        otpAlert.classList.remove('hidden');
        return;
      }

      otpAlert.classList.add('hidden');
      otpVerifyBtn.disabled = true;
      otpVerifyBtn.innerHTML = `<span>Verifying OTP...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: currentSignupIdentifier, code })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'OTP verification failed.');
        }

        // OTP succeeded! Cache payload details and open Choose Username block
        currentSignupPasswordHash = result.passwordHash;
        
        otpPanel.classList.add('hidden');
        usernamePanel.classList.remove('hidden');
        
        document.getElementById('chosen-username-input').value = currentSignupIdentifier.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
        document.getElementById('username-alert').classList.add('hidden');
        document.getElementById('username-suggestions-container').classList.add('hidden');

      } catch (err) {
        otpAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        otpAlert.innerHTML = `<div><p class="font-medium">Verification Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        otpAlert.classList.remove('hidden');
      } finally {
        otpVerifyBtn.disabled = false;
        otpVerifyBtn.innerHTML = `Confirm Access Key`;
      }
    });

    // ==========================================
    // CHOOSE USERNAME FORM SUBMISSION
    // ==========================================
    const usernameForm = document.getElementById('username-choice-form');
    const usernameAlert = document.getElementById('username-alert');
    const usernameSubmitBtn = document.getElementById('username-submit-btn');
    const suggestionsContainer = document.getElementById('username-suggestions-container');
    const suggestionsList = document.getElementById('username-suggestions-list');

    window.selectSuggestedUsername = (name) => {
      document.getElementById('chosen-username-input').value = name;
      usernameForm.requestSubmit(); // Auto trigger submit
    };

    usernameForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const chosenUsername = document.getElementById('chosen-username-input').value.trim();

      usernameAlert.classList.add('hidden');
      usernameSubmitBtn.disabled = true;
      usernameSubmitBtn.innerHTML = `<span>Saving Profile...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/choose-username`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: currentSignupIdentifier,
            passwordHash: currentSignupPasswordHash,
            username: chosenUsername
          })
        });

        const result = await response.json();

        if (!response.ok) {
          // If username is taken, result contains suggestions
          if (result.suggestions && result.suggestions.length > 0) {
            suggestionsList.innerHTML = result.suggestions.map(s => `
              <button type="button" onclick="window.selectSuggestedUsername('${s}')" class="px-2.5 py-1 rounded bg-neutral-900 border border-border text-[10px] font-mono text-accent hover:border-accent/40 hover:bg-neutral-800 transition-all">
                ${s}
              </button>
            `).join('');
            suggestionsContainer.classList.remove('hidden');
          }
          throw new Error(result.error || 'Failed to claim username.');
        }

        // Success!
        suggestionsContainer.classList.add('hidden');
        usernameAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs flex items-start gap-2.5";
        usernameAlert.innerHTML = `<div><p class="font-medium">Registration Successful!</p><p class="text-[11px] mt-0.5">Account finalized. Loading your workspace...</p></div>`;
        usernameAlert.classList.remove('hidden');

        localStorage.setItem('devtrace_auth', JSON.stringify({
          identifier: result.identifier,
          username: result.username,
          token: result.token,
          membership: result.membership,
          tokens_remaining: result.tokens_remaining,
          authorized: true
        }));

        setTimeout(() => {
          window.router.navigate('/dashboard');
        }, 1500);

      } catch (err) {
        usernameAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        usernameAlert.innerHTML = `<div><p class="font-medium">Onboarding Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        usernameAlert.classList.remove('hidden');
      } finally {
        usernameSubmitBtn.disabled = false;
        usernameSubmitBtn.innerHTML = `<span>Complete Onboarding</span>`;
      }
    });

    // ==========================================
    // FORGOT PASSWORD REQUEST FLOW
    // ==========================================
    const forgotForm = document.getElementById('forgot-form');
    const forgotAlert = document.getElementById('forgot-alert');
    const forgotSubmitBtn = document.getElementById('forgot-submit-btn');

    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email-input').value.trim();

      forgotAlert.classList.add('hidden');
      forgotSubmitBtn.disabled = true;
      forgotSubmitBtn.innerHTML = `<span>Generating Reset Key...</span>`;

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
        forgotAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        forgotAlert.innerHTML = `<div><p class="font-medium">Request Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        forgotAlert.classList.remove('hidden');
      } finally {
        forgotSubmitBtn.disabled = false;
        forgotSubmitBtn.innerHTML = `<span>Send Recovery Passcode</span>`;
      }
    });

    // ==========================================
    // RECOVERY CODE VERIFICATION FLOW
    // ==========================================
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
        recoveryAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Verification Incomplete</p><p class="text-[11px] mt-0.5">Please enter the complete 6-digit code.</p></div>`;
        recoveryAlert.classList.remove('hidden');
        return;
      }

      recoveryAlert.classList.add('hidden');
      recoveryVerifyBtn.disabled = true;
      recoveryVerifyBtn.innerHTML = `<span>Authorizing Recovery...</span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/auth/verify-recovery`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentRecoveryEmail, code })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to verify recovery code.');
        }

        recoveryAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs flex items-start gap-2.5";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Recovery Authorized!</p><p class="text-[11px] mt-0.5">Welcome back. Access granted...</p></div>`;
        recoveryAlert.classList.remove('hidden');

        localStorage.setItem('devtrace_auth', JSON.stringify({
          identifier: result.identifier,
          username: result.username,
          token: result.token,
          membership: result.membership,
          tokens_remaining: result.tokens_remaining,
          authorized: true
        }));

        setTimeout(() => {
          window.router.navigate('/dashboard');
        }, 1500);

      } catch (err) {
        recoveryAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        recoveryAlert.innerHTML = `<div><p class="font-medium">Recovery Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        recoveryAlert.classList.remove('hidden');
      } finally {
        recoveryVerifyBtn.disabled = false;
        recoveryVerifyBtn.innerHTML = `Confirm Recovery Code`;
      }
    });

    // Load initial tab setting
    window.switchTab('login');
  }
};
