/**
 * PTE Speaking Module - Hash-based SPA Router
 */

window.PTE = window.PTE || {};

PTE.Router = {
  routes: {},
  currentRoute: null,

  init() {
    window.addEventListener('hashchange', () => this.resolve());
    // Handle initial load
    if (!location.hash || location.hash === '#') {
      location.hash = '#/';
    }
    this.resolve();
  },

  on(path, handler) {
    this.routes[path] = handler;
  },

  resolve() {
    const hash = location.hash.slice(1) || '/';
    this.currentRoute = hash;

    // Try exact match first
    if (this.routes[hash]) {
      this.routes[hash]();
      window.scrollTo(0, 0);
      return;
    }

    // Try pattern matching (e.g., /practice/:type)
    for (const [pattern, handler] of Object.entries(this.routes)) {
      const regex = new RegExp('^' + pattern.replace(/:[^/]+/g, '([^/]+)') + '$');
      const match = hash.match(regex);
      if (match) {
        handler(...match.slice(1));
        window.scrollTo(0, 0);
        return;
      }
    }

    // 404 fallback
    this.navigate('/');
  },

  navigate(path) {
    location.hash = '#' + path;
  }
};
