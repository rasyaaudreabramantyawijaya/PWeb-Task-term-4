/* ============================================
   STAYEASE — Payment Page
   Step 2: Payment Information
   Supports direct pay and "Pay Now" from history.
   ============================================ */

const PaymentPage = {
  render({ query, container }) {
    // Check for booking from history (pay now from history)
    const historyBookingId = query.bookingId || null;
    let bookingData;

    if (historyBookingId) {
      const existing = Storage.getBooking(historyBookingId);
      if (!existing) { container.innerHTML = `<div class="empty-state container"><div class="empty-state-icon">📋</div><h3>Booking not found</h3><button class="btn btn-primary" onclick="Router.navigate('/history')">Go to History</button></div>`; return; }
      bookingData = { ...existing, _fromHistory: true };
    } else {
      bookingData = JSON.parse(sessionStorage.getItem('stayease_pending_booking') || 'null');
    }

    if (!bookingData) {
      container.innerHTML = `<div class="empty-state container"><div class="empty-state-icon">💳</div><h3>No booking to pay</h3><p>Please select a room and fill in your details first.</p><button class="btn btn-primary" onclick="Router.navigate('/')">Go Home</button></div>`;
      return;
    }

    // Store for later reference
    this._currentBooking = bookingData;

    container.innerHTML = `
      <div class="payment-page container">
        <!-- 3-step progress: step 2 active -->
        <div class="progress-steps" style="margin-bottom:0">
          <div class="progress-step"><div class="step-circle completed">✓</div><span class="step-label completed">Customer information</span></div>
          <div class="step-connector completed"></div>
          <div class="progress-step"><div class="step-circle active">2</div><span class="step-label active">Payment information</span></div>
          <div class="step-connector"></div>
          <div class="progress-step"><div class="step-circle">3</div><span class="step-label">Booking is confirmed!</span></div>
        </div>

        <!-- Countdown -->
        <div style="background:var(--color-primary); color:white; text-align:center; padding:var(--space-3); border-radius:var(--radius-md); margin-bottom:var(--space-6); display:flex; align-items:center; justify-content:center; gap:var(--space-3); font-size:var(--font-size-sm)">
          <span>This price is guaranteed for...</span>
          <span style="display:flex; align-items:center; gap:var(--space-2)">
            ⏱️ <span id="payment-countdown" style="font-weight:var(--font-weight-bold); color:var(--color-error); font-size:var(--font-size-md)">00:20:00</span>
          </span>
        </div>

        <div class="payment-card" id="payment-form-card">
          <div style="text-align:center; margin-bottom:var(--space-6)">
            <span style="font-size:32px">🔒</span>
            <h2 style="margin-top:var(--space-2)">Secure Payment</h2>
            <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary)">Your payment information is encrypted and secure.</p>
          </div>

          <div class="payment-amount">
            <p>Total Amount</p>
            <div class="amount">${Helpers.formatPrice(bookingData.totalPrice)}</div>
            <p style="margin-top:var(--space-1)">${bookingData.hotelName} · ${Helpers.getNights(bookingData.checkIn, bookingData.checkOut)} nights</p>
          </div>

          <div class="input-group" style="margin-bottom:var(--space-4)">
            <label for="card-name">Cardholder Name</label>
            <input type="text" id="card-name" class="input-field" placeholder="John Doe" value="${bookingData.guestName}" />
          </div>
          <div class="input-group" style="margin-bottom:var(--space-4)">
            <label for="card-number">Card Number</label>
            <input type="text" id="card-number" class="input-field" placeholder="4242 4242 4242 4242" maxlength="19" oninput="this.value = Helpers.formatCardNumber(this.value)" />
          </div>
          <div class="card-input-row" style="margin-bottom:var(--space-6)">
            <div class="input-group">
              <label for="card-expiry">Expiry Date</label>
              <input type="text" id="card-expiry" class="input-field" placeholder="MM/YY" maxlength="5" oninput="this.value = Helpers.formatExpiry(this.value)" />
            </div>
            <div class="input-group">
              <label for="card-cvv">CVV</label>
              <input type="text" id="card-cvv" class="input-field" placeholder="123" maxlength="4" oninput="this.value = this.value.replace(/\\D/g,'').substring(0,4)" />
            </div>
          </div>

          <button class="btn btn-primary btn-lg btn-full" id="pay-btn" onclick="PaymentPage.processPayment()">
            Pay ${Helpers.formatPrice(bookingData.totalPrice)}
          </button>
          <p style="text-align:center; font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-top:var(--space-4)">
            🔒 Secured by Stay WithMe Pay · This is a simulated payment
          </p>
        </div>
      </div>
    `;

    // Countdown
    const target = new Date(Date.now() + 20 * 60 * 1000).toISOString();
    Helpers.startCountdown(target,
      (t) => { const el = document.getElementById('payment-countdown'); if (el) el.textContent = t; },
      null,
      () => { Toast.warning("⏰ Your price guarantee is about to expire. Complete your payment now!"); }
    );
  },

  async processPayment() {
    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('card-expiry').value;
    const cvv = document.getElementById('card-cvv').value;
    let valid = true;
    document.querySelectorAll('.input-field.error').forEach(el => el.classList.remove('error'));
    if (!Helpers.isNotEmpty(cardName)) { document.getElementById('card-name').classList.add('error'); valid = false; }
    if (cardNumber.length < 13) { document.getElementById('card-number').classList.add('error'); valid = false; }
    if (expiry.length < 5) { document.getElementById('card-expiry').classList.add('error'); valid = false; }
    if (cvv.length < 3) { document.getElementById('card-cvv').classList.add('error'); valid = false; }
    if (!valid) { Toast.error('Please fill in all card details correctly.'); return; }

    // Processing animation
    const card = document.getElementById('payment-form-card');
    card.innerHTML = `<div class="payment-processing"><div class="spinner"></div><h3>Processing Payment...</h3><p style="color:var(--color-text-secondary)">Please wait while we securely process your payment.</p><div class="progress-bar-container"><div class="progress-bar" id="payment-progress" style="width:0%"></div></div></div>`;
    const bar = document.getElementById('payment-progress');
    let p = 0;
    const interval = setInterval(() => { p += Math.random() * 15; if (p > 90) p = 90; if (bar) bar.style.width = p + '%'; }, 300);

    const success = await HotelData.processPayment();
    clearInterval(interval);
    if (bar) bar.style.width = '100%';
    await Helpers.simulateDelay(500);

    const bookingData = this._currentBooking;

    if (success) {
      const confirmCode = Helpers.generateConfirmCode();
      let bookingId;

      if (bookingData._fromHistory) {
        // Paying existing unpaid booking
        Storage.confirmPayment(bookingData.id, confirmCode);
        bookingId = bookingData.id;
      } else {
        // New booking with immediate payment
        const booking = Storage.saveBooking({
          ...bookingData, status: 'confirmed', paymentStatus: 'paid', confirmCode
        });
        bookingId = booking.id;
        sessionStorage.removeItem('stayease_pending_booking');
      }
      Router.navigate(`/confirmation/${bookingId}?status=success`);
    } else {
      Router.navigate('/confirmation/failed?status=failed');
    }
  }
};
