const defaultPlaces = [
  {
    id: 0,
    title: "test title",
    description: "test descr",
    created_at: "today",
    event_date: "tomorrow",
    author: "Pasha",
    location_type: "walk",
    activity_type: "other",
    cover_type: "open",
    comment: null,
    address: null,
    coordinates: null,
    link: null,
    rating: 10,
    images: [],
    is_new: true,
    is_visited: false,
    is_expired: null,
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
