/* ============================================
   STAYEASE — Booking Page (Agoda-style)
   3-step: Customer Info → Payment Info → Confirmed
   Countdown timer, Pay Now / Pay Later option,
   "You're almost done!" popup at 2 min.
   ============================================ */

const BookingPage = {
  stopCountdown: null,
  _countdownPaused: false,

  async render({ params, query, container }) {
    const hotel = await HotelData.getHotel(params.id);
    if (!hotel) { container.innerHTML = `<div class="empty-state container"><div class="empty-state-icon">🏨</div><h3>Hotel not found</h3><button class="btn btn-primary" onclick="Router.navigate('/')">Go Home</button></div>`; return; }

    const roomId = query.roomId || hotel.rooms[0].id;
    const room = hotel.rooms.find(r => r.id === roomId) || hotel.rooms[0];
    const checkIn = query.checkIn || Helpers.formatDateISO(new Date(Date.now() + 86400000));
    const checkOut = query.checkOut || Helpers.formatDateISO(new Date(Date.now() + 86400000 * 3));
    const guests = parseInt(query.guests) || 2;
    const nights = Helpers.getNights(checkIn, checkOut);
    const subtotal = room.pricePerNight * nights;
    const taxes = Math.round(subtotal * 0.12);
    const serviceFee = 0;
    const total = subtotal + taxes + serviceFee;

    // Due date: 5 days from now, null if <5 days to check-in
    const dueDate = Storage.calcDueDate(checkIn);
    const canPayLater = dueDate !== null;
    const dueDateDisplay = canPayLater ? Helpers.formatDate(dueDate) : null;

    // Countdown target = 20 min session
    const countdownTarget = new Date(Date.now() + 20 * 60 * 1000).toISOString();

    container.innerHTML = `
      <div class="booking-page container">
        <!-- Agoda-style 3-step progress -->
        <div class="progress-steps" style="margin-bottom:0">
          <div class="progress-step"><div class="step-circle active">1</div><span class="step-label active">Customer information</span></div>
          <div class="step-connector"></div>
          <div class="progress-step"><div class="step-circle">2</div><span class="step-label">Payment information</span></div>
          <div class="step-connector"></div>
          <div class="progress-step"><div class="step-circle">3</div><span class="step-label">Booking is confirmed!</span></div>
        </div>

        <!-- Countdown Timer Bar -->
        <div style="background:var(--color-primary); color:white; text-align:center; padding:var(--space-3); border-radius:var(--radius-md); margin-bottom:var(--space-6); display:flex; align-items:center; justify-content:center; gap:var(--space-3); font-size:var(--font-size-sm)">
          <span>This price is guaranteed for...</span>
          <span style="display:flex; align-items:center; gap:var(--space-2)">
            ⏱️ <span id="booking-countdown" style="font-weight:var(--font-weight-bold); color:#ff6b6b; font-size:var(--font-size-md)">00:20:00</span>
          </span>
        </div>

        <div class="booking-layout">
          <!-- Left: Booking Form -->
          <div>
            <!-- Payment Option Choice -->
            ${canPayLater ? `
            <div class="booking-form" style="margin-bottom:var(--space-6)" id="payment-option-section">
              <h3 style="margin-bottom:var(--space-4)">Choose your payment option</h3>
              <label class="payment-option" style="display:flex; gap:var(--space-3); padding:var(--space-4); border:2px solid var(--color-accent); border-radius:var(--radius-md); margin-bottom:var(--space-3); cursor:pointer; background:var(--color-accent-bg)">
                <input type="radio" name="payOption" value="later" checked style="accent-color:var(--color-accent); margin-top:2px" />
                <div>
                  <strong style="color:var(--color-accent)">Pay on ${dueDateDisplay}</strong>
                  <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-top:var(--space-1)">✓ Stay flexible! No payment today</p>
                  <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary)">✓ Free cancellation before due date</p>
                </div>
              </label>
              <label class="payment-option" style="display:flex; gap:var(--space-3); padding:var(--space-4); border:2px solid var(--color-border); border-radius:var(--radius-md); cursor:pointer">
                <input type="radio" name="payOption" value="now" style="accent-color:var(--color-accent); margin-top:2px" />
                <div>
                  <strong>Pay now</strong>
                  <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-top:var(--space-1)">✓ Instant confirmation</p>
                </div>
              </label>
            </div>
            ` : `
            <div class="booking-form" style="margin-bottom:var(--space-6)">
              <h3 style="margin-bottom:var(--space-3)">Payment required</h3>
              <div style="background:var(--color-warning-bg); border:1px solid var(--color-warning); border-radius:var(--radius-md); padding:var(--space-4)">
                <p style="font-size:var(--font-size-sm); color:var(--color-text)">
                  ⚠️ Your check-in date is less than 5 days away. <strong>Payment is required now</strong> to secure your booking.
                </p>
              </div>
              <input type="hidden" name="payOption" value="now" />
            </div>
            `}

            <!-- Guest Info Form -->
            <div class="booking-form" id="booking-form">
              <h2>Who's the lead guest?</h2>
              <p style="font-size:var(--font-size-xs); color:var(--color-error); margin-bottom:var(--space-4)">* Required field</p>
              <div class="form-row" style="margin-bottom:var(--space-4)">
                <div class="input-group">
                  <label for="guest-firstname">First name *</label>
                  <input type="text" id="guest-firstname" class="input-field" placeholder="John" required />
                </div>
                <div class="input-group">
                  <label for="guest-lastname">Last name *</label>
                  <input type="text" id="guest-lastname" class="input-field" placeholder="Doe" required />
                </div>
              </div>
              <div class="input-group" style="margin-bottom:var(--space-4)">
                <label for="guest-email">Email *</label>
                <input type="email" id="guest-email" class="input-field" placeholder="john@example.com" required />
              </div>
              <div class="input-group" style="margin-bottom:var(--space-4)">
                <label for="guest-phone">Mobile number</label>
                <input type="tel" id="guest-phone" class="input-field" placeholder="+1 234 567 890" />
              </div>
              <div class="input-group" style="margin-bottom:var(--space-6)">
                <label for="guest-requests">Special requests (optional)</label>
                <textarea id="guest-requests" class="input-field" rows="2" placeholder="Any special requirements..." style="resize:vertical"></textarea>
              </div>

              <!-- Free Room Benefits -->
              ${canPayLater ? `
              <div style="border:1.5px solid var(--color-border-light); border-radius:var(--radius-md); padding:var(--space-5); margin-bottom:var(--space-6)">
                <h4 style="color:var(--color-success); margin-bottom:var(--space-4)">Free room benefits</h4>
                <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3)">
                  <span style="font-size:var(--font-size-xl)">🔄</span>
                  <div><strong style="font-size:var(--font-size-sm)">Fully refundable</strong><p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">Cancel for free before ${dueDateDisplay}</p></div>
                  <span class="badge badge-success" style="margin-left:auto">FREE</span>
                </div>
                <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3)">
                  <span style="font-size:var(--font-size-xl)">💳</span>
                  <div><strong style="font-size:var(--font-size-sm)">No payment until ${Helpers.formatDateShort(dueDate)}</strong><p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">No payment today</p></div>
                  <span class="badge badge-success" style="margin-left:auto">FREE</span>
                </div>
                ${room.amenities.filter(a => ['WiFi','Parking','Breakfast'].includes(a)).map(a => `
                  <div style="display:flex; align-items:center; gap:var(--space-3); margin-bottom:var(--space-3)">
                    <span style="font-size:var(--font-size-xl)">${Helpers.getAmenityIcon(a)}</span>
                    <strong style="font-size:var(--font-size-sm)">Free ${a}</strong>
                    <span class="badge badge-success" style="margin-left:auto">FREE</span>
                  </div>
                `).join('')}
              </div>
              ` : ''}

              <button class="btn btn-primary btn-lg btn-full" id="continue-booking-btn"
                onclick="BookingPage.handleContinue(${hotel.id}, '${roomId}', '${checkIn}', '${checkOut}', ${guests}, ${total})">
                <span id="continue-btn-text">${canPayLater ? 'NEXT: FINAL STEP' : 'CONTINUE TO PAYMENT'}</span>
              </button>
              <p id="continue-btn-sub" style="text-align:center; font-size:var(--font-size-xs); color:${canPayLater ? 'var(--color-success)' : 'var(--color-text-secondary)'}; margin-top:var(--space-2)">
                ${canPayLater ? 'You will pay $0 today' : `You will pay ${Helpers.formatPrice(total)} now`}
              </p>
            </div>
          </div>

          <!-- Right: Booking Summary Sidebar -->
          <div class="booking-summary" style="position:sticky; top:calc(var(--header-height) + var(--space-4))">
            <div style="display:flex; justify-content:space-between; font-size:var(--font-size-sm); margin-bottom:var(--space-4)">
              <div><strong>Check-in</strong><br/>${Helpers.formatDateLong(checkIn)}<br/><span style="color:var(--color-text-tertiary)">14:00</span></div>
              <div style="display:flex; align-items:center; color:var(--color-text-tertiary)">→</div>
              <div style="text-align:right"><strong>Check-out</strong><br/>${Helpers.formatDateLong(checkOut)}<br/><span style="color:var(--color-text-tertiary)">12:00</span></div>
              <div style="text-align:right"><strong style="font-size:var(--font-size-xl)">${nights}</strong><br/><span style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">nights</span></div>
            </div>

            <div class="divider"></div>

            <div style="display:flex; gap:var(--space-3); margin-bottom:var(--space-4)">
              <img src="${hotel.images[0]}" alt="${hotel.name}" style="width:60px;height:60px;border-radius:var(--radius-md);object-fit:cover" />
              <div>
                <h4 style="font-size:var(--font-size-sm)">${hotel.name}</h4>
                <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">📍 ${hotel.location}</p>
                <div style="margin-top:var(--space-1)">${Helpers.renderStars(hotel.rating)}</div>
              </div>
            </div>

            <!-- Room Details -->
            <div style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:var(--space-4)">
              <div style="display:flex; gap:var(--space-3); margin-bottom:var(--space-3)">
                <img src="${hotel.images[1]}" style="width:50px; height:50px; border-radius:var(--radius-sm); object-fit:cover" />
                <div>
                  <strong style="font-size:var(--font-size-sm)">${room.name}</strong>
                  <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">Max ${room.maxGuests} adults · ${room.size} m² · ${room.bed}</p>
                </div>
              </div>
              ${room.checkIn24h ? '<p style="font-size:var(--font-size-xs); color:var(--color-info); margin-bottom:var(--space-1)">🔵 24 hours check-in</p>' : ''}
              ${canPayLater ? `<p style="font-size:var(--font-size-xs); color:var(--color-success)">✓ No payment until ${Helpers.formatDateShort(dueDate)}</p>` : ''}
              ${room.amenities.map(a => `<span style="font-size:var(--font-size-xs); color:var(--color-success); display:block">✓ ${a}</span>`).join('')}
            </div>

            <div class="divider"></div>

            <div class="summary-line"><span>${Helpers.formatPrice(room.pricePerNight)} × ${nights} nights</span><span>${Helpers.formatPrice(subtotal)}</span></div>
            <div class="summary-line"><span>Taxes & fees</span><span>${Helpers.formatPrice(taxes)}</span></div>
            <div class="summary-line"><span>Booking fees</span><span style="color:var(--color-success)">FREE</span></div>
            <div class="summary-line total"><span>Total</span><span>${Helpers.formatPrice(total)}</span></div>
          </div>
        </div>
      </div>

      <!-- "You're almost done!" Modal -->
      <div class="modal-backdrop" id="almost-done-modal">
        <div class="modal" style="max-width:520px; padding:var(--space-8); text-align:center">
          <h2 style="margin-bottom:var(--space-3)">You're almost done!</h2>
          <p style="color:var(--color-text-secondary); margin-bottom:var(--space-4)">
            Our last rooms for your dates. If you leave now, we can't hold this room and rate for you.
          </p>
          <div style="text-align:left; margin-bottom:var(--space-6)">
            ${canPayLater ? `<p style="font-size:var(--font-size-sm); color:var(--color-success); margin-bottom:var(--space-2)">✓ Stay flexible! Cancel for free before ${dueDateDisplay}</p>` : ''}
            <p style="font-size:var(--font-size-sm); color:var(--color-success)">✓ Book now — ${canPayLater ? 'no payment until ' + Helpers.formatDateShort(dueDate) : 'secure your room today'}</p>
          </div>
          <button class="btn btn-primary btn-lg btn-full" onclick="BookingPage.closePopupAndContinue()" style="background:#ef4444; margin-bottom:var(--space-3)">Continue Booking</button>
          <button class="btn btn-ghost btn-full" onclick="BookingPage.closePopupAndCancel()" style="color:var(--color-text-tertiary)">Leave this page</button>
        </div>
      </div>
    `;

    // Start countdown
    if (this.stopCountdown) this.stopCountdown();
    this._countdownPaused = false;
    this.stopCountdown = Helpers.startCountdown(
      countdownTarget,
      (t) => { if (!this._countdownPaused) { const el = document.getElementById('booking-countdown'); if (el) el.textContent = t; } },
      () => { Toast.warning('Time expired! Prices may change.'); },
      () => { BookingPage.showAlmostDonePopup(); }
    );

    // Listen for payment option changes
    if (canPayLater) {
      document.querySelectorAll('input[name="payOption"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
          const btnText = document.getElementById('continue-btn-text');
          const btnSub = document.getElementById('continue-btn-sub');
          if (e.target.value === 'now') {
            btnText.textContent = 'CONTINUE TO PAYMENT';
            btnSub.textContent = `You will pay ${Helpers.formatPrice(total)} now`;
            btnSub.style.color = 'var(--color-text-secondary)';
          } else {
            btnText.textContent = 'NEXT: FINAL STEP';
            btnSub.textContent = 'You will pay $0 today';
            btnSub.style.color = 'var(--color-success)';
          }
          document.querySelectorAll('.payment-option').forEach(l => { l.style.borderColor = 'var(--color-border)'; l.style.background = 'transparent'; });
          e.target.closest('.payment-option').style.borderColor = 'var(--color-accent)';
          e.target.closest('.payment-option').style.background = 'var(--color-accent-bg)';
        });
      });
    }
  },

  showAlmostDonePopup() {
    this._countdownPaused = true;
    const modal = document.getElementById('almost-done-modal');
    if (modal) modal.classList.add('active');
  },

  closePopupAndContinue() {
    this._countdownPaused = false;
    const modal = document.getElementById('almost-done-modal');
    if (modal) modal.classList.remove('active');
  },

  closePopupAndCancel() {
    if (this.stopCountdown) { this.stopCountdown(); this.stopCountdown = null; }
    const modal = document.getElementById('almost-done-modal');
    if (modal) modal.classList.remove('active');
    Router.navigate('/');
  },

  /** Validate and proceed based on Pay Now / Pay Later */
  handleContinue(hotelId, roomId, checkIn, checkOut, guests, total) {
    const firstName = document.getElementById('guest-firstname').value.trim();
    const lastName = document.getElementById('guest-lastname').value.trim();
    const email = document.getElementById('guest-email').value.trim();
    let valid = true;
    document.querySelectorAll('.input-field.error').forEach(el => el.classList.remove('error'));
    if (!Helpers.isNotEmpty(firstName)) { document.getElementById('guest-firstname').classList.add('error'); valid = false; }
    if (!Helpers.isNotEmpty(lastName)) { document.getElementById('guest-lastname').classList.add('error'); valid = false; }
    if (!Helpers.isValidEmail(email)) { document.getElementById('guest-email').classList.add('error'); valid = false; }
    if (!valid) { Toast.error('Please fill in all required fields correctly.'); return; }

    const hotel = HotelData.hotels.find(h => h.id === hotelId);
    const room = hotel.rooms.find(r => r.id === roomId) || hotel.rooms[0];
    const payRadio = document.querySelector('input[name="payOption"]:checked');
    const payOption = payRadio ? payRadio.value : 'now';

    const bookingData = {
      hotelId, hotelName: hotel.name, location: hotel.location,
      image: hotel.images[0], roomId: room.id, roomName: room.name,
      roomSize: room.size, roomBed: room.bed, roomAmenities: room.amenities,
      checkIn24h: room.checkIn24h, checkIn, checkOut, guests,
      guestName: `${firstName} ${lastName}`, guestEmail: email,
      phone: document.getElementById('guest-phone').value.trim(),
      requests: document.getElementById('guest-requests').value.trim(),
      totalPrice: total, pricePerNight: room.pricePerNight
    };

    if (this.stopCountdown) { this.stopCountdown(); this.stopCountdown = null; }

    if (payOption === 'now') {
      // Pay Now → go directly to payment page
      sessionStorage.setItem('stayease_pending_booking', JSON.stringify(bookingData));
      Router.navigate('/payment');
    } else {
      // Pay Later → save as booked (unpaid), show confirmation
      const booking = Storage.saveBooking({
        ...bookingData,
        status: 'booked',
        paymentStatus: 'unpaid',
        confirmCode: Helpers.generateConfirmCode()
      });
      Router.navigate(`/confirmation/${booking.id}?status=booked`);
    }
  }
};
