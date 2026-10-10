/* ============================================
   STAYEASE — Mock Hotel Data
   Hotels with room types, provider contacts,
   and simulated API methods.
   ============================================ */

const HotelData = {
  hotels: [
    {
      id: 1, name: "The Grand Azure Resort", location: "Bali, Indonesia",
      description: "Nestled among lush tropical gardens overlooking the Indian Ocean, The Grand Azure Resort offers an unparalleled blend of luxury and tranquility. Each suite features handcrafted Balinese décor, private terraces, and stunning ocean panoramas.",
      images: [
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80"
      ],
      rating: 4.8, reviewCount: 342, popular: true,
      provider: { name: "Azure Hospitality Group", phone: "+62 361 847 2900", address: "Jl. Pantai Kuta No. 88, Kuta, Bali 80361, Indonesia", email: "reservations@grandazure.com" },
      rooms: [
        { id: "1a", name: "Standard Room", size: 28, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 149, amenities: ["WiFi", "Air Conditioning", "Safe"], checkIn24h: false },
        { id: "1b", name: "Ocean Suite", size: 45, bed: "1 King Bed", maxGuests: 3, pricePerNight: 189, amenities: ["WiFi", "Pool", "Spa", "Balcony", "Room Service", "Air Conditioning"], checkIn24h: true },
        { id: "1c", name: "Presidential Villa", size: 85, bed: "2 King Beds", maxGuests: 4, pricePerNight: 350, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Room Service", "Air Conditioning", "Balcony", "Kitchen"], checkIn24h: true }
      ]
    },
    {
      id: 2, name: "Sakura Garden Hotel", location: "Tokyo, Japan",
      description: "Experience the perfect harmony of traditional Japanese elegance and modern luxury at Sakura Garden Hotel. Located in the heart of Shibuya with spectacular city views.",
      images: [
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80"
      ],
      rating: 4.9, reviewCount: 518, popular: true,
      provider: { name: "Sakura Hotels & Resorts Co., Ltd.", phone: "+81 3-5467-0123", address: "2-21-1 Shibuya, Shibuya-ku, Tokyo 150-0002, Japan", email: "info@sakuragarden.jp" },
      rooms: [
        { id: "2a", name: "Studio Room", size: 22, bed: "1 Double Bed", maxGuests: 2, pricePerNight: 195, amenities: ["WiFi", "Air Conditioning", "City View"], checkIn24h: false },
        { id: "2b", name: "Premium City Room", size: 38, bed: "1 King Bed", maxGuests: 2, pricePerNight: 245, amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Gym", "Concierge", "Air Conditioning", "City View"], checkIn24h: true },
        { id: "2c", name: "Imperial Suite", size: 65, bed: "1 King Bed + Sofa", maxGuests: 3, pricePerNight: 420, amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Gym", "Concierge", "Air Conditioning", "City View", "Room Service", "Safe"], checkIn24h: true }
      ]
    },
    {
      id: 3, name: "Alpine Serenity Lodge", location: "Swiss Alps, Switzerland",
      description: "Perched at 1,800 meters in the Swiss Alps, Alpine Serenity Lodge is a sanctuary for those seeking mountain magic with breathtaking Alpine panoramas.",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&q=80",
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80"
      ],
      rating: 4.7, reviewCount: 267, popular: false,
      provider: { name: "Serenity Mountain Hotels AG", phone: "+41 33 854 12 00", address: "Bergstrasse 42, 3818 Grindelwald, Switzerland", email: "booking@alpineserenity.ch" },
      rooms: [
        { id: "3a", name: "Mountain View Room", size: 30, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 260, amenities: ["WiFi", "Mountain View", "Breakfast", "Parking"], checkIn24h: false },
        { id: "3b", name: "Alpine Deluxe", size: 48, bed: "1 King Bed", maxGuests: 4, pricePerNight: 320, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Mountain View", "Parking", "Breakfast"], checkIn24h: true },
        { id: "3c", name: "Chalet Suite", size: 75, bed: "2 Queen Beds", maxGuests: 5, pricePerNight: 490, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Mountain View", "Parking", "Breakfast", "Kitchen", "Balcony"], checkIn24h: true }
      ]
    },
    {
      id: 4, name: "Coastal Breeze Inn", location: "Maldives",
      description: "Your private overwater paradise awaits. Each villa sits above crystal-clear turquoise waters with glass floor panels for underwater viewing.",
      images: [
        "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&q=80",
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
        "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80"
      ],
      rating: 4.9, reviewCount: 189, popular: true,
      provider: { name: "Breeze Island Resorts Pvt Ltd", phone: "+960 664-0088", address: "North Malé Atoll, Maldives 08090", email: "stay@coastalbreeze.mv" },
      rooms: [
        { id: "4a", name: "Beach Bungalow", size: 35, bed: "1 King Bed", maxGuests: 2, pricePerNight: 350, amenities: ["WiFi", "Beach Access", "Breakfast", "Air Conditioning"], checkIn24h: false },
        { id: "4b", name: "Overwater Villa", size: 55, bed: "1 King Bed", maxGuests: 2, pricePerNight: 450, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Room Service", "Breakfast", "Shuttle"], checkIn24h: true },
        { id: "4c", name: "Sunset Water Suite", size: 90, bed: "1 King Bed + Daybed", maxGuests: 3, pricePerNight: 680, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Beach Access", "Room Service", "Breakfast", "Shuttle", "Kitchen", "Balcony"], checkIn24h: true }
      ]
    },
    {
      id: 5, name: "Metropolitan Loft Hotel", location: "New York, USA",
      description: "In the pulse of Manhattan, Metropolitan Loft Hotel redefines urban luxury with industrial-chic lofts and panoramic skyline views.",
      images: [
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
      ],
      rating: 4.6, reviewCount: 724, popular: true,
      provider: { name: "Metro Hospitality Inc.", phone: "+1 (212) 555-0147", address: "450 W 42nd Street, New York, NY 10036, USA", email: "hello@metropolitanloft.com" },
      rooms: [
        { id: "5a", name: "Urban Room", size: 25, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 229, amenities: ["WiFi", "Air Conditioning", "City View", "Gym"], checkIn24h: false },
        { id: "5b", name: "Skyline Loft", size: 42, bed: "1 King Bed", maxGuests: 2, pricePerNight: 299, amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Room Service", "Concierge", "Air Conditioning", "City View"], checkIn24h: true },
        { id: "5c", name: "Penthouse Suite", size: 80, bed: "2 King Beds", maxGuests: 4, pricePerNight: 550, amenities: ["WiFi", "Gym", "Restaurant", "Bar", "Room Service", "Concierge", "Air Conditioning", "City View", "Kitchen", "Balcony"], checkIn24h: true }
      ]
    },
    {
      id: 6, name: "Villa Rosa Toscana", location: "Tuscany, Italy",
      description: "Set among rolling Tuscan hills and ancient vineyards, a restored 16th-century estate offering la dolce vita at its finest.",
      images: [
        "https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80"
      ],
      rating: 4.8, reviewCount: 156, popular: false,
      provider: { name: "Toscana Luxury Villas S.r.l.", phone: "+39 0577 740 123", address: "Strada di Montalcino 15, 53024 Siena, Italy", email: "villa@rosatoscana.it" },
      rooms: [
        { id: "6a", name: "Classic Room", size: 26, bed: "1 Double Bed", maxGuests: 2, pricePerNight: 195, amenities: ["WiFi", "Breakfast", "Parking"], checkIn24h: false },
        { id: "6b", name: "Garden Suite", size: 40, bed: "1 King Bed", maxGuests: 3, pricePerNight: 275, amenities: ["WiFi", "Pool", "Restaurant", "Parking", "Kitchen", "Balcony", "Breakfast", "Laundry"], checkIn24h: true }
      ]
    },
    {
      id: 7, name: "Zen Wellness Retreat", location: "Ubud, Bali",
      description: "Discover inner peace hidden deep within Ubud's sacred monkey forest. Eco-luxury bamboo villas blending seamlessly with nature.",
      images: [
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80"
      ],
      rating: 4.7, reviewCount: 298, popular: false,
      provider: { name: "Zen Bali Retreats", phone: "+62 361 908 456", address: "Jl. Monkey Forest, Ubud, Gianyar, Bali 80571, Indonesia", email: "namaste@zenwellness.id" },
      rooms: [
        { id: "7a", name: "Bamboo Room", size: 24, bed: "1 Double Bed", maxGuests: 2, pricePerNight: 120, amenities: ["WiFi", "Breakfast", "Balcony"], checkIn24h: false },
        { id: "7b", name: "Bamboo Villa", size: 40, bed: "1 King Bed", maxGuests: 2, pricePerNight: 165, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Gym", "Breakfast", "Balcony", "Pet Friendly"], checkIn24h: true }
      ]
    },
    {
      id: 8, name: "The Royal Crescent", location: "London, UK",
      description: "Step into timeless British elegance at this meticulously restored Georgian townhouse in Kensington.",
      images: [
        "https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80",
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
        "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80"
      ],
      rating: 4.8, reviewCount: 412, popular: false,
      provider: { name: "Royal Heritage Hotels Ltd.", phone: "+44 20 7946 0123", address: "15 Royal Crescent, Kensington, London W8 5PQ, UK", email: "concierge@royalcrescent.co.uk" },
      rooms: [
        { id: "8a", name: "Classic Double", size: 24, bed: "1 Double Bed", maxGuests: 2, pricePerNight: 310, amenities: ["WiFi", "Breakfast", "Air Conditioning", "Safe"], checkIn24h: false },
        { id: "8b", name: "Heritage Suite", size: 50, bed: "1 King Bed", maxGuests: 2, pricePerNight: 385, amenities: ["WiFi", "Restaurant", "Bar", "Room Service", "Concierge", "Air Conditioning", "Safe", "Breakfast"], checkIn24h: true }
      ]
    },
    {
      id: 9, name: "Palm Oasis Resort", location: "Dubai, UAE",
      description: "Rising from the golden sands of Jumeirah Beach, where Arabian opulence meets contemporary design.",
      images: [
        "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80"
      ],
      rating: 4.9, reviewCount: 631, popular: true,
      provider: { name: "Oasis International Hotels LLC", phone: "+971 4 399 8888", address: "Palm Jumeirah, Crescent Road, Dubai, UAE", email: "reservations@palmoasis.ae" },
      rooms: [
        { id: "9a", name: "Deluxe Room", size: 35, bed: "1 King Bed", maxGuests: 2, pricePerNight: 390, amenities: ["WiFi", "Pool", "Gym", "Air Conditioning", "City View"], checkIn24h: false },
        { id: "9b", name: "Royal Suite", size: 70, bed: "1 King Bed + Sofa", maxGuests: 4, pricePerNight: 520, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Gym", "Beach Access", "Shuttle", "Concierge", "Room Service"], checkIn24h: true }
      ]
    },
    {
      id: 10, name: "Riverside Boutique Hotel", location: "Bangkok, Thailand",
      description: "Overlooking the majestic Chao Phraya River, blending traditional Thai artistry with modern minimalism.",
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80"
      ],
      rating: 4.5, reviewCount: 445, popular: false,
      provider: { name: "Riverside Thai Hotels Co.", phone: "+66 2 234 5678", address: "123 Charoen Krung Rd, Bang Rak, Bangkok 10500, Thailand", email: "info@riversideboutique.th" },
      rooms: [
        { id: "10a", name: "River View Room", size: 28, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 95, amenities: ["WiFi", "Air Conditioning", "Balcony", "Shuttle"], checkIn24h: false },
        { id: "10b", name: "Premium Suite", size: 45, bed: "1 King Bed", maxGuests: 3, pricePerNight: 145, amenities: ["WiFi", "Pool", "Restaurant", "Bar", "Air Conditioning", "Balcony", "Shuttle", "Laundry"], checkIn24h: true }
      ]
    },
    {
      id: 11, name: "Casa del Sol Beach Club", location: "Cancún, Mexico",
      description: "Your Caribbean dream comes alive. Powder-white beach with the turquoise Caribbean Sea at your feet.",
      images: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
        "https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800&q=80",
        "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80"
      ],
      rating: 4.6, reviewCount: 567, popular: false,
      provider: { name: "Sol Resorts S.A. de C.V.", phone: "+52 998 881 7700", address: "Blvd. Kukulcan Km 14.5, Zona Hotelera, 77500 Cancún, Mexico", email: "hola@casadelsol.mx" },
      rooms: [
        { id: "11a", name: "Garden Room", size: 30, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 160, amenities: ["WiFi", "Pool", "Breakfast", "Parking"], checkIn24h: false },
        { id: "11b", name: "Beachfront Suite", size: 50, bed: "2 Queen Beds", maxGuests: 4, pricePerNight: 210, amenities: ["WiFi", "Pool", "Spa", "Restaurant", "Bar", "Beach Access", "Gym", "Pet Friendly", "Parking", "Breakfast"], checkIn24h: true }
      ]
    },
    {
      id: 12, name: "Aurora Sky Hotel", location: "Reykjavik, Iceland",
      description: "Chase the Northern Lights from your glass-ceiling suite with unobstructed views of Iceland's dramatic skies.",
      images: [
        "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
        "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?w=800&q=80"
      ],
      rating: 4.7, reviewCount: 203, popular: false,
      provider: { name: "Aurora Nordic Hotels ehf.", phone: "+354 562 4000", address: "Laugavegur 28, 101 Reykjavik, Iceland", email: "book@aurorasky.is" },
      rooms: [
        { id: "12a", name: "Comfort Room", size: 26, bed: "1 Queen Bed", maxGuests: 2, pricePerNight: 280, amenities: ["WiFi", "Breakfast", "Mountain View"], checkIn24h: false },
        { id: "12b", name: "Aurora Suite", size: 48, bed: "1 King Bed", maxGuests: 2, pricePerNight: 340, amenities: ["WiFi", "Spa", "Restaurant", "Bar", "Mountain View", "Breakfast", "Shuttle", "Safe"], checkIn24h: true }
      ]
    }
  ],

  locations: [
    "Bali, Indonesia", "Tokyo, Japan", "Swiss Alps, Switzerland",
    "Maldives", "New York, USA", "Tuscany, Italy", "Ubud, Bali",
    "London, UK", "Dubai, UAE", "Bangkok, Thailand",
    "Cancún, Mexico", "Reykjavik, Iceland"
  ],

  popularDestinations: [
    { name: "Bali", subtitle: "12 hotels", image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80", query: "Bali" },
    { name: "Tokyo", subtitle: "8 hotels", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80", query: "Tokyo" },
    { name: "Maldives", subtitle: "6 hotels", image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80", query: "Maldives" },
    { name: "New York", subtitle: "15 hotels", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80", query: "New York" }
  ],

  mockBookingHistory: [],  // Empty for user to fill in their own bookings

  /** Helper: get lowest price for a hotel */
  getLowestPrice(hotel) {
    return Math.min(...hotel.rooms.map(r => r.pricePerNight));
  },

  async searchHotels({ location = '', minPrice = 0, maxPrice = 1000, minRating = 0, amenities = [], sort = 'popular' } = {}) {
    await Helpers.simulateDelay(800);
    let results = [...this.hotels];
    if (location) {
      const q = location.toLowerCase();
      results = results.filter(h => h.location.toLowerCase().includes(q) || h.name.toLowerCase().includes(q));
    }
    results = results.filter(h => this.getLowestPrice(h) >= minPrice && this.getLowestPrice(h) <= maxPrice);
    if (minRating > 0) results = results.filter(h => h.rating >= minRating);
    if (amenities.length > 0) {
      results = results.filter(h => h.rooms.some(r => amenities.every(a => r.amenities.includes(a))));
    }
    switch (sort) {
      case 'price-low': results.sort((a, b) => this.getLowestPrice(a) - this.getLowestPrice(b)); break;
      case 'price-high': results.sort((a, b) => this.getLowestPrice(b) - this.getLowestPrice(a)); break;
      case 'rating': results.sort((a, b) => b.rating - a.rating); break;
      default: results.sort((a, b) => b.reviewCount - a.reviewCount); break;
    }
    return results;
  },

  async getHotel(id) {
    await Helpers.simulateDelay(500);
    return this.hotels.find(h => h.id === parseInt(id)) || null;
  },

  async processPayment() {
    await Helpers.simulateDelay(2500);
    return Math.random() < 0.9;
  }
};
