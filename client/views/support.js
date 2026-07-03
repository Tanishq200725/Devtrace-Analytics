export default {
  template: `
    <div class="flex-grow max-w-4xl w-full mx-auto px-6 py-12 flex flex-col justify-center">
      <div class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-white mb-2" id="support-title">Developer Support Desk</h1>
        <p class="text-gray-400 text-sm" id="support-desc">Submit formal diagnostic tickets or send improvement advice directly to our engineers.</p>
      </div>

      <!-- Tab Selection (Linear styling) -->
      <div class="flex p-1 rounded-xl bg-neutral-900 border border-border max-w-sm mb-8">
        <button id="tab-ticket" class="flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200" onclick="window.switchSupportTab('ticket')">
          FILE TICKET
        </button>
        <button id="tab-suggestion" class="flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200" onclick="window.switchSupportTab('suggestion')">
          SUGGESTION BOX
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Tab 1: File Ticket Container -->
        <div class="md:col-span-2 space-y-6" id="panel-ticket">
          <div class="glass rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm font-semibold tracking-tight text-white mb-4">Report an Issue</h3>
            
            <form id="support-form" class="space-y-5">
              <div>
                <label for="ticket-subject" class="block text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-2">Issue Subject</label>
                <input type="text" id="ticket-subject" placeholder="e.g., Git excavation failed on large repository" required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <div>
                <label for="ticket-description" class="block text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-2">Detailed Description</label>
                <textarea id="ticket-description" rows="5" placeholder="Please describe the steps taken leading up to the issue..." required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none focus:border-accent resize-none"></textarea>
              </div>

              <div class="rounded-xl bg-neutral-900 border border-border p-4 flex items-start gap-3">
                <input type="checkbox" id="attach-telemetry" checked class="mt-1 accent-accent h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent" />
                <div>
                  <label for="attach-telemetry" class="text-xs font-medium text-gray-300 cursor-pointer">Attach client-side JSON diagnostic footprint</label>
                  <p class="text-[10px] text-gray-500 mt-1">Includes userAgent browser metadata, local storage authentication parameters, and client router logs.</p>
                </div>
              </div>

              <div id="support-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

              <button type="submit" id="support-submit-btn" class="w-full md:w-auto px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-md shadow-accent/15 flex items-center justify-center gap-2">
                <span>Submit Ticket</span>
                <svg class="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Tab 2: Suggestion Box Container (Hidden Initially) -->
        <div class="md:col-span-2 space-y-6 hidden" id="panel-suggestion">
          <div class="glass rounded-2xl p-6 shadow-xl">
            <h3 class="text-sm font-semibold tracking-tight text-white mb-4">Submit Improvement Suggestions</h3>
            
            <form id="suggestion-form" class="space-y-5">
              <div>
                <label for="suggestion-email" class="block text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-2">Gmail Address</label>
                <input type="email" id="suggestion-email" placeholder="e.g. user@gmail.com" required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none focus:border-accent" />
              </div>

              <div>
                <label for="suggestion-text" class="block text-[11px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-2">Your Suggestion / Advice</label>
                <textarea id="suggestion-text" rows="5" placeholder="Share your improvement advice or request new features..." required
                  class="w-full bg-neutral-900 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-all duration-200 outline-none focus:border-accent resize-none"></textarea>
              </div>

              <div id="suggestion-alert" class="hidden rounded-xl border p-3.5 text-xs flex items-start gap-2.5"></div>

              <button type="submit" id="suggestion-submit-btn" class="w-full md:w-auto px-6 py-3 rounded-xl bg-accent text-white font-medium hover:bg-opacity-90 active:scale-[0.99] transition-all duration-200 shadow-md shadow-accent/15 flex items-center justify-center gap-2">
                <span>Send Suggestion</span>
                <svg class="w-4 h-4 stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        <!-- Right Side Panel: Telemetry Monitor -->
        <div class="flex flex-col gap-6">
          <div class="glass rounded-2xl p-5 shadow-lg flex-grow flex flex-col justify-between">
            <div>
              <h3 class="text-sm font-semibold tracking-tight text-white mb-3 flex items-center gap-2">
                <svg class="w-4 h-4 text-accent stroke-[2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                </svg>
                <span>Diagnostics Monitor</span>
              </h3>
              <p class="text-xs text-gray-500 mb-4" id="monitor-text">Live output of the JSON metadata package ready for upload:</p>
              
              <div class="bg-neutral-950 rounded-xl p-3 border border-border/80 font-mono text-[10px] leading-relaxed text-emerald-500 max-h-56 overflow-y-auto" id="telemetry-box">
                <!-- Telemetry text populated dynamically -->
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-border/60 text-center">
              <span class="text-[9px] text-gray-500 font-mono" id="panel-db-tag">SUPABASE TABLE: support_tickets</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `,
  mount() {
    let activeSupportTab = 'ticket';

    const panelTicket = document.getElementById('panel-ticket');
    const panelSuggestion = document.getElementById('panel-suggestion');
    const monitorText = document.getElementById('monitor-text');
    const dbTag = document.getElementById('panel-db-tag');

    // Tab Switcher Controller
    window.switchSupportTab = (tab) => {
      activeSupportTab = tab;
      
      const tabTicket = document.getElementById('tab-ticket');
      const tabSuggestion = document.getElementById('tab-suggestion');

      if (tab === 'ticket') {
        tabTicket.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabSuggestion.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        panelTicket.classList.remove('hidden');
        panelSuggestion.classList.add('hidden');
        monitorText.textContent = "Live output of the JSON metadata package ready for upload:";
        dbTag.textContent = "SUPABASE TABLE: support_tickets";
        renderTelemetry();
      } else {
        tabSuggestion.className = "flex-1 py-2 text-xs font-mono font-semibold rounded-lg bg-accent text-white shadow border border-accent transition-all duration-200";
        tabTicket.className = "flex-1 py-2 text-xs font-mono font-medium rounded-lg text-gray-400 hover:text-white transition-all duration-200";
        panelTicket.classList.add('hidden');
        panelSuggestion.classList.remove('hidden');
        monitorText.textContent = "Feedback package format structure details:";
        dbTag.textContent = "API POST PATH: /api/support/suggestion";
        renderSuggestionTelemetry();
      }
    };

    // FORM 1: TICKET REGISTRY
    const form = document.getElementById('support-form');
    const alertBox = document.getElementById('support-alert');
    const submitBtn = document.getElementById('support-submit-btn');
    const telemetryBox = document.getElementById('telemetry-box');
    const attachCheckbox = document.getElementById('attach-telemetry');

    const getTelemetry = () => {
      const authState = localStorage.getItem('devtrace_auth') 
        ? JSON.parse(localStorage.getItem('devtrace_auth')) 
        : { authorized: false };
      
      return {
        timestamp: new Date().toISOString(),
        agent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        url: window.location.href,
        connection: navigator.onLine ? "online" : "offline",
        auth: {
          authorized: authState.authorized,
          developer_sap_id: authState.identifier || "anonymous"
        }
      };
    };

    const renderTelemetry = () => {
      if (activeSupportTab === 'suggestion') return;
      if (attachCheckbox.checked) {
        telemetryBox.innerHTML = JSON.stringify(getTelemetry(), null, 2);
      } else {
        telemetryBox.innerHTML = `{\n  "telemetry": "disabled by user"\n}`;
      }
    };

    renderTelemetry();
    attachCheckbox.addEventListener('change', renderTelemetry);

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const subject = document.getElementById('ticket-subject').value.trim();
      const description = document.getElementById('ticket-description').value.trim();
      const telemetry = attachCheckbox.checked ? getTelemetry() : null;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block"></span>`;

      try {
        const payload = { subject, description, telemetry, created_at: new Date().toISOString() };
        const response = await fetch(`${window.API_BASE || ''}/api/support/ticket`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
          alertBox.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs flex items-start gap-2.5";
          alertBox.innerHTML = `
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Ticket Created Successfully</p>
              <p class="text-[11px] text-emerald-500/80 mt-0.5">Ticket ID: ${result.ticketId}. Saved successfully.</p>
            </div>
          `;
          alertBox.classList.remove('hidden');
          form.reset();
          renderTelemetry();
        } else {
          throw new Error(result.error || 'Server error uploading ticket');
        }
      } catch (err) {
        alertBox.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5";
        alertBox.innerHTML = `<div><p class="font-medium">Submission Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        alertBox.classList.remove('hidden');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Ticket</span>`;
      }
    });

    // FORM 2: SUGGESTION BOX
    const sugForm = document.getElementById('suggestion-form');
    const sugAlert = document.getElementById('suggestion-alert');
    const sugSubmitBtn = document.getElementById('suggestion-submit-btn');

    const renderSuggestionTelemetry = () => {
      const emailVal = document.getElementById('suggestion-email').value || 'user@gmail.com';
      const textVal = document.getElementById('suggestion-text').value || 'I recommend adding visual graph mappings...';
      
      telemetryBox.innerHTML = JSON.stringify({
        email: emailVal,
        suggestion: textVal,
        envelope: {
          subject: "Thank you for your DevTrace suggestion!",
          template: "UX_FEEDBACK_LAYOUT"
        }
      }, null, 2);
    };

    // Auto update suggest logs when typing
    document.getElementById('suggestion-email').addEventListener('input', renderSuggestionTelemetry);
    document.getElementById('suggestion-text').addEventListener('input', renderSuggestionTelemetry);

    sugForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('suggestion-email').value.trim();
      const suggestion = document.getElementById('suggestion-text').value.trim();

      sugSubmitBtn.disabled = true;
      sugSubmitBtn.innerHTML = `<span class="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block"></span>`;

      try {
        const response = await fetch(`${window.API_BASE || ''}/api/support/suggestion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, suggestion })
        });

        const result = await response.json();

        if (response.ok) {
          sugAlert.className = "rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
          sugAlert.innerHTML = `
            <svg class="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p class="font-medium">Suggestion Submitted!</p>
              <p class="text-[11px] text-emerald-500/80 mt-0.5">Thank you. We have sent a confirmation thank-you email to ${email}. (Check your terminal console logs).</p>
            </div>
          `;
          sugAlert.classList.remove('hidden');
          sugForm.reset();
          renderSuggestionTelemetry();
        } else {
          throw new Error(result.error || 'Server error recording suggestion');
        }
      } catch (err) {
        sugAlert.className = "rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 p-3.5 text-xs flex items-start gap-2.5 animate-fadeIn";
        sugAlert.innerHTML = `<div><p class="font-medium">Submission Failed</p><p class="text-[11px] mt-0.5">${err.message}</p></div>`;
        sugAlert.classList.remove('hidden');
      } finally {
        sugSubmitBtn.disabled = false;
        sugSubmitBtn.innerHTML = `<span>Send Suggestion</span>`;
      }
    });

    // Check query params for active tab redirect routing
    const urlParams = new URLSearchParams(window.location.search);
    const activeTabParam = urlParams.get('tab');
    if (activeTabParam === 'suggestion') {
      window.switchSupportTab('suggestion');
    } else {
      window.switchSupportTab('ticket');
    }
  }
};
