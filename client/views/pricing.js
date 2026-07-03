export default {
  template: `
    <div class="flex-grow w-full max-w-6xl mx-auto px-6 py-12 flex flex-col justify-center">
      <!-- Title & Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold tracking-tight text-white mb-3">Membership Plans</h1>
        <p class="text-gray-400 text-sm max-w-lg mx-auto">Access deeper telemetry, unlock premium coding vibes, and increase your analysis limits today.</p>
      </div>

      <!-- Upgrade Alert Notification -->
      <div id="pricing-alert" class="hidden max-w-xl mx-auto mb-8 rounded-xl border p-4 text-xs flex items-start gap-2.5"></div>

      <!-- Pricing cards Grid (4 Columns) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- FREE PLAN -->
        <div class="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-neutral-700/60" id="card-free">
          <div>
            <span class="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">Standard Scope</span>
            <h3 class="text-lg font-bold text-white mb-2">Free</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-3xl font-extrabold text-white">₹0</span>
              <span class="text-xs text-gray-500 font-mono">/ forever</span>
            </div>
            
            <ul class="space-y-3 text-xs text-gray-400 border-t border-border/40 pt-4 mb-6">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>10 Ingestion scan tokens</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>Beginner profile lock</span>
              </li>
              <li class="flex items-center gap-2 text-gray-600 line-through">
                <span>Unlock Advanced telemetry</span>
              </li>
              <li class="flex items-center gap-2 text-gray-600 line-through">
                <span>Matrix & Cyberpunk vibes</span>
              </li>
            </ul>
          </div>

          <button id="btn-upgrade-free" disabled class="w-full py-2.5 rounded-xl bg-neutral-900 border border-border text-gray-500 text-xs font-mono font-medium cursor-not-allowed">
            Current Tier
          </button>
        </div>

        <!-- BASIC PLAN -->
        <div class="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-neutral-700/60" id="card-basic">
          <div>
            <span class="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">Professional</span>
            <h3 class="text-lg font-bold text-white mb-2">Basic</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-3xl font-extrabold text-white">₹99</span>
              <span class="text-xs text-gray-500 font-mono">/ single user</span>
            </div>
            
            <ul class="space-y-3 text-xs text-gray-400 border-t border-border/40 pt-4 mb-6">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span class="text-gray-300">50 Ingestion scan tokens</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span class="text-gray-300">Unlock Intermediate profile</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span>Matrix visual theme</span>
              </li>
              <li class="flex items-center gap-2 text-gray-600 line-through">
                <span>Unlock Cyberpunk vibes</span>
              </li>
            </ul>
          </div>

          <button onclick="window.purchasePlan('basic')" id="btn-upgrade-basic" class="w-full py-2.5 rounded-xl border border-border bg-neutral-950 text-gray-400 hover:text-white hover:bg-neutral-900 text-xs font-mono font-medium transition-all duration-200">
            Select Basic
          </button>
        </div>

        <!-- ADVANCED PLAN -->
        <div class="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border-accent/40 shadow-xl shadow-accent/5 hover:border-accent/80" id="card-advanced">
          <!-- Recommended Badge -->
          <div class="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-accent/20 border border-accent/30 text-accent text-[9px] font-mono font-semibold uppercase tracking-wider">
            Popular
          </div>

          <div>
            <span class="text-[10px] font-mono text-accent uppercase tracking-widest block mb-1">Corporate Core</span>
            <h3 class="text-lg font-bold text-white mb-2">Advanced</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-3xl font-extrabold text-white">₹299</span>
              <span class="text-xs text-gray-500 font-mono">/ team profile</span>
            </div>
            
            <ul class="space-y-3 text-xs text-gray-400 border-t border-border/40 pt-4 mb-6">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span class="text-gray-200">Unlimited scans (unlocked)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span class="text-gray-200">Unlock Advanced profile</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-accent"></span>
                <span class="text-gray-200">Matrix & Cyberpunk themes</span>
              </li>
              <li class="flex items-center gap-2 text-gray-600 line-through">
                <span>Ollama AI Intelligence</span>
              </li>
            </ul>
          </div>

          <button onclick="window.purchasePlan('advanced')" id="btn-upgrade-advanced" class="w-full py-2.5 rounded-xl bg-accent text-white hover:bg-opacity-90 text-xs font-mono font-medium transition-all duration-200 shadow-md shadow-accent/15">
            Select Advanced
          </button>
        </div>

        <!-- ELITE CLUB PLAN -->
        <div class="glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-neutral-700/60" id="card-elite">
          <div>
            <span class="text-[10px] font-mono text-amber-500 uppercase tracking-widest block mb-1">Elite VIP</span>
            <h3 class="text-lg font-bold text-white mb-2">Elite Club</h3>
            <div class="flex items-baseline gap-1 mb-6">
              <span class="text-3xl font-extrabold text-white">₹499</span>
              <span class="text-xs text-gray-500 font-mono">/ enterprise</span>
            </div>
            
            <ul class="space-y-3 text-xs text-gray-400 border-t border-border/40 pt-4 mb-6">
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span class="text-gray-200">Unlimited scans (unlocked)</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span class="text-gray-200">All themes unlocked</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span class="text-gray-200">Ollama AI core integrations</span>
              </li>
              <li class="flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span class="text-gray-200">Dedicated support hotline</span>
              </li>
            </ul>
          </div>

          <button onclick="window.purchasePlan('elite')" id="btn-upgrade-elite" class="w-full py-2.5 rounded-xl border border-border bg-neutral-950 text-gray-400 hover:text-white hover:bg-neutral-900 text-xs font-mono font-medium transition-all duration-200">
            Join Elite Club
          </button>
        </div>

      </div>

      <!-- ========================================== -->
      <!-- CHECKOUT OVERLAY MODAL SHEET               -->
      <!-- ========================================== -->
      <div id="checkout-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
        <div class="w-full max-w-md bg-neutral-950 border border-border rounded-2xl shadow-2xl overflow-hidden relative">
          
          <!-- Header -->
          <div class="p-6 border-b border-border/80 flex items-center justify-between">
            <div>
              <h3 class="text-sm font-bold text-white">DevTrace Secure Ingestion Billing</h3>
              <p class="text-[10px] text-gray-500 font-mono mt-0.5" id="checkout-plan-tag">BASIC PLAN UPGRADE</p>
            </div>
            <button onclick="window.closeCheckout()" class="text-gray-500 hover:text-white transition-colors">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Checkout Tabs -->
          <div class="flex p-1 rounded-xl bg-neutral-900 border border-border mx-6 mt-6">
            <button id="tab-pay-upi" class="flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow transition-all duration-200" onclick="window.switchCheckoutTab('upi')">
              BHIM UPI / App
            </button>
            <button id="tab-pay-card" class="flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200" onclick="window.switchCheckoutTab('card')">
              Debit/Credit Card
            </button>
          </div>

          <!-- UPI Panel -->
          <div id="panel-pay-upi" class="p-6 space-y-5">
            <div class="flex flex-col items-center gap-4 text-center">
              <p class="text-xs text-gray-400">Scan QR Code using Google Pay, PhonePe, Paytm, or any UPI app to pay <strong class="text-white" id="checkout-upi-price">₹99</strong> directly to Tanishq Tyagi.</p>
              
              <!-- QR Code -->
              <div class="h-44 w-44 bg-white p-2 rounded-xl border border-border/40 flex items-center justify-center relative">
                <img id="checkout-qr-img" src="" alt="UPI Payment QR Code" class="h-40 w-40" />
              </div>
              
              <!-- UPI ID details -->
              <div class="px-3 py-1.5 rounded bg-neutral-900 border border-border font-mono text-[10px] text-gray-300">
                Merchant UPI ID: <strong class="text-accent">9286285985@ibl</strong>
              </div>
            </div>

            <!-- Deep Link Redirect for Mobile -->
            <a href="" id="checkout-upi-deeplink" class="w-full py-2.5 rounded-xl bg-accent text-white hover:bg-opacity-90 font-medium text-xs font-mono text-center flex items-center justify-center gap-2 transition-all">
              <span>Pay via UPI Mobile App</span>
              <svg class="w-3.5 h-3.5 stroke-[2.2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>

            <button onclick="window.confirmUPIPayment()" class="w-full py-2.5 rounded-xl border border-border bg-neutral-900 hover:bg-neutral-800 text-gray-300 hover:text-white font-medium text-xs font-mono transition-all">
              Confirm Payment & Upgrade
            </button>
          </div>

          <!-- Card Panel -->
          <form id="panel-pay-card" class="p-6 space-y-4 hidden" onsubmit="event.preventDefault(); window.processCardPayment();">
            <div>
              <label for="card-holder" class="block text-[9px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Cardholder Name</label>
              <input type="text" id="card-holder" placeholder="e.g. TANISHQ TYAGI" required
                class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
            </div>

            <div>
              <label for="card-number" class="block text-[9px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Card Number</label>
              <input type="text" id="card-number" placeholder="4111 2222 3333 4444" maxlength="19" required
                class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="card-expiry" class="block text-[9px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">Expiry Date</label>
                <input type="text" id="card-expiry" placeholder="MM/YY" maxlength="5" required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
              </div>
              <div>
                <label for="card-cvv" class="block text-[9px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1.5">CVV / CVN</label>
                <input type="password" id="card-cvv" placeholder="•••" maxlength="3" required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 font-mono transition-all outline-none focus:border-accent" />
              </div>
            </div>

            <button type="submit" id="card-pay-btn" class="w-full py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 font-mono text-xs shadow-lg shadow-accent/25 flex items-center justify-center gap-2">
              <span id="card-btn-text">Pay ₹99 Securely</span>
            </button>
          </form>

          <!-- Processing Overlay Progress Screen -->
          <div id="payment-processing-overlay" class="hidden absolute inset-0 bg-neutral-950/95 z-30 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div id="processing-spinner" class="h-8 w-8 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4"></div>
            <h4 class="text-xs font-mono text-white uppercase tracking-wider mb-2" id="processing-status-title">Securing Banking Host Connection</h4>
            <p class="text-[10px] text-gray-500 font-mono" id="processing-status-desc">Initializing 256-bit SSL transaction handshake...</p>
            
            <!-- OTP Input -->
            <div id="processing-otp-block" class="hidden mt-6 space-y-4 w-full max-w-xs">
              <p class="text-[10px] text-gray-400 font-mono">Enter 6-digit OTP code sent to your phone:</p>
              <input type="text" id="processing-card-otp" maxlength="6" placeholder="******" class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-2 text-center text-sm text-white placeholder-gray-600 font-mono tracking-widest outline-none focus:border-accent" />
              <button onclick="window.submitCardOTPVerification()" class="w-full py-2 bg-accent text-white text-xs font-mono rounded-lg hover:bg-opacity-90">Verify OTP Code</button>
            </div>
          </div>

        </div>
      </div>

    </div>
  `,
  mount() {
    const alertBox = document.getElementById('pricing-alert');
    const authState = localStorage.getItem('devtrace_auth') ? JSON.parse(localStorage.getItem('devtrace_auth')) : null;

    const modal = document.getElementById('checkout-modal');
    const upiPanel = document.getElementById('panel-pay-upi');
    const cardPanel = document.getElementById('panel-pay-card');
    const processingOverlay = document.getElementById('payment-processing-overlay');
    const otpBlock = document.getElementById('processing-otp-block');
    const spinner = document.getElementById('processing-spinner');

    let currentSelectedPlan = 'basic';
    let currentPlanPrice = 99;
    let activeCheckoutTab = 'upi';

    // Synchronize pricing card configurations according to current plan
    const syncCurrentMembership = () => {
      const auth = localStorage.getItem('devtrace_auth') ? JSON.parse(localStorage.getItem('devtrace_auth')) : null;
      if (!auth) return;

      const membership = auth.membership || 'free';

      const planButtons = {
        free: document.getElementById('btn-upgrade-free'),
        basic: document.getElementById('btn-upgrade-basic'),
        advanced: document.getElementById('btn-upgrade-advanced'),
        elite: document.getElementById('btn-upgrade-elite')
      };

      const planTiers = ['free', 'basic', 'advanced', 'elite'];
      planTiers.forEach(tier => {
        const btn = planButtons[tier];
        const card = document.getElementById(`card-${tier}`);
        if (!btn || !card) return;

        if (tier === membership) {
          card.className = "glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden border-accent bg-accent/5 shadow-2xl";
          btn.disabled = true;
          btn.textContent = "Active Tier";
          btn.className = "w-full py-2.5 rounded-xl bg-accent/15 border border-accent/20 text-accent text-xs font-mono font-semibold cursor-not-allowed";
        } else {
          card.className = "glass rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-neutral-700/60";
          btn.disabled = false;
          if (tier === 'advanced') {
            btn.className = "w-full py-2.5 rounded-xl bg-accent text-white hover:bg-opacity-90 text-xs font-mono font-medium transition-all duration-200";
            btn.textContent = "Upgrade Advanced";
          } else {
            btn.className = "w-full py-2.5 rounded-xl border border-border bg-neutral-950 text-gray-400 hover:text-white hover:bg-neutral-900 text-xs font-mono font-medium transition-all duration-200";
            btn.textContent = `Select ${tier.charAt(0).toUpperCase() + tier.slice(1)}`;
          }
        }
      });
    };

    // Card Input Auto Formatting Listeners
    const cardInput = document.getElementById('card-number');
    const expiryInput = document.getElementById('card-expiry');
    const cvvInput = document.getElementById('card-cvv');

    cardInput.addEventListener('input', () => {
      // Add spaces every 4 digits
      let val = cardInput.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
      let formatted = '';
      for (let i = 0; i < val.length; i++) {
        if (i > 0 && i % 4 === 0) formatted += ' ';
        formatted += val[i];
      }
      cardInput.value = formatted;
    });

    expiryInput.addEventListener('input', () => {
      // Add slash spacer
      let val = expiryInput.value.replace(/\//g, '').replace(/[^0-9]/g, '');
      if (val.length >= 2) {
        expiryInput.value = val.substring(0, 2) + '/' + val.substring(2, 4);
      } else {
        expiryInput.value = val;
      }
    });

    cvvInput.addEventListener('input', () => {
      cvvInput.value = cvvInput.value.replace(/[^0-9]/g, '');
    });

    // Close Checkout Modal Window
    window.closeCheckout = () => {
      modal.classList.add('hidden');
      processingOverlay.classList.add('hidden');
      otpBlock.classList.add('hidden');
      spinner.classList.remove('hidden');
    };

    // Tab Switcher inside Checkout Modal
    window.switchCheckoutTab = (tab) => {
      activeCheckoutTab = tab;
      const tabUpi = document.getElementById('tab-pay-upi');
      const tabCard = document.getElementById('tab-pay-card');

      if (tab === 'upi') {
        tabUpi.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow transition-all duration-200";
        tabCard.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        upiPanel.classList.remove('hidden');
        cardPanel.classList.add('hidden');
      } else {
        tabCard.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow transition-all duration-200";
        tabUpi.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        cardPanel.classList.remove('hidden');
        upiPanel.classList.add('hidden');
      }
    };

    // Open Checkout Dialog Window and configure payment routing targets
    window.purchasePlan = (planTier) => {
      if (!authState) {
        window.router.navigate('/auth');
        return;
      }

      currentSelectedPlan = planTier;
      
      const pricingMapping = { basic: 99, advanced: 299, elite: 499 };
      currentPlanPrice = pricingMapping[planTier] || 99;

      // Update Labels
      document.getElementById('checkout-plan-tag').textContent = `${planTier.toUpperCase()} PLAN UPGRADE`;
      document.getElementById('checkout-upi-price').textContent = `₹${currentPlanPrice}`;
      document.getElementById('card-btn-text').textContent = `Pay ₹${currentPlanPrice} Securely`;

      // Generate UPI dynamic QR Code via qrserver API
      const upiUrl = `upi://pay?pa=9286285985@ibl&pn=DevTrace&am=${currentPlanPrice}&cu=INR&tn=DevTrace%20${planTier.toUpperCase()}%20Plan`;
      const encodedUpi = encodeURIComponent(upiUrl);
      
      document.getElementById('checkout-qr-img').src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedUpi}`;
      document.getElementById('checkout-upi-deeplink').href = upiUrl;

      // Reset Modal Visual forms
      window.switchCheckoutTab('upi');
      modal.classList.remove('hidden');
    };

    // 1. UPI Payment confirmation handler
    window.confirmUPIPayment = () => {
      processingOverlay.classList.remove('hidden');
      document.getElementById('processing-status-title').textContent = "Checking UPI Payment Confirmation";
      document.getElementById('processing-status-desc').textContent = "Scanning direct ledger for token updates to 9286285985@ibl...";

      setTimeout(async () => {
        await executeBackendUpgrade();
      }, 2000);
    };

    // 2. Card Payment processing handler
    window.processCardPayment = () => {
      processingOverlay.classList.remove('hidden');
      document.getElementById('processing-status-title').textContent = "Connecting to Secure Card Server";
      document.getElementById('processing-status-desc').textContent = "Establishing 256-bit secure gateway connection...";

      setTimeout(() => {
        document.getElementById('processing-status-title').textContent = "Verifying Card Credentials";
        document.getElementById('processing-status-desc').textContent = "Communicating with Visa/Mastercard processing host...";

        setTimeout(() => {
          // Display OTP Entry Form block inside processing overlay
          spinner.classList.add('hidden');
          document.getElementById('processing-status-title').textContent = "OTP Authentication Required";
          document.getElementById('processing-status-desc').textContent = "Entering secure verification portal.";
          otpBlock.classList.remove('hidden');
          document.getElementById('processing-card-otp').focus();
        }, 1500);

      }, 1500);
    };

    // Submit Card OTP verification handler
    window.submitCardOTPVerification = () => {
      const otpVal = document.getElementById('processing-card-otp').value.trim();
      if (otpVal.length < 6) {
        alert("Please enter a valid 6-digit OTP code.");
        return;
      }

      otpBlock.classList.add('hidden');
      spinner.classList.remove('hidden');
      document.getElementById('processing-status-title').textContent = "Authorizing Transaction";
      document.getElementById('processing-status-desc').textContent = "Finalizing card settlement...";

      setTimeout(async () => {
        await executeBackendUpgrade();
      }, 1500);
    };

    // Execute backend database updates after payments
    const executeBackendUpgrade = async () => {
      try {
        const response = await fetch(`${window.API_BASE || ''}/api/membership/upgrade`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            identifier: authState.identifier,
            tier: currentSelectedPlan
          })
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to update billing plan.');
        }

        // Successfully upgraded
        window.closeCheckout();

        alertBox.className = "max-w-xl mx-auto mb-8 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-4 text-xs flex items-start gap-2.5 animate-fadeIn";
        alertBox.innerHTML = `
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="font-medium">Plan Upgraded Successfully!</p>
            <p class="text-[11px] text-emerald-500/80 mt-0.5">Your profile now has ${currentSelectedPlan.toUpperCase()} credentials. Scan tokens have been refueled. An invoice statement has been printed to the console.</p>
          </div>
        `;
        alertBox.classList.remove('hidden');

        // Sync local session cache
        authState.membership = currentSelectedPlan;
        authState.tokens_remaining = result.tokens_remaining;
        localStorage.setItem('devtrace_auth', JSON.stringify(authState));

        syncCurrentMembership();

      } catch (err) {
        window.closeCheckout();

        alertBox.className = "max-w-xl mx-auto mb-8 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-4 text-xs flex items-start gap-2.5 animate-fadeIn";
        alertBox.innerHTML = `
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p class="font-medium">Payment Authorization Failed</p>
            <p class="text-[11px] text-rose-400/80 mt-0.5">${err.message}</p>
          </div>
        `;
        alertBox.classList.remove('hidden');
        syncCurrentMembership();
      }
    };

    syncCurrentMembership();
  }
};
