require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./auth");
const supabase = require("../supabaseClient");
const {
  uploadBase64Image,
  batchGetImagesBase64,
} = require("../helpers/imageUtils");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ---------- Пользователи из .env ----------
const USERS = [
  {
    login: process.env.USER1_LOGIN,
    password: process.env.USER1_PASSWORD,
    role: "admin",
  },
  {
    login: process.env.USER2_LOGIN,
    password: process.env.USER2_PASSWORD,
    role: "user",
  },
].filter((user) => user.login && user.password);

// ---------- Вычисляемые поля ----------
function enrichPlace(place) {
  const now = new Date();
  const createdDate = new Date(place.created_at);
  const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
  const is_new = diffDays < 7;

  let is_expired = null;
  if (place.event_date) {
    const eventDate = new Date(place.event_date);
    is_expired = now > eventDate;
  }

  return { ...place, is_new, is_expired };
}

// ---------- Чёрный список токенов ----------
async function isTokenRevoked(token) {
  const { data, error } = await supabase
    .from("revoked_tokens")
    .select("token")
    .eq("token", token)
    .maybeSingle();
  if (error) throw error;
  return data !== null;
}

async function addRevokedToken(token) {
  const { error } = await supabase.from("revoked_tokens").insert({ token });
  if (error) throw error;
}

// Middleware для проверки отозванных токенов
async function checkRevoked(req, res, next) {
  try {
    const revoked = await isTokenRevoked(req.token);
    if (revoked) {
      return res.status(401).json({ error: "Токен был отозван" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

// ---------- Auth ----------
app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль" });
  }
  const user = USERS.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }
  const token = jwt.sign(
    { login: user.login, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );
  res.json({ token, user: { login: user.login, role: user.role } });
});

app.post("/api/logout", authMiddleware, async (req, res) => {
  try {
    await addRevokedToken(req.token);
    res.json({ success: true, message: "Токен отозван" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при выходе" });
  }
});

// ---------- Places CRUD (атомарные SQL-запросы) ----------

// GET /api/places – список с поиском, сортировкой, фильтрацией и пагинацией
app.get("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    // --- Параметры запроса с валидацией ---
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(req.query.limit, 10) || 10),
    );
    const sortField = ["title", "created_at"].includes(req.query.sort)
      ? req.query.sort
      : "created_at";
    const order = req.query.order === "asc" ? "asc" : "desc";
    const search = req.query.search?.trim() || "";
    const locationType = req.query.location_type?.trim();
    const coverType = req.query.cover_type?.trim();
    const author = req.query.author?.trim();
    const isVisitedParam = req.query.is_visited?.trim().toLowerCase();

    // Строим запрос
    let query = supabase.from("places").select("*", { count: "exact" });

    // Фильтры
    if (locationType) {
      query = query.eq("location_type", locationType);
    }
    if (coverType) {
      query = query.eq("cover_type", coverType);
    }
    if (author) {
      query = query.eq("author", author);
    }
    if (isVisitedParam === "true") {
      query = query.eq("is_visited", true);
    } else if (isVisitedParam === "false") {
      query = query.eq("is_visited", false);
    }

    // Поиск по нескольким полям
    if (search) {
      query = query.or(
        `title.ilike.%:search%,description.ilike.%:search%,address.ilike.%:search%,comment.ilike.%:search%`,
        { search },
      );
    }

    // Сортировка
    query = query.order(sortField, { ascending: order === "asc" });

    // Пагинация
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data: places, error, count } = await query;

    if (error) throw error;

    // Обработка изображений (первые для списка)
    const firstImageIds = places
      .map((p) => (p.images && p.images.length > 0 ? p.images[0] : null))
      .filter((id) => id != null);
    const base64Map = await batchGetImagesBase64(firstImageIds);

    const enriched = places.map((place) => {
      const firstId = place.images?.[0];
      const imageData =
        firstId && base64Map[firstId]
          ? [
              {
                id: firstId,
                uri: base64Map[firstId],
                name: "image",
                type: "image/jpeg",
              },
            ]
          : [];
      return enrichPlace({ ...place, images: imageData });
    });

    // Мета-информация пагинации
    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.json({
      data: enriched,
      meta: {
        page,
        limit,
        totalItems,
        totalPages,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/places/:id
app.get("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { data: place, error } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116")
        return res.status(404).json({ error: "Место не найдено" });
      throw error;
    }

    const imageIds = place.images || [];
    const base64Map = await batchGetImagesBase64(imageIds);

    const fullImages = imageIds.map((imgId) => ({
      id: imgId,
      uri: base64Map[imgId] || "",
      name: "image",
      type: "image/jpeg",
    }));

    res.json(enrichPlace({ ...place, images: fullImages }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/places
app.post("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const inputImages = req.body.images || [];
    const imageIds = [];

    for (const img of inputImages) {
      if (img.id && typeof img.id === "number" && img.id > 0) {
        imageIds.push(img.id);
      } else if (img.uri && img.uri.startsWith("data:image/")) {
        const newId = await uploadBase64Image(img.uri, img.name, img.type);
        imageIds.push(newId);
      } else {
        console.warn("Пропущено изображение без id и не base64:", img);
      }
    }

    const newPlace = {
      title: req.body.title,
      description: req.body.description,
      created_at: new Date().toISOString(),
      event_date: req.body.event_date || null,
      author: req.body.author,
      location_type: req.body.location_type,
      activity_type: req.body.activity_type || [],
      cover_type: req.body.cover_type,
      comment: req.body.comment || null,
      address: req.body.address || null,
      coordinates: req.body.coordinates || [],
      link: req.body.link || null,
      rating: req.body.rating || 0,
      images: imageIds,
      is_visited: req.body.is_visited || false,
    };

    const { data: created, error } = await supabase
      .from("places")
      .insert(newPlace)
      .select()
      .single();

    if (error) throw error;

    const base64Map = await batchGetImagesBase64(imageIds);
    const fullImages = imageIds.map((id) => ({
      id,
      uri: base64Map[id] || "",
      name: "image",
      type: "image/jpeg",
    }));

    res.status(201).json(enrichPlace({ ...created, images: fullImages }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/places/:id
app.patch("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { data: existing, error: findError } = await supabase
      .from("places")
      .select("images")
      .eq("id", id)
      .single();
    if (findError) return res.status(404).json({ error: "Место не найдено" });

    const oldImageIds = existing.images || [];

    let newImageIds = oldImageIds;
    if (req.body.images !== undefined) {
      const inputImages = req.body.images || [];
      const processedIds = [];

      for (const img of inputImages) {
        if (img.id && typeof img.id === "number" && img.id > 0) {
          processedIds.push(img.id);
        } else if (img.uri && img.uri.startsWith("data:image/")) {
          const newId = await uploadBase64Image(img.uri, img.name, img.type);
          processedIds.push(newId);
        } else {
          console.warn("Пропущено изображение:", img);
        }
      }

      const idsToDelete = oldImageIds.filter(
        (oldId) => !processedIds.includes(oldId),
      );
      if (idsToDelete.length > 0) {
        const { error: delError } = await supabase
          .from("images")
          .delete()
          .in("id", idsToDelete);
        if (delError)
          console.error("Ошибка удаления старых изображений:", delError);
      }

      newImageIds = processedIds;
    }

    const updatableFields = [
      "title",
      "description",
      "event_date",
      "author",
      "location_type",
      "activity_type",
      "cover_type",
      "comment",
      "address",
      "coordinates",
      "link",
      "rating",
      "is_visited",
    ];
    const updates = {};
    for (const field of updatableFields) {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    }
    updates.images = newImageIds;

    const { data: updated, error } = await supabase
      .from("places")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    const base64Map = await batchGetImagesBase64(newImageIds);
    const fullImages = newImageIds.map((id) => ({
      id,
      uri: base64Map[id] || "",
      name: "image",
      type: "image/jpeg",
    }));

    res.json(enrichPlace({ ...updated, images: fullImages }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/places/:id
app.delete(
  "/api/places/:id",
  authMiddleware,
  checkRevoked,
  async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { data: place, error: findError } = await supabase
        .from("places")
        .select("images")
        .eq("id", id)
        .single();
      if (findError) return res.status(404).json({ error: "Место не найдено" });

      const imageIds = place.images || [];
      if (imageIds.length > 0) {
        const { error: delError } = await supabase
          .from("images")
          .delete()
          .in("id", imageIds);
        if (delError) console.error("Ошибка удаления изображений:", delError);
      }

      const { error: deleteError } = await supabase
        .from("places")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;

      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

app.get("/api/status", (req, res) => res.json({ status: "ok" }));

module.exports = app;
