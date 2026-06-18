const supabase = require("../supabaseClient");

async function uploadBase64Image(base64Url, name, type) {
  if (!base64Url.startsWith("data:image/")) return base64Url;

  const matches = base64Url.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!matches) return base64Url;

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, "base64");

  // Логируем размер, чтобы убедиться, что буфер не обрезан
  console.log(
    `Buffer size: ${buffer.length} bytes (${(buffer.length / 1024).toFixed(
      1,
    )} KB)`,
  );

  // Определяем расширение по MIME-типу, а не по имени файла
  const ext = mimeType.split("/")[1] || "jpg";
  const fileName = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("place-images")
    .upload(fileName, buffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) {
    console.error("Ошибка загрузки изображения:", error);
    return base64Url; // fallback – оставляем исходную строку
  }

  const { data: publicURL } = supabase.storage
    .from("place-images")
    .getPublicUrl(fileName);

  console.log("Uploaded to:", publicURL.publicUrl);
  return publicURL.publicUrl;
}

module.exports = { uploadBase64Image };
