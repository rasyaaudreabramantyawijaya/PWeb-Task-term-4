/* ============================================
   STAYEASE — Confirmation Page
   Step 3: Booking is confirmed!
   Animated checkmark for both Pay Now (confirmed)
   and Pay Later (booked/unpaid).
   ============================================ */

const ConfirmationPage = {
  render({ params, query, container }) {
    const status = query.status; // 'success' (paid), 'booked' (unpaid), 'failed'

    if (status === 'failed') {
      container.innerHTML = `
        <div class="confirmation-page container">
          <div class="confirmation-icon">😞</div>
          <h1>Payment Failed</h1>
          <p style="font-size:var(--font-size-md); max-width:480px; margin:0 auto; color:var(--color-text-secondary)">
            We couldn't process your payment. Please check your card details and try again.
          </p>
          <div class="confirmation-details" style="border-left:4px solid var(--color-error)">
            <div style="text-align:center">
              <span class="badge badge-error" style="font-size:var(--font-size-sm); padding:var(--space-2) var(--space-4)">✕ Payment Declined</span>
              <p style="margin-top:var(--space-4); font-size:var(--font-size-sm); color:var(--color-text-secondary)">
                Your card was declined. This could be due to insufficient funds or incorrect card details.
              </p>
            </div>
          </div>
          <div class="confirmation-actions">
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/payment')">🔄 Try Again</button>
            <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/')">🏠 Back to Home</button>
          </div>
        </div>
        ${Footer.render()}
      `;
      return;
    }

    const booking = Storage.getBooking(params.id);
    if (!booking) {
      container.innerHTML = `<div class="empty-state container"><div class="empty-state-icon">📋</div><h3>Booking not found</h3><button class="btn btn-primary" onclick="Router.navigate('/')">Go Home</button></div>`;
      return;
    }

    const isPaid = status === 'success' || booking.paymentStatus === 'paid';

    // Show confetti for paid bookings
    if (isPaid) setTimeout(() => Helpers.showConfetti(), 300);

    // 3-step progress: all completed for step 3
    const progressHTML = `
      <div class="progress-steps" style="margin-bottom:var(--space-6)">
        <div class="progress-step"><div class="step-circle completed">✓</div><span class="step-label completed">Customer information</span></div>
        <div class="step-connector completed"></div>
        <div class="progress-step"><div class="step-circle completed">${isPaid ? '✓' : '✓'}</div><span class="step-label completed">Payment information</span></div>
        <div class="step-connector completed"></div>
        <div class="progress-step"><div class="step-circle ${isPaid ? 'completed' : 'active'}">3</div><span class="step-label ${isPaid ? 'completed' : 'active'}">Booking is confirmed!</span></div>
      </div>
    `;

    container.innerHTML = `
      <div class="confirmation-page container">
        ${progressHTML}

        <!-- Animated Checkmark -->
        <div class="success-checkmark">
          <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
          </div>
        </div>

        <h1 style="margin-top:var(--space-4)">Your Reservation Was Successful!</h1>
        <p style="font-size:var(--font-size-md); max-width:520px; margin:0 auto; color:var(--color-text-secondary)">
          ${isPaid
            ? 'Your accommodation booking was confirmed! A confirmation email has been sent to your inbox.'
            : 'Your accommodation booking was successful! Complete your payment before the due date to secure your reservation.'}
        </p>

        <div class="confirmation-details">
          <div style="text-align:center; margin-bottom:var(--space-4)">
            <span class="badge ${isPaid ? 'badge-success' : 'badge-warning'}" style="font-size:var(--font-size-sm); padding:var(--space-2) var(--space-4)">
              ${isPaid ? '✓ Confirmed Payment' : '⏳ Unverified Payment'}
            </span>
          </div>

          <div class="summary-line"><span style="color:var(--color-text-secondary)">Confirmation Code</span><span style="font-weight:var(--font-weight-bold); font-size:var(--font-size-lg); color:var(--color-accent)">${booking.confirmCode}</span></div>
          <div class="divider"></div>
          <div class="summary-line"><span>Hotel</span><span style="font-weight:var(--font-weight-semibold)">${booking.hotelName}</span></div>
          <div class="summary-line"><span>Location</span><span>${booking.location}</span></div>
          <div class="summary-line"><span>Room</span><span>${booking.roomName || 'Standard'} · ${booking.roomSize || '—'} m²</span></div>
          <div class="summary-line"><span>Bed</span><span>${booking.roomBed || '—'}</span></div>
          <div class="summary-line"><span>Check-in</span><span>${Helpers.formatDate(booking.checkIn)}</span></div>
          <div class="summary-line"><span>Check-out</span><span>${Helpers.formatDate(booking.checkOut)}</span></div>
          <div class="summary-line"><span>Guests</span><span>${booking.guests}</span></div>
          <div class="summary-line"><span>Guest Name</span><span>${booking.guestName}</span></div>
          ${booking.checkIn24h ? '<div class="summary-line"><span>Check-in Type</span><span style="color:var(--color-success)">🔵 24 Hours</span></div>' : ''}
          <div class="divider"></div>
          <div class="summary-line total"><span>${isPaid ? 'Total Paid' : 'Total Due'}</span><span>${Helpers.formatPrice(booking.totalPrice)}</span></div>
          ${!isPaid ? `
            <div class="summary-line" style="margin-top:var(--space-3)">
              <span style="color:var(--color-error)">⚠ Payment Due By</span>
              <span style="font-weight:var(--font-weight-bold); color:var(--color-error)">${Helpers.formatDate(booking.paymentDueDate)}</span>
            </div>
            <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-top:var(--space-2); text-align:center">
              If payment is not received by this date, your booking will be automatically forfeited.
            </p>
          ` : ''}
        </div>

        <div class="confirmation-actions">
          ${!isPaid ? `<button class="btn btn-primary btn-lg" onclick="Router.navigate('/payment?bookingId=${booking.id}')">💳 Pay Now</button>` : ''}
          <button class="btn ${isPaid ? 'btn-primary' : 'btn-secondary'} btn-lg" onclick="Router.navigate('/history')">📋 View Booking History</button>
          <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/')">🏠 Back to Home</button>
        </div>
      </div>
      ${Footer.render()}
    `;
  }
};
