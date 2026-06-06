require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { put, list, del } = require("@vercel/blob");
const { defaultPlaces, defaultReviews } = require("../defaultData");
const { authMiddleware } = require("./auth");

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

// ---------- Blob helpers с ETag-блокировкой ----------
async function readJsonBlob(filename) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { blobs } = await list({ prefix: filename, token });
  if (blobs.length === 0) return null;
  const blob = blobs[0];
  const response = await fetch(blob.url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Blob fetch failed for ${filename}: ${response.status}`);
  }
  const data = await response.json();
  const etag = response.headers.get("ETag");
  return { data, etag };
}

async function writeJsonBlob(filename, data, etag = undefined) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const { blobs } = await list({ prefix: filename, token });
  for (const blob of blobs) await del(blob.url, { token });
  const options = {
    access: 'private',
    contentType: "application/json",
    token,
  };
  if (etag) {
    options.headers = { "If-Match": etag };
  }
  await put(filename, JSON.stringify(data, null, 2), options);
}

// Атомарное обновление файла с повторами при конфликте
async function updateJsonBlob(filename, updateFn) {
  const MAX_RETRIES = 3;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const result = await readJsonBlob(filename);
    if (!result) throw new Error(`File ${filename} not found`);
    const { data, etag } = result;
    const newData = updateFn(data);
    try {
      await writeJsonBlob(filename, newData, etag);
      return newData;
    } catch (err) {
      // 412 Precondition Failed – файл изменился, пробуем ещё раз
      if (err.status === 412 && attempt < MAX_RETRIES - 1) {
        continue;
      }
      throw err;
    }
  }
}

// Инициализация данных (только если файлов нет)
async function initDataIfEmpty() {
  const places = await readJsonBlob("places.json");
  if (!places) {
    await writeJsonBlob("places.json", defaultPlaces);
    console.log("✅ places.json инициализирован");
  }
  const reviews = await readJsonBlob("reviews.json");
  if (!reviews) {
    await writeJsonBlob("reviews.json", defaultReviews);
    console.log("✅ reviews.json инициализирован");
  }
}
initDataIfEmpty().catch(console.error);

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
async function getRevokedTokens() {
  const result = await readJsonBlob("revoked_tokens.json");
  return result ? result.data : [];
}

async function addRevokedToken(token) {
  await updateJsonBlob("revoked_tokens.json", (tokens) => {
    tokens.push(token);
    return tokens;
  });
}

async function checkRevoked(req, res, next) {
  const tokens = await getRevokedTokens();
  if (tokens.includes(req.token)) {
    return res.status(401).json({ error: "Токен был отозван" });
  }
  next();
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

// ---------- Places CRUD (защищённые, атомарные) ----------

// GET /api/places – список всех мест
app.get("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const result = await readJsonBlob("places.json");
    if (!result) return res.status(404).json({ error: "Данные не найдены" });
    res.json(result.data.map(enrichPlace));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/places/:id – одно место
app.get("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const result = await readJsonBlob("places.json");
    if (!result) return res.status(404).json({ error: "Данные не найдены" });
    const id = Number(req.params.id);
    const place = result.data.find((p) => p.id === id);
    if (!place) return res.status(404).json({ error: "Место не найдено" });
    res.json(enrichPlace(place));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/places – создать новое место
app.post("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
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

    await updateJsonBlob("places.json", (places) => {
      return [...places, newPlace];
    });
    res.status(201).json(enrichPlace(newPlace));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/places/:id – обновить место
app.patch("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const updatedPlace = await updateJsonBlob("places.json", (places) => {
      const index = places.findIndex((p) => p.id === id);
      if (index === -1) throw { status: 404, message: "Место не найдено" };

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
      updated.id = existing.id;
      updated.created_at = existing.created_at;

      places[index] = updated;
      return places;
    });
    res.json(enrichPlace(updatedPlace.find((p) => p.id === id)));
  } catch (err) {
    if (err.status === 404) return res.status(404).json({ error: err.message });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/places – удалить несколько мест (массив id в теле)
app.delete("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const idsToDelete = req.body?.ids;
    if (!Array.isArray(idsToDelete)) {
      return res.status(400).json({ error: "Необходим массив ids" });
    }
    let deletedCount = 0;
    await updateJsonBlob("places.json", (places) => {
      const newPlaces = places.filter((p) => !idsToDelete.includes(p.id));
      deletedCount = places.length - newPlaces.length;
      return newPlaces;
    });
    if (deletedCount === 0) {
      return res.status(404).json({ error: "Ни одно место не найдено" });
    }
    res.json({ deleted: deletedCount });
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
      const id = Number(req.params.id);
      let deletedPlace = null;
      await updateJsonBlob("places.json", (places) => {
        const index = places.findIndex((p) => p.id === id);
        if (index === -1) throw { status: 404, message: "Место не найдено" };
        [deletedPlace] = places.splice(index, 1);
        return places;
      });
      res.json(enrichPlace(deletedPlace));
    } catch (err) {
      if (err.status === 404)
        return res.status(404).json({ error: err.message });
      res.status(500).json({ error: err.message });
    }
  },
);

// Тестовый статус
app.get("/api/status", (req, res) => res.json({ status: "ok" }));

module.exports = app;
