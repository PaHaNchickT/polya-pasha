const supabase = require("../supabaseClient");

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

module.exports = { isTokenRevoked, addRevokedToken, checkRevoked };
