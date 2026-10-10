const Skeleton = {
  /**
   * Render a grid of skeleton loading cards.
   * @param {number} count - Number of skeleton cards
   * @returns {string} HTML string
   */
  renderCards(count = 6) {
    let html = '';
    for (let i = 0; i < count; i++) {
      html += `
        <div class="skeleton-card">
          <div class="skeleton skeleton-image"></div>
          <div class="card-body">
            <div class="skeleton skeleton-text-lg"></div>
            <div class="skeleton skeleton-text" style="width:60%"></div>
            <div class="skeleton skeleton-text-sm" style="width:40%; margin-top:var(--space-4)"></div>
          </div>
        </div>
      `;
    }
    return html;
  },

  /**
   * Render a single detail page skeleton.
   * @returns {string} HTML string
   */
  renderDetail() {
    return `
      <div style="padding:var(--space-8) 0" class="container">
        <div class="skeleton" style="height:500px; margin-bottom:var(--space-8)"></div>
        <div style="display:grid; grid-template-columns:1fr 380px; gap:var(--space-10)">
          <div>
            <div class="skeleton skeleton-text-lg" style="width:80%; height:28px; margin-bottom:var(--space-4)"></div>
            <div class="skeleton skeleton-text" style="width:40%; margin-bottom:var(--space-6)"></div>
            <div class="skeleton" style="height:120px; margin-bottom:var(--space-6)"></div>
            <div class="skeleton skeleton-text-lg" style="width:50%; height:24px; margin-bottom:var(--space-4)"></div>
            <div class="skeleton" style="height:80px"></div>
          </div>
          <div class="skeleton" style="height:300px; border-radius:var(--radius-lg)"></div>
        </div>
      </div>
    `;
  }
};
