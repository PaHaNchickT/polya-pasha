const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { checkRevoked } = require("../middleware/revoke");
const supabase = require("../supabaseClient");

const router = express.Router();

// GET /api/map – список мест для карты (id, coordinates) с теми же фильтрами
router.get("/map", authMiddleware, checkRevoked, async (req, res) => {
  try {
    // Все те же фильтры, что и у GET /api/places
    const search = req.query.search?.trim() || null;
    const activityType = req.query.activity_type?.trim() || null;
    const locationType = req.query.location_type?.trim() || null;
    const coverType = req.query.cover_type?.trim() || null;
    const author = req.query.author?.trim() || null;

    const isVisitedParam = req.query.is_visited?.trim().toLowerCase();
    const isVisited =
      isVisitedParam === "true"
        ? true
        : isVisitedParam === "false"
          ? false
          : null;

    const eventDateParam = req.query.event_date?.trim().toLowerCase();
    const eventDateFilter =
      eventDateParam === "true"
        ? "true"
        : eventDateParam === "false"
          ? "false"
          : null;

    const isExpiredParam = req.query.is_expired?.trim().toLowerCase();
    const isExpiredFilter =
      isExpiredParam === "true"
        ? "true"
        : isExpiredParam === "false"
          ? "false"
          : null;

    // Вызываем специализированную RPC-функцию без пагинации и сортировки
    const { data, error } = await supabase.rpc("map_places", {
      search_term: search,
      activity_type_filter: activityType,
      location_type_filter: locationType,
      cover_type_filter: coverType,
      author_filter: author,
      is_visited_filter: isVisited,
      event_date_filter: eventDateFilter,
      is_expired_filter: isExpiredFilter,
    });

    if (error) throw error;

    // map_places возвращает массив объектов { id, coordinates }
    // Оборачиваем в data, как и в других эндпоинтах
    res.json({ data: data || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
