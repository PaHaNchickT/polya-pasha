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
app.use(express.json());

// ---------- Конфигурация пользователей из .env ----------
const USERS = [
  {
    login: process.env.USER1_LOGIN,
    password: process.env.USER1_PASSWORD,
    role: "admin", // можно добавить роли, если нужно
  },
  {
    login: process.env.USER2_LOGIN,
    password: process.env.USER2_PASSWORD,
    role: "user",
  },
].filter((user) => user.login && user.password); // на случай, если переменная не задана

// ---------- Вспомогательные функции для Blob (JSON) ----------
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

// ---------- Работа с чёрным списком токенов (revoked_tokens.json) ----------
async function getRevokedTokens() {
  const tokens = await readJsonBlob("revoked_tokens.json");
  return tokens || [];
}

async function addRevokedToken(token) {
  const tokens = await getRevokedTokens();
  tokens.push(token);
  await writeJsonBlob("revoked_tokens.json", tokens);
}

// Middleware для проверки, не отозван ли токен
async function checkRevoked(req, res, next) {
  const tokens = await getRevokedTokens();
  if (tokens.includes(req.token)) {
    return res
      .status(401)
      .json({ error: "Токен был отозван. Пожалуйста, войдите заново." });
  }
  next();
}

// ---------- Эндпоинты ----------
// POST /api/login – аутентификация
app.post("/api/login", (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ error: "Укажите логин и пароль" });
  }

  const user = USERS.find((u) => u.login === login && u.password === password);
  if (!user) {
    return res.status(401).json({ error: "Неверный логин или пароль" });
  }

  // Создаём JWT токен на 24 часа (можно изменить)
  const token = jwt.sign(
    { login: user.login, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" },
  );

  res.json({ token, user: { login: user.login, role: user.role } });
});

// POST /api/logout – выход (добавляем токен в чёрный список)
app.post("/api/logout", authMiddleware, async (req, res) => {
  try {
    await addRevokedToken(req.token);
    res.json({ success: true, message: "Токен отозван" });
  } catch (err) {
    res.status(500).json({ error: "Ошибка при выходе из системы" });
  }
});

// GET /api/places – защищённый маршрут (пример)
app.get("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Аналогично защищаем POST /api/places и будущие reviews
app.post("/api/places", authMiddleware, checkRevoked, async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    const newPlace = { id: Date.now(), ...req.body };
    places.push(newPlace);
    await writeJsonBlob("places.json", places);
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Пока не реализованы, но могут быть защищены так же:
// GET /api/reviews, POST /api/reviews — добавляй аналогично с middleware

// Для теста можно добавить публичный эндпоинт /api/status
app.get("/api/status", (req, res) => res.json({ status: "ok" }));

// Экспорт приложения для Vercel
module.exports = app;
