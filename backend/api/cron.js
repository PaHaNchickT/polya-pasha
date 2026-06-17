export default async function handler(req, res) {
  try {
    const supabase = require("../supabaseClient");
    const { data, error } = await supabase.from("places").select("id").limit(1);
    if (error) throw error;
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
