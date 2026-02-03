/**
 * Deal Seed Data Fixtures
 * 15 sample deals across 5 categories from Target, Walmart, and Amazon
 */

export const deals = [
  // Electronics (5 deals)
  {
    productName: 'Samsung 55" Class Crystal UHD 4K Smart TV',
    description: 'Experience stunning 4K resolution with Crystal Processor 4K and smart TV capabilities. Stream your favorite content with built-in apps including Netflix, Disney+, and more.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800',
    price: 44999, // $449.99
    originalPrice: 69999, // $699.99
    savingsPercentage: 36,
    category: 'electronics',
    retailer: 'target',
    dealUrl: 'https://target.com',
    expirationDate: new Date('2026-02-17T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    clickCount: 0,
    slug: 'samsung-55-crystal-uhd-4k-smart-tv',
    metaDescription: 'Save 36% on Samsung 55" 4K Smart TV at Target',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Apple AirPods Pro (2nd Generation)',
    description: 'Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio. Up to 6 hours of listening time with ANC enabled.',
    imageUrl: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=800',
    price: 19999, // $199.99
    originalPrice: 24999, // $249.99
    savingsPercentage: 20,
    category: 'electronics',
    retailer: 'amazon',
    dealUrl: 'https://amazon.com',
    expirationDate: new Date('2026-02-20T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    clickCount: 0,
    slug: 'apple-airpods-pro-2nd-gen',
    metaDescription: 'Save 20% on Apple AirPods Pro 2nd Generation at Amazon',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'HP 15.6" Laptop - Intel Core i5',
    description: '15.6" Full HD display, Intel Core i5 processor, 8GB RAM, 256GB SSD. Perfect for work, school, and entertainment.',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
    price: 49999, // $499.99
    originalPrice: 69999, // $699.99
    savingsPercentage: 29,
    category: 'electronics',
    retailer: 'walmart',
    dealUrl: 'https://walmart.com',
    expirationDate: new Date('2026-02-22T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'hp-156-laptop-intel-core-i5',
    metaDescription: 'Save 29% on HP 15.6" Laptop with Intel Core i5 at Walmart',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise cancellation, exceptional sound quality, 30-hour battery life. Perfect for travel and daily use.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800',
    price: 34999, // $349.99
    originalPrice: 39999, // $399.99
    savingsPercentage: 13,
    category: 'electronics',
    retailer: 'target',
    dealUrl: 'https://target.com',
    expirationDate: new Date('2026-02-19T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    clickCount: 0,
    slug: 'sony-wh-1000xm5-wireless-headphones',
    metaDescription: 'Save 13% on Sony WH-1000XM5 Wireless Headphones at Target',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Amazon Fire TV Stick 4K',
    description: 'Stream in 4K Ultra HD with support for Dolby Vision, HDR, and Dolby Atmos audio. Includes Alexa Voice Remote.',
    imageUrl: 'https://images.unsplash.com/photo-1593078165-e5c1e6d1e0e7?w=800',
    price: 2999, // $29.99
    originalPrice: 4999, // $49.99
    savingsPercentage: 40,
    category: 'electronics',
    retailer: 'amazon',
    dealUrl: 'https://amazon.com',
    expirationDate: new Date('2026-02-25T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'amazon-fire-tv-stick-4k',
    metaDescription: 'Save 40% on Amazon Fire TV Stick 4K',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },

  // Home & Garden (4 deals)
  {
    productName: 'Ninja Professional Blender',
    description: 'Professional power with 1000 watts. Crush ice and frozen fruit in seconds. Perfect for smoothies, shakes, and more.',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
    price: 5999, // $59.99
    originalPrice: 9999, // $99.99
    savingsPercentage: 40,
    category: 'home-garden',
    retailer: 'walmart',
    dealUrl: 'https://walmart.com',
    expirationDate: new Date('2026-02-15T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'ninja-professional-blender',
    metaDescription: 'Save 40% on Ninja Professional Blender at Walmart',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'KitchenAid Stand Mixer',
    description: '5-Quart tilt-head stand mixer with 10 speeds. Includes flat beater, dough hook, and wire whip. Perfect for baking.',
    imageUrl: 'https://images.unsplash.com/photo-1578269174936-2709b6aeb913?w=800',
    price: 27999, // $279.99
    originalPrice: 39999, // $399.99
    savingsPercentage: 30,
    category: 'home-garden',
    retailer: 'target',
    dealUrl: 'https://target.com',
    expirationDate: new Date('2026-02-12T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'kitchenaid-stand-mixer',
    metaDescription: 'Save 30% on KitchenAid Stand Mixer at Target',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Dyson V11 Cordless Vacuum',
    description: 'Powerful suction, intelligent cleaning modes, up to 60 minutes of run time. Perfect for whole-home cleaning.',
    imageUrl: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
    price: 44999, // $449.99
    originalPrice: 59999, // $599.99
    savingsPercentage: 25,
    category: 'home-garden',
    retailer: 'amazon',
    dealUrl: 'https://amazon.com',
    expirationDate: new Date('2026-02-28T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    clickCount: 0,
    slug: 'dyson-v11-cordless-vacuum',
    metaDescription: 'Save 25% on Dyson V11 Cordless Vacuum at Amazon',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
    description: '6-quart multi-cooker: pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer.',
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800',
    price: 7999, // $79.99
    originalPrice: 11999, // $119.99
    savingsPercentage: 33,
    category: 'home-garden',
    retailer: 'walmart',
    dealUrl: 'https://walmart.com',
    expirationDate: new Date('2026-02-18T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'instant-pot-duo-7in1-pressure-cooker',
    metaDescription: 'Save 33% on Instant Pot Duo 7-in-1 at Walmart',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },

  // Clothing (2 deals)
  {
    productName: 'Levi\'s Men\'s 501 Original Fit Jeans',
    description: 'The original blue jean since 1873. Classic straight fit with button fly. 100% cotton denim.',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    price: 3999, // $39.99
    originalPrice: 5999, // $59.99
    savingsPercentage: 33,
    category: 'clothing',
    retailer: 'target',
    dealUrl: 'https://target.com',
    expirationDate: new Date('2026-02-10T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'levis-mens-501-original-fit-jeans',
    metaDescription: 'Save 33% on Levi\'s 501 Original Fit Jeans at Target',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Nike Women\'s Air Max Sneakers',
    description: 'Iconic Air Max cushioning, breathable mesh upper, durable rubber outsole. Available in multiple colors.',
    imageUrl: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800',
    price: 8999, // $89.99
    originalPrice: 12999, // $129.99
    savingsPercentage: 31,
    category: 'clothing',
    retailer: 'amazon',
    dealUrl: 'https://amazon.com',
    expirationDate: new Date('2026-02-24T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'nike-womens-air-max-sneakers',
    metaDescription: 'Save 31% on Nike Women\'s Air Max Sneakers at Amazon',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },

  // Health & Beauty (2 deals)
  {
    productName: 'Fitbit Charge 6 Fitness Tracker',
    description: 'Track your health and fitness with built-in GPS, heart rate monitoring, sleep tracking, and 7+ day battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800',
    price: 12999, // $129.99
    originalPrice: 15999, // $159.99
    savingsPercentage: 19,
    category: 'health-beauty',
    retailer: 'walmart',
    dealUrl: 'https://walmart.com',
    expirationDate: new Date('2026-02-18T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'fitbit-charge-6-fitness-tracker',
    metaDescription: 'Save 19% on Fitbit Charge 6 Fitness Tracker at Walmart',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Oral-B Pro 1000 Electric Toothbrush',
    description: 'Clinically proven superior clean vs. a regular manual toothbrush. Removes up to 300% more plaque.',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800',
    price: 3999, // $39.99
    originalPrice: 5999, // $59.99
    savingsPercentage: 33,
    category: 'health-beauty',
    retailer: 'target',
    dealUrl: 'https://target.com',
    expirationDate: new Date('2026-02-21T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'oral-b-pro-1000-electric-toothbrush',
    metaDescription: 'Save 33% on Oral-B Pro 1000 Electric Toothbrush at Target',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },

  // Sports & Outdoors (2 deals)
  {
    productName: 'Coleman 6-Person Camping Tent',
    description: 'WeatherTec system with patented welded floors and inverted seams. Easy setup in 10 minutes. Fits 2 queen airbeds.',
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    price: 8999, // $89.99
    originalPrice: 12999, // $129.99
    savingsPercentage: 31,
    category: 'sports-outdoors',
    retailer: 'amazon',
    dealUrl: 'https://amazon.com',
    expirationDate: new Date('2026-02-25T23:59:59Z'),
    isActive: true,
    isFeatured: true,
    viewCount: 0,
    clickCount: 0,
    slug: 'coleman-6-person-camping-tent',
    metaDescription: 'Save 31% on Coleman 6-Person Camping Tent at Amazon',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
  {
    productName: 'Schwinn Mountain Bike 29" Wheels',
    description: '21-speed twist shifters, front suspension fork, alloy linear pull brakes. Perfect for trails and recreation.',
    imageUrl: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800',
    price: 29999, // $299.99
    originalPrice: 44999, // $449.99
    savingsPercentage: 33,
    category: 'sports-outdoors',
    retailer: 'walmart',
    dealUrl: 'https://walmart.com',
    expirationDate: new Date('2026-02-27T23:59:59Z'),
    isActive: true,
    isFeatured: false,
    viewCount: 0,
    clickCount: 0,
    slug: 'schwinn-mountain-bike-29-wheels',
    metaDescription: 'Save 33% on Schwinn Mountain Bike 29" at Walmart',
    createdBy: 'admin@unlimitedperfectdeals.com',
  },
];
