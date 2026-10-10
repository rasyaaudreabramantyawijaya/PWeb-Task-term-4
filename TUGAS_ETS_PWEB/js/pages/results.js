/* ============================================
   STAYEASE — Search Results Page
   Displays filtered hotel list with sidebar
   filters, sort options, and skeleton loading.
   Features: Room List, Filter, Sort
   ============================================ */

const ResultsPage = {
  currentFilters: {},

  async render({ query, container }) {
    // Extract search params
    this.currentFilters = {
      location: query.location || '',
      checkIn: query.checkIn || '',
      checkOut: query.checkOut || '',
      guests: parseInt(query.guests) || 2,
      minPrice: 0,
      maxPrice: 1000,
      minRating: 0,
      amenities: [],
      sort: query.sort || 'popular'
    };

    const locationLabel = this.currentFilters.location || 'All Destinations';

    // Render page shell with skeleton loading
    container.innerHTML = `
      <div class="results-page container">
        <div class="results-header">
          <div>
            <h2 style="font-size:var(--font-size-xl); margin-bottom:var(--space-1)">
              Hotels in ${locationLabel}
            </h2>
            <p class="results-count" id="results-count">Searching...</p>
            ${this.currentFilters.checkIn && this.currentFilters.checkOut ? `
              <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-top:var(--space-1)">
                📅 ${Helpers.formatDateShort(this.currentFilters.checkIn)} — ${Helpers.formatDateShort(this.currentFilters.checkOut)}
                · ${Helpers.getNights(this.currentFilters.checkIn, this.currentFilters.checkOut)} night${Helpers.getNights(this.currentFilters.checkIn, this.currentFilters.checkOut) > 1 ? 's' : ''}
                · 👤 ${this.currentFilters.guests} guest${this.currentFilters.guests > 1 ? 's' : ''}
              </p>
            ` : ''}
          </div>
          <div style="display:flex; gap:var(--space-3); align-items:center">
            <button class="btn btn-secondary btn-sm filter-toggle-btn" id="filter-toggle" onclick="ResultsPage.toggleMobileFilter()">
              ⚙ Filters
            </button>
            <div class="sort-control">
              <label>Sort by:</label>
              <select class="select-field" id="sort-select" onchange="ResultsPage.applyFilters()" style="width:auto; min-width:160px; padding:var(--space-2) var(--space-8) var(--space-2) var(--space-3); font-size:var(--font-size-sm)">
                <option value="popular" ${this.currentFilters.sort === 'popular' ? 'selected' : ''}>Most Popular</option>
                <option value="price-low" ${this.currentFilters.sort === 'price-low' ? 'selected' : ''}>Lowest Price</option>
                <option value="price-high" ${this.currentFilters.sort === 'price-high' ? 'selected' : ''}>Highest Price</option>
                <option value="rating" ${this.currentFilters.sort === 'rating' ? 'selected' : ''}>Best Rating</option>
              </select>
            </div>
          </div>
        </div>
        
        <div class="results-layout">
          <!-- Filter Sidebar -->
          <div class="filter-backdrop" id="filter-backdrop" onclick="ResultsPage.toggleMobileFilter()"></div>
          <aside class="filter-sidebar" id="filter-sidebar">
            <div class="filter-section">
              <h4>Price Range</h4>
              <div class="price-range">
                <input type="range" id="filter-price" min="0" max="600" value="600" step="10" oninput="ResultsPage.updatePriceLabel(this.value)" onchange="ResultsPage.applyFilters()" />
                <div class="price-range-labels">
                  <span>$0</span>
                  <span id="price-label">Up to $600</span>
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="filter-section">
              <h4>Minimum Rating</h4>
              ${[4.5, 4.0, 3.5].map(r => `
                <label class="filter-checkbox">
                  <input type="radio" name="rating" value="${r}" onchange="ResultsPage.applyFilters()" />
                  ${Helpers.renderStars(r)} <span style="margin-left:var(--space-1); font-size:var(--font-size-xs)">${r}+</span>
                </label>
              `).join('')}
              <label class="filter-checkbox">
                <input type="radio" name="rating" value="0" checked onchange="ResultsPage.applyFilters()" />
                <span style="font-size:var(--font-size-sm)">All ratings</span>
              </label>
            </div>
            <div class="divider"></div>
            <div class="filter-section">
              <h4>Amenities</h4>
              ${['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Beach Access', 'Parking', 'Breakfast'].map(a => `
                <label class="filter-checkbox">
                  <input type="checkbox" value="${a}" onchange="ResultsPage.applyFilters()" class="amenity-filter" />
                  <span>${Helpers.getAmenityIcon(a)} ${a}</span>
                </label>
              `).join('')}
            </div>
          </aside>

          <!-- Results Grid -->
          <div id="results-grid" class="results-grid">
            ${Skeleton.renderCards(6)}
          </div>
        </div>
      </div>
      ${Footer.render()}
    `;

    // Load actual results
    await this.applyFilters();
  },

  /**
   * Apply current filters and re-render results.
   * Reads filter values from DOM, calls simulated API.
   */
  async applyFilters() {
    const grid = document.getElementById('results-grid');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    // Read filter values
    const maxPrice = parseInt(document.getElementById('filter-price')?.value || 600);
    const ratingRadio = document.querySelector('input[name="rating"]:checked');
    const minRating = ratingRadio ? parseFloat(ratingRadio.value) : 0;
    const amenities = Array.from(document.querySelectorAll('.amenity-filter:checked')).map(c => c.value);
    const sort = document.getElementById('sort-select')?.value || 'popular';

    // Show skeleton
    grid.innerHTML = Skeleton.renderCards(4);

    // Fetch filtered results
    const results = await HotelData.searchHotels({
      location: this.currentFilters.location,
      minPrice: 0,
      maxPrice,
      minRating,
      amenities,
      sort
    });

    // Filter by max guests (check if any room supports the number)
    const filtered = results.filter(h => h.rooms.some(r => r.maxGuests >= this.currentFilters.guests));

    // Update count
    if (countEl) countEl.textContent = `${filtered.length} hotel${filtered.length !== 1 ? 's' : ''} found`;

    // Render results or empty state
    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="empty-state-icon">🔍</div>
          <h3>No hotels found</h3>
          <p>Try adjusting your filters or search for a different destination.</p>
          <button class="btn btn-primary" onclick="Router.navigate('/')">Back to Search</button>
        </div>
      `;
    } else {
      grid.innerHTML = filtered.map(h => RoomCard.render(h, {
        checkIn: this.currentFilters.checkIn,
        checkOut: this.currentFilters.checkOut,
        guests: this.currentFilters.guests
      })).join('');
    }
  },

  updatePriceLabel(value) {
    const label = document.getElementById('price-label');
    if (label) label.textContent = `Up to ${Helpers.formatPrice(parseInt(value))}`;
  },

  toggleMobileFilter() {
    document.getElementById('filter-sidebar')?.classList.toggle('open');
    document.getElementById('filter-backdrop')?.classList.toggle('open');
  }
};
