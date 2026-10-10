/* ============================================
   STAY WITHME — Header / Navigation Component
   Fixed header with logo, nav links,
   and responsive mobile hamburger menu.
   ============================================ */

const Header = {
  /**
   * Render the site header into the DOM.
   * Highlights the active nav link based on current hash.
   */
  render() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const hash = window.location.hash.slice(1) || '/';

    header.innerHTML = `
      <div class="header-inner">
        <div class="logo" onclick="Router.navigate('/')" id="logo">
          <span class="logo-icon">◆</span>
          <span>Stay WithMe</span>
        </div>
        <nav class="nav-links" id="nav-links">
          <a class="nav-link ${hash === '/' ? 'active' : ''}" onclick="Router.navigate('/')">
            <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></span> Home
          </a>
          <a class="nav-link ${hash.startsWith('/wishlist') ? 'active' : ''}" onclick="Router.navigate('/wishlist')">
            <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg></span> Wishlist
            <span id="wishlist-count" class="badge badge-accent" style="display:none"></span>
          </a>
          <a class="nav-link ${hash.startsWith('/history') ? 'active' : ''}" onclick="Router.navigate('/history')">
            <span class="nav-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="12" y2="15"/></svg></span> Bookings
          </a>
        </nav>
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Toggle menu" onclick="Header.toggleMobile()">☰</button>
      </div>
    `;

    // Update wishlist count badge
    this.updateWishlistCount();
  },

  /** Toggle mobile menu open/close */
  toggleMobile() {
    const nav = document.getElementById('nav-links');
    if (nav) nav.classList.toggle('open');
  },

  /** Update the wishlist count badge in header */
  updateWishlistCount() {
    const badge = document.getElementById('wishlist-count');
    if (!badge) return;
    const count = Storage.getWishlist().length;
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'inline-flex';
    } else {
      badge.style.display = 'none';
    }
  }
};
