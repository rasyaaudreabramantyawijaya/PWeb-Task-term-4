/* ============================================
   STAYEASE — Booking History Page
   Full detail view per booking:
   - Paid: view details, contact provider, cancel with 50% refund
   - Unpaid: pay now, cancel (full), due date warning
   Auto-expiry for unpaid past due date.
   ============================================ */

const HistoryPage = {
  render({ container }) {
    // getBookings auto-purges expired unpaid bookings
    const realBookings = Storage.getBookings();
    const allBookings = [...realBookings, ...HotelData.mockBookingHistory];

    container.innerHTML = `
      <div class="history-page container">
        <h1>Booking History</h1>
        ${allBookings.length === 0 ? `
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <h3>No bookings yet</h3>
            <p>Once you book a stay, your booking details will appear here.</p>
            <button class="btn btn-primary" onclick="Router.navigate('/')">Find a Hotel</button>
          </div>
        ` : `
          <p style="color:var(--color-text-secondary); margin-bottom:var(--space-6)">${allBookings.length} booking${allBookings.length > 1 ? 's' : ''}</p>
          ${allBookings.map(b => HistoryPage.renderCard(b)).join('')}
        `}
      </div>
      <!-- Cancel Confirmation Modal -->
      <div class="modal-backdrop" id="cancel-modal">
        <div class="modal" style="max-width:480px">
          <div class="modal-header">
            <h3 id="cancel-modal-title">Cancel Booking</h3>
            <div class="modal-close" onclick="HistoryPage.closeCancelModal()">✕</div>
          </div>
          <div class="modal-body" id="cancel-modal-body">
          </div>
          <div class="modal-footer" id="cancel-modal-footer">
          </div>
        </div>
      </div>
      ${Footer.render()}
    `;
  },

  renderCard(b) {
    const isPaid = b.paymentStatus === 'paid';
    const isDemo = b.id.startsWith('BK-DEMO');
    const nights = Helpers.getNights(b.checkIn, b.checkOut);
    const hotel = HotelData.hotels.find(h => h.id === b.hotelId);
    const provider = hotel ? hotel.provider : { name: b.hotelName, phone: '—', address: '—', email: '—' };
    const timeLeft = b.paymentDueDate ? Helpers.getTimeRemaining(b.paymentDueDate) : '';

    return `
      <div class="history-card-v2" id="history-${b.id}">
        <div class="history-card-header">
          <div style="display:flex; gap:var(--space-4); align-items:start; flex:1">
            <img src="${b.image}" alt="${b.hotelName}" style="width:90px; height:90px; border-radius:var(--radius-md); object-fit:cover" />
            <div style="flex:1">
              <h4 style="margin-bottom:var(--space-1)">${b.hotelName}</h4>
              <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary); margin-bottom:var(--space-2)">📍 ${b.location}</p>
              <div style="display:flex; flex-wrap:wrap; gap:var(--space-3); font-size:var(--font-size-xs); color:var(--color-text-secondary)">
                <span>📅 ${Helpers.formatDateShort(b.checkIn)} — ${Helpers.formatDateShort(b.checkOut)}</span>
                <span>🌙 ${nights} night${nights>1?'s':''}</span>
                <span>👤 ${b.guests} guest${b.guests>1?'s':''}</span>
              </div>
            </div>
          </div>
          <div style="text-align:right; flex-shrink:0">
            <span class="badge ${isPaid ? 'badge-success' : 'badge-warning'}" style="margin-bottom:var(--space-2); display:inline-block">
              ${isPaid ? '✓ Confirmed Payment' : '⏳ Unverified Payment'}
            </span>
            <div style="font-weight:var(--font-weight-bold); font-size:var(--font-size-lg)">${Helpers.formatPrice(b.totalPrice)}</div>
            <div style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">${b.confirmCode}</div>
          </div>
        </div>

        <!-- Expandable Details -->
        <details class="history-details" id="details-${b.id}">
          <summary style="cursor:pointer; padding:var(--space-3) var(--space-5); font-weight:var(--font-weight-semibold); font-size:var(--font-size-sm); color:var(--color-accent); border-top:1px solid var(--color-border-light)">
            View Details ▾
          </summary>
          <div style="padding:0 var(--space-5) var(--space-5)">
            <!-- Room Details -->
            <div style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4)">
              <h5 style="margin-bottom:var(--space-3); font-size:var(--font-size-sm)">Room Details</h5>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-2); font-size:var(--font-size-xs)">
                <span>🏨 <strong>${b.roomName || 'Standard Room'}</strong></span>
                <span>📐 ${b.roomSize || '—'} m²</span>
                <span>🛏️ ${b.roomBed || '—'}</span>
                <span>👥 Max ${b.guests} guests</span>
                ${b.checkIn24h ? '<span style="color:var(--color-info)">🔵 24 Hours Check-in</span>' : '<span>🕐 Check-in: 14:00</span>'}
                <span>🕐 Check-out: 12:00</span>
              </div>
              ${b.roomAmenities ? `
                <div style="margin-top:var(--space-3); display:flex; flex-wrap:wrap; gap:var(--space-2)">
                  ${b.roomAmenities.map(a => `<span style="font-size:var(--font-size-xs); color:var(--color-success)">✓ ${a}</span>`).join('')}
                </div>
              ` : ''}
            </div>

            <!-- Guest Info -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:var(--space-3); font-size:var(--font-size-sm); margin-bottom:var(--space-4)">
              <div><span style="color:var(--color-text-tertiary)">Guest</span><br/><strong>${b.guestName}</strong></div>
              <div><span style="color:var(--color-text-tertiary)">Booking Date</span><br/><strong>${Helpers.formatDate(b.createdAt)}</strong></div>
            </div>

            ${!isPaid ? `
              <!-- Payment Due Warning -->
              <div style="background:rgba(239,68,68,0.05); border:1px solid var(--color-error); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4)">
                <div style="display:flex; align-items:center; gap:var(--space-2); margin-bottom:var(--space-2)">
                  <span style="font-size:var(--font-size-lg)">⚠️</span>
                  <strong style="color:var(--color-error)">Payment Required</strong>
                </div>
                <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary); margin-bottom:var(--space-2)">
                  Due date: <strong>${Helpers.formatDateLong(b.paymentDueDate)}</strong>
                </p>
                <p style="font-size:var(--font-size-xs); color:var(--color-text-tertiary)">
                  Time remaining: <strong>${timeLeft}</strong>.
                  If not paid by this date, your booking will be automatically forfeited and removed.
                </p>
              </div>
            ` : ''}

            <!-- Provider Contact -->
            <div style="background:var(--color-surface-hover); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-4)">
              <h5 style="margin-bottom:var(--space-3); font-size:var(--font-size-sm)">Accommodation Provider</h5>
              <div style="font-size:var(--font-size-xs); display:grid; gap:var(--space-2)">
                <span>🏢 <strong>${provider.name}</strong></span>
                <span>📞 ${provider.phone}</span>
                <span>📍 ${provider.address}</span>
                <span>✉️ ${provider.email}</span>
              </div>
            </div>

            <!-- Actions -->
            <div style="display:flex; gap:var(--space-3); flex-wrap:wrap">
              ${!isPaid && !isDemo ? `
                <button class="btn btn-primary" onclick="Router.navigate('/payment?bookingId=${b.id}')">💳 Pay Now</button>
                <button class="btn btn-secondary" style="color:var(--color-error); border-color:var(--color-error)" onclick="HistoryPage.showCancelModal('${b.id}', false, ${b.totalPrice})">✕ Cancel Booking</button>
              ` : ''}
              ${isPaid && !isDemo ? `
                <a href="tel:${provider.phone}" class="btn btn-secondary">📞 Contact Provider</a>
                <button class="btn btn-secondary" style="color:var(--color-error); border-color:var(--color-error)" onclick="HistoryPage.showCancelModal('${b.id}', true, ${b.totalPrice})">✕ Cancel & Refund</button>
              ` : ''}
              ${isDemo && isPaid ? `<a href="tel:${provider.phone}" class="btn btn-secondary">📞 Contact Provider</a>` : ''}
              ${isDemo && !isPaid ? `
                <button class="btn btn-primary" onclick="Router.navigate('/payment?bookingId=${b.id}')">💳 Pay Now</button>
              ` : ''}
            </div>
          </div>
        </details>
      </div>
    `;
  },

  showCancelModal(bookingId, isPaid, totalPrice) {
    const refund = isPaid ? Math.round(totalPrice * 0.5) : totalPrice;
    const modal = document.getElementById('cancel-modal');
    const title = document.getElementById('cancel-modal-title');
    const body = document.getElementById('cancel-modal-body');
    const footer = document.getElementById('cancel-modal-footer');

    title.textContent = isPaid ? 'Cancel & Request Refund' : 'Cancel Booking';
    body.innerHTML = `
      <div style="text-align:center; margin-bottom:var(--space-4)">
        <span style="font-size:48px">${isPaid ? '💸' : '❌'}</span>
      </div>
      <p style="text-align:center; font-size:var(--font-size-md); margin-bottom:var(--space-4)">
        Are you sure you want to cancel this booking?
      </p>
      ${isPaid ? `
        <div style="background:var(--color-warning-bg); border-radius:var(--radius-md); padding:var(--space-4); margin-bottom:var(--space-3)">
          <p style="font-size:var(--font-size-sm); color:var(--color-text)">
            Since this booking is already <strong>paid and confirmed</strong>, a <strong>50% refund</strong> of
            <strong>${Helpers.formatPrice(refund)}</strong> will be processed back to your payment method within 5-7 business days.
          </p>
        </div>
      ` : `
        <p style="font-size:var(--font-size-sm); color:var(--color-text-secondary); text-align:center; margin-bottom:var(--space-3)">
          This booking has not been paid. You will not be charged anything.
          The booking will be permanently removed from your history.
        </p>
      `}
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary" onclick="HistoryPage.closeCancelModal()">No, Keep Booking</button>
      <button class="btn btn-primary" style="background:var(--color-error)" onclick="HistoryPage.confirmCancel('${bookingId}', ${isPaid}, ${refund})">
        ${isPaid ? 'Yes, Cancel & Refund' : 'Yes, Cancel Booking'}
      </button>
    `;
    modal.classList.add('active');
  },

  closeCancelModal() {
    document.getElementById('cancel-modal')?.classList.remove('active');
  },

  confirmCancel(bookingId, isPaid, refund) {
    this.closeCancelModal();
    const result = Storage.cancelBooking(bookingId);
    if (result && result.success) {
      if (isPaid) {
        Toast.success(`Booking cancelled. A refund of ${Helpers.formatPrice(refund)} will be processed within 5-7 business days.`);
      } else {
        Toast.success('Booking has been cancelled successfully.');
      }
      // Re-render the page
      Router.resolve();
    } else {
      Toast.error('Failed to cancel booking. Please try again.');
    }
  }
};
