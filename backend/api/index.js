require("dotenv").config();

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("./auth");
const supabase = require("../supabaseClient");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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

// GET /api/places – список всех мест с вычисляемыми полями
app.get("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const { data: places, error } = await supabase
      .from("places")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.json(places.map(enrichPlace));
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
    res.json(enrichPlace(place));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/places – создать новое место
app.post("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
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
      images: req.body.images || [],
      is_visited: req.body.is_visited || false,
    };

    const { data: created, error } = await supabase
      .from("places")
      .insert(newPlace)
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(enrichPlace(created));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/places/:id – обновить место
app.patch("/api/places/:id", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Получаем текущее место (чтобы знать старые картинки)
    const { data: existing, error: findError } = await supabase
      .from("places")
      .select("images")
      .eq("id", id)
      .single();
    if (findError) return res.status(404).json({ error: "Место не найдено" });

    // Если клиент передал новые images, удаляем старые файлы из Storage
    if (req.body.images !== undefined) {
      const oldUrls = existing.images || [];
      for (const url of oldUrls) {
        // Извлекаем имя файла из URL
        const filePath = url.split("/").pop();
        const { error: delError } = await supabase.storage
          .from("place-images")
          .remove([filePath]);
        if (delError) console.error("Ошибка удаления файла:", delError);
      }
    }

    // Теперь обновляем поля, включая images
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
      "images",
      "is_visited",
    ];

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
      .from("places")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.json(enrichPlace(updated));
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
      const id = parseInt(req.params.id, 10);
      const { data: place, error: findError } = await supabase
        .from("places")
        .select("images")
        .eq("id", id)
        .single();
      if (findError) return res.status(404).json({ error: "Место не найдено" });

      // Удаляем файлы картинок из Storage
      if (place.images && place.images.length > 0) {
        const filePaths = place.images.map((url) => url.split("/").pop());
        const { error: delError } = await supabase.storage
          .from("place-images")
          .remove(filePaths);
        if (delError) console.error("Ошибка удаления файлов:", delError);
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

// POST /api/upload – загрузка нескольких изображений
app.post(
  "/api/upload",
  authMiddleware,
  checkRevoked,
  upload.array("images", 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "Файлы не найдены" });
      }

      const uploadedUrls = [];

      for (const file of req.files) {
        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
          .from("place-images")
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (error) throw error;

        const { data: publicURL } = supabase.storage
          .from("place-images")
          .getPublicUrl(fileName);

        uploadedUrls.push(publicURL.publicUrl);
      }

      res.json({ urls: uploadedUrls });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
);

// Тестовый статус
app.get("/api/status", (req, res) => res.json({ status: "ok" }));

module.exports = app;
