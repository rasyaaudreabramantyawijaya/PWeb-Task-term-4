/* ============================================
   STAYEASE — Storage Utility
   localStorage wrapper with booking lifecycle:
   save, cancel, expire, and payment status.
   ============================================ */

const Storage = {
  KEYS: { WISHLIST: 'stayease_wishlist', BOOKINGS: 'stayease_bookings' },

  get(key) { try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch(e) { console.warn(e); } },

  /* ── Wishlist ── */
  getWishlist() { return this.get(this.KEYS.WISHLIST) || []; },
  toggleWishlist(hotelId) {
    const list = this.getWishlist();
    const idx = list.indexOf(hotelId);
    if (idx > -1) { list.splice(idx, 1); this.set(this.KEYS.WISHLIST, list); return false; }
    else { list.push(hotelId); this.set(this.KEYS.WISHLIST, list); return true; }
  },
  isWishlisted(hotelId) { return this.getWishlist().includes(hotelId); },

  /* ── Bookings ── */
  getBookings() {
    const bookings = this.get(this.KEYS.BOOKINGS) || [];
    // Auto-expire: remove unpaid bookings past their due date
    const now = new Date();
    const active = bookings.filter(b => {
      if (b.paymentStatus === 'paid') return true;
      if (b.paymentDueDate && new Date(b.paymentDueDate) < now) return false;
      return true;
    });
    if (active.length !== bookings.length) this.set(this.KEYS.BOOKINGS, active);
    return active;
  },

  /**
   * Calculate payment due date.
   * Returns null if check-in is < 5 days away (must pay now).
   * If >= 5 days away, due date = 3 days from now (or check-in minus 2 days, whichever is earlier).
   * Unpaid bookings past the due date are automatically forfeited.
   */
  calcDueDate(checkIn) {
    // Parse date string (YYYY-MM-DD) as local date at midnight
    const [year, month, day] = checkIn.split('-').map(Number);
    const checkInDate = new Date(year, month - 1, day, 0, 0, 0, 0);
    
    // Today at midnight in local time
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate days between dates (accounting for DST transitions)
    const daysUntilCheckIn = Math.floor((checkInDate - today) / 86400000);

    // If less than 5 days until check-in → must pay now, no pay later
    if (daysUntilCheckIn < 5) return null;

    // Due date = 3 days from now, but never later than check-in minus 2 days
    const threeDaysFromNow = new Date(Date.now() + 3 * 86400000);
    const checkInMinusTwo = new Date(checkInDate.getTime() - 2 * 86400000);
    return threeDaysFromNow < checkInMinusTwo ? threeDaysFromNow : checkInMinusTwo;
  },

  saveBooking(booking) {
    const bookings = this.get(this.KEYS.BOOKINGS) || [];
    booking.id = 'BK-' + Date.now().toString(36).toUpperCase();
    booking.createdAt = new Date().toISOString();

    const dueDate = this.calcDueDate(booking.checkIn);
    booking.paymentDueDate = dueDate ? dueDate.toISOString() : new Date(Date.now() + 5 * 86400000).toISOString();

    bookings.unshift(booking);
    this.set(this.KEYS.BOOKINGS, bookings);
    return booking;
  },

  /** Mark a booking as paid */
  confirmPayment(bookingId, confirmCode) {
    const bookings = this.get(this.KEYS.BOOKINGS) || [];
    const b = bookings.find(x => x.id === bookingId);
    if (b) {
      b.paymentStatus = 'paid';
      b.status = 'confirmed';
      b.confirmCode = confirmCode || b.confirmCode;
      b.paidAt = new Date().toISOString();
      this.set(this.KEYS.BOOKINGS, bookings);
    }
    return b;
  },

  /** Cancel a booking — unpaid: full cancel, paid: 50% refund */
  cancelBooking(bookingId) {
    let bookings = this.get(this.KEYS.BOOKINGS) || [];
    const b = bookings.find(x => x.id === bookingId);
    if (!b) return null;

    const isPaid = b.paymentStatus === 'paid';
    const refund = isPaid ? Math.round(b.totalPrice * 0.5) : 0;

    bookings = bookings.filter(x => x.id !== bookingId);
    this.set(this.KEYS.BOOKINGS, bookings);
    return { success: true, refund, isPaid };
  },

  getBooking(bookingId) {
    // Read raw (skip auto-purge) for just-created bookings
    const bookings = this.get(this.KEYS.BOOKINGS) || [];
    return bookings.find(b => b.id === bookingId) || null;
  }
};
