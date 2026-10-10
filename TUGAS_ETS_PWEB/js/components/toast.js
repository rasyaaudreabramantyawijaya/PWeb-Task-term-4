/* ============================================
   STAYEASE — Toast Notification Component
   Slide-in notifications for success, error,
   info, and warning messages. Auto-dismisses
   after 3 seconds.
   ============================================ */

const Toast = {
  container: null,

  /** Initialize toast container in the DOM */
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.id = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  /**
   * Show a toast notification.
   * @param {string} message - The message to display
   * @param {string} type - 'success' | 'error' | 'info' | 'warning'
   * @param {number} duration - Auto-dismiss in ms (default 3000)
   */
  show(message, type = 'info', duration = 3000) {
    this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type]}</span>
      <span class="toast-message">${message}</span>
      <span class="toast-close" onclick="this.parentElement.classList.add('toast-exit'); setTimeout(() => this.parentElement.remove(), 300)">✕</span>
    `;
    this.container.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('toast-exit');
        setTimeout(() => toast.remove(), 300);
      }
    }, duration);
  },

  success(msg) { this.show(msg, 'success'); },
  error(msg) { this.show(msg, 'error'); },
  info(msg) { this.show(msg, 'info'); },
  warning(msg) { this.show(msg, 'warning'); }
};
