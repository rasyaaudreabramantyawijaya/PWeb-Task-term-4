/* ============================================
   STAYEASE — Helper Utilities
   Date/price formatting, validation, countdown,
   animations, and shared functions.
   ============================================ */

const Helpers = {
  formatDate(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  },
  formatDateISO(date) { return new Date(date).toISOString().split('T')[0]; },
  formatDateShort(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  },
  formatDateLong(date) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  },
  getNights(checkIn, checkOut) {
    if (!checkIn || !checkOut) return 0;
    return Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000));
  },
  formatPrice(amount) { return '$' + amount.toLocaleString('en-US'); },

  renderStars(rating) {
    let html = '<div class="stars">';
    for (let i = 1; i <= 5; i++) html += `<span${i > Math.floor(rating) && i - 0.5 > rating ? ' class="star-empty"' : ''}>★</span>`;
    return html + '</div>';
  },

  isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); },
  isNotEmpty(str) { return str && str.trim().length > 0; },
  generateConfirmCode() { return 'SE-' + Math.random().toString(36).substring(2, 8).toUpperCase(); },
  simulateDelay(ms = 800) { return new Promise(resolve => setTimeout(resolve, ms)); },

  getAmenityIcon(amenity) {
    const icons = {
      'WiFi': '📶', 'Pool': '🏊', 'Spa': '💆', 'Gym': '🏋️',
      'Restaurant': '🍽️', 'Bar': '🍸', 'Parking': '🅿️', 'Room Service': '🛎️',
      'Air Conditioning': '❄️', 'Beach Access': '🏖️', 'Mountain View': '🏔️',
      'City View': '🌆', 'Balcony': '🌅', 'Kitchen': '🍳', 'Laundry': '👔',
      'Pet Friendly': '🐾', 'Breakfast': '🥐', 'Shuttle': '🚐',
      'Concierge': '🎩', 'Safe': '🔒'
    };
    return icons[amenity] || '✨';
  },

  showConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-container';
    document.body.appendChild(container);
    const colors = ['#e07a5f', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 2 + 's';
      piece.style.animationDuration = (2 + Math.random() * 2) + 's';
      const size = 6 + Math.random() * 8;
      piece.style.width = size + 'px'; piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
    }
    setTimeout(() => container.remove(), 5000);
  },

  formatCardNumber(value) {
    const v = value.replace(/\s/g, '').replace(/\D/g, '').substring(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  },
  formatExpiry(value) {
    const v = value.replace(/\D/g, '').substring(0, 4);
    if (v.length > 2) return v.substring(0, 2) + '/' + v.substring(2);
    return v;
  },

  /**
   * Start a countdown timer. Calls onTick(timeString) every second.
   * Calls onExpire() when time runs out. Calls onWarning() at 2 min mark.
   * @returns {function} stop function to clear interval
   */
  startCountdown(targetDate, onTick, onExpire, onWarning) {
    let warned = false;
    const tick = () => {
      const now = new Date();
      const diff = new Date(targetDate) - now;
      if (diff <= 0) {
        onTick('00:00:00');
        if (onExpire) onExpire();
        clearInterval(interval);
        return;
      }
      // Warning at 2 minutes
      if (!warned && diff <= 120000 && onWarning) {
        warned = true;
        onWarning();
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const str = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
      onTick(str);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  },

  /**
   * Get time remaining string for a due date (e.g. "5 days, 3 hours")
   */
  getTimeRemaining(dueDate) {
    const diff = new Date(dueDate) - new Date();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}, ${hours} hr${hours > 1 ? 's' : ''}`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours} hr${hours > 1 ? 's' : ''}, ${mins} min`;
  }
};
