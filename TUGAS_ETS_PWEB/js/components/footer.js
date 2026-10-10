/* ============================================
   STAY WITHME — Footer Component
   Site footer with brand info, links,
   and copyright notice.
   ============================================ */

const Footer = {
  render() {
    return `
      <footer class="site-footer">
        <div class="footer-grid">
          <div class="footer-brand">
            <h3>◆ Stay WithMe</h3>
            <p>Discover extraordinary stays around the world. Simple booking, unforgettable experiences.</p>
          </div>
          <div class="footer-column">
            <h4>Explore</h4>
            <a href="#/">Home</a>
            <a href="#/results?location=">All Hotels</a>
            <a href="#/wishlist">Wishlist</a>
            <a href="#/history">Bookings</a>
          </div>
          <div class="footer-column">
            <h4>Destinations</h4>
            <a href="#/results?location=Bali">Bali</a>
            <a href="#/results?location=Tokyo">Tokyo</a>
            <a href="#/results?location=Maldives">Maldives</a>
            <a href="#/results?location=Dubai">Dubai</a>
          </div>
          <div class="footer-column">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
        <div class="footer-bottom">
          © 2026 Stay WithMe. All rights reserved. Built with ♥ for extraordinary journeys.
        </div>
      </footer>
    `;
  }
};

