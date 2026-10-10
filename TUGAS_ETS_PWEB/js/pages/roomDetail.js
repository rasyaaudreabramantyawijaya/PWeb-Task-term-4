/* ============================================
   STAYEASE — Room Detail Page
   Hotel info + Agoda-style room selection
   with size, bed, amenities, max guests.
   ============================================ */

const RoomDetailPage = {
  async render({ params, query, container }) {
    container.innerHTML = Skeleton.renderDetail();
    const hotel = await HotelData.getHotel(params.id);
    if (!hotel) {
      container.innerHTML = `<div class="empty-state container"><div class="empty-state-icon">🏨</div><h3>Hotel not found</h3><button class="btn btn-primary" onclick="Router.navigate('/')">Go Home</button></div>`;
      return;
    }

    const checkIn = query.checkIn || Helpers.formatDateISO(new Date(Date.now() + 86400000));
    const checkOut = query.checkOut || Helpers.formatDateISO(new Date(Date.now() + 86400000 * 3));
    const guests = parseInt(query.guests) || 2;
    const nights = Helpers.getNights(checkIn, checkOut);
    const wishlisted = Storage.isWishlisted(hotel.id);

    container.innerHTML = `
      <div class="detail-page container">
        <a class="detail-back" onclick="history.back()">← Back to results</a>

        <!-- Image Gallery -->
        <div class="detail-gallery" id="detail-gallery">
          <img class="main-image" src="${hotel.images[0]}" alt="${hotel.name}" />
          <img src="${hotel.images[1]}" alt="${hotel.name} view 2" />
          <img src="${hotel.images[2]}" alt="${hotel.name} view 3" />
        </div>

        <!-- Hotel Info -->
        <div style="margin-bottom:var(--space-8)">
          <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:var(--space-3)">
            <div>
              <h1>${hotel.name}</h1>
              <div class="detail-location">📍 ${hotel.location}</div>
            </div>
            <button class="btn btn-secondary" onclick="RoomCard.toggleWishlist(${hotel.id}, event)" style="flex-shrink:0">
              ${wishlisted ? '♥ Saved' : '♡ Save'}
            </button>
          </div>
          <div class="detail-rating">
            ${Helpers.renderStars(hotel.rating)}
            <span style="font-weight:var(--font-weight-semibold)">${hotel.rating}</span>
            <span style="color:var(--color-text-tertiary); font-size:var(--font-size-sm)">(${hotel.reviewCount} reviews)</span>
          </div>
          <p class="detail-description" style="margin-top:var(--space-4)">${hotel.description}</p>
        </div>

        <div class="divider"></div>

        <!-- Select Your Room (Agoda-style) -->
        <div style="margin-top:var(--space-6)">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:var(--space-2)">
            <h2 style="font-size:var(--font-size-xl)">Select Your Room</h2>
            <span style="font-size:var(--font-size-sm); color:var(--color-text-tertiary)">
              📅 ${Helpers.formatDateShort(checkIn)} — ${Helpers.formatDateShort(checkOut)} · ${nights} night${nights>1?'s':''}
            </span>
          </div>
          <p style="font-size:var(--font-size-sm); color:var(--color-warning); margin-bottom:var(--space-6)">
            ⚡ Hurry! Limited rooms available at these prices for your dates!
          </p>

          ${hotel.rooms.map(room => {
            const totalPrice = room.pricePerNight * nights;
            const taxes = Math.round(totalPrice * 0.12);
            const fee = 25;
            const grandTotal = totalPrice + taxes + fee;
            const available = room.maxGuests >= guests;
            return `
            <div class="room-select-card ${!available ? 'room-unavailable' : ''}" style="background:var(--color-surface); border:1.5px solid var(--color-border); border-radius:var(--radius-lg); padding:var(--space-5); margin-bottom:var(--space-4); display:grid; grid-template-columns:1fr 200px; gap:var(--space-6); align-items:start; ${!available?'opacity:0.5':''}">
              <div>
                <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3)">
                  <h3 style="font-size:var(--font-size-md)">${room.name}</h3>
                  ${room.checkIn24h ? '<span class="badge badge-success">24h Check-in</span>' : ''}
                </div>
                <div style="display:flex; gap:var(--space-6); font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-bottom:var(--space-3)">
                  <span>📐 ${room.size} m²</span>
                  <span>🛏️ ${room.bed}</span>
                  <span>👥 Max ${room.maxGuests} adult${room.maxGuests>1?'s':''}</span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:var(--space-2); margin-bottom:var(--space-2)">
                  ${room.amenities.map(a => `
                    <span style="display:inline-flex; align-items:center; gap:4px; font-size:var(--font-size-xs); color:var(--color-success)">
                      ✓ ${a}
                    </span>
                  `).join('')}
                </div>
                ${!available ? `<p style="font-size:var(--font-size-xs); color:var(--color-error); margin-top:var(--space-2)">⚠ Not available for ${guests} guests</p>` : ''}
              </div>
              <div style="text-align:right">
                <div class="price" style="margin-bottom:var(--space-1)">
                  ${Helpers.formatPrice(room.pricePerNight)}
                  <span class="per-night">/ night</span>
                </div>
                <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-bottom:var(--space-4)">
                  Total: ${Helpers.formatPrice(grandTotal)} for ${nights} night${nights>1?'s':''}
                </p>
                ${available ? `
                  <button class="btn btn-primary btn-full" onclick="RoomDetailPage.bookRoom(${hotel.id}, '${room.id}', '${checkIn}', '${checkOut}', ${guests})">
                    Book
                  </button>
                  <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-top:var(--space-2)">Pay later available</p>
                ` : `<button class="btn btn-secondary btn-full" disabled>Unavailable</button>`}
              </div>
            </div>
            `;
          }).join('')}
        </div>

        <div class="divider"></div>

        <!-- House Rules -->
        <h3 style="margin-bottom:var(--space-4); margin-top:var(--space-6)">House Rules</h3>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-3); font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-bottom:var(--space-8)">
          <div>🕐 Check-in: 2:00 PM</div>
          <div>🕐 Check-out: 12:00 PM</div>
          <div>🚭 No smoking</div>
          <div>📞 ${hotel.provider.phone}</div>
        </div>
      </div>
      ${Footer.render()}
    `;
  },

  /** Navigate to booking page with selected room */
  bookRoom(hotelId, roomId, checkIn, checkOut, guests) {
    const params = new URLSearchParams({ checkIn, checkOut, guests, roomId });
    Router.navigate(`/booking/${hotelId}?${params.toString()}`);
  }
};
