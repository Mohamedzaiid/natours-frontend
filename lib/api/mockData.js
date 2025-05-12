/**
 * Mock tour data to use as a fallback when the API is unavailable
 */

export const mockTours = [
  {
    id: "5c88fa8cf4afda39709c2955",
    name: "The Forest Hiker",
    duration: 5,
    maxGroupSize: 25,
    difficulty: "easy",
    ratingsAverage: 4.7,
    ratingsQuantity: 37,
    price: 397,
    summary: "Breathtaking hike through the Canadian Banff National Park",
    description: "Explore Canada's most beautiful national park and discover the pristine forests, crystal-clear lakes, and majestic mountains. Experience the stunning beauty of this pristine wilderness.",
    imageCover: "/img/tours/Hiking.jpg",
    images: [
      "/img/tours/Hiking.jpg",
      "/img/tours/Forest.jpg",
      "/img/tours/Mountain.jpg"
    ],
    startDates: [
      "2025-04-25T09:00:00.000Z",
      "2025-07-20T09:00:00.000Z",
      "2025-10-05T09:00:00.000Z"
    ],
    startLocation: {
      description: "Banff, Canada",
      type: "Point",
      coordinates: [-115.570154, 51.178456]
    }
  },
  {
    id: "5c88fa8cf4afda39709c2951",
    name: "The Sea Explorer",
    duration: 7,
    maxGroupSize: 15,
    difficulty: "medium",
    ratingsAverage: 4.8,
    ratingsQuantity: 23,
    price: 497,
    summary: "Exploring the jaw-dropping US east coast by foot and by boat",
    description: "Discover the beautiful coastal regions of the United States on this amazing journey. Experience stunning beaches, historic lighthouses, and charming coastal towns.",
    imageCover: "/img/tours/Beach.jpg",
    images: [
      "/img/tours/Beach.jpg",
      "/img/tours/Adventure.jpg",
      "/img/tours/Mountain.jpg"
    ],
    startDates: [
      "2025-06-19T09:00:00.000Z",
      "2025-07-20T09:00:00.000Z",
      "2025-08-18T09:00:00.000Z"
    ],
    startLocation: {
      description: "Miami, USA",
      type: "Point",
      coordinates: [-80.185942, 25.774772]
    }
  },
  {
    id: "5c88fa8cf4afda39709c2961",
    name: "The Snow Adventurer",
    duration: 4,
    maxGroupSize: 10,
    difficulty: "difficult",
    ratingsAverage: 4.5,
    ratingsQuantity: 13,
    price: 997,
    summary: "Exciting adventure in the snow with snowboarding and skiing",
    description: "Experience the thrill of winter sports in the beautiful snow-covered mountains. Enjoy skiing, snowboarding, and cozy evenings by the fireplace.",
    imageCover: "/img/tours/Mountain.jpg",
    images: [
      "/img/tours/Mountain.jpg",
      "/img/tours/Forest.jpg",
      "/img/tours/Hiking.jpg"
    ],
    startDates: [
      "2025-01-05T09:00:00.000Z",
      "2025-02-12T09:00:00.000Z",
      "2026-01-06T09:00:00.000Z"
    ],
    startLocation: {
      description: "Aspen, USA",
      type: "Point",
      coordinates: [-106.822318, 39.199872]
    }
  },
  {
    id: "5c88fa8cf4afda39709c295a",
    name: "The City Wanderer",
    duration: 9,
    maxGroupSize: 20,
    difficulty: "easy",
    ratingsAverage: 4.6,
    ratingsQuantity: 54,
    price: 1197,
    summary: "Living the life of Wanderlust in the US' most beatiful cities",
    description: "Experience the vibrant culture and rich history of America's greatest cities. From the bright lights of New York to the cultural diversity of San Francisco.",
    imageCover: "/img/tours/Adventure.jpg",
    images: [
      "/img/tours/Adventure.jpg",
      "/img/tours/Camping.jpg",
      "/img/tours/Forest.jpg"
    ],
    startDates: [
      "2025-03-11T09:00:00.000Z",
      "2025-05-02T09:00:00.000Z",
      "2025-06-09T09:00:00.000Z"
    ],
    startLocation: {
      description: "New York, USA",
      type: "Point",
      coordinates: [-73.985141, 40.75894]
    }
  },
  {
    id: "5c88fa8cf4afda39709c2970",
    name: "The Park Camper",
    duration: 10,
    maxGroupSize: 15,
    difficulty: "medium",
    ratingsAverage: 4.9,
    ratingsQuantity: 19,
    price: 1497,
    summary: "Breathing in Nature in America's most spectacular National Parks",
    description: "Explore the natural wonders of America's most beautiful national parks. Experience stunning landscapes, diverse wildlife, and unforgettable adventures.",
    imageCover: "/img/tours/Camping.jpg",
    images: [
      "/img/tours/Camping.jpg",
      "/img/tours/Adventure.jpg",
      "/img/tours/Hiking.jpg"
    ],
    startDates: [
      "2025-08-05T09:00:00.000Z",
      "2025-10-12T09:00:00.000Z",
      "2026-01-06T09:00:00.000Z"
    ],
    startLocation: {
      description: "Yellowstone National Park, USA",
      type: "Point",
      coordinates: [-110.588586, 44.427963]
    }
  }
];
