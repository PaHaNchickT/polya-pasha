async function uploadBase64Image(base64Url, name, type) {
  if (!base64Url.startsWith("data:image/")) return base64Url;

  const matches = base64Url.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!matches) return base64Url;

  const [, mimeType, base64Data] = matches;
  const buffer = Buffer.from(base64Data, "base64");
  const fileName = `${Date.now()}-${name || "image.jpg"}`;

  console.log("=== Прямая загрузка ===");
  console.log("Файл:", fileName);
  console.log("Размер:", buffer.length, "байт");

  const url = `${process.env.SUPABASE_URL}/storage/v1/object/place-images/${fileName}`;

  // FormData + Blob
  const form = new FormData();
  const blob = new Blob([buffer], { type: mimeType });
  form.append("file", blob, fileName);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": mimeType,
        "Content-Length": buffer.length,
      },
      body: buffer,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Ответ сервера:", response.status, errText);
      throw new Error("Upload failed");
    }

    console.log("Загрузка успешна через fetch");
    const publicURL = `${process.env.SUPABASE_URL}/storage/v1/object/public/place-images/${fileName}`;
    return publicURL;
  } catch (err) {
    console.error("Ошибка при прямой загрузке:", err);
    return base64Url; // fallback
  }
}

module.exports = { uploadBase64Image };
