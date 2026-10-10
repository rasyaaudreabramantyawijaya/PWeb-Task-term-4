/* ============================================
   STAYEASE — SPA Router
   Hash-based client-side routing system.
   Listens for hash changes and renders
   the appropriate page component.
   ============================================ */

const Router = {
  routes: {},      // Registered route handlers
  currentPage: null,

  /**
   * Register a route pattern with its handler function.
   * Supports dynamic params like /room/:id
   */
  register(pattern, handler) {
    this.routes[pattern] = handler;
  },

  /**
   * Initialize the router — listen for hash changes
   * and handle the initial route.
   */
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    // Handle initial load
    this.resolve();
  },

  /**
   * Navigate to a new route programmatically.
   */
  navigate(path) {
    window.location.hash = path;
  },

  /**
   * Resolve the current hash to a registered route
   * and execute its handler with extracted params.
   */
  resolve() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, queryString] = hash.split('?');
    const query = this.parseQuery(queryString || '');

    // Try to match routes (exact first, then parameterized)
    for (const pattern in this.routes) {
      const params = this.matchRoute(pattern, path);
      if (params !== null) {
        const container = document.getElementById('page-content');
        if (container) {
          container.innerHTML = '';
          container.className = 'page-enter';
          // Small delay for transition effect
          requestAnimationFrame(() => {
            this.routes[pattern]({ params, query, container });
            this.currentPage = pattern;
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
        return;
      }
    }

    // 404 fallback — redirect to home
    this.navigate('/');
  },

  /**
   * Match a route pattern against a path.
   * Returns params object if matched, null otherwise.
   * Example: pattern="/room/:id", path="/room/3" → { id: "3" }
   */
  matchRoute(pattern, path) {
    const patternParts = pattern.split('/');
    const pathParts = path.split('/');

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  },

  /**
   * Parse query string into an object.
   * Example: "location=Bali&guests=2" → { location: "Bali", guests: "2" }
   */
  parseQuery(queryString) {
    if (!queryString) return {};
    return Object.fromEntries(
      queryString.split('&').map(p => {
        const [k, v] = p.split('=');
        return [decodeURIComponent(k), decodeURIComponent(v || '')];
      })
    );
  }
};
