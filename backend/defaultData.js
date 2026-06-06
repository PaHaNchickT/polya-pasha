const defaultPlaces = [
  {
    id: 1,
    title: "Кафе «Ромашка»",
    description: "Уютное кафе в центре",
    created_at: "2026-06-01T10:00:00.000Z",
    event_date: "2026-06-10T18:00:00.000Z",
    author: "Pasha",
    location_type: "walk",
    activity_type: ["food"],
    cover_type: "open",
    comment: "Можно с собаками",
    address: "ул. Ленина, 10",
    coordinates: [55.7558, 37.6173],
    link: null,
    rating: 5,
    images: [],
    is_visited: false,
  },
  {
    id: 2,
    title: "Парк Горького",
    description: "Отличное место для прогулок",
    created_at: "2026-06-04T12:00:00.000Z",
    event_date: null,
    author: "Polya",
    location_type: "walk",
    activity_type: ["action", "animals"],
    cover_type: "hybrid",
    comment: null,
    address: "центр",
    coordinates: [55.7298, 37.6033],
    link: "https://park-gorkogo.com",
    rating: 4,
    images: [],
    is_visited: false,
  },
];

const defaultReviews = [
  {
    id: 0,
    place_id: 0,
    title: "test review title",
    description: "test review descr",
    images: [],
  },
];

module.exports = { defaultPlaces, defaultReviews };
