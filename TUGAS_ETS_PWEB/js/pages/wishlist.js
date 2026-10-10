/* ============================================
   STAYEASE — Wishlist Page
   Displays all saved/wishlisted hotels using
   room cards. Data persisted in localStorage.
   Feature: Wishlist / Save Hotel (Bonus)
   ============================================ */

const WishlistPage = {
  render({ container }) {
    const wishlistIds = Storage.getWishlist();
    const hotels = HotelData.hotels.filter(h => wishlistIds.includes(h.id));

    container.innerHTML = `
      <div class="wishlist-page container">
        <h1>My Wishlist</h1>
        ${hotels.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">♡</div>
            <h3>Your wishlist is empty</h3>
            <p>Start exploring and save hotels you love by clicking the heart icon.</p>
            <button class="btn btn-primary" onclick="Router.navigate('/results?location=')">Explore Hotels</button>
          </div>
        ` : `
          <p style="color:var(--color-text-secondary); margin-bottom:var(--space-6)">${hotels.length} saved hotel${hotels.length > 1 ? 's' : ''}</p>
          <div class="results-grid">
            ${hotels.map(h => RoomCard.render(h)).join('')}
          </div>
        `}
      </div>
      ${Footer.render()}
    `;
  }
};
