// api/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { put, list, del } = require("@vercel/blob");
const { defaultPlaces, defaultReviews } = require("../defaultData");
const { authMiddleware } = require("./auth");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" })); // увеличим лимит для base64 картинок

// ---------- Конфигурация пользователей из .env ----------
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

// ---------- Blob helpers ----------
async function readJsonBlob(filename) {
  const { blobs } = await list({ prefix: filename });
  if (blobs.length === 0) return null;
  const blob = blobs[0];
  const response = await fetch(blob.url);
  if (!response.ok) throw new Error(`Blob fetch failed for ${filename}`);
  return await response.json();
}

async function writeJsonBlob(filename, data) {
  const { blobs } = await list({ prefix: filename });
  for (const blob of blobs) await del(blob.url);
  await put(filename, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

async function ensureDefaultData(filename, defaultData) {
  const existing = await readJsonBlob(filename);
  if (existing === null) {
    await writeJsonBlob(filename, defaultData);
    return defaultData;
  }
  return existing;
}

// ---------- Вспомогательные вычисляемые поля ----------
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

  return {
    ...place,
    is_new,
    is_expired,
  };
}

// ---------- Работа с чёрным списком токенов ----------
async function getRevokedTokens() {
  const tokens = await readJsonBlob("revoked_tokens.json");
  return tokens || [];
}

async function addRevokedToken(token) {
  const tokens = await getRevokedTokens();
  tokens.push(token);
  await writeJsonBlob("revoked_tokens.json", tokens);
}

async function checkRevoked(req, res, next) {
  const tokens = await getRevokedTokens();
  if (tokens.includes(req.token)) {
    return res.status(401).json({ error: "Токен был отозван" });
  }
  next();
}

// ---------- Auth routes ----------
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

// ---------- Places CRUD ----------
// Все маршруты защищены authMiddleware + checkRevoked

// GET /api/places – список всех мест
app.get("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const enriched = places.map(enrichPlace);
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/places/:id – одно место
app.get("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const id = Number(req.params.id);
    const place = places.find((p) => p.id === id);
    if (!place) return res.status(404).json({ error: "Место не найдено" });
    res.json(enrichPlace(place));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/places – создать новое место
app.post("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const newPlace = {
      id: Date.now(),
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
      images: req.body.images || [],
      is_visited: req.body.is_visited || false,
    };
    places.push(newPlace);
    await writeJsonBlob("places.json", places);
    res.status(201).json(enrichPlace(newPlace));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/places/:id – обновить место (только разрешённые поля)
app.patch("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const id = Number(req.params.id);
    const index = places.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: "Место не найдено" });

    // Список полей, которые разрешено менять (кроме id, created_at, rating? можно rating)
    const updatable = [
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
      "images",
      "is_visited",
    ];

    const existing = places[index];
    const updated = { ...existing };

    for (const field of updatable) {
      if (req.body[field] !== undefined) {
        updated[field] = req.body[field];
      }
    }

    // Убедимся, что id и created_at не изменились
    updated.id = existing.id;
    updated.created_at = existing.created_at;

    places[index] = updated;
    await writeJsonBlob("places.json", places);
    res.json(enrichPlace(updated));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/places – удалить несколько мест (массив id в теле)
app.delete("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const idsToDelete = req.body?.ids; // ожидается массив [1,2,3]
    if (!Array.isArray(idsToDelete)) {
      return res.status(400).json({ error: "Необходим массив ids" });
    }
    const newPlaces = places.filter((p) => !idsToDelete.includes(p.id));
    if (newPlaces.length === places.length) {
      return res.status(404).json({ error: "Ни одно место не найдено" });
    }
    await writeJsonBlob("places.json", newPlaces);
    res.json({ deleted: places.length - newPlaces.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/places/:id – удалить одно место
app.delete(
  "/api/places/:id",
  authMiddleware,
  checkRevoked,
  async (req, res) => {
    try {
      const places = await ensureDefaultData("places.json", defaultPlaces);
      const id = Number(req.params.id);
      const index = places.findIndex((p) => p.id === id);
      if (index === -1)
        return res.status(404).json({ error: "Место не найдено" });
      const [deleted] = places.splice(index, 1);
      await writeJsonBlob("places.json", places);
      res.json(enrichPlace(deleted)); // или просто { success: true }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Для теста
app.get("/api/status", (req, res) => res.json({ status: "ok" }));

module.exports = app;
