/* ============================================
   STAYEASE — Room Card Component
   Reusable card for hotel listing with lowest
   price from available rooms.
   ============================================ */

const RoomCard = {
  render(hotel, searchContext) {
    const wishlisted = Storage.isWishlisted(hotel.id);
    const lowestPrice = HotelData.getLowestPrice(hotel);
    const maxGuests = Math.max(...hotel.rooms.map(r => r.maxGuests));

    // Build URL with search context (dates/guests) if available
    let detailUrl = `/room/${hotel.id}`;
    if (searchContext && (searchContext.checkIn || searchContext.checkOut || searchContext.guests)) {
      const params = new URLSearchParams();
      if (searchContext.checkIn) params.set('checkIn', searchContext.checkIn);
      if (searchContext.checkOut) params.set('checkOut', searchContext.checkOut);
      if (searchContext.guests) params.set('guests', searchContext.guests);
      detailUrl += '?' + params.toString();
    }

    return `
      <div class="card" id="hotel-card-${hotel.id}">
        <div class="card-image-wrapper">
          <img class="card-image" src="${hotel.images[0]}" alt="${hotel.name}" loading="lazy"
            onclick="Router.navigate('${detailUrl}')" style="cursor:pointer" />
          <button class="wishlist-btn ${wishlisted ? 'active' : ''}" id="wishlist-toggle-${hotel.id}"
            onclick="RoomCard.toggleWishlist(${hotel.id}, event)" aria-label="Toggle wishlist">
            <span class="heart-icon">${wishlisted ? '♥' : '♡'}</span>
          </button>
        </div>
        <div class="card-body" onclick="Router.navigate('${detailUrl}')" style="cursor:pointer">
          <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:var(--space-2)">
            <h4 style="font-size:var(--font-size-base); font-weight:var(--font-weight-semibold); flex:1">${hotel.name}</h4>
            <div style="display:flex; align-items:center; gap:var(--space-1); flex-shrink:0; margin-left:var(--space-3)">
              ${Helpers.renderStars(hotel.rating)}
              <span style="font-size:var(--font-size-xs); color:var(--color-text-secondary)">${hotel.rating}</span>
            </div>
          </div>
          <p style="font-size:var(--font-size-sm); color:var(--color-text-tertiary); margin-bottom:var(--space-1)">📍 ${hotel.location}</p>
          <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-bottom:var(--space-4)">
            ${hotel.rooms.length} room type${hotel.rooms.length > 1 ? 's' : ''} · Up to ${maxGuests} guests
          </p>
          <div style="display:flex; justify-content:space-between; align-items:center">
            <div class="price">
              <span class="currency">from </span>${Helpers.formatPrice(lowestPrice)}
              <span class="per-night">/ night</span>
            </div>
            <span style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">${hotel.reviewCount} reviews</span>
          </div>
        </div>
      </div>
    `;
  },

  toggleWishlist(hotelId, event) {
    event.stopPropagation();
    const added = Storage.toggleWishlist(hotelId);
    const btn = document.getElementById(`wishlist-toggle-${hotelId}`);
    if (btn) {
      btn.classList.toggle('active', added);
      btn.querySelector('.heart-icon').textContent = added ? '♥' : '♡';
    }
    Toast.show(added ? 'Added to wishlist ♥' : 'Removed from wishlist', added ? 'success' : 'info');
    Header.updateWishlistCount();
  }
};
