const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { checkRevoked } = require("../middleware/revoke");
const supabase = require("../supabaseClient");

const router = express.Router();

router.use(authMiddleware, checkRevoked);

// GET /api/reviews – все отзывы или фильтр по place_id
router.get("/", async (req, res) => {
  try {
    const placeId = req.query.place_id
      ? parseInt(req.query.place_id, 10)
      : null;

    let query = supabase.from("reviews").select("*");

    if (placeId) {
      if (isNaN(placeId)) {
        return res.status(400).json({ error: "place_id должен быть числом" });
      }
      query = query.eq("place_id", placeId);
    }

    const { data, error } = await query;
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews/:id – один отзыв
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { data: review, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116")
        return res.status(404).json({ error: "Отзыв не найден" });
      throw error;
    }
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/reviews – создать отзыв (теперь с author)
router.post("/", async (req, res) => {
  try {
    const { place_id, title, description, visited_at, author } = req.body;

    // Проверка всех обязательных полей (добавлен author)
    if (!place_id || !title || !description || !visited_at || !author) {
      return res.status(400).json({
        error:
          "Все поля (place_id, title, description, visited_at, author) обязательны",
      });
    }

    if (isNaN(parseInt(place_id, 10))) {
      return res.status(400).json({ error: "place_id должен быть числом" });
    }

    // Проверка существования места
    const { data: placeExists, error: placeError } = await supabase
      .from("places")
      .select("id")
      .eq("id", place_id)
      .single();
    if (placeError || !placeExists) {
      return res
        .status(404)
        .json({ error: "Место с таким place_id не найдено" });
    }

    const newReview = {
      place_id,
      title,
      description,
      visited_at,
      author, // <-- сохраняем автора
    };

    const { data: created, error } = await supabase
      .from("reviews")
      .insert(newReview)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/reviews/:id – обновить (author не меняем)
router.patch("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const { data: existing, error: findError } = await supabase
      .from("reviews")
      .select("id")
      .eq("id", id)
      .single();
    if (findError) {
      return res.status(404).json({ error: "Отзыв не найден" });
    }

    // Только эти поля разрешены к обновлению
    const updatableFields = ["title", "description", "visited_at"];
    const updates = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "Нет полей для обновления" });
    }

    const { data: updated, error } = await supabase
      .from("reviews")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);

    const { data: existing, error: findError } = await supabase
      .from("reviews")
      .select("id")
      .eq("id", id)
      .single();
    if (findError) {
      return res.status(404).json({ error: "Отзыв не найден" });
    }

    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) throw error;

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
