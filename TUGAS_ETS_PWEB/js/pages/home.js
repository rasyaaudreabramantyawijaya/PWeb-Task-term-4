/* ============================================
   STAYEASE — Home Page
   Landing page with hero section, search bar,
   and popular destinations grid.
   Feature: Hotel Search
   ============================================ */

const HomePage = {
  render({ container }) {
    container.innerHTML = `
      <!-- Hero Section with Search -->
      <section class="hero" id="hero-section">
        <div class="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover handpicked hotels worldwide. Book effortlessly. Travel beautifully.</p>
          
          <!-- Search Bar Component -->
          <div class="search-bar" id="search-bar">
            <div class="search-field">
              <label for="search-location">Location</label>
              <select id="search-location" class="select-field" style="border:none; padding-left:0">
                <option value="">Where are you going?</option>
                ${HotelData.locations.map(l => `<option value="${l}">${l}</option>`).join('')}
              </select>
            </div>
            <div class="search-divider"></div>
            <div class="search-field">
              <label for="search-checkin">Check In</label>
              <input type="date" id="search-checkin" min="${Helpers.formatDateISO(new Date())}" />
            </div>
            <div class="search-divider"></div>
            <div class="search-field">
              <label for="search-checkout">Check Out</label>
              <input type="date" id="search-checkout" />
            </div>
            <div class="search-divider"></div>
            <div class="search-field">
              <label for="search-guests">Guests</label>
              <select id="search-guests">
                <option value="1">1 Guest</option>
                <option value="2" selected>2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
            <button class="search-btn" id="search-submit" onclick="HomePage.handleSearch()" aria-label="Search">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- Popular Destinations -->
      <section class="popular-section container" id="popular-destinations">
        <div class="section-header">
          <h2>Popular Destinations</h2>
          <a class="btn btn-ghost" onclick="Router.navigate('/results?location=')">View all →</a>
        </div>
        <div class="destination-grid">
          ${HotelData.popularDestinations.map(d => `
            <div class="destination-card" onclick="Router.navigate('/results?location=${encodeURIComponent(d.query)}')">
              <img src="${d.image}" alt="${d.name}" loading="lazy" />
              <div class="destination-overlay">
                <h4>${d.name}</h4>
                <p>${d.subtitle}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Featured Hotels -->
      <section class="popular-section container" id="featured-hotels">
        <div class="section-header">
          <h2>Trending Now</h2>
          <a class="btn btn-ghost" onclick="Router.navigate('/results?sort=popular')">See more →</a>
        </div>
        <div class="results-grid">
          ${HotelData.hotels.filter(h => h.popular).slice(0, 4).map(h => RoomCard.render(h)).join('')}
        </div>
      </section>

      ${Footer.render()}
    `;

    // Set default dates (tomorrow + day after)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 3);
    const checkinEl = document.getElementById('search-checkin');
    const checkoutEl = document.getElementById('search-checkout');
    checkinEl.value = Helpers.formatDateISO(tomorrow);
    checkoutEl.value = Helpers.formatDateISO(dayAfter);
    checkoutEl.min = Helpers.formatDateISO(tomorrow);

    // Sync check-in → check-out: ensure check-out is always after check-in
    checkinEl.addEventListener('change', () => {
      const ciDate = new Date(checkinEl.value);
      checkoutEl.min = checkinEl.value;
      // If check-out is before or equal to check-in, adjust it
      if (!checkoutEl.value || new Date(checkoutEl.value) <= ciDate) {
        const nextDay = new Date(ciDate);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutEl.value = Helpers.formatDateISO(nextDay);
      }
    });

    checkoutEl.addEventListener('change', () => {
      // If check-out is before check-in, swap
      if (checkinEl.value && new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
        const ciDate = new Date(checkinEl.value);
        ciDate.setDate(ciDate.getDate() + 1);
        checkoutEl.value = Helpers.formatDateISO(ciDate);
      }
    });
  },

  /**
   * Handle search form submission.
   * Builds query string and navigates to results page.
   */
  handleSearch() {
    const location = document.getElementById('search-location').value;
    const checkIn = document.getElementById('search-checkin').value;
    const checkOut = document.getElementById('search-checkout').value;
    const guests = document.getElementById('search-guests').value;

    // Build query params
    const params = new URLSearchParams({ location, checkIn, checkOut, guests });
    Router.navigate(`/results?${params.toString()}`);
  }
};
