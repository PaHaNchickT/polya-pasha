// api/index.js
require("dotenv").config(); // для локальной разработки
const express = require("express");
const { put, list, del } = require("@vercel/blob");
const { defaultPlaces, defaultReviews } = require("../defaultData");

const app = express();
app.use(express.json());

// ---------- Вспомогательные функции для работы с Blob ----------
async function readJsonBlob(filename) {
  // Ищем файл в Blob
  const { blobs } = await list({ prefix: filename });
  if (blobs.length === 0) return null; // файла нет
  const blob = blobs[0];
  // Скачиваем содержимое
  const response = await fetch(blob.url);
  if (!response.ok) throw new Error(`Blob fetch failed for ${filename}`);
  return await response.json();
}

async function writeJsonBlob(filename, data) {
  // Удаляем старый файл, если был
  const { blobs } = await list({ prefix: filename });
  for (const blob of blobs) await del(blob.url);
  // Загружаем новый
  await put(filename, JSON.stringify(data, null, 2), {
    access: "public",
    contentType: "application/json",
  });
}

async function ensureDefaultData(filename, defaultData) {
  const existing = await readJsonBlob(filename);
  if (existing === null) {
    // Первый запуск – загружаем начальные данные
    await writeJsonBlob(filename, defaultData);
    return defaultData;
  }
  return existing;
}

// ---------- Маршруты ----------
// GET /api/places
app.get("/api/places", async (req, res) => {
  try {
    const places = await ensureDefaultData("places.json", defaultPlaces);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/reviews
app.get("/api/reviews", async (req, res) => {
  try {
    const reviews = await ensureDefaultData("reviews.json", defaultReviews);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Для будущих POST-запросов можно добавить что-то вроде:
// POST /api/places – добавляет новое место
app.post("/api/places", async (req, res) => {
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

// Экспорт для Vercel
module.exports = app;
