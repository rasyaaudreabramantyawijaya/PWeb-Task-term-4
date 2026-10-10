/* ============================================
   STAYEASE — App Initialization
   Registers all routes and initializes the
   SPA router, header, and toast system.
   This is the main entry point for JS.
   ============================================ */

const App = {
  /**
   * Initialize the entire application.
   * Called on DOMContentLoaded from index.html.
   */
  init() {
    // Initialize toast system
    Toast.init();

    // Register all SPA routes
    Router.register('/', (ctx) => {
      HomePage.render(ctx);
      Header.render();
    });

    Router.register('/results', (ctx) => {
      ResultsPage.render(ctx);
      Header.render();
    });

    Router.register('/room/:id', (ctx) => {
      RoomDetailPage.render(ctx);
      Header.render();
    });

    Router.register('/booking/:id', (ctx) => {
      BookingPage.render(ctx);
      Header.render();
    });

    Router.register('/payment', (ctx) => {
      PaymentPage.render(ctx);
      Header.render();
    });

    Router.register('/confirmation/:id', (ctx) => {
      ConfirmationPage.render(ctx);
      Header.render();
    });

    Router.register('/wishlist', (ctx) => {
      WishlistPage.render(ctx);
      Header.render();
    });

    Router.register('/history', (ctx) => {
      HistoryPage.render(ctx);
      Header.render();
    });

    // Start the router (handles initial route)
    Router.init();

    console.log('🏨 Stay WithMe initialized successfully');
  }
};

// Boot the app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
