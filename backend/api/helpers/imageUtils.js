const supabase = require("../supabaseClient");
const crypto = require("crypto"); // если хочешь логировать MD5 — можно оставить, но не обязательно

async function uploadBase64Image(base64Url, name, type) {
  if (!base64Url.startsWith("data:image/")) return base64Url;

  const matches = base64Url.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!matches) {
    throw new Error("Невалидный формат изображения");
  }

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, "base64");

  // Опционально логируем
  console.log(`📦 Загрузка в images: ${buffer.length} байт`);

  const { data, error } = await supabase
    .from("images")
    .insert({
      data: base64Url,
      mime_type: mimeType,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Ошибка сохранения изображения:", error);
    throw new Error("Не удалось сохранить изображение в БД");
  }

  return data.id; // число
}

async function batchGetImagesBase64(ids) {
  if (!ids || ids.length === 0) return {};

  const uniqueIds = [...new Set(ids.filter((id) => id != null))];
  if (uniqueIds.length === 0) return {};

  const { data, error } = await supabase
    .from("images")
    .select("id, data")
    .in("id", uniqueIds);

  if (error) {
    console.error("Batch image load error:", error);
    return {};
  }

  const result = {};
  data.forEach((row) => {
    result[row.id] = row.data;
  });
  return result;
}

module.exports = { uploadBase64Image, batchGetImagesBase64 };
