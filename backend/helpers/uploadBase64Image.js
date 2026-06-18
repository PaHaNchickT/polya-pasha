const supabase = require("../supabaseClient");

async function uploadBase64Image(base64Url, name, type) {
  if (!base64Url.startsWith("data:image/")) return base64Url; // уже URL

  const matches = base64Url.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!matches) return base64Url; // невалидный формат – оставляем как есть

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `${Date.now()}-${name || "image.jpg"}`;

  const { data, error } = await supabase.storage
    .from("place-images")
    .upload(fileName, buffer, { contentType: mimeType, upsert: false });

  if (error) {
    console.error("Ошибка загрузки изображения:", error);
    return base64Url; // fallback – оставляем исходную строку
  }

  const { data: publicURL } = supabase.storage
    .from("place-images")
    .getPublicUrl(fileName);

  return publicURL.publicUrl;
}

module.exports = { uploadBase64Image };