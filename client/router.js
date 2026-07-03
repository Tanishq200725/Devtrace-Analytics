// Custom Asynchronous client-side Router

// Import views
import authView from './views/auth.js';
import dashboardView from './views/dashboard.js';
import diffView from './views/diff.js';
import supportView from './views/support.js';
import pricingView from './views/pricing.js';

const routes = {
  '/auth': authView,
  '/dashboard': dashboardView,
  '/workspace/diff': diffView,
  '/support': supportView,
  '/pricing': pricingView
};

// Setup Dynamic Production API base URL
// Replace with your actual deployed Render Web Service URL
window.API_BASE = '';

// Global visual theme controller
window.setTheme = (themeName) => {
  const authState = localStorage.getItem('devtrace_auth') 
    ? JSON.parse(localStorage.getItem('devtrace_auth')) 
    : { authorized: false, membership: 'free' };

  const membership = authState.membership || 'free';

  // Access permissions mapping for themes
  const themePermissions = {
    vercel: 'free',
    dracula: 'free',
    matrix: 'basic',
    cyberpunk: 'advanced',
    stripe: 'elite'
  };

  const requiredTier = themePermissions[themeName] || 'free';

  // Evaluate permission weights
  const levels = { free: 0, basic: 1, advanced: 2, elite: 3 };
  const userWeight = levels[membership] || 0;
  const requiredWeight = levels[requiredTier] || 0;

  if (userWeight < requiredWeight) {
    // Reset dropdown selector back to current applied theme
    const currentTheme = localStorage.getItem('devtrace_theme') || 'vercel';
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = currentTheme;
    
    alert(`The '${themeName.toUpperCase()}' theme requires a ${requiredTier.toUpperCase()} membership or above! Please upgrade your plan in the Membership portal.`);
    window.router.navigate('/pricing');
    return;
  }

  // Remove existing applied theme classes
  document.documentElement.className = '';
  document.documentElement.classList.add('dark', `theme-${themeName}`);
  localStorage.setItem('devtrace_theme', themeName);

  const selector = document.getElementById('theme-selector');
  if (selector) selector.value = themeName;
};

class Router {
  constructor() {
    this.appRoot = document.getElementById('app-root');
    this.navLinks = document.getElementById('nav-links');
    this.authNavBtn = document.getElementById('auth-nav-btn');
    
    // Bind event handlers
    window.addEventListener('popstate', () => this.handleRouting());
    document.addEventListener('click', (e) => this.handleLinkClick(e));
    
    // Expose router globally
    window.router = this;
    
    // Load saved visual theme on boot
    this.loadInitialTheme();
  }

  loadInitialTheme() {
    const savedTheme = localStorage.getItem('devtrace_theme') || 'vercel';
    document.documentElement.className = '';
    document.documentElement.classList.add('dark', `theme-${savedTheme}`);
    const selector = document.getElementById('theme-selector');
    if (selector) selector.value = savedTheme;
  }

  // Intercept standard data-link anchors
  handleLinkClick(e) {
    const target = e.target.closest('[data-link]');
    if (target) {
      e.preventDefault();
      const href = target.getAttribute('href');
      this.navigate(href);
    }
  }

  // Navigate programmatically
  navigate(url) {
    window.history.pushState(null, null, url);
    this.handleRouting();
  }

  // Orchestrate view swapping
  async handleRouting() {
    let path = window.location.pathname;
    
    // Redirect root to dashboard
    if (path === '/' || path === '') {
      path = '/dashboard';
      window.history.replaceState(null, null, path);
    }

    const authState = localStorage.getItem('devtrace_auth') 
      ? JSON.parse(localStorage.getItem('devtrace_auth')) 
      : { authorized: false };

    // Auth Guard: Redirect based on authentication status
    if (path === '/auth' && authState.authorized) {
      this.navigate('/dashboard');
      return;
    }
    if (path !== '/auth' && !authState.authorized) {
      this.navigate('/auth');
      return;
    }


    const view = routes[path];
    
    if (!view) {
      // Fallback route
      this.appRoot.innerHTML = `
        <div class="flex-grow flex flex-col items-center justify-center fade-in">
          <h2 class="text-3xl font-bold tracking-tight mb-2">404</h2>
          <p class="text-gray-400 mb-6 text-sm">The digital trace leads to a dead end.</p>
          <a href="/dashboard" class="px-5 py-2 rounded-lg bg-accent text-white font-medium hover:bg-opacity-90 transition-all" data-link>Back to Dashboard</a>
        </div>
      `;
      this.updateNavigationUI(path);
      return;
    }

    // Cleanup previous view if needed to prevent memory leaks or key listener accumulation
    if (this.currentView && typeof this.currentView.unmount === 'function') {
      try {
        this.currentView.unmount();
      } catch (err) {
        console.error('Error unmounting view:', err);
      }
    }

    this.currentView = view;

    // Apply fade-out and swap views
    this.appRoot.innerHTML = `
      <div class="flex-grow flex flex-col fade-in h-full w-full">
        ${view.template}
      </div>
    `;

    // Initialize scripts/events bound to the view
    if (view && typeof view.mount === 'function') {
      try {
        view.mount();
      } catch (err) {
        console.error('Error mounting view:', err);
      }
    }

    this.updateNavigationUI(path);
    if (typeof window.onRouteChanged === 'function') {
      try {
        window.onRouteChanged();
      } catch (err) {
        console.error('Error in onRouteChanged hook:', err);
      }
    }
  }

  // Sync navigation styles based on current path
  updateNavigationUI(path) {
    const themeSelector = document.getElementById('theme-selector-container');
    
    // Hide navigation bar when in auth flow to focus attention
    if (path === '/auth') {
      this.navLinks.classList.add('hidden');
      if (themeSelector) themeSelector.classList.add('hidden');
      this.authNavBtn.textContent = 'Explore Dashboard';
      this.authNavBtn.onclick = () => this.navigate('/dashboard');
      this.authNavBtn.className = 'text-sm font-medium px-4 py-1.5 rounded-lg border border-accent bg-accent/10 text-accent hover:bg-accent/20 transition-all duration-200';
    } else {
      this.navLinks.classList.remove('hidden');
      if (themeSelector) themeSelector.classList.remove('hidden');
      this.authNavBtn.textContent = 'Authorize';
      this.authNavBtn.onclick = () => this.navigate('/auth');
      this.authNavBtn.className = 'text-sm font-medium px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-neutral-800 hover:border-gray-700 transition-all duration-200';
      
      // Update active links status
      const links = this.navLinks.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href === path) {
          link.classList.add('text-white', 'border-b-2', 'border-accent', 'pb-1');
          link.classList.remove('text-gray-400');
        } else {
          link.classList.remove('text-white', 'border-b-2', 'border-accent', 'pb-1');
          link.classList.add('text-gray-400');
        }
      });
    }
  }
}

// Start routing once DOM content loads
document.addEventListener('DOMContentLoaded', () => {
  const appRouter = new Router();
  appRouter.handleRouting();
});
